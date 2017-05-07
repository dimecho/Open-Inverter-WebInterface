#!/bin/bash

if [ $# -eq 0 ]; then
    sudo apt-get update
    sudo apt-get -y install python
else
    sudo apt-get remove --purge python
fi