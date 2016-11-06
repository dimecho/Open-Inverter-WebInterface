#!/bin/bash

sudo apt-get update
sudo apt-get -y install gcc

if [[ ! $(type -p python) ]]; then
    sudo apt-get install python
fi