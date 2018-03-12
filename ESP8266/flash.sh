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
else
    echo " > Backup Flash? (y/n)"
    read yn
    if [ $yn = y ]; then
        sudo esptool.py --port /dev/cu.usbserial --baud 115200 read_flash 0x000000 0x400000 Huebner.Inverter.ESP8266.bin
        #sudo esptool.py --port /dev/cu.usbserial --baud 115200 read_flash 0x000000 1048576 Huebner.Inverter.ESP8266.bin
    fi
fi

echo " > Build Filesystem (SIFFS)? (y/n)"
read yn
if [ $yn = y ]; then
    mkspiffs -p 256 -b 8192 -s 1028096 -c ./data/ ESP8266.SPIFFS.bin
    mkspiffs -i ESP8266.SPIFFS.bin
    echo " > Flash Filesystem (SIFFS)? (y/n)"
    read yn
    if [ $yn = y ]; then
        sudo esptool.py --port /dev/cu.usbserial --baud 115200 write_flash 0x100000 ESP8266.SPIFFS.bin
    fi
fi