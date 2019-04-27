#!/bin/bash

version="9.3.2"

if [ $# -eq 0 ]; then
    echo "Installing Autodesk Eagle $version ..."
    sudo mkdir -p /opt/Autodesk/
    tar xzf $HOME/Downloads/Autodesk_EAGLE_"$version"_English_Linux_64bit.tar.gz -C $HOME/Downloads/
    sudo mv $HOME/Downloads/eagle-"$version" /opt/Autodesk/
    sh -c /opt/Autodesk/eagle-"$version"/eagle run
else
    sudo rm -r /opt/Autodesk/eagle-"$version"
fi