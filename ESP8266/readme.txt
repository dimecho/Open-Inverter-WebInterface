INSTRUCTIONS FOR OLIMEX ESP8266

[DEVELOPERS]

Build (From Source Code)

    [Arduino IDE Setup]

    1) Arduino/File -> Preferences -> Additional Boards Manager URLs: http://arduino.esp8266.com/stable/package_esp8266com_index.json
    2) Tools -> Boards -> Board Manager -> esp8266 -> Install
    3) Tools -> Boards -> Olimex MOD-WIFI-ESP8266-DEV -> Flash Size -> 2M (1M SPIFFS)
    4) Tools -> Boards -> Debug Level -> None

    [Build]

    1) Run ./spiffs-build-osx.sh (spiffs-build-win.ps1 Windows) build SPIFFS filesystem
    2) Open ESP8266.ino with Arduino IDE
    3) Sketch -> Export compiled Binary

[USERS]

Setup (New from Factory)

    1) Solder GPIO-0 bridge to 0 to enable UART
    2) Connect ESP8266 to USB-Serial-TTL (Note: 3.3V ONLY!)
    3) Plugin to computer and check/install TTL-USB drivers
    4) Run ./sketch.sh (sketch.ps1 Windows) flash "flash-sketch.bin"
    5) Run ./spiffs.sh (spiffs.ps1 Windows) flash "flash-spiffs.bin"
    6) Solder GPIO-0 bridge back to 1 to enable FLASH
    7) Connect to inverter UART (see Wiring)

Setup (Upgrade Existing)

    [Web Browser - Recommended]

    1) Connect to ESP8266 WiFi
    2) Go to http://192.168.4.1/update

    [Computer]

    1) Connect to ESP8266 USB-Serial-TTL
    2) Run ./sketch.sh (sketch.ps1 Windows) flash "flash-sketch.bin"
    3) Run ./spiffs.sh (spiffs.ps1 Windows) flash "flash-spiffs.bin"

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