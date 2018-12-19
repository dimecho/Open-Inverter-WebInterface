#include <RemoteDebug.h>
#include <FS.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <ESP8266WebServer.h>
#include "src/ESP8266HTTPUpdateServer.h"

RemoteDebug Debug;
ESP8266WebServer server(80);
ESP8266HTTPUpdateServer updater;
File fsUpload;

int LED_Pin = 1;
int ACCESS_POINT_MODE = 0;
char ACCESS_POINT_SSID[] = "Inverter";
char ACCESS_POINT_PASSWORD[] = "inverter123";
int ACCESS_POINT_CHANNEL = 7;
int ACCESS_POINT_HIDE = 0;
bool phpTag[] = { false, false, false, false };
int timeout = 10;

//============
//SWD Debugger
//============
/*
  Experimental SWD over ESP8266
  https://github.com/scanlime/esp8266-arm-swd
*/

#include "src/arm_debug.h"

const int swd_clock_pin = 4; //0; //GPIO0 (D3) -> Pin4 (SWD)
const int swd_data_pin = 5; //2; //GPIO2 (D4) -> Pin2 (SWD)

ARMDebug target(swd_clock_pin, swd_data_pin);

// Turn the log level back up for debugging; but by default, we have it
// completely off so that even failures happen quickly, to keep the web app responsive.
//ARMDebug target(swd_clock_pin, swd_data_pin, ARMDebug::LOG_NONE);

uint32_t intArg(const char *name)
{
  // Like server.arg(name).toInt(), but it handles integer bases other than 10
  // with C-style prefixes (0xNUMBER for hex, or 0NUMBER for octal)

  uint8_t tmp[64];
  server.arg(name).getBytes(tmp, sizeof tmp, 0);
  return strtoul((char*) tmp, 0, 0);
}

const char *boolStr(bool x)
{
  return x ? "true" : "false";
}

void swdMemRead()
{
  uint32_t addr = intArg("addr");
  uint32_t count = constrain(intArg("count"), 1, 1024);
  uint32_t value;
  String output = "[";

  while (count) {
    if (target.memLoad(addr, value)) {
      output += value;
    } else {
      output += "null";
    }
    addr += 4;
    count--;
    if (count) {
      output += ",";
    }
  }

  output += "]\n";
  server.send(200, "application/json", output);
}

void swdRegRead()
{
  uint32_t addr = intArg("addr");
  uint32_t count = constrain(intArg("count"), 1, 1024);
  uint32_t value;
  String output = "[";

  while (count) {
    if (target.regRead(addr >> 2, value)) {
      output += value;
    } else {
      output += "null";
    }
    addr += 4;
    count--;
    if (count) {
      output += ",";
    }
  }

  output += "]\n";
  server.send(200, "application/json", output);
}

void swdMemWrite()
{
  // Interprets the argument list as a list of stores to make in order.
  // The key in the key=value pair consists of an address with an optional
  // width prefix ('b' = byte wide, 'h' = half width, default = word)
  // The address can be a '.' to auto-increment after the previous store.
  //
  // Returns a confirmation and result for each store, as JSON.

  uint32_t addr = -1;
  String output = "[\n";

  for (int i = 0; server.argName(i).length() > 0; i++) {
    uint8_t arg[64];
    server.argName(i).getBytes(arg, sizeof arg, 0);

    uint8_t *addrString = &arg[arg[0] == 'b' || arg[0] == 'h'];
    if (addrString[0] != '.') {
      addr = strtoul((char*) addrString, 0, 0);
    }

    uint8_t valueString[64];
    server.arg(i).getBytes(valueString, sizeof valueString, 0);
    uint32_t value = strtoul((char*) valueString, 0, 0);

    bool result;
    const char *storeType = "word";

    switch (arg[0]) {
      case 'b':
        value &= 0xff;
        storeType = "byte";
        result = target.memStoreByte(addr, value);
        addr++;
        break;

      case 'h':
        storeType = "half";
        value &= 0xffff;
        result = target.memStoreHalf(addr, value);
        addr += 2;
        break;

      default:
        result = target.memStore(addr, value);
        addr += 4;
        break;
    }

    char buf[128];
    snprintf(buf, sizeof buf,
             "%s{\"store\": \"%s\", \"addr\": %lu, \"value\": %lu, \"result\": %s}",
             i ? "," : "", storeType, addr, value, boolStr(result));
    output += buf;
  }
  output += "\n]";
  server.send(200, "application/json", output);
}

void swdRegWrite()
{
  String output = "[\n";

  for (int i = 0; server.argName(i).length() > 0; i++) {
    uint8_t addrString[64];
    server.argName(i).getBytes(addrString, sizeof addrString, 0);
    uint32_t addr = strtoul((char*) addrString, 0, 0);

    uint8_t valueString[64];
    server.arg(i).getBytes(valueString, sizeof valueString, 0);
    uint32_t value = strtoul((char*) valueString, 0, 0);

    bool result = target.regWrite(addr >> 2, value);

    char buf[128];
    snprintf(buf, sizeof buf,
             "%s{\"addr\": %lu, \"value\": %lu, \"result\": %s}",
             i ? "," : "", addr, value, boolStr(result));
    output += buf;
  }
  output += "\n]";
  server.send(200, "application/json", output);
}

void swdBegin()
{
  // See if we can communicate. If so, return information about the target.
  // This shouldn't reset the target, but it does need to communicate,
  // and the debug port itself will be reset.
  //
  // If all is well, this returns some identifying info about the target.

  uint32_t idcode;
  
  if (target.begin() && target.getIDCODE(idcode)) {
    char result[128];

    // Note the room left in the API for future platforms detected,
    // even though it requires refactoring a bit.

    snprintf(result, sizeof result, "{\"connected\": true, \"idcode\": %lu}", idcode);

    server.send(200, "application/json", result);
  } else {
    server.send(200, "application/json", "{\"connected\": false}");
  }
}

//=============================

void setup()
{
  //======================
  //NVRAM type of Settings
  //======================
  EEPROM.begin(512);
  if (NVRAM_Read(0) == "") {
    NVRAM_Erase();
    NVRAM_Write(0, String(ACCESS_POINT_MODE));
    NVRAM_Write(1, String(ACCESS_POINT_HIDE));
    NVRAM_Write(2, String(ACCESS_POINT_CHANNEL));
    NVRAM_Write(3, ACCESS_POINT_SSID);
    NVRAM_Write(4, ACCESS_POINT_PASSWORD);
  } else {
    ACCESS_POINT_MODE = NVRAM_Read(0).toInt();
    ACCESS_POINT_HIDE = NVRAM_Read(1).toInt();
    ACCESS_POINT_CHANNEL = NVRAM_Read(2).toInt();
    String s = NVRAM_Read(3);
    s.toCharArray(ACCESS_POINT_SSID, s.length() + 1);
    String p = NVRAM_Read(4);
    p.toCharArray(ACCESS_POINT_PASSWORD, p.length() + 1);
  }
  //EEPROM.end();

  if (ACCESS_POINT_MODE == 0) {
    //=====================
    //WiFi Access Point Mode
    //=====================
    WiFi.mode(WIFI_AP);
    IPAddress ip(192, 168, 4, 1);
    IPAddress gateway(192, 168, 4, 1);
    IPAddress subnet(255, 255, 255, 0);
    IPAddress dns0(192, 168, 4, 1);
    WiFi.softAPConfig(ip, gateway, subnet);
    WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD, ACCESS_POINT_CHANNEL, ACCESS_POINT_HIDE);
    //Debug.println(WiFi.softAPIP());
  } else {
    //================
    //WiFi Client Mode
    //================
    WiFi.mode(WIFI_STA);
    WiFi.begin(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD);  //Connect to the WiFi network
    //WiFi.enableAP(0);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
      //Debug.println("Connection Failed! Rebooting...");
      delay(5000);
      ESP.restart();
    }
    //Debug.println(WiFi.localIP());
  }

  //===================
  //Arduino OTA Updater
  //===================
  /*
    Port defaults to 8266
    ArduinoOTA.setPort(8266);

    Hostname defaults to esp8266-[ChipID]
    ArduinoOTA.setHostname("inverter");

    No authentication by default
    ArduinoOTA.setPassword("admin");

    Password can be set with it's md5 value as well
    MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
    ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");
  */
  ArduinoOTA.onStart([]() {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else { // U_SPIFFS
      type = "filesystem";
      SPIFFS.end(); //unmount SPIFFS
    }
    //Debug.println("Start updating " + type);
  });
  /*
    ArduinoOTA.onEnd([]() {
    Debug.println("\nEnd");
    });
    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    DEBUG.printf("Progress: %u%%\r", (progress / (total / 100)));
    });
    ArduinoOTA.onError([](ota_error_t error) {
    //DEBUG.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Debug.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Debug.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Debug.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Debug.println("Receive Failed");
    else if (error == OTA_END_ERROR) Debug.println("End Failed");
    });
  */
  ArduinoOTA.begin();

  //===============
  //Web OTA Updater
  //===============
  //updater.setup(&server, "/firmware", update_username, update_password);
  updater.setup(&server);

  //===============
  //Web Server
  //===============

  //---------------
  //SWD Debugger
  //---------------
  server.on("/swd/reset", []() {
    server.send(200, "application/json", boolStr(target.debugPortReset()));
  });
  server.on("/swd/halt", []() {
    server.send(200, "application/json", boolStr(target.debugHalt()));
  });
  server.on("/swd/begin", swdBegin);
  server.on("/swd/mem/read", swdMemRead);
  server.on("/swd/mem/write", swdMemWrite);
  server.on("/swd/reg/read", swdRegRead);
  server.on("/swd/reg/write", swdRegWrite);
  //---------------

  server.on("/format", HTTP_GET, []() {
    String result = SPIFFS.format() ? "OK" : "Error";
    FSInfo fs_info;
    SPIFFS.info(fs_info);
    server.send(200, "text/plain", "<b>Format " + result + "</b><br/>Total Flash Size: " + String(ESP.getFlashChipSize()) + "<br>SPIFFS Size: " + String(fs_info.totalBytes) + "<br>SPIFFS Used: " + String(fs_info.usedBytes));
  });
  server.on("/reset", HTTP_GET, []() {
    server.send(200, "text/plain", "...");
    delay(500);
    ESP.restart();
  });
  server.on("/nvram", HTTP_GET, []() {
    NVRAM();
  });
  server.on("/nvram", HTTP_POST, []() {
    NVRAMUpload();
  });
  server.on("/serial.php", HTTP_GET, []() {

    if (server.hasArg("init"))
    {
      String speed = server.arg("init");
      if (speed != "921600")
        speed = "0";

      String fastuart = readSerial("fastuart " + speed);
      Serial.end();
      Serial.begin(server.arg("init").toInt(), SERIAL_8N2);
      fastuart += readSerial("hello");

      server.send(200, "text/plain", fastuart);
    }
    else if (server.hasArg("os"))
    {
      server.send(200, "text/plain", "esp8266");
    }
    else if (server.hasArg("com"))
    {
      server.send(200, "text/plain", "ESP8266 UART");
    }
    else if (server.hasArg("pk") && server.hasArg("name") && server.hasArg("value"))
    {
      server.send(200, "text/plain", readSerial("set " + server.arg("name") + " " + server.arg("value")));
    }
    else if (server.hasArg("get"))
    {
      String sz = server.arg("get");
      String out;

      if (sz.indexOf(",") != -1 )
      {
        char buf[sz.length() + 1];
        sz.toCharArray(buf, sizeof(buf));
        char *p = buf;
        char *str;
        while ((str = strtok_r(p, ",", &p)) != NULL) //split
        {
          out += readSerial("get " + String(str));
        }
      } else {
        out = readSerial("get " + sz);
      }
      Debug.println(out);
      server.send(200, "text/plain", out);
    }
    else if (server.hasArg("command"))
    {
      server.send(200, "text/plain", readSerial(server.arg("command")));
    }
    else if (server.hasArg("stream"))
    {
      String l = server.arg("loop");
      String t = server.arg("delay");
      readStream("get " + server.arg("stream"), l.toInt(), t.toInt());
    }
  });
  server.on("/snapshot.php", HTTP_GET, []() {
    Snapshot();
  });
  server.on("/snapshot.php", HTTP_POST, []() {
    server.send(200);
  }, SnapshotUpload );
  server.on("/firmware.php", HTTP_POST, []() {
    server.send(200);
  }, STM32Upload );
  server.on("/js/menu-mobile.json", HTTP_GET, []() {
    HTTPServer("/js/menu.json");
  });
  server.on("/", []() {
    if (SPIFFS.exists("/index.php")) {
      server.sendHeader("Location", "/index.php");
      server.send(303);
    } else {
      server.sendHeader("Refresh", "6; url=/update");
      server.send(200, "text/html", "File System Not Found ...Upload SPIFFS");
    }
  });
  server.onNotFound([]() {
    if (!HTTPServer(server.uri()))
      server.send(404, "text/plain", "404: Not Found");
  });
  server.begin();

  //===========
  //File system
  //===========
  SPIFFS.begin();

  //==========
  //DNS Server
  //==========
  //http://inverter.local
  MDNS.begin("inverter");
  MDNS.addService("http", "tcp", 80);
  MDNS.addService("telnet", "tcp", 23);
  MDNS.addService("arduino", "tcp", 8266);

  //===================
  //Remote Telnet Debug
  //===================
  Debug.begin("inverter"); // Telnet server
  //Debug.setPassword(ACCESS_POINT_PASSWORD); // Telnet password
  Debug.setResetCmdEnabled(true); // Enable the reset command
  //Debug.showProfiler(true); // To show profiler - time between messages of Debug
  //Debug.showColors(true); // Colors
  //Debug.showDebugLevel(false); // To not show debug levels
  //Debug.showTime(true); // To show time
  //Debug.setSerialEnabled(true); // Serial echo

  //======
  //UART0
  //======
  Serial.begin(115200, SERIAL_8N2);

  while (!Serial && timeout > 0) {
    delay(500);
    timeout--;
  }

  pinMode(LED_Pin, OUTPUT);
}

void loop()
{
  ArduinoOTA.handle();
  server.handleClient();
  Debug.handle();
  //yield();
}

//=============
// NVRAM CONFIG
//=============
void NVRAM()
{
  String out = "{\n";
  for (int i = 0; i < 4; i++) {
    out += "\t\"nvram" + String(i) + "\": \"" + NVRAM_Read(i) + "\",\n";
  }

  //out += "\t\"var3\": \"" + String(ACCESS_POINT_SSID) + "\",\n";
  //out += "\t\"var4\": \"" + String(ACCESS_POINT_PASSWORD) + "\",\n";

  out = out.substring(0, (out.length() - 2));
  out += "\n}";

  server.send(200, "text/json", out);
}

void NVRAMUpload()
{
  NVRAM_Erase();

  String out = "<pre>";

  for (int i = 0; i < server.args(); i++) {
    out += server.argName(i) + ": ";
    NVRAM_Write(i, server.arg(i));
    out += NVRAM_Read(i) + "\n";
  }
  out += "\n...Rebooting";
  out += "</pre>";

  server.sendHeader("Refresh", "10; url=/esp8266.php");
  server.send(200, "text/html", out);

  delay(5000);
  ESP.restart();
}

void NVRAM_Erase()
{
  for (int i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i, 0);
  }
}

void NVRAM_Write(int address, String txt)
{
  char arrayToStore[32];
  memset(arrayToStore, 0, sizeof(arrayToStore));
  txt.toCharArray(arrayToStore, sizeof(arrayToStore)); // Convert string to array.

  EEPROM.put(address * sizeof(arrayToStore), arrayToStore);
  EEPROM.commit();
}

String NVRAM_Read(int address)
{
  char arrayToStore[32];
  EEPROM.get(address * sizeof(arrayToStore), arrayToStore);

  return String(arrayToStore);
}

//=============
// PHP MINI
//=============
String PHP(String line, int i)
{
  //Debug.println(line);

  if (line.indexOf("<?php") != -1) {
    line.replace("<?php", "");
    phpTag[i] = true;
  } else if (line.indexOf("?>") != -1) {
    line = "";
    phpTag[i] = false;
  }

  if (phpTag[i] == true)
  {
    if (line.indexOf("include") != -1 ) {
      //line.trim();
      line.replace("'", "\"");
      line.replace("(", "");
      line.replace(")", "");
      line.replace(";", "");
      int s = line.indexOf("\"") + 1;
      int e = line.lastIndexOf("\"");
      String include = line.substring(s, e);

      //Debug.println("include:" + include);

      File f = SPIFFS.open("/" + include, "r");
      if (!f)
      {
        //Debug.println(include + " (file not found)");

      } else {

        String l;
        int x = i + 1;
        phpTag[x] = false;

        while (f.available()) {
          l = f.readStringUntil('\n');
          line += PHP(l, x);
          line += "\n";
        }
        f.close();
      }

      line.replace("include_once", "");
      line.replace("include", "");
      line.replace("\"" + include + "\"", "");
      if (line.indexOf("?>") != -1) {
        line.replace("?>", "");
        phpTag[i] = false;
      }

    } else {
      line = "";
    }
  }

  return line;
}

bool HTTPServer(String file)
{
  Debug.println((server.method() == HTTP_GET) ? "GET" : "POST");
  Debug.println(file);

  if (SPIFFS.exists(file))
  {
    File f = SPIFFS.open(file, "r");
    if (f)
    {
      digitalWrite(LED_Pin, HIGH);
      //Debug.println(f.size());

      String contentType = getContentType(file);

      if (file.indexOf(".php") > 0) {

        String response = "";
        String l = "";
        phpTag[0] = false;

        while (f.available()) {
          l = f.readStringUntil('\n');
          response += PHP(l, 0);
          response += "\n";
        }
        server.send(200, contentType, response);
      } else {
        server.sendHeader("Content-Encoding", "gzip");
        server.streamFile(f, contentType);
      }
      f.close();

      digitalWrite(LED_Pin, LOW);

      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

String getContentType(String filename)
{
  if (server.hasArg("download")) return "application/octet-stream";
  else if (filename.endsWith(".php")) return "text/html";
  else if (filename.endsWith(".htm")) return "text/html";
  else if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".json")) return "application/json";
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".gif")) return "image/gif";
  else if (filename.endsWith(".jpg")) return "image/jpeg";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  else if (filename.endsWith(".svg")) return "image/svg+xml";
  else if (filename.endsWith(".xml")) return "text/xml";
  else if (filename.endsWith(".pdf")) return "application/x-pdf";
  else if (filename.endsWith(".zip")) return "application/x-zip";
  else if (filename.endsWith(".csv")) return "text/plain";
  return "text/plain";
}

//====================
// SAVE/UPLOAD CONFIG
//====================
void SnapshotUpload()
{
  HTTPUpload& upload = server.upload();

  if (upload.status == UPLOAD_FILE_START)
  {
    Debug.println(upload.filename);
    fsUpload = SPIFFS.open("/" + upload.filename, "w");
  }
  else if (upload.status == UPLOAD_FILE_WRITE)
  {
    if (fsUpload)
      fsUpload.write(upload.buf, upload.currentSize);
  }
  else if (upload.status == UPLOAD_FILE_END)
  {
    if (fsUpload) {
      fsUpload.close();

      Debug.println(upload.totalSize);

      File f = SPIFFS.open("/" + upload.filename, "r");
      while (f.available()) {
        String cmd = f.readStringUntil('\n');
        cmd.replace("\t", "");
        cmd.replace(" ", "");
        cmd.replace("\"", "");
        cmd.replace(",", "");
        cmd.replace(":", " ");
        if (!cmd.startsWith("{") && !cmd.endsWith("}")) {
          Serial.print("set " + cmd);
          Serial.print("\n");
        }
      }

      Serial.print("save");
      Serial.print("\n");

      f.close();
      SPIFFS.remove("/" + upload.filename);

      server.sendHeader("Location", "/index.php");
      server.send(303);

    } else {
      server.send(500, "text/plain", "500: Couldn't Upload File");
    }
  }
}

void Snapshot()
{
  //quick json format
  String json;
  String all = readSerial("all");

  all.replace("\r", "");
  all = all.substring(0, (all.length() - 1));
  all.replace("\t\t", "\": \"");
  all.replace("\n", "\",\n    \"");

  json = "{\n    \"" + all + "\"\n}";

  server.sendHeader("Content-Disposition", "attachment; filename=\"snapshot.txt\"");
  server.send(200, "text/json", json);
}

//===================
// SERIAL PROCESSING
//===================
String readSerial(String cmd)
{
  char b[255];
  size_t len = 0;
  String output;

  while (Serial.available())
    Serial.read(); //flush all previous output

  Debug.println(cmd);

  Serial.print(cmd);
  Serial.print("\n");
  Serial.readStringUntil('\n'); //consume echo
  do {
    memset(b, 0, sizeof(b));
    len = Serial.readBytes(b, sizeof(b) - 1);
    output += b;
  } while (len > 0);

  Debug.println(output);

  return output;
}

String readStream(String cmd, int _loop, int _delay)
{
  char b[255];
  while (Serial.available())
    Serial.read(); //flush all previous output

  Serial.print(cmd);
  Serial.print("\n");
  Serial.readStringUntil('\n'); //consume echo

  //server.sendHeader("Expires", "-1");
  server.sendHeader("Cache-Control", "no-cache");
  //server.setContentLength(CONTENT_LENGTH_UNKNOWN);
  //server.send(200, "text/plain", "");
  server.send(200, "text/html", "");

  //WiFiClient client = server.client();
  for (int i = 0; i < _loop; i++) {
    String output = "";
    size_t len = 0;
    if (i != 0)
    {
      Serial.print("!");
      Serial.readBytes(b, 1); //consume "!"
    }
    do {
      memset(b, 0, sizeof(b));
      len = Serial.readBytes(b, sizeof(b) - 1);
      //client.write((const char*)b, len);
      output += b;
    } while (len > 0);

    server.sendContent(output);
    //client.print(output);
    //client.flush();

    Debug.println(output);
    delay(_delay);
  }
  //client.stop(); // Stop is needed because we sent no content length
}

//==================
// STM32 UPDATER
//==================
void STM32Upload()
{
  HTTPUpload& upload = server.upload();

  if (upload.status == UPLOAD_FILE_START) {

    //Debug.println(upload.filename);

    if (!upload.filename.endsWith(".bin")) {
      server.send(500, "text/plain", "Firmware must be binary");
    } else {
      fsUpload = SPIFFS.open("/" + upload.filename, "w");
    }
  }
  else if (upload.status == UPLOAD_FILE_WRITE)
  {
    if (fsUpload)
      fsUpload.write(upload.buf, upload.currentSize);

  } else if (upload.status == UPLOAD_FILE_END) {

    if (fsUpload) {
      fsUpload.close();
      File f = SPIFFS.open("/" + upload.filename, "r");

      server.sendHeader("Cache-Control", "no-cache");
      //server.setContentLength(CONTENT_LENGTH_UNKNOWN);
      server.sendHeader("Refresh", "10; url=/index.php");
      server.send(200, "text/html", "");
      server.sendContent("<pre>");

      int timeout = 0;
      char c;
      const size_t PAGE_SIZE_BYTES = 1024;
      int len = f.size();
      //int pages = (len / PAGE_SIZE_BYTES) + 1;
      int pages = (len + PAGE_SIZE_BYTES - 1) / PAGE_SIZE_BYTES;

      server.sendContent("File length is " + String(len) + " bytes/" + String(pages) + " pages\n");

      Serial.begin(115200);
      while (Serial.available())
        Serial.read();

      //Clear the initialization Bug
      //-----------------------------
      Serial.print("hello\n");
      Serial.read(); //echo
      Serial.read(); //ok
      //-----------------------------
      server.sendContent("Resetting device...\n");
      Serial.print("reset\n");

      do {
        c = Serial.read();
        //server.sendContent(String(c));
        delay(10);
        timeout++;
      } while (c != 'S' && c != '2' && timeout < 600);

      server.sendContent("\n" + String(timeout) + "\n");

      if (c == '2')
      {
        server.sendContent("Bootloader v2 detected\n");
        Serial.write(0xAA); //Send magic
        while (Serial.read() != 'S');
      }

      if (timeout < 600)
      {
        server.sendContent("Sending number of pages.." + String(pages) + "\n");
        Serial.write(pages);

        while (Serial.read() != 'P'); //Wait for page request

        int page = 0;
        bool done = false;

        while (done != true)
        {
          server.sendContent("Sending page " + String(page) + "...\n");

          f.seek(page * PAGE_SIZE_BYTES);

          char data[PAGE_SIZE_BYTES];
          size_t bytesRead = f.readBytes(data, sizeof(data));

          while (bytesRead < PAGE_SIZE_BYTES) //Fill ramaining bytes with zeros, prevents corrupted endings
            data[bytesRead++] = 0xff;

          uint32_t crc = crc32((uint32_t*)data, PAGE_SIZE_BYTES / 4, 0xffffffff);

          while (c != 'C')
          {
            //Serial.write(data);
            Serial.write((uint8_t*)data, sizeof(data));

            while (!Serial.available());
            c = Serial.read();

            if (c == 'T')
            {
              server.sendContent("Transmission Error\n");
            }
          }

          server.sendContent("Sending CRC...\n");

          //Serial.write(crc);
          Serial.write((uint8_t*)&crc, sizeof(uint32_t));
          while (!Serial.available());
          c = Serial.read();

          if ('D' == c)
          {
            server.sendContent("CRC correct!\n");
            server.sendContent("Update done!\n");

            done = true;
          }
          else if ('E' == c)
          {
            server.sendContent("CRC error!\n");
          }
          else if ('P' == c)
          {
            server.sendContent("CRC correct!\n");
            page++;
          }
        }
      } else {
        server.sendContent("STM32 is bricked - Try pressing reset button during upload\n");
      }
      server.sendContent("</pre>");
      //server.client().flush();
      //server.client().stop();

      f.close();
      SPIFFS.remove("/" + upload.filename);
    }
  }
}

static uint32_t crc32_word(uint32_t Crc, uint32_t Data)
{
  int i;

  Crc = Crc ^ Data;

  for (i = 0; i < 32; i++)
    if (Crc & 0x80000000)
      Crc = (Crc << 1) ^ 0x04C11DB7; // Polynomial used in STM32
    else
      Crc = (Crc << 1);

  return (Crc);
}

static uint32_t crc32(uint32_t* data, uint32_t len, uint32_t crc)
{
  for (uint32_t i = 0; i < len; i++)
    crc = crc32_word(crc, data[i]);
  return crc;
}
