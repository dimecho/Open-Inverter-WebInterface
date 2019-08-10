#!/bin/bash

if [ "$1" -eq "uninstall" ]; then
    sudo rm -r /opt/Autodesk/eagle-$2
else
    echo "Installing Autodesk Eagle $1 ..."
    sudo mkdir -p /opt/Autodesk/
    tar xzf $HOME/Downloads/Autodesk_EAGLE_$1_English_Linux_64bit.tar.gz -C $HOME/Downloads/
    sudo mv $HOME/Downloads/eagle-$1 /opt/Autodesk/
    sh -c /opt/Autodesk/eagle-$1/eagle run
fi