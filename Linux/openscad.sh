#!/bin/bash

if [ $# -eq 0 ]; then
    sudo add-apt-repository -y ppa:openscad/releases
    sudo apt-get update
    sudo apt-get -y install openscad
else
    sudo apt-get remove --purge openscad
fi