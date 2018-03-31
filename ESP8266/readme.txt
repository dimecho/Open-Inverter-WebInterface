INSTRUCTIONS FOR OLIMEX ESP8266

Build (From Source Code)

    1) Run ./data.sh (data.bat Windows) build data directory
    2) Open ESP8266.ino with Arduino IDE (Sketch -> Export compiled Binary) or upload sketch

Setup (New from Factory)

    1) Solder GPIO-0 bridge to 0 to enable UART
    2) Connect ESP8266 board to TTL-USB converter (Note: 3.3V ONLY!)
    3) Plugin to computer and check/install TTL-USB drivers
    4) Run ./sketch.sh (sketch.bat Windows) flash "flash-sketch.bin" (NO OTA)
    5) Run ./spiffs.sh (spiffs.bat Windows) flash "flash-spiffs.bin" (NO OTA)
    6) Solder GPIO-0 bridge back to 1 to enable FLASH
       Note: Future updates can be done over-the-air (OTA)
    7) Connect to inverter TTL (see Wiring)

Setup (Upgrade Existing)

    [Web Browser - Recommended]

    1) Connect to ESP8266 WiFi (see Usage)
    2) Go to http://192.168.4.1/upgrade and flash Sketch and SPIFFS

    [Computer]

    1) Connect to ESP8266 WiFi (see Usage)
    2) Run ./sketch.sh (sketch.bat Windows) flash "flash-sketch.bin" (OTA)
    3) Run ./spiffs.sh (spiffs.bat Windows) flash "flash-spiffs.bin" (OTA)

Wiring
          ______
 ________|______|_______
|  VCC TXD              |
|   x   x   x   x   x   |
|   x   x   x   x   x   |
|  GND RXD              |
|_______________________|


Usage

1) Connect to WiFi SSID "Inverter" + Password "inverter123"
2) Open web browser and go to http://192.168.4.1