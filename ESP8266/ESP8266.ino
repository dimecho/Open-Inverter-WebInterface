#define VERSION 1.0
#define DEBUG Serial
#include <FS.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <ESP8266WebServer.h>
#include "src/ESP8266HTTPUpdateServer.h"

ESP8266WebServer server(80);
ESP8266HTTPUpdateServer updater;
File fsUpload;

int ACCESS_POINT_MODE = 0;
char ACCESS_POINT_SSID[] = "Inverter";
char ACCESS_POINT_PASSWORD[] = "12345678";
int ACCESS_POINT_CHANNEL = 7;
int ACCESS_POINT_HIDE = 0;
bool phpTag[] = { false, false, false, false };
int timeout = 10;

void setup()
{
  Serial.begin(115200);

  while (!Serial && timeout > 0) {
    delay(500);
    timeout--;
  }

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
    s.toCharArray(ACCESS_POINT_SSID, s.length()+1);
    String p = NVRAM_Read(4);
    p.toCharArray(ACCESS_POINT_PASSWORD, p.length()+1);
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
    //DEBUG.println(WiFi.softAPIP());
  } else {
    //================
    //WiFi Client Mode
    //================
    WiFi.mode(WIFI_STA);
    WiFi.begin(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD);  //Connect to the WiFi network
    //WiFi.enableAP(0);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
      //DEBUG.println("Connection Failed! Rebooting...");
      delay(5000);
      ESP.restart();
    }
    //DEBUG.println(WiFi.localIP());
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
    //DEBUG.println("Start updating " + type);
  });
  /*
    ArduinoOTA.onEnd([]() {
    DEBUG.println("\nEnd");
    });
    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    DEBUG.printf("Progress: %u%%\r", (progress / (total / 100)));
    });
    ArduinoOTA.onError([](ota_error_t error) {
    //DEBUG.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) DEBUG.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) DEBUG.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) DEBUG.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) DEBUG.println("Receive Failed");
    else if (error == OTA_END_ERROR) DEBUG.println("End Failed");
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
  server.on("/format", HTTP_GET, []() {
    String result = SPIFFS.format() ? "OK" : "Error";
    FSInfo fs_info;
    SPIFFS.info(fs_info);
    server.send(200, "text/plain", "<b>Format " + result + "</b><br/>Total Flash Size: " + String(ESP.getFlashChipSize()) + "<br>SPIFFS Size: " + String(fs_info.totalBytes) + "<br>SPIFFS Used: " + String(fs_info.usedBytes));
    delay(5000);
    ESP.restart();
  });
  server.on("/reset", HTTP_GET, []() {
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
      server.send(200, "text/plain", readSerial("hello"));
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
  server.on("/", []() {
    HTTPServer("/index.php");
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
  MDNS.addService("arduino", "tcp", 8266);
}

void loop()
{
  ArduinoOTA.handle();
  server.handleClient();
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
  ////DEBUG.println(line);

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

      //DEBUG.println("include:" + include);

      File f = SPIFFS.open("/" + include, "r");
      if (!f)
      {
        ////DEBUG.println(include + " (file not found)");

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
  //DEBUG.println((server.method() == HTTP_GET) ? "GET" : "POST");
  //DEBUG.println(file);

  if (SPIFFS.exists(file))
  {
    File f = SPIFFS.open(file, "r");
    if (f)
    {
      //DEBUG.println(f.size());

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
    //DEBUG.println(upload.filename);
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

      //DEBUG.println(upload.totalSize);

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

  Serial.print(cmd);
  Serial.print("\n");
  Serial.readBytes(b, cmd.length() + 1); //consume echo

  do {
    memset(b, 0, sizeof(b));
    len = Serial.readBytes(b, sizeof(b) - 1);
    output += b;
  } while (len > 0);

  /*
    if (output.indexOf(cmd + "\n") != -1) { //Got echo, try again ...OVERVOLTAGE?
    output = readSerial(cmd);
    }
  */
  return output;
}

String readStream(String cmd, int _loop, int _delay)
{
  char b[255];
  size_t len = 0;
  String output;

  server.sendHeader("Connection", "Keep-Alive");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "" );

  Serial.print(cmd);
  Serial.print("\n");
  Serial.readBytes(b, cmd.length() + 1); //consume echo

  for (int i = 0; i < _loop; i++) {
    output = "";
    if (i != 0)
    {
      Serial.print("!");
      Serial.readBytes(b, 1); //consume "!"
    }

    do {
      memset(b, 0, sizeof(b));
      len = Serial.readBytes(b, sizeof(b) - 1);
      output += b;
    } while (len > 0);

    server.sendContent(output);
    server.client().flush();
  }
  server.client().stop(); //This doesn't close connection
  server.sendHeader("Content-Length", "0"); //This does

  server.send(200, "text/plain", "");
}

//==================
// STM32 UPDATER
//==================
void STM32Upload()
{
  HTTPUpload& upload = server.upload();

  if (upload.status == UPLOAD_FILE_START) {

    //DEBUG.println(upload.filename);

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

      String out;

      //DEBUG.println(upload.totalSize);

      File f = SPIFFS.open("/" + upload.filename, "r");
      uint32_t *data = new uint32_t[f.size()];
      while (f.available()) {
        data += char(f.read());
      }
      f.close();
      SPIFFS.remove("/" + upload.filename);

      int PAGE_SIZE_BYTES = 1024;
      int len = upload.totalSize;
      int pages = round((len + PAGE_SIZE_BYTES - 1) / PAGE_SIZE_BYTES);

      while ((sizeof(data) % PAGE_SIZE_BYTES) > 0) //Fill ramaining bytes with zeros, prevents corrupted endings
      {
        //Allocate new array and copy in data
        uint32_t *append = new uint32_t[sizeof(data) + 1];
        memcpy(append, data, sizeof(data));

        //Delete old array
        delete [] data;

        //Swap with new array
        data = append;
      }

      if (Serial.available() < 0) {
        server.send(500, "text/plain", "Serial not connected");
        return;
      }

      out += "File length is $len bytes/$pages pages";
      out += "Resetting device...\n";

      Serial.print("reset\r");

      char s[] = {'S', '2'};
      char p[] = {'P'};

      char c = wait_for_char(s); //Wait for size request
      if (c == '2') { //version 2 bootloader
        Serial.write(0xAA); //Send magic
        wait_for_char(s);
      }

      out += "Sending number of pages...\n";

      Serial.print(pages);

      wait_for_char(p); //Wait for page request

      int page = 0;
      bool done = false;
      int idx = 0;

      while (done != true)
      {
        out += "Sending page " + page;

        uint32_t crc = calcStmCrc(data, idx, PAGE_SIZE_BYTES);
        char c;

        while (c != 'C')
        {
          idx = page * PAGE_SIZE_BYTES;
          int cnt = 0;

          while (cnt < PAGE_SIZE_BYTES)
          {
            Serial.write(data[idx]);
            //DEBUG.println((char)data[idx]);
            idx++;
            cnt++;
          }

          c = Serial.read();

          if (c == 'T')
            out += "Transmission Error";
        }

        out += "Sending CRC... ";

        Serial.write(crc & 0xFF);
        Serial.write((crc >> 8) & 0xFF);
        Serial.write((crc >> 16) & 0xFF);
        Serial.write((crc >> 24) & 0xFF);

        c = Serial.read();

        if ('D' == c)
        {
          out += "CRC correct!\n";
          out += "Update done!\n";
          done = true;
        }
        else if ('E' == c)
        {
          out += "CRC error!\n";
        }
        else if ('P' == c)
        {
          out += "CRC correct!\n";
          page++;
        }
      }
      server.send(200, "text/plain", out);
    }
  }
}

char wait_for_char(char c[])
{
  char recv_char;
  while (recv_char = Serial.read())
  {
    for ( int i = 0; i < sizeof(c); ++i )
      if (recv_char == c[i])
        return recv_char;
  }

  return -1;
}

uint32_t calcStmCrc(uint32_t *data, uint32_t idx, uint32_t len)
{
  uint32_t cnt = 0;
  uint32_t crc = 0xffffffff;

  while (cnt < len)
  {
    uint32_t _word = data[idx] | (data[idx + 1] << 8) | (data[idx + 2] << 16) | (data[idx + 3] << 24);
    cnt = cnt + 4;
    idx = idx + 4;

    crc = crc ^ _word;
    for (uint32_t i = 0; i < 32; i++)
    {
      if (crc & 0x80000000)
      {
        crc = ((crc << 1) ^ 0x04C11DB7) & 0xffffffff; //Polynomial used in STM32
      } else {
        crc = (crc << 1) & 0xffffffff;
      }
    }
  }

  return crc;
}
