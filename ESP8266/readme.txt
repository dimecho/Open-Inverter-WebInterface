INSTRUCTIONS FOR OLIMEX ESP8266

Setup

1) Solder GPIO-0 bridge to 0 to enable UART
2) Connect ESP8266 board to TTL-USB converter (Note: 3.3V ONLY!)
3) Plugin to computer and check/install TTL-USB drivers
4) Run ./data.sh (data.bat Windows) build data directory
5) Run ./spiffs.sh (spiffs.bat Windows) build and flash SPIFFS
6) Open ESP8266.ino with Arduino IDE and upload sketch
7) Solder GPIO-0 bridge back to 1 to enable FLASH
8) Connect to inverter TTL

Wiring
          ______
 ________|______|_______
|  VCC TXD              |
|   x   x   x   x   x   |
|   x   x   x   x   x   |
|  GND RXD              |
|_______________________|


Usage

1) Connect to WiFi SSID "Inverter" + Password "12345678"
2) Open web browser and go to http://192.168.4.1