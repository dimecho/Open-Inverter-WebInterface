#!/bin/bash

if [ $# -eq 0 ]; then
    sudo add-apt-repository ppa:team-gcc-arm-embedded/ppa
    sudo apt-get update
    sudo apt-get -y install gcc-arm-embedded
    sudo apt-get -y install avrdude
else
    sudo apt-get remove --purge gcc-arm-embedded
    sudo apt-get remove --purge avrdude
fi