#!/bin/bash

# MacOS - /Library/Python/2.7/site-packages/
sudo easy_install pip

# Linux - /usr/lib/python2.7/site-packages/
sudo pip install pyserial
sudo pip install esptool
sudo pip install ptool

echo $(($(du -ks data | cut -f1) * 1024))

#mkspiffs -c ./data/ -b 8192 -p 256 -s $((0x100000 / 2)) flash-spiffs.bin
mkspiffs -c ./data/ -b 8192 -p 256 -s 1028096 flash-spiffs.bin
#mkspiffs -i flash-spiffs.bin
echo " > Flash Filesystem (SPIFFS)? (y/n)"
read yn
if [ $yn = y ]; then
    echo " > Over The Air (OTA)? (y/n)"
    read yn
    if [ $yn = y ]; then
        python ./tools/espota.py -i 192.168.4.1 -p 8266 -s -f flash-spiffs.bin
    else
        sudo esptool.py --port /dev/cu.usbserial --baud 115200 write_flash 0x100000 flash-spiffs.bin
    fi
fi