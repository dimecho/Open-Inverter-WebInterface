#!/bin/bash

if [ $# -eq 0 ]; then
    sudo apt-get update
    sudo apt-get -y install php php-curl
else
    killall php
    sudo apt-get remove --purge php php-curl
fi