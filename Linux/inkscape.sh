#!/bin/bash

if [ $# -eq 0 ]; then
    sudo add-apt-repository -y ppa:inkscape.dev/stable
    sudo apt-get update
    sudo apt-get -y install inkscape
    cd "$(dirname "$0")"
    rsync -avh ../Web/encoder/* ~/.config/inkscape/
else
    sudo apt-get remove --purge inkscape
fi