#!/bin/bash

if [ $# -eq 0 ]; then

    if ! [ -x "$(command -v dfu-util)" ]; then
        sudo apt-get update
        sudo apt-get -y install dfu-util
    else
        sudo dfu-util -d 0483:df11 -D Web/firmware/can/$1.dfu
    fi
else
    sudo apt-get remove --purge dfu-util
fi