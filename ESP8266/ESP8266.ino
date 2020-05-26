#define ASYNC_TCP_SSL_ENABLED 0
/*
#define LFS_READ_SIZE 256
#define LFS_PROG_SIZE 256
#define LFS_BLOCK_SIZE 4096
*/

//#include <RemoteDebug.h>
//#include <ArduinoOTA.h>
#include <EEPROM.h>
#include <AESLib.h>
#include <flash_hal.h>
#include <StreamString.h>

#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#include <Update.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <LittleFS.h>
#include <ESPAsyncWebServer.h>

#ifdef ARDUINO_ESP8266_WEMOS_D1R1
#define LED_BUILTIN 2 //GPIO2=ESP-12/WeMos(D4)
#else //#ifdef ARDUINO_MOD_WIFI_ESP8266
#define LED_BUILTIN 1 //GPIO1=Olimex
#endif

//#define DEBUG true
//RemoteDebug Debug;

#if ASYNC_TCP_SSL_ENABLED == 1
//AsyncWebServer httpserver(80);
AsyncWebServer server(443);
#else
AsyncWebServer server(80);
#endif

int WIFI_PHY_MODE = 1; //WIFI_PHY_MODE_11B = 1, WIFI_PHY_MODE_11G = 2, WIFI_PHY_MODE_11N = 3
float WIFI_PHY_POWER = 20.5; //Max = 20.5dbm
int ACCESS_POINT_MODE = 0;
char ACCESS_POINT_SSID[] = "Inverter";
char ACCESS_POINT_PASSWORD[] = "inverter123";
int ACCESS_POINT_CHANNEL = 7;
int ACCESS_POINT_HIDE = 0;
int DATA_LOG = 0; //Enable data logger
int LOG_INTERVAL = 5; //seconds between data collection and write to Filesystem
int NETWORK_DHCP = 0;
char NETWORK_IP[] = "192.168.4.1";
char NETWORK_SUBNET[] = "255.255.255.0";
char NETWORK_GATEWAY[] = "192.168.4.1";
char NETWORK_DNS[] = "192.168.4.1";

String firmwareInterface = "" ;
StreamString firmwareStream;

bool phpTag[] = { false, false }; //2 level processing
const char text_html[] = "text/html";
const char text_plain[] = "text/plain";
const char text_json[] = "application/json";
static const char serverIndex[] PROGMEM =
  R"(<!DOCTYPE html>
<html lang='en'>
<head>
   <meta charset='utf-8'>
   <meta name='viewport' content='width=device-width,initial-scale=1'/>
</head>
<body>
<form method='POST' action='' enctype='multipart/form-data'>
   <input type='file' accept='.bin' name='firmware'>
   <input type='submit' value='Update Firmware'>
</form>
<br>
<form method='POST' action='' enctype='multipart/form-data'>
   <input type='file' accept='.bin' name='filesystem'>
   <input type='submit' value='Update Filesystem'>
</form>
</body>
</html>)";
bool restartRequired = false;  // Set this flag in the callbacks to restart ESP in the main loop
//====================
//CAN-Bus
//====================
#ifdef ARDUINO_ESP8266_WEMOS_D1R1
/*
   https://github.com/coryjfowler/MCP_CAN_lib
   http://scottsnowden.co.uk/esp8266-mcp2515-can-bus-to-wifi-gateway/
   http://www.canhack.org/board/viewtopic.php?f=1&t=1041
   http://forum.arduino.cc/index.php?topic=152145.0
   https://github.com/Metaln00b/NodeMCU-BlackBox
*/
/*
   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   The NodeMCU is not officially 5V tolerant.
   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   Connect TJA1050-Chip separately to 5V of external power,
   because the TJA1050-Chip can not run with 3V3.
*/
#include <mcp_can.h>
#include <SPI.h>
/*
  #define MCP_8MHz_250kBPS_CFG1 (0x40)
  #define MCP_8MHz_250kBPS_CFG2 (0xF1)
  #define MCP_8MHz_250kBPS_CFG3 (0x85)
*/
/*
  MISO=D7(GPIO12),MOSI=D6(GPIO13),SCLK=D5(GPIO14),CS=D2(GPIO4),INT=D4(GPIO2)
  https://arduino-esp8266.readthedocs.io/en/2.4.0-rc1/libraries.html#spi

  There’s an extended mode where you can swap the normal pins to the SPI0 hardware pins.
  This is enabled by calling SPI.pins(6, 7, 8, 0) before the call to SPI.begin().

  The pins would change to: MOSI=SD1,MISO=SD0,SCLK=CLK,HWCS=GPIO0
*/

/* WeMos D1 Pins for MCP2515: CS=D2, INT=D4, SCK=D5, SO=D6, SI=D7 */

#define DEBUG_MODE 0
MCP_CAN CAN0(4);      // Set CS to pin GPIO4 (D2) or GPIO15 (D8)

int CAN_ID_FILTERS[10];

/*
  Standard CANId: 0x800 (max = 2048)
  Extended CANId: 0xPPPXXXXSS
  P = priority;  low value = higher priority;
      0x00=0
      0x0F=15
      0x10=16
      0x1C=20
      0x20=32
      0x90=144
      0xFF=255;
  XXXX = PNG, parameter group number, 4 chars / 8 bytes long
  SS = source address,
*/
long unsigned int CANmsgId;
unsigned char CANmsg[8];
#endif
//=========================
//Experimental SWD Debugger
//=========================
/*
  https://github.com/scanlime/esp8266-arm-swd
*/

#include "src/arm_debug.h"

const uint8_t swd_clock_pin = 4; //GPIO4 (D2)
const uint8_t swd_data_pin = 5; //GPIO5 (D1)

//ARMDebug target(swd_clock_pin, swd_data_pin);

// Turn the log level back up for debugging; but by default, we have it
// completely off so that even failures happen quickly, to keep the web app responsive.
ARMDebug target(swd_clock_pin, swd_data_pin, ARMDebug::LOG_NONE);

/*
  uint32_t intArg(const char *name)
  {
  // Like server.arg(name).toInt(), but it handles integer bases other than 10
  // with C-style prefixes (0xNUMBER for hex, or 0NUMBER for octal)

  uint8_t tmp[64];
  server.arg(name).getBytes(tmp, sizeof tmp, 0);
  return strtoul((char*) tmp, 0, 0);
  }
*/

const char *boolStr(bool x)
{
  return x ? "true" : "false";
}
//=============================

void setup()
{
  Serial.begin(115200, SERIAL_8N1);
  //Serial.setDebugOutput(false);
  //Serial.setTimeout(1000);

  //===========
  //File system
  //===========
  LittleFS.begin();

  //======================
  //NVRAM type of Settings
  //======================
  EEPROM.begin(1024);
  int e = EEPROM.read(0);
  String nvram = "";

  if (e == 255) { //if (NVRAM_Read(0) == "") {
    NVRAM_Erase();
    NVRAM_Write(0, String(ACCESS_POINT_MODE));
    NVRAM_Write(1, String(ACCESS_POINT_HIDE));
    NVRAM_Write(2, String(ACCESS_POINT_CHANNEL));
    NVRAM_Write(3, ACCESS_POINT_SSID);
    NVRAM_Write(4, ACCESS_POINT_PASSWORD);
    NVRAM_Write(5, String(DATA_LOG));
    NVRAM_Write(6, String(LOG_INTERVAL));
    //==========
    NVRAM_Write(7, String(NETWORK_DHCP));
    NVRAM_Write(8, NETWORK_IP);
    NVRAM_Write(9, NETWORK_SUBNET);
    NVRAM_Write(10, NETWORK_GATEWAY);
    NVRAM_Write(11, NETWORK_DNS);

    LittleFS.format();
  } else {
    ACCESS_POINT_MODE = NVRAM_Read(0).toInt();
    ACCESS_POINT_HIDE = NVRAM_Read(1).toInt();
    ACCESS_POINT_CHANNEL = NVRAM_Read(2).toInt();
    nvram = NVRAM_Read(3);
    nvram.toCharArray(ACCESS_POINT_SSID, nvram.length() + 1);
    nvram = NVRAM_Read(4);
    nvram.toCharArray(ACCESS_POINT_PASSWORD, nvram.length() + 1);
    DATA_LOG = NVRAM_Read(5).toInt();
    LOG_INTERVAL = NVRAM_Read(6).toInt();
    //==========
    NETWORK_DHCP = NVRAM_Read(7).toInt();
    nvram = NVRAM_Read(8);
    nvram.toCharArray(NETWORK_IP, nvram.length() + 1);
    nvram = NVRAM_Read(9);
    nvram.toCharArray(NETWORK_SUBNET, nvram.length() + 1);
    nvram = NVRAM_Read(10);
    nvram.toCharArray(NETWORK_GATEWAY, nvram.length() + 1);
    nvram = NVRAM_Read(11);
    nvram.toCharArray(NETWORK_DNS, nvram.length() + 1);
  }
  //EEPROM.end();

  WiFi.setPhyMode((WiFiPhyMode_t)WIFI_PHY_MODE);
  WiFi.setOutputPower(WIFI_PHY_POWER);

  IPAddress ip, gateway, subnet, dns;
  ip.fromString(NETWORK_IP);
  subnet.fromString(NETWORK_SUBNET);
  gateway.fromString(NETWORK_GATEWAY);
  dns.fromString(NETWORK_DNS);

  if (ACCESS_POINT_MODE == 0) {
    //=====================
    //WiFi Access Point Mode
    //=====================
    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(ip, gateway, subnet);
    WiFi.softAP(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD, ACCESS_POINT_CHANNEL, ACCESS_POINT_HIDE);
    //Serial.println(WiFi.softAPIP());
  } else {
    //================
    //WiFi Client Mode
    //================
    WiFi.mode(WIFI_STA);
    if (NETWORK_DHCP == 0) {
      WiFi.config(ip, dns, gateway, subnet);
    }
    WiFi.persistent(false);
    WiFi.disconnect(true);
    WiFi.begin(ACCESS_POINT_SSID, ACCESS_POINT_PASSWORD);  //Connect to the WiFi network
    //WiFi.enableAP(0);
    while (WiFi.waitForConnectResult() != WL_CONNECTED) {
#if DEBUG
      Serial.println("Connection Failed! Rebooting...");
#endif
      //If client mode fails ESP8266 will not be accessible
      //Set Emergency AP SSID for re-configuration
      NVRAM_Write(0, "0");
      NVRAM_Write(3, "_" + String(ACCESS_POINT_SSID));
      delay(5000);
      ESP.restart();
    }
#if DEBUG
    Serial.println(WiFi.localIP());
#endif
  }

  //===============
  //Async Web Server
  //===============
  /*
    -------------------------
    Experimental SWD Debugger
    -------------------------
  */
  server.on("/swd/reset", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, text_json, boolStr(target.debugPortReset()));
  });
  server.on("/swd/halt", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, text_json, boolStr(target.debugHalt()));
  });
  server.on("/swd/begin", HTTP_GET, [](AsyncWebServerRequest * request) {
    // See if we can communicate. If so, return information about the target.
    // This shouldn't reset the target, but it does need to communicate,
    // and the debug port itself will be reset.
    //
    // If all is well, this returns some identifying info about the target.

    uint32_t idcode;
    target.getIDCODE(idcode);
    //Debug.println(idcode);

    if (target.begin() && target.getIDCODE(idcode)) {
      char result[128];

      // Note the room left in the API for future platforms detected,
      // even though it requires refactoring a bit.

      snprintf(result, sizeof result, "{\"connected\": true, \"idcode\": %lu}", idcode);

      request->send(200, text_json, result);
    } else {
      request->send(200, text_json, "{\"connected\": false}");
    }
  });
  server.on("/swd/mem/read", HTTP_GET, [](AsyncWebServerRequest * request) {
    uint32_t addr = request->getParam("addr")->value().toInt(); ////intArg("addr");
    uint32_t count = constrain(addr, 1, 1024);
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
    request->send(200, text_json, output);
  });
  server.on("/swd/mem/write", HTTP_GET, [](AsyncWebServerRequest * request) {
    // Interprets the argument list as a list of stores to make in order.
    // The key in the key=value pair consists of an address with an optional
    // width prefix ('b' = byte wide, 'h' = half width, default = word)
    // The address can be a '.' to auto-increment after the previous store.
    //
    // Returns a confirmation and result for each store, as JSON.

    uint32_t addr = -1;
    String output = "[\n";

    for (int i = 0; request->getParam(i)->name().length()  > 0; i++) {
      uint8_t arg[64];
      request->getParam(i)->name().getBytes(arg, sizeof arg, 0);

      uint8_t *addrString = &arg[arg[0] == 'b' || arg[0] == 'h'];
      if (addrString[0] != '.') {
        addr = strtoul((char*) addrString, 0, 0);
      }

      uint8_t valueString[64];
      request->getParam(i)->name().getBytes(valueString, sizeof valueString, 0);
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
    request->send(200, text_json, output);
  });
  server.on("/swd/reg/read", HTTP_GET, [](AsyncWebServerRequest * request) {
    uint32_t addr = request->getParam("addr")->value().toInt(); //intArg("addr");
    uint32_t count = constrain(addr, 1, 1024);
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
    request->send(200, text_json, output);
  });
  server.on("/swd/reg/write", HTTP_GET, [](AsyncWebServerRequest * request) {
    String output = "[\n";

    for (int i = 0; request->getParam(i)->name().length() > 0; i++) {
      uint8_t addrString[64];
      request->getParam(i)->name().getBytes(addrString, sizeof addrString, 0);
      uint32_t addr = strtoul((char*) addrString, 0, 0);

      uint8_t valueString[64];
      request->getParam(i)->name().getBytes(valueString, sizeof valueString, 0);
      uint32_t value = strtoul((char*) valueString, 0, 0);

      bool result = target.regWrite(addr >> 2, value);

      char buf[128];
      snprintf(buf, sizeof buf,
               "%s{\"addr\": %lu, \"value\": %lu, \"result\": %s}",
               i ? "," : "", addr, value, boolStr(result));
      output += buf;
    }
    output += "\n]";
    request->send(200, text_json, output);
  });

#ifndef ARDUINO_MOD_WIFI_ESP8266
  /*
    -------------------------
    CAN-Bus
    -------------------------
  */
  server.on("/can/read",  HTTP_GET, [](AsyncWebServerRequest * request) {

    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->addHeader("Cache-Control", "no-store");

    if (request->hasParam("sdo"))
    {
      //https://openinverter.org/wiki/CAN_communication#Setting_and_reading_parameters_via_SDO
      //CANId Receive Filter (0x581/1409)

      byte txBuf0[] = {0x22, 0x00, 0x20, 0x00, 0, 0, 0, 0}; //0x00 is node id (see: include/param_prj.h)

      String sz = request->getParam("sdo")->value();
      if (sz.indexOf(",") != -1)
      {
        char buf[sz.length() + 1];
        sz.toCharArray(buf, sizeof(buf));
        char *p = buf;
        char *str;

        while ((str = strtok_r(p, ",", &p)) != NULL) //split
        {
          txBuf0[3] = String(str).toInt();
          CAN0.sendMsgBuf(0x601, 0, 8, txBuf0);
          response->print(CANReceive());
        }
      } else {
        txBuf0[3] = sz.toInt();
        CAN0.sendMsgBuf(0x601, 0, 8, txBuf0);
      }
    }
    response->print(CANReceive());
    request->send(response);
  });
  server.on("/can/write",  HTTP_GET, [](AsyncWebServerRequest * request) {

    byte txBuf0[] = {0, 0, 0, 0, 0, 0, 0, 0};

    String id = request->getParam("id")->value();
    String sz = request->getParam("data")->value();
    if (sz.indexOf(",") != -1)
    {
      uint8_t i = 0;
      char buf[sz.length() + 1];
      sz.toCharArray(buf, sizeof(buf));
      char *p = buf;
      char *str;
      while ((str = strtok_r(p, ",", &p)) != NULL) //split
      {
        txBuf0[i] = String(str).toInt();
        i++;
      }
      CAN0.sendMsgBuf(id.toInt(), 0, 8, txBuf0);
    }
    request->send(200, text_plain, "CAN Message Sent");
  });
  server.on("/can/filter", HTTP_GET, [](AsyncWebServerRequest * request) {

    //Data bytes are ONLY checked when the MCP2515 is in 'MCP_STDEXT' mode via the begin
    //function, otherwise ('MCP_STD') only the ID is checked.

    //https://github.com/SeeedDocument/CAN_BUS_Shield/raw/master/resource/MCP2515.pdf
    //RXB0 has RXM0 (Mask 0), RXF0, and RXF1 (Filter 0 and Filter 1).
    //RXB1 has RXM1 (Mask 1), RXF2, RXF3, RXF4, and RXF5 (Filters 2, 3, 4, and 5).

    uint32_t RXM = 0x00000000;
    uint32_t RXF = 0x00000000;

    if (request->hasParam("id"))
    {
      String sz = request->getParam("id")->value();
      if (sz.indexOf(",") != -1)
      {
        uint8_t i = 0;
        char buf[sz.length() + 1];
        sz.toCharArray(buf, sizeof(buf));
        char *p = buf;
        char *str;

        memset(CAN_ID_FILTERS, 0, sizeof(CAN_ID_FILTERS));
        while ((str = strtok_r(p, ",", &p)) != NULL) //split
        {
          //TODO: Build Range from Filters

          RXM = String(str).toInt() >> 8;
          RXF = String(str).toInt() >> 8;
          CAN_ID_FILTERS[i] = RXF;
          i++;
        }
      } else {
        RXM = sz.toInt() >> 8;
        RXF = sz.toInt() >> 8;
        CAN_ID_FILTERS[0] = RXF;
      }
    }

    CAN0.init_Filt(0, 0, RXM); //Mask0 is for Filter0 and Filter1
    CAN0.init_Filt(0, 0, RXF); //0
    CAN0.init_Filt(1, 0, RXF); //1

    CAN0.init_Mask(1, 0, RXM); //Mask1 is only for Filter2, 3, 4, and 5
    CAN0.init_Filt(2, 0, RXF); //2
    CAN0.init_Filt(3, 0, RXF); //3
    CAN0.init_Filt(4, 0, RXF); //4
    CAN0.init_Filt(5, 0, RXF); //5

    /*
      http://www.savvysolutions.info/savvymicrocontrollersolutions/arduino.php?topic=arduino-seeedstudio-CAN-BUS-shield
    */
    //Generally, set the mask to 0xFFFFFFF and then apply filters
    //to each of the messages you want to allow to pass to the CAN bus shield.
    //
    //Mask 0xFFFFFFF & filter 0xFFFFFFF disables all messages
    //Mask 0xFFFFFFF & filter 0x0 disables all messages (mask disables filter)
    //Mask 0x0 & filter 0x0 allows all messages to pass
    //Mask 0x0 & filter 0xFFFFFFF allows msg 0xCF00400 to be received
    //Mask 0xFFFFFFF & filter 0xCF00400 allows msg 0xCF00400 to be received

    //=================================
    //After applying Filters reset Mode
    //=================================
    CAN0.setMode(MCP_NORMAL);

    request->send(200, text_plain, "CAN Filter Set");
  });
  /*-------------------------*/
#endif

  server.on("/format", HTTP_GET, [](AsyncWebServerRequest * request) {
    FSInfo fs_info;
    String result = LittleFS.format() ? "OK" : "Error";
    LittleFS.info(fs_info);
    request->send(200, text_plain, "<b>Format " + result + "</b><br/>Total Flash Size: " + String(ESP.getFlashChipSize()) + "<br>Filesystem Size: " + String(fs_info.totalBytes) + "<br>Filesystem Used: " + String(fs_info.usedBytes));
  });
  server.on("/reset", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, text_plain, "...");
    restartRequired = true;
    //ESP.restart();
  });
  server.on("/nvram", HTTP_GET, [](AsyncWebServerRequest * request) {
    String out = NVRAM(0, 11, 4);
    request->send(200, text_json, out);
  });
  server.on("/nvram", HTTP_POST, [](AsyncWebServerRequest * request) {

    String out = "<pre>";
    uint8_t c = 0, from = 0, to = 0;
    uint8_t skip = -1;

    //skip confirm password (5)
    from = 0, to = 11, skip = 5;

    for (uint8_t i = from; i <= to; i++) {

      String v = request->getParam(c)->value();

      if (skip == -1 || i < skip) {
        out += request->getParam(c)->name() + ": ";
        NVRAM_Write(i, v);
        out += NVRAM_Read(i) + "\n";
      } else if (i > skip) {
        out += request->getParam(c)->name() + ": ";
        NVRAM_Write(i - 1, v);
        out += NVRAM_Read(i - 1) + "\n";
      }

      c++;
    }

    out += "\n...Rebooting";
    out += "</pre>";

    AsyncWebServerResponse *response = request->beginResponse(200,  text_html, out);

    if (request->hasParam("WiFiIP", true)) { //IP has changed
      response->addHeader("Refresh", "12; url=http://" + request->getParam("WiFiIP", true)->value() + "/index.php");
    } else {
      response->addHeader("Refresh", "10; url=/index.php");
    }
    request->send(response);

    restartRequired = true;
    //ESP.restart();
  });

  server.on("/update", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->send(200, text_html, serverIndex);
  });

  server.on("/update", HTTP_POST, [](AsyncWebServerRequest * request) {
    if (Update.hasError()) {
      StreamString str;
      Update.printError(str);
      request->send(200,  text_plain, String("Update error: ") + str.c_str());
    } else {
      AsyncWebServerResponse *response = request->beginResponse(200,  text_html, "Update Success! Rebooting...");
      response->addHeader("Refresh", "15; url=/");
      request->send(response);

      restartRequired = true;
      //ESP.restart();
    }
  }, WebUpload);

  server.on("/snapshot.php", HTTP_GET, [](AsyncWebServerRequest * request) {
    //NOTE: AsyncWebServerRequest has a Buffer Limit https://github.com/me-no-dev/ESPAsyncWebServer/issues/179

    char b[255];
    size_t len = 0;

    //Get "all", Format JSON, Save to FS and Send chunked.

    //serialStreamFlush(); //flush

    File f = LittleFS.open("/snapshot.json", "w");
    f.print("{\n    \"");

    Serial.print("all");
    Serial.print('\n');
    serialEcho(); //while (Serial.read() != '\n'); //consume echo

    do {
      memset(b, 0, sizeof(b));
      len = Serial.readBytes(b, sizeof(b) - 1);
      //------------------
      //quick json format
      //------------------
      String line = b;
      line.replace("\r", "");
      line = line.substring(0, (line.length() - 1));
      line.replace("\t\t", "\": \"");
      line.replace("\n", "\",\n    \"");
      //------------------
      f.print(line);
    } while (len > 0);

    f.print("\"\n}");
    f.close();

    AsyncWebServerResponse *response = request->beginResponse(LittleFS, "/snapshot.json", text_json, true);
    request->send(response);

    //LittleFS.remove("/snapshot.json");
  });

  server.on("/snapshot.php", HTTP_POST, [](AsyncWebServerRequest * request) {
    request->redirect("/index.php");
  }, SnapshotUpload);

  server.on("/bootlo~1.php", HTTP_POST, [](AsyncWebServerRequest * request) { //Short name for Windows
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->addHeader("Cache-Control", "no-store");
    response->addHeader("Refresh", "30; url=/firmware.php");
    response->print(firmwareStream);
    request->send(response);
  }, FirmwareUpload);

  server.on("/bootloader.php", HTTP_POST, [](AsyncWebServerRequest * request) {
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->addHeader("Cache-Control", "no-store");
    response->addHeader("Refresh", "30; url=/firmware.php");
    response->print(firmwareStream);
    request->send(response);
  }, FirmwareUpload);

  server.on("/firmware.php", HTTP_POST, [](AsyncWebServerRequest * request) {
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->addHeader("Cache-Control", "no-store");
    response->addHeader("Refresh", "10; url=/index.php");
    response->print(firmwareStream);
    request->send(response);
  }, FirmwareUpload);

  server.on("/test.php", HTTP_POST, [](AsyncWebServerRequest * request) {
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->addHeader("Cache-Control", "no-store");
    response->print(firmwareStream);
    request->send(response);
  }, FirmwareUpload);

  server.on("/serial.php", HTTP_GET, [](AsyncWebServerRequest * request) {

    //NOTE: AsyncWebServer library does not allow delay or yield, but Serial.readString(); uses yield();

    char b[255];
    size_t len = 0;
    String output = "";

    if (request->hasParam("init")) {

      String _speed = request->getParam("init")->value();
      int _baud = _speed.toInt();

      if (_speed != "921600") {
        _speed = "0";
      }

      //serialStreamFlush(); //flush

      Serial.print("fastuart ");
      Serial.print(_speed);
      Serial.print('\n');
      serialEcho(); //consume echo

      //Serial.end();
      Serial.begin(_baud, SERIAL_8N1);

      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t *buffer, size_t maxLen, size_t index) -> size_t {
        return Serial.readBytes(buffer, maxLen);
      });
      response->addHeader("Cache-Control", "no-store");
      request->send(response);

    } else if (request->hasParam("os")) {

      request->send(200, text_plain, "esp8266");

    } else if (request->hasParam("pk") && request->hasParam("name") && request->hasParam("value")) {

      AsyncResponseStream *response = request->beginResponseStream(text_plain);
      response->addHeader("Cache-Control", "no-store");

      //serialStreamFlush(); //flush

      Serial.print("set " + request->getParam("name")->value() + " " + request->getParam("value")->value());
      Serial.print('\n');
      serialEcho(); //consume echo

      do {
        memset(b, 0, sizeof(b));
        len = Serial.readBytes(b, sizeof(b) - 1);
        response->printf("%s", b);
      } while (len > 0);

      request->send(response);
      
    } else if (request->hasParam("get")) {

      //serialStreamFlush(); //flush
      
      String _param = request->getParam("get")->value();
      
      Serial.print("get " + _param);
      Serial.print('\n');

      _param += ","; //Support multi-value

      for (byte i = 0; i < _param.length(); i++) {
        if (_param.charAt(i) == ',') {
          serialEcho(); //while (Serial.read() != '\n'); //consume echo
        }
      }
      
      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t *buffer, size_t maxLen, size_t index) -> size_t {
        return Serial.readBytes(buffer, maxLen);
      });
      response->addHeader("Cache-Control", "no-store");
      request->send(response);

    } else if (request->hasParam("command")) {

      //serialStreamFlush(); //flush

      Serial.print(request->getParam("command")->value());
      Serial.print('\n');
      serialEcho(); //while (Serial.read() != '\n'); //consume echo

      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t *buffer, size_t maxLen, size_t index) -> size_t {
        //while (!Serial.available()); //wait until available
        return Serial.readBytes(buffer, maxLen);
      });
      response->addHeader("Cache-Control", "no-store");
      request->send(response);

    } else if (request->hasParam("stream")) {

      uint16_t _loop = request->getParam("loop")->value().toInt();
      uint16_t _delay = request->getParam("delay")->value().toInt();

      //serialStreamFlush(); //flush

      Serial.print("get " + request->getParam("stream")->value());
      Serial.print('\n');
      serialEcho(); //consume echo
      serialEcho(); //consume first read

      AsyncWebServerResponse *response = request->beginResponse(text_plain, _loop + 1, [](uint8_t *buffer, size_t maxLen, size_t index) -> size_t {
        Serial.print('!');
        Serial.read(); //consume "!"
        return Serial.readBytes(buffer, maxLen);
      });
      response->addHeader("Cache-Control", "no-store");
      request->send(response);
    }
  });
  server.on("/graph.php", HTTP_GET, [](AsyncWebServerRequest * request) {

    if (request->hasParam("debug"))
    {
      AsyncResponseStream *response = request->beginResponseStream(text_plain);
      response->addHeader("Cache-Control", "no-store");

      char* s = string2char(request->getParam("stream")->value());
      uint16_t _loop = request->getParam("loop")->value().toInt();
      uint16_t _delay = request->getParam("delay")->value().toInt();

      for (uint16_t i = 0; i < _loop; i++) {
        String _response = ""; //String(c);
        for (uint16_t x = 0; s[x]; s[x] == ',' ? x++ : *s++) {
          _response += String(random(50, 100));
          _response += "\n";
        }
        response->print(_response);
        //delay(_delay);
      }
      request->send(response);
    } else {
      String file = request->url();
      readPHP(file);

      AsyncWebServerResponse *response = request->beginResponse(LittleFS, file + ".html", text_html);
      request->send(response);
    }
  });

  server.on("/interface", HTTP_GET, [](AsyncWebServerRequest * request) {
    firmwareInterface = request->getParam("i")->value();
    request->send(200, text_plain, firmwareInterface);
  });

  server.on("/js/menu-mobile.json", HTTP_GET, [](AsyncWebServerRequest * request) {
    request->redirect("/js/menu.json");
  });

  server.on("/", [](AsyncWebServerRequest * request) {
    if (LittleFS.exists("/index.php")) {
      request->redirect("/index.php");
    } else {
      AsyncWebServerResponse *response = request->beginResponse(200, text_html, "File System Not Found ...");
      response->addHeader("Refresh", "6; url=/update");
      request->send(response);
    }
  });

  server.onNotFound([](AsyncWebServerRequest * request) {
    //Serial.println((request->method() == HTTP_GET) ? "GET" : "POST");

    String file = request->url();

#if DEBUG
    Serial.println("Request:" + file);
#endif

    bool php = LittleFS.exists(file);
    bool php_html = LittleFS.exists(file + ".html");
    
    if (php || php_html)
    {
      digitalWrite(LED_BUILTIN, HIGH);
      String contentType = getContentType(file);

      if (file.endsWith(".php") > 0)
      {
        //Large files must to be buffered. Process PHP > HTML > Asyncronous stream
        if (!php_html) {
          readPHP(file);
        }
        //Large files need to be buffered

        AsyncWebServerResponse *response = request->beginResponse(LittleFS, file + ".html", text_html);
        //response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);

      } else {

        AsyncWebServerResponse *response = request->beginResponse(LittleFS, file, contentType);
        response->addHeader("Content-Encoding", "gzip");
        //response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);
      }
      digitalWrite(LED_BUILTIN, LOW);
    } else {
      request->send(404, text_plain, "404: Not Found");
    }
  });

#if ASYNC_TCP_SSL_ENABLED == 1
  server.onSslFileRequest([](void * arg, const char *filename, uint8_t **buf) -> int {
    File file = LittleFS.open(filename, "r");
    if (file) {
      size_t size = file.size();
      uint8_t* nbuf = (uint8_t*) malloc(size);
      if (nbuf) {
        size = file.read(nbuf, size);
        file.close();
        *buf = nbuf;
#if DEBUG
        Serial.print("[WEB] SSL File: ");
        Serial.print(filename);
        Serial.println(" OK");
#endif
        return size;
      }
      file.close();
    }
#if DEBUG
    Serial.print("[WEB] SSL File: ");
    Serial.print(filename);
    Serial.println(" ERROR");
#endif
    *buf = 0;
    return 0;
  }, NULL);
  server.beginSecure("/server.cer", "/server.key", NULL);
#else
  server.begin(); // Web server start
#endif

  //ArduinoOTA.begin();

  pinMode(LED_BUILTIN, OUTPUT);

  //==========
  //DNS Server
  //==========
  /* http://inverter.local */
  /*
    MDNS.begin("inverter");
    MDNS.addService("http", "tcp", 80);
    MDNS.addService("telnet", "tcp", 23);
    MDNS.addService("arduino", "tcp", 8266);
  */

  //===================
  //Remote Telnet Debug
  //===================
  /*
    Debug.begin("inverter"); // Telnet server
    //Debug.setPassword(ACCESS_POINT_PASSWORD); // Telnet password
    Debug.setResetCmdEnabled(true); // Enable the reset command
    //Debug.showProfiler(true); // To show profiler - time between messages of Debug
    //Debug.showColors(true); // Colors
    //Debug.showDebugLevel(false); // To not show debug levels
    //Debug.showTime(true); // To show time
    //Debug.setSerialEnabled(true); // Serial echo
  */
#ifdef ARDUINO_ESP8266_WEMOS_D1R1
  //====================
  //CAN-Bus
  //====================
  /*
    CAN bus @ 250 kbps is limited to a sample rate of 100 Hz
    1000 ms = 1 sec = 1 Hz
    100 ms = 0.1 sec = 10 Hz
    10 ms = 0.01 sec = 100 Hz
  */

  SPI.begin();

  if (CAN0.begin(MCP_STDEXT, CAN_250KBPS, MCP_8MHZ) == CAN_OK) // Coryjfowler Library
  {
#if DEBUG
    Serial.println("MCP2515 Initialized Successfully!");
#endif
    CAN0.setMode(MCP_NORMAL);

  } else {
#if DEBUG
    Serial.println("Error Initializing MCP2515...");
#endif
  }
  serialStreamFlush(); //flush
#endif
}

void loop()
{
  if (restartRequired) {
#if DEBUG
    Serial.println("Restarting ESP");
#endif
    restartRequired = false;
    delay(1000);
    WiFi.disconnect(true);  //Erases SSID/password
    //ESP.eraseConfig();
    ESP.restart();
  }
  //Debug.handle();
  //server.handleClient();
  //ArduinoOTA.handle();
  //yield();
}

char* string2char(String command) {
  if (command.length() != 0) {
    char *p = const_cast<char*>(command.c_str());
    return p;
  }
}
#ifdef ARDUINO_ESP8266_WEMOS_D1R1
StreamString CANReceive()
{
  StreamString CANMessage;

  if (CAN0.checkReceive() == CAN_MSGAVAIL)
  {
    unsigned char len = 0;

    CAN0.readMsgBuf(&CANmsgId, &len, CANmsg);

    if ((CANmsgId & 0x80000000) == 0x80000000)
    {
      CANMessage.printf("Extended ID:0x%.8lX  DLC:%1d  Data:", (CANmsgId & 0x1FFFFFFF), len);
    } else {
      CANMessage.printf("Standard ID:0x%.3lX  DLC:%1d  Data:", CANmsgId, len);
    }

    for (byte i = 0; i < len; i++) {
      CANMessage.printf("0x%.2X ", CANmsg[i]);
    }
#ifdef DEBUG
    Serial.println(CANMessage);
#endif

  } else {
    if (CAN0.checkError() == CAN_CTRLERROR) {
      CANMessage.println(CAN0.getError());
    }
    //CANMessage.println("No CAN Message Available");
  }
  return CANMessage;
}
#endif

//=============
// NVRAM CONFIG
//=============
String NVRAM(uint8_t from, uint8_t to, uint8_t skip)
{
  String out = "{\n";

  for (uint8_t i = from; i <= to; i++) {
    if (skip == -1 || i != skip) {
      out += "\t\"nvram" + String(i) + "\": \"" + NVRAM_Read(i) + "\",\n";
    }
  }

  out = out.substring(0, (out.length() - 2));
  out += "\n}";

  return out;
}

void NVRAM_Erase()
{
  for (uint16_t i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i, 255);
  }
}

void NVRAM_Write(uint32_t address, String txt)
{
  char arrayToStore[32];
  memset(arrayToStore, 0, sizeof(arrayToStore));
  txt.toCharArray(arrayToStore, sizeof(arrayToStore)); // Convert string to array.

  EEPROM.put(address * sizeof(arrayToStore), arrayToStore);
  EEPROM.commit();
}

String NVRAM_Read(uint32_t address)
{
  char arrayToStore[32];
  EEPROM.get(address * sizeof(arrayToStore), arrayToStore);

  return String(arrayToStore);
}

//=============
// PHP MINI
//=============
void readPHP(String file)
{
  String l = "";
  phpTag[0] = false;

  File f = LittleFS.open(file, "r");
  File ff = LittleFS.open(file + ".html", "w");

  while (f.available()) {
    l = f.readStringUntil('\n');
    ff.println(PHP(l, 0));
  }
  f.close();
  ff.close();

  //Unless these are Dynamic PHP we no longer need to keep Original PHP
  LittleFS.remove(file);
}

String PHP(String line, int i)
{
#ifdef DEBUG
  Serial.println(line);
#endif

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

#ifdef DEBUG
      Serial.println("include:" + include);
#endif

      File f = LittleFS.open("/" + include, "r");
      //if (f) {
      String l;
      int x = i + 1;
      phpTag[x] = false;

      while (f.available()) {
        l = f.readStringUntil('\n');
        line += PHP(l, x);
        //line += "\n";
      }
      f.close();
      //}

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

String indexJSON(String dir, String ext[])
{
  String out = "{\n\t\"index\": [\n";

  Dir files = LittleFS.openDir(dir);
  while (files.next()) {
    for (int i = 0; i < sizeof(ext); i++) {
      if (files.fileName().endsWith(ext[i])) {
        out += "\t\t\"" + files.fileName() + "\",\n";
      }
    }
  }

  out = out.substring(0, (out.length() - 2));
  out += "\t]\n}";

  return out;
}

String getContentType(String filename)
{
  if (filename.endsWith(".php")) return text_html;
  else if (filename.endsWith(".htm")) return text_html;
  else if (filename.endsWith(".html")) return text_html;
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".json")) return text_json;
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".jpg")) return "image/jpeg";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  else if (filename.endsWith(".svg")) return "image/svg+xml";
  else if (filename.endsWith(".pdf")) return "application/x-pdf";
  else if (filename.endsWith(".zip")) return "application/x-zip";
  else if (filename.endsWith(".csv")) return "text/csv";
  else if (filename.endsWith(".ttf")) return "font/ttf";
  else if (filename.endsWith(".woff")) return "font/woff";
  else if (filename.endsWith(".woff2")) return "font/woff2";
  return text_plain;
}

//===============
//Web OTA Updater
//===============
void WebUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
  if (!index) {
    //Serial.print(request->params());

    if (filename == "flash-littlefs.bin") {
      //if (request->hasParam("filesystem",true)) {
      size_t fsSize = ((size_t) &_FS_end - (size_t) &_FS_start);
#if DEBUG
      Serial.printf("Free Filesystem Space: %u\n", fsSize);
      Serial.printf("Filesystem Flash Offset: %u\n", U_FS);
#endif
      close_all_fs();
      if (!Update.begin(fsSize, U_FS)) { //start with max available size
        Update.printError(Serial);
      }
    } else {
      uint32_t maxSketchSpace = (ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000; //calculate sketch space required for the update
#if DEBUG
      Serial.printf("Free Scketch Space: %u\n", maxSketchSpace);
#endif
      if (!Update.begin(maxSketchSpace, U_FLASH)) { //start with max available size
        Update.printError(Serial);
      }
    }
    Update.runAsync(true); // tell the updaterClass to run in async mode
  }

  if (Update.write(data, len) != len) {
    Update.printError(Serial);
  }

  if (final) {
    if (!Update.end(true)) {
      Update.printError(Serial);
    }
  }
}

void SnapshotUpload(AsyncWebServerRequest * request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
  if (!index) {
    LittleFS.remove("/" + filename);
  }

  File fsUpload = LittleFS.open("/" + filename, "a");
  fsUpload.write(data, len);
  fsUpload.close();

  if (final) {

    File f = LittleFS.open("/" + filename, "r");
    while (f.available()) {
      String cmd = f.readStringUntil('\n');
      cmd.replace("\t", "");
      cmd.replace(" ", "");
      cmd.replace("\"", "");
      cmd.replace(",", "");
      cmd.replace(":", " ");
      if (!cmd.startsWith("{") && !cmd.endsWith("}")) {
        Serial.print("set " + cmd);
        Serial.print('\n');
      }
    }
    f.close();
    LittleFS.remove("/" + filename);

    Serial.print("save");
    Serial.print('\n');
  }
}

void FirmwareUpload(AsyncWebServerRequest * request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
  if (!index) {
    LittleFS.remove("/" + filename);
    //firmwareStream.clear();
  }

  File fsUpload = LittleFS.open("/" + filename, "a");
  fsUpload.write(data, len);
  fsUpload.close();

  if (final) {

    File f = LittleFS.open("/" + filename, "r");
    uint32_t len = f.size();
    uint32_t addr = (uint32_t)0x08000000;
    uint32_t addrEnd = (uint32_t)0x0801ffff;

    if (request->url() == "/firmware.php") {
      addr = (uint32_t)0x08001000;
    }

    firmwareStream.println("<pre>");
    firmwareStream.println("\ninterface: ");
    firmwareStream.println(firmwareInterface);

    if (firmwareInterface == "swd-esp8266") {
      //==================
      // SWD UPDATER
      //==================
      uint32_t idcode;
      uint32_t SWD_idcode = 463475831; //0x1BA01477 - page:1089
      bool debugHalt = false;
      uint8_t timeout = 10;
      while (idcode != SWD_idcode && timeout > 0) {
        target.begin();
        target.getIDCODE(idcode);
        debugHalt = target.debugHalt();
        delay(500);
        timeout--;
      }
      firmwareStream.println("debug: ");
      firmwareStream.print(String(debugHalt));
      firmwareStream.println("size: ");
      firmwareStream.print(String(len));

      if (target.begin() && target.getIDCODE(idcode)) {
        firmwareStream.println("idcode: ");
        firmwareStream.print(String(idcode));

        //Erase until end of flash

        for (int i = addr; i <= addrEnd; i++) {
          target.apWrite(addr, 0); //zero it
        }

        while (f.available()) {
          //char b = char(f.read());

          //firmwareStream.println("0x");
          //firmwareStream.print(String(addr, HEX));

          //uint32_t data = f.read();
          //firmwareStream.println("=0x");
          //firmwareStream.print(String(data, HEX));

          //target.debugHalt();
          //target.memStoreByte(addr, f.read());
          //target.memStore(addr, data);
          //target.memStoreAndVerify(addr, f.read());
          target.apWrite(addr, f.read());

          addr++;
        }
        firmwareStream.println("jolly good!"); //st-flash lingo
      } else {
        firmwareStream.println("SWD not connected");
      }
      //request->send(response);

    } else {
      //==================
      // STM32 UPDATER
      //==================
      uint8_t timeout = 0;
      char c;
      const size_t PAGE_SIZE_BYTES = 1024;
      //int pages = (len / PAGE_SIZE_BYTES) + 1;
      uint8_t pages = (len + PAGE_SIZE_BYTES - 1) / PAGE_SIZE_BYTES;

      firmwareStream.println("File length is " + String(len) + " bytes/" + String(pages) + " pages");

      //Serial.end();
      Serial.begin(115200, SERIAL_8N1);

      //Clear the initialization Bug
      //-----------------------------
      Serial.print("hello");
      Serial.print('\n');
      serialEcho(); //while (Serial.read() != '\n'); //echo
      serialEcho(); //while (Serial.read() != '\n'); //reply
      //-----------------------------
      firmwareStream.println("Resetting device...");
      Serial.print("reset");
      Serial.print('\n');

      do {
        c = Serial.read();
        /*
          server.sendContent(String(c));
          delay(10);
          timeout++;
        */
      } while (c != 'S' && c != '2'); // && timeout < 255);

      firmwareStream.println("\n" + String(timeout) + "\n");

      if (c == '2')
      {
        firmwareStream.println("Bootloader v2 detected");
        Serial.write(0xAA); //Send magic
        while (Serial.read() != 'S');
      }

      if (timeout < 255)
      {
        firmwareStream.println("Sending number of pages.." + String(pages));
        Serial.write(pages);

        while (Serial.read() != 'P'); //Wait for page request

        uint8_t page = 0;
        bool done = false;

        while (done != true)
        {
          firmwareStream.println("Sending page " + String(page) + "...");

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

            while (!Serial.available()); //wait until available
            c = Serial.read();

            if (c == 'T')
            {
              firmwareStream.println("Transmission Error");
            }
          }
          firmwareStream.println("Sending CRC...");

          //Serial.write(crc);
          Serial.write((uint8_t*)&crc, sizeof(uint32_t));
          while (!Serial.available()); //wait until available
          c = Serial.read();
          
          if ('D' == c)
          {
            firmwareStream.println("CRC correct!");
            firmwareStream.println("Update done!");

            done = true;
          }
          else if ('E' == c)
          {
            firmwareStream.println("CRC error!");
          }
          else if ('P' == c)
          {
            firmwareStream.println("CRC correct!");
            page++;
          }
        }
      } else {
        firmwareStream.println("STM32 is bricked - Try pressing reset button during upload");
      }
    }
    f.close();

    LittleFS.remove("/" + filename);
    firmwareStream.println("</pre>");
    //request->send(response);
  }
}

void serialEcho()
{
  uint8_t timeout = 255;
  while (char c = Serial.read() != '\n' && timeout > 0) {
    timeout--;
  }
}

void serialStreamFlush()
{
  char b[64];
  size_t len = 0;
  uint8_t timeout = 255;

  Serial.print('\n');
  serialEcho(); //while (Serial.read() != '\n'); //consume echo

  do {
    memset(b, 0, sizeof(b));
    len = Serial.readBytes(b, sizeof(b) - 1);
    timeout--;
  } while (len > 0 && timeout > 0);
}

static uint32_t crc32_word(uint32_t Crc, uint32_t Data)
{
  Crc = Crc ^ Data;

  for (uint8_t i = 0; i < 32; i++)
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
