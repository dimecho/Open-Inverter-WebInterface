#!/bin/sh

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
        if [[ ! $(type -p pip) ]]; then
            cd ~/Downloads
            curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
            python get-pip.py --user --no-warn-script-location

            os_ver=$(sw_vers -productVersion)
            if [[ $os_ver == 10.15* ]]; then
               echo "export PATH=$PATH:$HOME/Library/Python/2.7/bin" > ~/.zprofile
            else
               echo "export PATH=$PATH:$HOME/Library/Python/2.7/bin" > ~/.bashrc
            fi
        fi

        PATH=$PATH:$HOME/Library/Python/2.7/bin

        if [ ! -d ~/Library/Python/2.7/lib/python/site-packages/serial ] && [ ! -d /Library/Python/2.7/site-packages/serial ]; then
            pip install pyserial --user
        fi
        if [ ! -d ~/Library/Python/2.7/lib/python/site-packages/esptool ] && [ ! -d /Library/Python/2.7/site-packages/esptool ]; then
            pip install esptool --user
        fi
        if [ ! -d ~/Library/Python/2.7/lib/python/site-packages/ptool ] && [ ! -d /Library/Python/2.7/site-packages/ptool ]; then
            pip install pyserial --user
        fi

        shopt -s nocasematch
        
        cu=$(ls /dev/cu.* && ls /dev/ttyUSB*)
        for serial in $cu; do
            if [[ $serial == *usb* ]] || [[ $serial == *ch34* ]] || [[ $serial == *pl23* ]] ; then
                esptool.py --port $serial --baud 115200 write_flash 0x100000 flash-spiffs.bin
                break
            fi
        done
    fi
fi