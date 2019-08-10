#!/bin/bash

if [ "$1" -eq "uninstall" ]; then
    sudo apt-get remove --purge dfu-util
else
    if ! [ -x "$(command -v dfu-util)" ]; then
        sudo apt-get update
        sudo apt-get -y install dfu-util
    else
        sudo dfu-util -d 0483:df11 -D Web/firmware/can/$1.dfu
    fi
fi