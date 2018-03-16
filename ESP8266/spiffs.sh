#!/bin/bash

# MacOS
sudo easy_install pyserial
sudo easy_install esptool
sudo easy_install ptool

# Linux
sudo pip install pyserial
sudo pip install esptool
sudo pip install ptool

echo " > Build Filesystem (SPIFFS)? (y/n)"
read yn
if [ $yn = y ]; then
    mkspiffs -p 256 -b 8192 -s 1028096 -c ./data/ flash-spiffs.bin
    mkspiffs -i flash-spiffs.bin
    echo " > Flash Filesystem (SPIFFS)? (y/n)"
    read yn
    if [ $yn = y ]; then
        sudo esptool.py --port /dev/cu.usbserial --baud 115200 write_flash 0x100000 flash-spiffs.bin
    fi
fi