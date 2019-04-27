#!/bin/bash

if [ $# -eq 0 ]; then
    sudo apt-get update
    sudo apt-get -y install minicom
else
    sudo apt-get remove --purge minicom
fi