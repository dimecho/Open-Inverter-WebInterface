#define VERSION 1.0
#define DEBUG 1
#define PRINTDEBUG(STR) \
  {  \
    if (DEBUG) Serial.println(STR); \
  }
#include <FS.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <ESP8266WebServer.h>
//#include <ESP8266WebServerSecure.h>
#include <ESP8266HTTPUpdateServer.h>
#include <ArduinoJson.h>

ESP8266WebServer server(80);
//ESP8266WebServerSecure serverSecure(443);
ESP8266HTTPUpdateServer updater;

const int ACCESS_POINT_MODE = 0;
const char* ACCESS_POINT_SSID = "Inverter";
const char* ACCESS_POINT_PASSWORD = "12345678";
const int ACCESS_POINT_CHANNEL = 2;

void setup()
{
  Serial.begin(115200);
  while (!Serial) delay(250);

  //EEPROM.begin(512);

  /*
    WiFi.begin(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD);  //Connect to the WiFi network
    while (WiFi.status() != WL_CONNECTED) {  //Wait for connection
  	delay(500);
  	Serial.println("Waiting to connect…");
    }
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  */

  WiFi.mode(WIFI_AP); //WFi Access Point Mode
  //WiFi.mode(WIFI_STA); //WiFi Client Mode

  IPAddress ip(192, 168, 43, 1);
  IPAddress gateway(192, 168, 43, 1);
  IPAddress subnet(255, 255, 255, 0);
  WiFi.softAPConfig(ip, gateway, subnet);
  WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD,ACCESS_POINT_CHANNEL);

  PRINTDEBUG(WiFi.softAPIP());

  server.on("/serial.php", []() {

    if (server.hasArg("get"))
    {
      server.send(200, "text/plain", readSerial("get " + server.arg("get")));
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

  server.on("/snapshot.php", []() {
    Snapshot();
  });

  server.on("/esp8266.php", HTTP_POST, []() {
    ESP8266Updater();
  });

  server.on("/firmware.php", HTTP_POST, []() {
    STM32Updater();
  });

  server.on("/", HTTP_GET, []() {
    HTTPServer("index.php");
  });

  server.onNotFound([]() {
    if (!HTTPServer(server.uri()))
      server.send(404, "text/plain", "404: Not Found");
  });

  SPIFFS.begin();

  //updater.setup(&server, "/firmware", update_username, update_password);
  updater.setup(&server);
   
  //serverSecure.setServerKeyAndCert_P(rsakey, sizeof(rsakey), x509, sizeof(x509));
  server.begin();

  // Set up mDNS responder:
  // - first argument is the domain name, in this example
  //   the fully-qualified domain name is "esp8266.local"
  // - second argument is the IP address to advertise
  //   we send our IP address on the WiFi network
  if (!MDNS.begin("inverter")) {
    PRINTDEBUG("Error setting up MDNS responder!");
    while (1) {
      delay(1000);
    }
  }
  
  // Add service to MDNS-SD
  MDNS.addService("http", "tcp", 80);
  //MDNS.addService("https", "tcp", 443);
}

void loop()
{
  //Serial.printf("Stations connected = %d\n", WiFi.softAPgetStationNum());
  //delay(3000);

  server.handleClient();
  //serverSecure.handleClient();
}

String PHP(String line, bool tag[], int i)
{
  if (line.indexOf("<?php") > 0) {
    tag[i] = true;
    line = "";
  } else if (line.indexOf("?>") > 0) {
    tag[i] = false;
    line = "";
  }

  if (tag[i] == true) {

    if (line.indexOf("include") > 0) {

      String include = line.substring(line.indexOf('"', 1), line.indexOf('"', 2));

      PRINTDEBUG(include);

      File f = SPIFFS.open(include, "r");
      if (!f) {
        PRINTDEBUG(include + " (file not found)");
      } else {
        while (f.available()) {
          line += f.readStringUntil('\n');
          //line += PHP(f.readStringUntil('\n'),tag,(i+1));
        }
        f.close();
      }
    } else {
      line = "";
    }
  }
  return line;
}

bool HTTPServer(String file)
{
  PRINTDEBUG((server.method() == HTTP_GET) ? "GET" : "POST");

  if (SPIFFS.exists(file))
  {
    File f = SPIFFS.open(file, "r");
    if (f)
    {
      return false;
    } else {

      PRINTDEBUG(f.size());

      String contentType = getContentType(file);

      if (file.indexOf(".php") > 0) {

        bool php[] = { false, false, false, false };
        String response = "";
        String line = "";

        while (f.available()) {
          line = f.readStringUntil('\n');
          line = PHP(line, php, 0);
          response += line;
        }
        server.send(200, contentType, response);
      } else {
        /*
          while (f.available()) {
            response += f.readStringUntil('\n');
          }
        */
        server.sendHeader("Content-Encoding", "gzip");
        server.streamFile(f, contentType);
      }
      f.close();
    }
    return true;

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
  else if (filename.endsWith(".xml")) return "text/xml";
  else if (filename.endsWith(".pdf")) return "application/x-pdf";
  else if (filename.endsWith(".zip")) return "application/x-zip";
  return "text/plain";
}

//====================
// SAVE/UPLOAD CONFIG
//====================
void Snapshot()
{
  if (server.method() == HTTP_POST)
  {

  } else {
    String read = readSerial("all");

    char charBuffer[read.length() + 1];
    read.toCharArray(charBuffer, read.length());

    DynamicJsonBuffer jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();

    char * split = strtok(charBuffer, "\n");
    while (split != NULL)
    {
      //printf ("%s\n", split);
      String values = String(split);
      for (int i = 0; i < values.length(); i++) {
        if (values.substring(i, i + 1) == "\t") {
          root[values.substring(0, i)] = values.substring(i + 1);
          break;
        }
      }
      split = strtok(NULL, "\n");
    }

    root.prettyPrintTo(read);

    server.sendHeader("Content-Disposition", "attachment; filename=\"snapshot.txt\"");
    server.send(200, "text/json", read);
  }
}

//===================
// SERIAL PROCESSING
//===================
String readSerial(String cmd)
{
  String read = "";

  Serial.print(cmd);

  while (Serial.available()) {
    read += Serial.readString();
  }

  return read;
}

String readStream(String cmd, int _loop, int _delay)
{
  String read = "";
  char buffer[1];
  
  server.sendHeader("Connection", "Keep-Alive");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "" );

  Serial.print(cmd);

  for (int i = 0; i < _loop; i++) {
    read = "";
    if(i != 0)
    {
      Serial.print("!");
      Serial.readBytes(buffer, 1); //consume "!"
    }
    while (Serial.available()) {
      read += Serial.readString();
      server.sendContent(read);
      server.client().flush();
    }
  }
  server.client().stop(); //This doesn't close connection

  server.sendHeader("Content-Length", "0");
  server.send(200, "text/plain", "");
}

//====================
// ESP8266 UPDATER
//====================
void ESP8266Updater()
{
  String html = "";
  String img = "<img src=\"img/esp8266.png\" />";

  if (server.method() == HTTP_POST)
  {
    html = "";
  } else {
    String v = "0";
    String b = "0";

    File f = SPIFFS.open("version.txt", "r");
    if (f)
    {
      v = f.readStringUntil('\n');
      b = f.readStringUntil('\n');
    }
    String header = (String)"<header><script src=\"/js/jszip.js\"></script><script src=\"/js/esp8266.js\"></script></header>";
    String form = (String)"<form enctype=\"multipart/form-data\" action=\"esp8266.php\" method=\"POST\"><input type=\"file\" onchange=\"javascript:this.form.submit();\" /><input type=\"submit\" /></form>";
    html = (String)"<html>" + header + "<body><center>" + img + " ESP8266 Firmware Version:" + VERSION + " - Web Interface Version:" + v + " (Build:" + b + ")<br/>" + form + "</center></body></html>";
  }
  server.send(200, "text/plain", html);
}

//==================
// STM32 UPDATER
//==================
void STM32Updater()
{
  HTTPUpload& upload = server.upload();

  if (upload.status == UPLOAD_FILE_START) {

    if (!upload.filename.endsWith(".bin"))
    {
      server.send(500, "text/plain", "Firmware must be binary");
    }

    //} else if (upload.status == UPLOAD_FILE_WRITE) {
    //fsUploadFile.write(upload.buf, upload.currentSize);

  } else if (upload.status == UPLOAD_FILE_END) {

    uint32_t *data = new uint32_t[upload.totalSize];
    memcpy(data, upload.buf, sizeof(upload.buf)); //fill in the data

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

    PRINTDEBUG("File length is $len bytes/$pages pages");

    PRINTDEBUG("Resetting device...\n");

    Serial.print("reset\r");

    char s[] = {'S', '2'};
    char p[] = {'P'};
    
    char c = wait_for_char(s); //Wait for size request
    if (c == '2') { //version 2 bootloader
      Serial.write(0xAA); //Send magic
      wait_for_char(s);
    }

    PRINTDEBUG("Sending number of pages...\n");

    Serial.print(pages);

    wait_for_char(p); //Wait for page request

    int page = 0;
    bool done = false;
    int idx = 0;

    while (done != true)
    {
      PRINTDEBUG("Sending page " + page);

      uint32_t crc = calcStmCrc(data, idx, PAGE_SIZE_BYTES);
      char c;

      while (c != 'C')
      {
        idx = page * PAGE_SIZE_BYTES;
        int cnt = 0;

        while (cnt < PAGE_SIZE_BYTES)
        {
          Serial.write(data[idx]);
          //PRINTDEBUG((char)data[idx]);
          idx++;
          cnt++;
        }

        c = Serial.read();

        if (c == 'T')
          PRINTDEBUG("Transmission Error");
      }

      PRINTDEBUG("Sending CRC... ");

      Serial.write(crc & 0xFF);
      Serial.write((crc >> 8) & 0xFF);
      Serial.write((crc >> 16) & 0xFF);
      Serial.write((crc >> 24) & 0xFF);

      c = Serial.read();

      if ('D' == c)
      {
        PRINTDEBUG("CRC correct!\n");
        PRINTDEBUG("Update done!\n");
        done = true;
      }
      else if ('E' == c)
      {
        PRINTDEBUG("CRC error!\n");
      }
      else if ('P' == c)
      {
        PRINTDEBUG("CRC correct!\n");
        page++;
      }
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
