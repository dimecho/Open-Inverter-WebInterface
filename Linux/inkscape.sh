#!/bin/bash

sudo add-apt-repository -y ppa:inkscape.dev/stable
sudo apt-get update
sudo apt-get -y install inkscape
cd "$(dirname "$0")"
rsync -avh encoder/* ~/.config/inkscape/