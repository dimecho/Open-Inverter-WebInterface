#!/bin/bash

if [[ $(type -p openocd) ]]; then
    cd /usr/share/openocd/scripts/
    openocd -f ./interface/ftdi/$2.cfg -f ./board/olimex_stm32_h103.cfg  -c "init" -c "reset init" -c "halt" -c "flash write_image erase $1 0x08000000" -c "reset" -c "shutdown" 
else
    sudo apt-get update
    sudo apt-get -y install openocd
fi