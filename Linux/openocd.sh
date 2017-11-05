#!/bin/bash

if [[ $(type -p openocd) ]]; then
    cd /usr/share/openocd/scripts/

    ADDRESS=" 0x08000000"

    if [[ "$1" == *".hex" ]]; then
        ADDRESS=""
    fi

    openocd -f ./$2 -f ./board/olimex_stm32_h103.cfg  -c "init" -c "reset halt" -c "flash write_image erase unlock $1$ADDRESS" -c "reset" -c "shutdown" 
else
    sudo apt-get update
    sudo apt-get -y install openocd
fi