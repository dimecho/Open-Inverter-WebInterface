#!/bin/bash

if [ ! -d "/usr/local/etc/gcc_arm/gcc-arm-none-eabi-5_4-2016q3" ]; then
    sudo mkdir /usr/local/etc/gcc_arm
    if [ ! -f $HOME/Downloads/gcc-arm-none-eabi-5_4-2016q3-20160926-linux.tar ]; then
        echo "Extracting ..."
        bzip2 -dkv $HOME/Downloads/gcc-arm-none-eabi-5_4-2016q3-20160926-linux.tar.bz2
    fi
    sudo tar xfv $HOME/Downloads/gcc-arm-none-eabi-5_4-2016q3-20160926-linux.tar -C /usr/local/etc/gcc_arm/
    #rm $HOME/Downloads/gcc-arm-none-eabi-5_4-2016q3-20160926-linux.tar
fi