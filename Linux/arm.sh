#!/bin/bash

if [ $# -eq 0 ]; then
    sudo add-apt-repository ppa:team-gcc-arm-embedded/ppa
    sudo apt-get update
    sudo apt-get install gcc-arm-embedded
else
    sudo apt-get remove --purge gcc-arm-embedded
fi