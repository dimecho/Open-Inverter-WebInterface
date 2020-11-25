/*IMPORTANT NOTE WEBSERVER

   Requires two libraries not part of Arduino
   1) https://github.com/me-no-dev/ESPAsyncWebServer
   2) https://github.com/me-no-dev/ESPAsyncTCP
*/
#include "version.h"

#define DEBUG                 false
#define EEPROM_ID             0x3BDAB101 //Identify Sketch by EEPROM

#define ASYNC_TCP_SSL_ENABLED false
String HTTPS_FQDN = "inverter.openinverter.org"; //DNS resolution to 192.168.4.1

/*IMPORTANT NOTE for SSL

   Need to fix ESPAsyncTCP library
   1) Modify line 5 in async_config.h to #define ASYNC_TCP_SSL_ENABLED 1
   2) Modify line 279 in ESPAsyncTCP.cpp
   from

  return connect(IPAddress(addr.addr), port);

   to

  #if ASYNC_TCP_SSL_ENABLED
      return connect(IPAddress(addr.addr), port, secure);
  #else
      return connect(IPAddress(addr.addr), port);
  #endif
*/

//#include <RemoteDebug.h>
//#include <ArduinoOTA.h>
#include <EEPROM.h>
#include <AESLib.h>
#include <flash_hal.h>
#include <StreamString.h>

#ifdef ESP32
#include <WiFi.h>
#include <ESP32Ticker.h>
#include <AsyncTCP.h>
#include <Update.h>
#elif defined(ESP8266)
#include <Ticker.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <LittleFS.h>
#include <ESPAsyncWebServer.h>
#include <DNSServer.h> //Works on all systems ...does not work in station mode (only as access point)
#include <ESP8266mDNS.h> //Works in station mode ...does not work on Android

#ifdef ARDUINO_MOD_WIFI_ESP8266
#define LED_BUILTIN 1 //GPIO1=Olimex
#else
#define LED_BUILTIN 2 //GPIO2=ESP-12/WeMos(D4)
#endif

//RemoteDebug Debug;

#if ASYNC_TCP_SSL_ENABLED
AsyncWebServer httpserver(80);
AsyncWebServer server(443);
const uint8_t SSLPrivateKey[] = {0x30, 0x82, 0x02, 0x5D, 0x02, 0x01, 0x00, 0x02, 0x81, 0x81, 0x00, 0xB6, 0xC1, 0x99, 0xF5, 0xC5, 0x84, 0xCA, 0xE9, 0x9C, 0x6A, 0x01, 0xCC, 0x63, 0x6B, 0x84, 0x7C, 0x7F, 0xD8, 0xA0, 0x38, 0x0F, 0xC0, 0x87, 0x7D, 0xCD, 0xBD, 0x8D, 0x4F, 0x2F, 0x8A, 0x78, 0xB3, 0xB8, 0x1F, 0x4D, 0x1D, 0x61, 0x34, 0x3F, 0x29, 0x56, 0xCC, 0xB6, 0x9D, 0x14, 0xF6, 0x8D, 0x12, 0x68, 0x58, 0x07, 0x44, 0xB0, 0x3C, 0xE9, 0xD3, 0x7F, 0x07, 0x92, 0xAE, 0x63, 0xCB, 0xE4, 0xE6, 0xD5, 0xCD, 0x4A, 0x1C, 0x99, 0xAA, 0x19, 0x67, 0xDD, 0x93, 0x0A, 0xA8, 0x18, 0x4F, 0x08, 0x8F, 0x09, 0x6C, 0xB7, 0xDD, 0xB4, 0xB6, 0x54, 0x8A, 0xC0, 0xF6, 0xCB, 0xC8, 0x57, 0xCC, 0x6C, 0xEB, 0x77, 0xC7, 0xC3, 0x62, 0xBB, 0x88, 0xFB, 0x47, 0x5B, 0x15, 0xC1, 0x0B, 0x7C, 0xE8, 0x5F, 0xF8, 0x05, 0x68, 0xA3, 0x49, 0x3D, 0xA2, 0x18, 0x59, 0x73, 0x63, 0x96, 0x83, 0x79, 0xCD, 0xAE, 0x61, 0x02, 0x03, 0x01, 0x00, 0x01, 0x02, 0x81, 0x80, 0x4C, 0x05, 0xD1, 0x03, 0xB9, 0xBC, 0x79, 0xA4, 0x20, 0x1A, 0xC0, 0xD0, 0xC2, 0xF2, 0xB0, 0xD4, 0x11, 0x62, 0x8D, 0x93, 0x84, 0x89, 0xF4, 0x52, 0xD2, 0xC8, 0xED, 0x05, 0x69, 0xA3, 0x52, 0x7E, 0x80, 0x33, 0x15, 0x23, 0x09, 0x92, 0x70, 0x4B, 0xC3, 0xFD, 0xB8, 0x61, 0x33, 0x9D, 0x34, 0x25, 0xDA, 0x1D, 0xF4, 0x38, 0x10, 0x8F, 0xE6, 0x3C, 0xC2, 0x74, 0xE6, 0x01, 0x81, 0x26, 0x09, 0xFB, 0x7F, 0xDE, 0xDC, 0x04, 0xA7, 0x83, 0x3A, 0x59, 0x4F, 0x62, 0x29, 0x8A, 0x30, 0x6A, 0x6C, 0x89, 0x5E, 0x80, 0x4C, 0x69, 0x7B, 0x75, 0xE4, 0xE5, 0x88, 0x4D, 0x58, 0x23, 0x12, 0xE6, 0x5C, 0x08, 0x40, 0xB8, 0x4D, 0x56, 0xC7, 0x93, 0x92, 0xAE, 0x12, 0x5C, 0xAD, 0xD4, 0x34, 0xC1, 0x07, 0xA6, 0xD7, 0x6A, 0x84, 0xAA, 0xD5, 0x14, 0xFF, 0x70, 0x82, 0x36, 0xE4, 0x51, 0xC9, 0xD8, 0xCA, 0x81, 0x02, 0x41, 0x00, 0xE5, 0xE0, 0x86, 0x55, 0xA0, 0x96, 0xAA, 0x88, 0x4B, 0xE9, 0xE4, 0xBC, 0x58, 0x21, 0x00, 0x6C, 0x1E, 0xAD, 0xCA, 0x2B, 0xB9, 0x6F, 0x27, 0xFE, 0xDA, 0x2B, 0x4C, 0xAE, 0xE8, 0x79, 0xE2, 0x77, 0xCE, 0x82, 0xD6, 0xF9, 0x30, 0x50, 0xDF, 0x42, 0xB9, 0x0B, 0x47, 0x59, 0x95, 0x8E, 0x7F, 0x5A, 0xB6, 0xB9, 0x03, 0xD2, 0xFC, 0x65, 0x3C, 0x1B, 0x8C, 0xB6, 0xD0, 0x66, 0xEF, 0xB1, 0x20, 0x29, 0x02, 0x41, 0x00, 0xCB, 0x86, 0x42, 0xB8, 0x7F, 0x57, 0x23, 0x8E, 0xBD, 0x41, 0x78, 0x4A, 0x33, 0x09, 0x74, 0xEF, 0x5F, 0x78, 0x9A, 0xDB, 0x04, 0xC4, 0xA5, 0x07, 0xBA, 0xF8, 0xA4, 0x26, 0x58, 0xA4, 0x00, 0xBA, 0x1E, 0x91, 0x82, 0xBD, 0xE5, 0xF2, 0x0E, 0x11, 0x3E, 0x6B, 0xC1, 0xF9, 0x3F, 0x06, 0xD3, 0x43, 0x39, 0x99, 0xEE, 0x2D, 0x93, 0x67, 0xAC, 0xEB, 0x44, 0xE7, 0x45, 0x53, 0x60, 0xAD, 0x03, 0x79, 0x02, 0x40, 0x03, 0x78, 0x10, 0xEE, 0xE7, 0xDE, 0x7E, 0x32, 0x52, 0x5A, 0xF4, 0x3D, 0xB7, 0x62, 0xC0, 0x1B, 0xE1, 0x96, 0xA3, 0xCF, 0x67, 0x1B, 0xFB, 0x51, 0x88, 0x3F, 0x51, 0x07, 0xEE, 0xB0, 0x30, 0x2F, 0xB8, 0xA9, 0x16, 0xCF, 0x69, 0xE0, 0x3E, 0x8E, 0x46, 0x36, 0x9A, 0x5C, 0x0A, 0xBA, 0xBC, 0xC7, 0x44, 0xAC, 0xA4, 0x17, 0x22, 0x01, 0xF1, 0x17, 0x45, 0x57, 0x58, 0xEB, 0xC4, 0xC0, 0x3A, 0x89, 0x02, 0x41, 0x00, 0xC2, 0x97, 0x07, 0xCB, 0xE6, 0xD4, 0xA5, 0xC6, 0x9F, 0xE4, 0xAC, 0xE2, 0x24, 0x91, 0xF2, 0x1F, 0xBC, 0x24, 0x4F, 0xCB, 0x00, 0x70, 0x13, 0x69, 0xA4, 0xB6, 0x7E, 0x1B, 0xBB, 0xBC, 0x72, 0x85, 0x81, 0x1C, 0x96, 0xE8, 0x81, 0xA6, 0x41, 0x14, 0xF3, 0x9D, 0x8B, 0xC4, 0x87, 0x22, 0x3B, 0x73, 0x96, 0xEB, 0x39, 0xF2, 0x91, 0x71, 0x1A, 0xBF, 0x87, 0x0D, 0xA8, 0x16, 0xE3, 0xE4, 0x07, 0xE1, 0x02, 0x41, 0x00, 0x84, 0xB8, 0x13, 0xC7, 0xB3, 0xC3, 0xDB, 0xD4, 0xE1, 0xC6, 0xF9, 0x46, 0xE5, 0x61, 0x7C, 0x24, 0xC3, 0x2B, 0x23, 0x25, 0x4B, 0x94, 0x4B, 0xA8, 0x30, 0xB4, 0x68, 0xEE, 0x1E, 0xB2, 0x5C, 0x56, 0x0C, 0xCB, 0xA1, 0x6D, 0xE8, 0xD8, 0x4F, 0xD1, 0x81, 0xE7, 0xBA, 0x11, 0xE4, 0x33, 0x84, 0xCB, 0x59, 0xC3, 0xC4, 0x48, 0x7D, 0x45, 0x1D, 0xFA, 0x9D, 0xE3, 0x12, 0x5A, 0x14, 0x83, 0x3B, 0x85 };
const uint8_t SSLCertificate[] = {0x30, 0x82, 0x02, 0x4F, 0x30, 0x82, 0x01, 0x37, 0x02, 0x14, 0x03, 0x83, 0x15, 0xE5, 0xB6, 0xC6, 0xE3, 0xC8, 0xF4, 0x4A, 0xAE, 0xEB, 0xB1, 0xDD, 0xCB, 0xFD, 0x26, 0xA5, 0x82, 0xDF, 0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x0B, 0x05, 0x00, 0x30, 0x1B, 0x31, 0x19, 0x30, 0x17, 0x06, 0x03, 0x55, 0x04, 0x0A, 0x0C, 0x10, 0x4F, 0x70, 0x65, 0x6E, 0x2D, 0x49, 0x6E, 0x76, 0x65, 0x72, 0x74, 0x65, 0x72, 0x20, 0x43, 0x41, 0x30, 0x1E, 0x17, 0x0D, 0x32, 0x30, 0x30, 0x35, 0x33, 0x31, 0x31, 0x37, 0x31, 0x30, 0x35, 0x30, 0x5A, 0x17, 0x0D, 0x33, 0x34, 0x30, 0x32, 0x30, 0x37, 0x31, 0x37, 0x31, 0x30, 0x35, 0x30, 0x5A, 0x30, 0x31, 0x31, 0x16, 0x30, 0x14, 0x06, 0x03, 0x55, 0x04, 0x0A, 0x0C, 0x0D, 0x4F, 0x70, 0x65, 0x6E, 0x2D, 0x49, 0x6E, 0x76, 0x65, 0x72, 0x74, 0x65, 0x72, 0x31, 0x17, 0x30, 0x15, 0x06, 0x03, 0x55, 0x04, 0x03, 0x0C, 0x0E, 0x69, 0x6E, 0x76, 0x65, 0x72, 0x74, 0x65, 0x72, 0x2E, 0x6C, 0x6F, 0x63, 0x61, 0x6C, 0x30, 0x81, 0x9F, 0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x01, 0x05, 0x00, 0x03, 0x81, 0x8D, 0x00, 0x30, 0x81, 0x89, 0x02, 0x81, 0x81, 0x00, 0xB6, 0xC1, 0x99, 0xF5, 0xC5, 0x84, 0xCA, 0xE9, 0x9C, 0x6A, 0x01, 0xCC, 0x63, 0x6B, 0x84, 0x7C, 0x7F, 0xD8, 0xA0, 0x38, 0x0F, 0xC0, 0x87, 0x7D, 0xCD, 0xBD, 0x8D, 0x4F, 0x2F, 0x8A, 0x78, 0xB3, 0xB8, 0x1F, 0x4D, 0x1D, 0x61, 0x34, 0x3F, 0x29, 0x56, 0xCC, 0xB6, 0x9D, 0x14, 0xF6, 0x8D, 0x12, 0x68, 0x58, 0x07, 0x44, 0xB0, 0x3C, 0xE9, 0xD3, 0x7F, 0x07, 0x92, 0xAE, 0x63, 0xCB, 0xE4, 0xE6, 0xD5, 0xCD, 0x4A, 0x1C, 0x99, 0xAA, 0x19, 0x67, 0xDD, 0x93, 0x0A, 0xA8, 0x18, 0x4F, 0x08, 0x8F, 0x09, 0x6C, 0xB7, 0xDD, 0xB4, 0xB6, 0x54, 0x8A, 0xC0, 0xF6, 0xCB, 0xC8, 0x57, 0xCC, 0x6C, 0xEB, 0x77, 0xC7, 0xC3, 0x62, 0xBB, 0x88, 0xFB, 0x47, 0x5B, 0x15, 0xC1, 0x0B, 0x7C, 0xE8, 0x5F, 0xF8, 0x05, 0x68, 0xA3, 0x49, 0x3D, 0xA2, 0x18, 0x59, 0x73, 0x63, 0x96, 0x83, 0x79, 0xCD, 0xAE, 0x61, 0x02, 0x03, 0x01, 0x00, 0x01, 0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x01, 0x0B, 0x05, 0x00, 0x03, 0x82, 0x01, 0x01, 0x00, 0x0E, 0x31, 0x34, 0xBF, 0x64, 0x10, 0x5B, 0x94, 0x32, 0xB3, 0x5C, 0xE4, 0x59, 0xF6, 0x10, 0x1E, 0x93, 0x70, 0x32, 0xE7, 0x37, 0xBD, 0xA0, 0x42, 0xA7, 0xE0, 0x30, 0xD6, 0x39, 0xA9, 0x56, 0x8E, 0x06, 0xFA, 0x64, 0xDD, 0x9F, 0x95, 0x87, 0xAA, 0xBF, 0xB0, 0x00, 0xA3, 0x4A, 0x71, 0xDE, 0xD8, 0x6F, 0xCC, 0xD9, 0x70, 0x41, 0x36, 0xA0, 0xED, 0x1C, 0x3C, 0xE7, 0x92, 0x30, 0x9F, 0xAD, 0x5F, 0x9C, 0x9B, 0x9B, 0x62, 0x7A, 0x8B, 0xAF, 0x96, 0xAD, 0x1A, 0x65, 0x5E, 0xF5, 0xCE, 0xA6, 0xC4, 0xC8, 0x90, 0x45, 0x64, 0x3A, 0x87, 0x60, 0x6B, 0x3A, 0x2E, 0xEF, 0x52, 0x5C, 0xE6, 0x0D, 0x3C, 0x9A, 0x41, 0x40, 0xC4, 0x11, 0x3C, 0xD5, 0xE9, 0xBB, 0x2D, 0x7E, 0x76, 0x49, 0x52, 0x4B, 0x4F, 0xC3, 0x94, 0xBF, 0xE4, 0xEE, 0x30, 0xD9, 0xCA, 0x03, 0xDA, 0x3D, 0xDB, 0xFD, 0x9C, 0x65, 0x5C, 0xDA, 0x7B, 0x2B, 0x3C, 0x31, 0xB5, 0xEA, 0xF2, 0xC4, 0x74, 0x18, 0xFF, 0x71, 0x03, 0xAC, 0x27, 0xD2, 0x29, 0x2C, 0x82, 0x90, 0x4F, 0x0D, 0x62, 0x47, 0x13, 0xBC, 0x53, 0xC1, 0xF5, 0x4A, 0xD3, 0x19, 0x58, 0x4A, 0x61, 0x02, 0xBA, 0x7E, 0x20, 0xB3, 0xF4, 0xA7, 0x62, 0x05, 0x4D, 0xEC, 0x8A, 0x50, 0x31, 0x22, 0xE2, 0x4F, 0x85, 0xE9, 0x29, 0x7E, 0x7B, 0x48, 0xE0, 0x48, 0x95, 0x91, 0xBA, 0xD8, 0xE1, 0xA5, 0xB4, 0x1A, 0x98, 0x74, 0x58, 0x4A, 0x74, 0xBD, 0xD5, 0x98, 0x23, 0x3A, 0x62, 0x72, 0xEF, 0xFC, 0xF9, 0x7A, 0x6E, 0xDF, 0xA4, 0x55, 0x70, 0x29, 0xF0, 0xE1, 0x00, 0x91, 0x5F, 0x7E, 0x57, 0x87, 0x09, 0x17, 0x6A, 0xA9, 0x2D, 0xDE, 0xF6, 0x95, 0x96, 0x81, 0x90, 0xC5, 0xC2, 0x45, 0x3B, 0x02, 0xBD, 0xF6, 0x6D, 0xCE, 0x88, 0x71, 0x26, 0xFC, 0xB7, 0x00, 0x80, 0x88, 0xA9 };
#else
AsyncWebServer server(80);
#endif

DNSServer dnsServer;

int WIFI_PHY_MODE = 1; //WIFI_PHY_MODE_11B = 1, WIFI_PHY_MODE_11G = 2, WIFI_PHY_MODE_11N = 3
float WIFI_PHY_POWER = 25; //Max = 20.5dbm or 25dbm
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
char SUBSCRIPTION_URL[] = "https://openinverter.org/parameters";
int SUBSCRIPTION_REFRESH = 0;
char SUBSCRIPTION_TOKEN[] = "";
char SUBSCRIPTION_STAMP[] = "";

String firmwareInterface = "";
String firmwareFile = "";
StreamString asyncLogStream;
uint32_t serialInitialized = 0;

bool phpTag[] = { false, false }; //2 level processing
const char text_html[] = "text/html";
const char text_plain[] = "text/plain";
const char text_json[] = "application/json";
bool restartRequired = false;  // Set this flag in the callbacks to restart ESP in the main loop
//====================
//CAN-Bus
//====================
#ifndef ARDUINO_MOD_WIFI_ESP8266
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
//============
//SWD Debugger
//============
/*
  https://github.com/scanlime/esp8266-arm-swd
*/
#include "src/arm_debug.h"
uint32_t addr = 0x08000000;
uint32_t addrEnd = 0x0801ffff;
uint32_t addrNext = 0x00000000;
const uint8_t swd_clock_pin = 4; //GPIO4 (D2)
const uint8_t swd_data_pin = 5; //GPIO5 (D1)

ARMDebug swd(swd_clock_pin, swd_data_pin, ARMDebug::LOG_NONE);

const char *boolStr(bool x)
{
  return x ? "true" : "false";
}
//=============================

ADC_MODE(ADC_VCC); //internal voltage check

void setup()
{
  Serial.begin(115200, SERIAL_8N1);

  LittleFS.begin();

  //======================
  //NVRAM type of Settings
  //======================
  EEPROM.begin(1024);
  long e = NVRAM_Read(0).toInt();
#if DEBUG
  Serial.setDebugOutput(true);
  Serial.println(e, HEX);
#endif
  if (e != EEPROM_ID) {
    //Check for multiple Inverter SSIDs
    uint8_t n = WiFi.scanNetworks();
    if (n != 0) {
      for (uint8_t i = 0; i < n; ++i) {
        Serial.println(WiFi.SSID(i));
        if (WiFi.SSID(i) == ACCESS_POINT_SSID) {
          strcat(ACCESS_POINT_SSID, String("-" + i).c_str()); //avoid conflict
          break;
        }
      }
    }
    NVRAM_Erase();
    NVRAM_Write(0, String(EEPROM_ID));
    NVRAM_Write(1, String(ACCESS_POINT_MODE));
    NVRAM_Write(2, String(ACCESS_POINT_HIDE));
    NVRAM_Write(3, String(ACCESS_POINT_CHANNEL));
    NVRAM_Write(4, ACCESS_POINT_SSID);
    NVRAM_Write(5, ACCESS_POINT_PASSWORD);
    NVRAM_Write(6, String(DATA_LOG));
    NVRAM_Write(7, String(LOG_INTERVAL));
    //==========
    NVRAM_Write(8, String(NETWORK_DHCP));
    NVRAM_Write(9, NETWORK_IP);
    NVRAM_Write(10, NETWORK_SUBNET);
    NVRAM_Write(11, NETWORK_GATEWAY);
    NVRAM_Write(12, NETWORK_DNS);
    NVRAM_Write(13, SUBSCRIPTION_URL);
    NVRAM_Write(14, String(SUBSCRIPTION_REFRESH));
    NVRAM_Write(15, SUBSCRIPTION_TOKEN);
    NVRAM_Write(16, SUBSCRIPTION_STAMP);

    LittleFS.format();
  } else {
    String nvram = "";
    ACCESS_POINT_MODE = NVRAM_Read(1).toInt();
    ACCESS_POINT_HIDE = NVRAM_Read(2).toInt();
    ACCESS_POINT_CHANNEL = NVRAM_Read(3).toInt();
    nvram = NVRAM_Read(4);
    nvram.toCharArray(ACCESS_POINT_SSID, nvram.length() + 1);
    nvram = NVRAM_Read(5);
    nvram.toCharArray(ACCESS_POINT_PASSWORD, nvram.length() + 1);
    DATA_LOG = NVRAM_Read(6).toInt();
    LOG_INTERVAL = NVRAM_Read(7).toInt();
    //==========
    NETWORK_DHCP = NVRAM_Read(8).toInt();
    nvram = NVRAM_Read(9);
    nvram.toCharArray(NETWORK_IP, nvram.length() + 1);
    nvram = NVRAM_Read(10);
    nvram.toCharArray(NETWORK_SUBNET, nvram.length() + 1);
    nvram = NVRAM_Read(11);
    nvram.toCharArray(NETWORK_GATEWAY, nvram.length() + 1);
    nvram = NVRAM_Read(12);
    nvram.toCharArray(NETWORK_DNS, nvram.length() + 1);
    nvram = NVRAM_Read(13);
    nvram.toCharArray(SUBSCRIPTION_URL, nvram.length() + 1);
    SUBSCRIPTION_REFRESH = NVRAM_Read(14).toInt();
    nvram = NVRAM_Read(15);
    nvram.toCharArray(SUBSCRIPTION_TOKEN, nvram.length() + 1);
    nvram = NVRAM_Read(16);
    nvram.toCharArray(SUBSCRIPTION_STAMP, nvram.length() + 1);
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

    //==========
    //DNS Server
    //==========
    // Modify TTL associated  with the domain name (default is 60 seconds)
    dnsServer.setTTL(300);
    // Set which return code will be used for all other domains
    // (e.g. sending ServerFailure instead of NonExistentDomain will reduce number of queries sent by clients)
    dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);
    // Start DNS server for a specific domain name
    dnsServer.start(53, HTTPS_FQDN, WiFi.softAPIP());
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
      NVRAM_Write(1, "0");
      NVRAM_Write(4, "_" + String(ACCESS_POINT_SSID));
      delay(5000);
      ESP.restart();
    }
#if DEBUG
    Serial.println(WiFi.localIP());
#endif

    //==========
    //DNS Server
    //==========
    /* http://inverter.local */
    MDNS.begin("inverter");
    MDNS.addService("http", "tcp", 80);
#if ASYNC_TCP_SSL_ENABLED
    MDNS.addService("http", "tcp", 443);
#endif
    //MDNS.addService("telnet", "tcp", 23);
    //MDNS.addService("arduino", "tcp", 8266);
  }

  //===============
  //Async Web Server
  //===============
  /*
    ------------
    SWD Debugger
    ------------
  */
  server.on("/swd/begin", HTTP_GET, [](AsyncWebServerRequest * request) {
    // See if we can communicate. If so, return information about the target.
    // This shouldn't reset the target, but it does need to communicate,
    // and the debug port itself will be reset.
    //
    // If all is well, this returns some identifying info about the target.

    uint32_t idcode;

    if (swd.begin() && swd.getIDCODE(idcode)) {

      AsyncResponseStream *response = request->beginResponseStream(text_json);
      response->printf("{\"connected\": true, \"idcode\": \"0x%02x\" }", idcode);
      request->send(response);

    } else {
      request->send(200, text_json, "{\"connected\": false}");
    }
  });
  server.on("/swd/halt", HTTP_GET, [](AsyncWebServerRequest * request) {
    //swd.debugHalt();

    //Set MEM-AP TAR to 0xE000EDF0 (DHCSR)
    swd.apWrite(0x4, 0xE000EDF0);
    //Write to MEM-AP DRW, writing the DHCSR bits C_STOP and C_DEBUGEN
    swd.apWrite(0xc, 0xA05F0003);

    request->send(200, text_plain, "");
  });
  server.on("/swd/run", HTTP_GET, [](AsyncWebServerRequest * request) {
    //swd.debugRun();

    //Set MEM-AP TAR to 0xE000EDF0 (DHCSR)
    swd.apWrite(0x4, 0xE000EDF0);
    //Write to MEM-AP DRW, resetting the DHCSR bits
    swd.apWrite(0xc, 0xA05F0000);

    request->send(200, text_plain, "");
  });
  server.on("/swd/reset", HTTP_GET, [](AsyncWebServerRequest * request) {
    //swd.debugReset()
    if (request->hasParam("hard")) {
      swd.reset();
    } else {
      //Set MEM-AP TAR to 0xE000ED0C (AIRCR)
      swd.apWrite(0x4, 0xE000ED0C);
      //Write to MEM-AP DRW, writing the AIRCR bits
      swd.apWrite(0xc, 0xFA050004);
    }

    request->send(200, text_plain, "");
  });
  server.on("/swd/uid", HTTP_GET, [](AsyncWebServerRequest * request) {

    // STM32F103 Reference Manual, Chapter 30.2 Unique device ID register (96 bits)
    // http://www.st.com/st-web-ui/static/active/en/resource/technical/document/reference_manual/CD00171190.pdf

    uint32_t REG_U_ID = 0x1FFFF7E8; //96 bits long, read using 3 read operations

    uint16_t off0;
    uint16_t off2;
    uint32_t off4;
    uint32_t off8;

    swd.memLoadHalf(REG_U_ID + 0x0, off0);
    swd.memLoadHalf(REG_U_ID + 0x2, off2);
    swd.memLoad(REG_U_ID + 0x4, off4);
    swd.memLoad(REG_U_ID + 0x8, off8);

    AsyncResponseStream *response = request->beginResponseStream(text_json);
    response->printf("{\"uid\": \"0x%04x-0x%04x-0x%08x-0x%08x\" }", off0, off2, off4, off8);
    request->send(response);
  });
  server.on("/swd/zero", HTTP_GET, [](AsyncWebServerRequest * request) {

    if (swd.begin()) {

      addr = 0x08000000;
      addrEnd = 0x0801ffff;
      addrNext = addr;

      ESP.wdtDisable(); // Software WDT OFF
      hw_wdt_disable(); // Hardware WDT OFF

      swd.debugHalt();
      swd.debugHaltOnReset(1);
      swd.reset();
      swd.unlockFlash();
      swd.flashEraseAll();
      swd.debugHaltOnReset(0);
      //swd.debugReset();

      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t* buffer, size_t maxLen, size_t index) -> size_t {

#if DEBUG
        Serial.printf("------ %08x ------\n", addrNext);
#endif
        if (addrNext > addrEnd) {
          swd.debugReset();
          return 0;
        }

        StreamString data;
        data.printf("%08x:", addrNext);

        uint32_t eraseBuffer[4];
        memset(eraseBuffer, 0xff, sizeof(eraseBuffer));

        for (int i = 0; i < 4; i++)
        {
          data.printf(" | %02x %02x %02x %02x", (uint8_t)(eraseBuffer[i] >> 0), (uint8_t)(eraseBuffer[i] >> 8), (uint8_t)(eraseBuffer[i] >> 16), (uint8_t)(eraseBuffer[i] >> 24));
          addrNext += 4;
        }
        data.println();

        return data.readBytes(buffer, data.available());
      });
      request->send(response);

    } else {
      request->send(200, text_plain, "SWD Error");
    }
  });
  server.on("/swd/hex", HTTP_GET, [](AsyncWebServerRequest * request) {

    if (swd.begin()) {

      if (request->hasParam("bootloader")) {
        addr = 0x08000000;
        addrEnd = 0x08000fff;
      } else if (request->hasParam("flash")) {
        addr = 0x08001000;
        addrEnd = 0x0801ffff;
      } else if (request->hasParam("ram")) {
        addr = 0x20000000;
        addrEnd = 0x200003ff; //Note: Read is limited to 0x200003ff but you can write to higher portion of RAM
      }
      addrNext = addr;

      ESP.wdtDisable(); // Software WDT OFF
      hw_wdt_disable(); // Hardware WDT OFF

      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t* buffer, size_t maxLen, size_t index) -> size_t {

        if (addrNext >= addrEnd)
          return 0;
#if DEBUG
        Serial.printf("------ %08x ------\n", addrNext);
#endif
        StreamString data;
        uint8_t PAGE_SIZE = 12; //8 pages = 2756 bytes plain-text chunks, cannot be over maxLen (4096)
        
        if (addrNext + (PAGE_SIZE * 4) >= addrEnd) //adjust last chunk
            PAGE_SIZE = ((addrEnd - addrNext) / 4) + 1;

        swd.hexDump(addrNext, PAGE_SIZE, data); //total data is x4 (swd reads in chunks of 4)
        addrNext += PAGE_SIZE * 4;

        return data.readBytes(buffer, data.available());
      });
      request->send(response);

    } else {
      request->send(200, text_plain, "SWD Error");
    }
  });
  server.on("/swd/bin", HTTP_GET, [](AsyncWebServerRequest * request) {

    if (swd.begin()) {

      String filename = "flash.bin";

      if (request->hasParam("bootloader")) {
        addr = 0x08000000;
        addrEnd = 0x08000fff;
        filename = "bootloader.bin";
      } else if (request->hasParam("flash")) {
        addr = 0x08001000;
        addrEnd = 0x0801ffff;
      }
      addrNext = addr;

      ESP.wdtDisable(); // Software WDT OFF
      hw_wdt_disable(); // Hardware WDT OFF

      AsyncWebServerResponse *response = request->beginChunkedResponse("application/octet-stream", [](uint8_t* buffer, size_t maxLen, size_t index) -> size_t {

        if (addrNext > addrEnd)
          return 0;
#if DEBUG
        Serial.printf("------ %08x ------\n", addrNext);
#endif
        swd.memLoadByte(addrNext, *buffer);
        addrNext++;

        return 1;
      });

      response->addHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");
      request->send(response);

    } else {
      request->send(200, text_plain, "SWD Error");
    }
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

  server.on("/vcc", HTTP_GET, [](AsyncWebServerRequest * request) {
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->print(ESP.getVcc());
    request->send(response);
  });
  server.on("/baud", HTTP_GET, [](AsyncWebServerRequest * request) {
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->print(serialInitialized);
    request->send(response);
  });
  server.on("/chipid", HTTP_GET, [](AsyncWebServerRequest * request) {
    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->printf("Chip ID = 0x%08X\n", ESP.getChipId());
    request->send(response);
  });
  server.on("/format", HTTP_GET, [](AsyncWebServerRequest * request) {
    FSInfo fs_info;
    String result = LittleFS.format() ? "OK" : "Error";
    LittleFS.info(fs_info);
    request->send(200, text_plain, "<b>Format " + result + "</b><br/>Total Flash Size: " + String(ESP.getFlashChipSize()) + "<br>Filesystem Size: " + String(fs_info.totalBytes) + "<br>Filesystem Used: " + String(fs_info.usedBytes));
  });
  server.on("/restart", HTTP_GET, [](AsyncWebServerRequest * request) {
    //Serial.end();
    //Serial.begin(115200, SERIAL_8N1);
    //serialStreamFlush(); //flush
    Serial.print("reset\n");

    request->send(200, text_plain, "...");
    restartRequired = true;
    //ESP.restart();
  });
  server.on("/reset", HTTP_GET, [](AsyncWebServerRequest * request) {
    NVRAM_Erase();
    //LittleFS.format();
    request->send(200, text_plain, "...");
    restartRequired = true;
  });
  server.on("/nvram", HTTP_GET, [](AsyncWebServerRequest * request) {
    if (request->params() > 0) {
      int i = request->getParam(0)->value().toInt();
      String v = request->getParam(1)->value();
      NVRAM_Write(i, v);
      request->send(200, text_plain, v);
    } else {
      String out = NVRAM(1, 15, 5);
      request->send(200, text_json, out);
    }
  });
  server.on("/nvram", HTTP_POST, [](AsyncWebServerRequest * request) {

    String out = "<pre>";
    uint8_t c = 0, from = 0, to = 0;
    uint8_t skip = -1;

    //skip confirm password (6)
    from = 1, to = 14, skip = 6;

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
    String updateURL = "http://" + String(NETWORK_IP) + "/update";
    String updateHTML = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'></head><body><form method='POST' action='" + updateURL + "' enctype='multipart/form-data'><input type='file' accept='.bin' name='firmware'><input type='submit' value='Update Firmware'></form><br><form method='POST' action='" + updateURL + "' enctype='multipart/form-data'><input type='file' accept='.bin' name='filesystem'><input type='submit' value='Update Filesystem'></form></body></html>";
    request->send(200, text_html, updateHTML);
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

    serialStreamFlush(); //flush

    File f = LittleFS.open("/snapshot.json", "w");
    f.print("{\n    \"");

    Serial.print("all\n");
    consumeEcho('\n'); //echo

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

  server.on("/firmware.php", HTTP_POST, [](AsyncWebServerRequest * request) {

    ESP.wdtDisable(); // Software WDT OFF
    hw_wdt_disable(); // Hardware WDT OFF

    //==================
    // SWD UPDATER
    //==================
    if (firmwareInterface == "swd-esp8266") {
      if (swd.begin()) {

        swd.debugHalt();
        swd.debugHaltOnReset(1);
        swd.reset();
        swd.unlockFlash();

        AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t* buffer, size_t maxLen, size_t index) -> size_t {

          StreamString data;
          File fs = LittleFS.open(firmwareFile, "r");
          fs.seek(addrNext - addr);
#if DEBUG
          Serial.println(addrNext - addr);
          Serial.println(fs.available());
#endif
          if (addrNext >= addrEnd || fs.available() == 0)
          {
            swd.flashFinalize(addr);
            swd.debugHaltOnReset(0);
            swd.reset(); //hard-reset

            fs.close();
            LittleFS.remove(firmwareFile);
            return 0;
          }
          swd.debugHalt();
          swd.flashloaderSRAM();

          uint8_t PAGE_SIZE = 12; //8 pages = 2756 bytes plain-text chunks, cannot be over maxLen (4096)
          uint32_t addrBuffer = 0x00000000;
          uint32_t addrIndex = addrNext;
          for (uint16_t p = 0; p < PAGE_SIZE; p++)
          {
#if DEBUG
            Serial.printf("------ %08x ------\n", addrIndex);
#endif
            if (fs.available() == 0)
              break;

            data.printf("%08x:", addrIndex);

            for (int i = 0; i < 4; i++)
            {
              if (fs.available() == 0)
                break;

              char sramBuffer[4];
              fs.readBytes(sramBuffer, 4);

              swd.writeBufferSRAM(addrBuffer, (uint8_t*)sramBuffer, sizeof(sramBuffer));
              data.printf(" | %02x %02x %02x %02x", sramBuffer[0], sramBuffer[1], sramBuffer[2], sramBuffer[3]);

              addrIndex += 4;
              addrBuffer += 4;
            }
            data.println();
          }
          swd.flashloaderRUN(addrNext, addrBuffer);
          addrNext = addrIndex;

          fs.close();
          
          do {
            PAGE_SIZE--;
          } while (PAGE_SIZE);
          
          //Serial.println((char*)buffer);
          return data.readBytes(buffer, data.available());
        });
        request->send(response);
      } else {
        AsyncResponseStream *response = request->beginResponseStream(text_plain);
        response->print("SWD not connected");
        request->send(response);
      }
    } else {
      //==================
      // STM32 UPDATER
      //==================
      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t* buffer, size_t maxLen, size_t index) -> size_t {
        StreamString data;
        File fs = LittleFS.open(firmwareFile, "r");

        if (addrNext >= addrEnd || fs.available() == 0)
        {
          fs.close();
          LittleFS.remove(firmwareFile);
          return 0;
        }

        uint32_t timeout = millis();
        uint16_t PAGE_SIZE_BYTES = 1024;
        //int pages = (request->_tempFile.size() / PAGE_SIZE_BYTES) + 1;
        uint8_t pages = (fs.size() + PAGE_SIZE_BYTES - 1) / PAGE_SIZE_BYTES;

        char c;
        if (addrNext == addr) //starting
        {
          data.println("File length is " + String(fs.size()) + " bytes/" + String(pages) + " pages");

          serialStreamFlush();

          data.println("Resetting device...");

          //Clear the initialization Bug
          //-----------------------------
          Serial.print("hello\n");
          //consumeEcho('\n'); //echo
          //consumeEcho('\n'); //reply
          //-----------------------------
          Serial.print("reset\n");
          consumeEcho('t'); //echo -> reset

          //Serial.end();
          //Serial.begin(115200, SERIAL_8N1);

          do {
            c = Serial.read();
          } while (c != 'S' && c != '2');

          //NO DELAY HERE!!!

          if (c == '2')
          {
            Serial.write(0xAA); //Send magic
            while (Serial.read() != 'S');

            data.println("Bootloader v2 detected");
          }

          if (millis() - timeout < 4000)
          {
            Serial.write(pages);
            while (Serial.read() != 'P'); //Wait for page request

            data.println("Sending number of pages.." + String(pages));
          } else {
            data.println("STM32 is bricked - Try pressing reset button during upload");
            data.readBytes(buffer, data.available());
            return 0;
          }
        }

        uint8_t page = (addrNext - addr ) / PAGE_SIZE_BYTES;
        data.println("Sending page " + String(page) + "...");

        char bufferRead[PAGE_SIZE_BYTES];
        fs.seek(addrNext - addr);
        size_t bytesRead = fs.readBytes(bufferRead, sizeof(bufferRead));

        while (bytesRead < PAGE_SIZE_BYTES) //Fill ramaining bytes with zeros, prevents corrupted endings
          bufferRead[bytesRead++] = 0xff;

        uint32_t crc = crc32((uint32_t*)bufferRead, PAGE_SIZE_BYTES / 4, 0xffffffff);

        //data.println("Sending bytes " + String(sizeof(bufferRead)));

        while (c != 'C') {
          Serial.write((uint8_t*)bufferRead, sizeof(bufferRead));
          while (!Serial.available()); //wait until available
          c = Serial.read();

          if (c == 'T')
          {
            data.println("Transmission Error");
          }
        }

        data.println("Sending CRC...");

        Serial.write((char*)&crc, sizeof(uint32_t));
        while (!Serial.available()); //wait until available
        c = Serial.read();

        if ('D' == c)
        {
          data.println("CRC correct!");
          data.println("Update Done!");
          addrNext = addrEnd;
        }
        else if ('E' == c)
        {
          data.println("CRC error!");
        }
        else if ('P' == c)
        {
          data.println("CRC correct!");
          addrNext += PAGE_SIZE_BYTES;
        }

        fs.close();
        return data.readBytes(buffer, data.available());
      });
      request->send(response);
    }
  }, FirmwareUpload);

  server.on("/test.php", HTTP_POST, [](AsyncWebServerRequest * request) {

    AsyncResponseStream *response = request->beginResponseStream(text_plain);
    response->print(asyncLogStream);
    request->send(response);

  }, FirmwareUpload);

  server.on("/serial.php", HTTP_GET, [](AsyncWebServerRequest * request) {

    //NOTE: AsyncWebServer library does not allow delay or yield, but Serial.readString(); uses yield();

    char b[255];
    size_t len = 0;
    String output = "";

    if (request->hasParam("init")) {

      uint32_t serialSpeed = request->getParam("init")->value().toInt();

      if (serialInitialized == serialSpeed) { //initialized only once
        request->send(200, text_plain, String(serialSpeed));
      } else {

        //consumeEcho('D'); //Bootloader echo

        //Clear the initialization Bug
        //-----------------------------
        Serial.print("hello\n");
        consumeEcho('\n'); //echo
        consumeEcho('\n'); //reply
        //-----------------------------
        if (serialSpeed == 921600) {
          Serial.print("fastuart 1\n");
          consumeEcho('\n'); //echo
        } else if (serialInitialized == 921600) {
          Serial.print("fastuart 0\n");
          consumeEcho('\n'); //echo
        }
        //-----------------------------
        //Serial.end();
        Serial.begin(serialSpeed, SERIAL_8N1);
        //serialStreamFlush(); //flush
        //-----------------------------
        //Clear the initialization Bug
        //-----------------------------
        Serial.print("hello\n");
        //consumeEcho('\n'); //echo
        //consumeEcho('\n'); //reply
        //-----------------------------
        serialInitialized = serialSpeed;

        AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t *buffer, size_t maxLen, size_t index) -> size_t {
          return Serial.readBytes(buffer, maxLen);
        });
        //response->addHeader("Cache-Control", "no-store");
        request->send(response);
      }

    } else if (request->hasParam("os")) {

      request->send(200, text_plain, "esp8266");

    } else if (request->hasParam("set") && request->hasParam("name") && request->hasParam("value")) {

      AsyncResponseStream *response = request->beginResponseStream(text_plain);
      response->addHeader("Access-Control-Allow-Origin", "*");
      response->addHeader("Cache-Control", "no-store");

      //serialStreamFlush(); //flush

      Serial.print("set " + request->getParam("name")->value() + " " + request->getParam("value")->value());
      Serial.print('\n');
      consumeEcho('\n'); //echo

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
          consumeEcho('\n'); //echo
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
      consumeEcho('\n'); //echo

      AsyncWebServerResponse *response = request->beginChunkedResponse(text_plain, [](uint8_t *buffer, size_t maxLen, size_t index) -> size_t {
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
      consumeEcho('\n'); //echo
      consumeEcho('\n'); //first read

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
      bool php_html = LittleFS.exists(file + ".html");

      if (!php_html) {
        readPHP(file);
      }

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
    if (LittleFS.exists("/index.php") || LittleFS.exists("/index.php.html")) {
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
      digitalWrite(LED_BUILTIN, LOW); //ON
      String contentType = getContentType(file);

      if (file.endsWith(".php"))
      {
        //Large files must to be buffered. Process PHP > HTML > Asyncronous stream
        if (!php_html) {
          readPHP(file);
        }
        //Large files need to be buffered

        AsyncWebServerResponse *response = request->beginResponse(LittleFS, file + ".html", text_html);
        //response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);

      } else if (file.endsWith(".bin") || file.endsWith(".log")) {
        AsyncWebServerResponse *response = request->beginResponse(LittleFS, file, contentType);
        request->send(response);
      } else {

        AsyncWebServerResponse *response = request->beginResponse(LittleFS, file, contentType);
        response->addHeader("Content-Encoding", "gzip");
        //response->addHeader("Cache-Control", "max-age=3600");
        request->send(response);
      }
      digitalWrite(LED_BUILTIN, HIGH); //OFF
    } else {
      request->send(404, text_plain, "404: Not Found");
    }
  });

#if ASYNC_TCP_SSL_ENABLED
  server.onSslFileRequest([](void * arg, const char *filename, uint8_t **buf) -> int {

    size_t size = 0;
    uint8_t* nbuf;

    if (LittleFS.exists(filename))
    {
      File file = LittleFS.open(filename, "r");
      if (file) {
        size = file.size();
        nbuf = (uint8_t*) malloc(size);
        if (nbuf) {
          size = file.read(nbuf, size);
          file.close();
          *buf = nbuf;
#if DEBUG
          Serial.print("SSL File: ");
          Serial.print(filename);
          Serial.println(" OK");
          Serial.print("SSL Size: ");
          Serial.print(size);
#endif
          return size;
        }
        file.close();

        free(nbuf); //free what you malloc()
      }
#if DEBUG
      Serial.print("[WEB] SSL File: ");
      Serial.print(filename);
      Serial.println(" ERROR");
#endif
    } else {
#if DEBUG
      Serial.print("SSL DEFAULT CERTIFICATE");
#endif
      /* DEFAULT CERTIFICATE*/
      if (filename == "/server.key") { // Private Key
        size = sizeof(SSLPrivateKey);
        nbuf = (uint8_t*) malloc(size);
        if (nbuf) {
          memcpy(nbuf, SSLPrivateKey, size);
          *buf = nbuf;
#if DEBUG
          Serial.print("SSL Private Key Size: ");
          Serial.print(size);
#endif
          return size;
        }
      } else { // Certificate
        size = sizeof(SSLCertificate);
        nbuf = (uint8_t*) malloc(size);
        if (nbuf) {
          memcpy(nbuf, SSLCertificate, size);
          *buf = nbuf;
#if DEBUG
          Serial.print("SSL Certificate Size: ");
          Serial.print(size);
#endif
          return size;
        }
      }
    }
    *buf = 0;
    return 0;
  }, NULL);
  server.beginSecure("/server.cer", "/server.key", NULL);

  // HTTP to HTTPS Redirect
  httpserver.on("^\\/([a-zA-Z0-9]+)$", HTTP_GET, [] (AsyncWebServerRequest * request) {
    HTTPS_FQDN = "192.168.4.1"; //Temp for now
    request->redirect("https://" + HTTPS_FQDN + request->url());
  });
  httpserver.onNotFound([](AsyncWebServerRequest * request) {
    HTTPS_FQDN = "192.168.4.1";
    request->redirect("https://" + HTTPS_FQDN + request->url());
  });
  //Web Updates only work over HTTP (TODO: Check Update Library)
  httpserver.on("/update", HTTP_POST, [](AsyncWebServerRequest * request) {
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
  httpserver.begin();
#else
  server.begin(); // Web server start
#endif

  //ArduinoOTA.begin();

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH); //OFF

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
#ifndef ARDUINO_MOD_WIFI_ESP8266
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
  if (ACCESS_POINT_MODE == 0) {
    dnsServer.processNextRequest();
  } else {
    MDNS.update();
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
#ifndef ARDUINO_MOD_WIFI_ESP8266
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

  out += "\t\"nvram\": [\"";
  out += _VERSION;
  out += "\",";

  for (uint8_t i = from; i <= to; i++) {
    if (skip == -1 || i != skip) {
      String escaped = NVRAM_Read(i);
      //escaped.replace("/", "\\/");

      out += "\"";
      out += escaped;
      out += "\",";
    }
  }

  out = out.substring(0, (out.length() - 1));
  out += "]\n}";

  return out;
}

void NVRAM_Erase()
{
  for (uint32_t i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i, 255);
  }
  EEPROM.commit();
}

void NVRAM_Write(uint32_t address, String txt)
{
  char arrayToStore[48];
  memset(arrayToStore, 0, sizeof(arrayToStore));
  txt.toCharArray(arrayToStore, sizeof(arrayToStore)); // Convert string to array.

  EEPROM.put(address * sizeof(arrayToStore), arrayToStore);
  EEPROM.commit();
}

String NVRAM_Read(uint32_t address)
{
  char arrayToStore[48];
  EEPROM.get(address * sizeof(arrayToStore), arrayToStore);

  return String(arrayToStore);
}

//=============
// PHP MINI
//=============
void readPHP(String file)
{
  phpTag[0] = false;
  phpTag[1] = false;

  File f = LittleFS.open(file, "r");
  File ff = LittleFS.open(file + ".html", "w");

  while (f.available()) {
    String l = f.readStringUntil('\n');
    ff.println(PHP(l, 0));
  }
  ff.close();
  f.close();

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
  else if (filename.endsWith(".bin")) return "application/octet-stream";
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
    request->_tempFile = LittleFS.open(filename, "w");
    asyncLogStream.clear();
  }

  request->_tempFile.write(data, len);

  if (final) {
    request->_tempFile.close();

    File f = LittleFS.open(filename, "r");
    while (f.available()) {
      String cmd = f.readStringUntil('\n');
      cmd.replace("\t", "");
      cmd.replace(" ", "");
      cmd.replace("\"", "");
      cmd.replace(",", "");
      cmd.replace(":", " ");
      if (!cmd.startsWith("{") && !cmd.endsWith("}")) {
        asyncLogStream.println("set " + cmd);
        Serial.print("set " + cmd);
        Serial.print('\n');
      }
    }
    f.close();

    Serial.print("save\n");

    LittleFS.remove(filename);
  }
}

void FirmwareUpload(AsyncWebServerRequest * request, String filename, size_t index, uint8_t *data, size_t len, bool final)
{
  if (!index) {
    request->_tempFile = LittleFS.open(filename, "w");

    //if (LittleFS.exists(filename + ".log"))
    //  LittleFS.remove(filename + ".log");
    //asyncLogStream.clear();
  }

  request->_tempFile.write(data, len);

  if (final)
  {
    firmwareFile = request->_tempFile.name();
    if (request->_tempFile.size() <= 4096 ) { //bootloader
      addr = 0x08000000;
      addrEnd = 0x08000fff;
    } else {
      addr = 0x08001000;
      addrEnd = 0x0801ffff;
    }
    addrNext = addr;
    //addrIndex = addr;
    request->_tempFile.close();
  }
}

void asyncLog(File fs, String text)
{
  asyncLogStream.print(text);
  fs.print(text);
}

void consumeEcho(char echo)
{
  char c;
  uint16_t timeout = 2048;

  while (Serial.available() <= 0 && timeout > 0) {
    timeout--;
  }
  if (timeout > 0) {
    timeout = 1024;
    while (timeout > 0 && c != echo) {
      if (Serial.available())
        c = Serial.read();
      timeout--;
    }
  }
}

void serialStreamFlush()
{
  char b[255];
  size_t len = 0;
  uint16_t timeout = 2048;

  Serial.print('\n');
  consumeEcho('\n'); //consume echo

  while (Serial.available() <= 0 && timeout > 0) {
    timeout--;
  }

  if (timeout > 0) {
    //timeout = 1024;
    do {
      memset(b, 0, sizeof(b));
      len = Serial.readBytes(b, sizeof(b) - 1);
      //timeout--;
    } while (len > 0);
  }
}

void hw_wdt_disable() {
  *((volatile uint32_t*) 0x60000900) &= ~(1); // Hardware WDT OFF
}

void hw_wdt_enable() {
  *((volatile uint32_t*) 0x60000900) |= 1; // Hardware WDT ON
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
