#!/bin/bash

if [ $# -eq 0 ]; then
    sudo apt-get update
    sudo apt-get -y install arduino arduino-core
else
    sudo apt-get remove --purge arduino arduino-core
fi