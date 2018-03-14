#!/bin/bash

# MacOS
sudo easy_install pyserial
sudo easy_install esptool
sudo easy_install ptool

# Linux
sudo pip install pyserial
sudo pip install esptool
sudo pip install ptool

echo " > Restore Flash? (y/n)"
read yn
if [ $yn = y ]; then
    sudo esptool.py --port /dev/cu.usbserial --baud 115200 write_flash 0x000000 Huebner.Inverter.ESP8266.bin
    #sudo espota.py -i 192.168.4.1 -p 8266 -f Huebner.Inverter.ESP8266.bin -d -r
else
    echo " > Backup Flash? (y/n)"
    read yn
    if [ $yn = y ]; then
        #4194304 mbits = 4MB, 2097152 mb = 2MB, 1048576 mbits = 1MB
        sudo esptool.py --port /dev/cu.usbserial --baud 115200 read_flash 0 2097152 Huebner.Inverter.ESP8266.bin
    fi
fi

echo " > Build Filesystem (SPIFFS)? (y/n)"
read yn
if [ $yn = y ]; then
    mkspiffs -p 256 -b 8192 -s 1028096 -c ./data/ ESP8266.SPIFFS.bin
    mkspiffs -i ESP8266.SPIFFS.bin
    echo " > Flash Filesystem (SPIFFS)? (y/n)"
    read yn
    if [ $yn = y ]; then
        sudo esptool.py --port /dev/cu.usbserial --baud 57600 write_flash 0x100000 ESP8266.SPIFFS.bin
    fi
fi