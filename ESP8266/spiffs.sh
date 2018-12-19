#!/bin/bash

echo " > Flash Filesystem (SPIFFS)? (y/n)"
read yn
if [ $yn = y ]; then
    echo " > Over The Air (OTA)? (y/n)"
    read yn
    if [ $yn = y ]; then
        #================
        #Download ESPOTA
        #================
        if [ ! -f tools/espota.py ]; then
            curl -L -o tools/espota.py -k -C - https://raw.githubusercontent.com/esp8266/Arduino/master/tools/espota.py
        fi
        python tools/espota.py -i 192.168.4.1 -p 8266 -s -f flash-spiffs.bin
    else
        # MacOS - /Library/Python/2.7/site-packages/
        sudo easy_install pip

        # Linux - /usr/lib/python2.7/site-packages/
        sudo pip install pyserial
        sudo pip install esptool
        sudo pip install ptool

        shopt -s nocasematch
        
        cu=$(ls /dev/cu.* && ls /dev/ttyUSB*)
        for serial in $cu; do
            if [[ $serial == *usb* ]] || [[ $serial == *ch34* ]] || [[ $serial == *pl23* ]] ; then
                sudo esptool.py --port $serial --baud 115200 write_flash 0x100000 flash-spiffs.bin
                break
            fi
        done
    fi
fi