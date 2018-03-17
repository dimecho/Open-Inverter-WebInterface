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
    sudo esptool.py --port /dev/cu.usbserial --baud 115200 write_flash 0x000000 flash-full.bin
    #sudo espota.py -i 192.168.4.1 -p 8266 -f flash-full.bin -d -r
else
    echo " > Backup Flash? (y/n)"
    read yn
    if [ $yn = y ]; then
        #4194304 mbits = 4MB, 2097152 mbits = 2MB, 1048576 mbits = 1MB
        sudo esptool.py --port /dev/cu.usbserial --baud 115200 read_flash 0 2097152 flash-full.bin
    fi
fi