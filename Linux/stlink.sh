#!/bin/bash

if [[ $(type -p openocd) ]]; then

    ADDRESS=" 0x08000000"
	
	if [[ "$2" == "ram" ]]; then
        ADDRESS="0x08001000"
    fi
	
    if [[ "$1" == *".hex" ]]; then
        ADDRESS=""
    fi
	
	st-flash --reset write $1$ADDRESS
else
    sudo apt-get update
	sudo add-apt-repository ppa:team-gcc-arm-embedded/ppa
	sudo apt-get -y install gcc-arm-none-eabi
    sudo apt-get -y install git build-essential libusb-1.0.0-dev cmake
	
	cd $HOME
	git clone https://github.com/texane/stlink stlink.git
	cd stlink
	make release
	cd build/Release && make install
fi