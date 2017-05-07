#!/bin/bash
if [ $# -eq 0 ]; then
    if [[ $(type -p avrdude) ]]; then
        avrdude -c $2 -p attiny13 -P $3 -U flash:w:$1 -F
    else
        sudo apt-get update
        sudo apt-get install avrdude
    fi
else
    sudo apt-get remove --purge avrdude
fi