#!/bin/bash

if [[ $(type -p openocd) ]]; then
    cd /usr/share/openocd/scripts/
    openocd -f ./$2 -f ./board/olimex_stm32_h103.cfg  -c "init" -c "reset halt" -c "flash write_image erase $1 0x08001000" -c "reset" -c "shutdown" 
else
    sudo apt-get update
    sudo apt-get -y install openocd
fi