#!/bin/bash

if [ ! -d "$HOME/Documents/stm32-sine-master" ]; then
    if [[ ! $(type -p unzip) ]]; then
        sudo apt-get install unzip
    fi
    unzip "$HOME/Downloads/stm32-sine-master.zip" -d "$HOME/Documents/"
else
    #--------- LIBOPENCM3 ------------
    cd "$HOME/Documents/stm32-sine-master"
    if [ ! -d libopencm3 ]; then
        if [ ! -f "$HOME/Downloads/libopencm3-master.zip" ]; then
            wget "https://github.com/libopencm3/libopencm3/archive/master.zip" -O "$HOME/Downloads/libopencm3-master.zip"
        fi
        unzip "$HOME/Downloads/libopencm3-master.zip" -d ./
        mv ./libopencm3-master ./libopencm3
    fi
    if [ ! -f ./libopencm3/lib/libopencm3_stm32f1.a ]; then
        cd ./libopencm3
        make TARGETS=stm32/f1
        
        #Overwrite existing with new version
        sudo rsync -avh ./lib/* "/usr/arm-none-eabi/lib"
        sudo rsync -avh ./include/* "/usr/arm-none-eabi/include"
    fi

    #--------- BOOTLOADER ------------
    cd "$HOME/Documents/stm32-sine-master"
    if [ ! -d ./src/bootloader ]; then
        unzip "$(dirname "$0")/../Web/firmware/bootloader_v2.zip" -d ./src/
    fi
    cd ./src/bootloader
    make clean
    make
    mv stm32_loader.bin ../../
    mv stm32_loader.hex ../../

    #--------- FIRMWARE --------------
    cd "$HOME/Documents/stm32-sine-master"
    cd ./src/sine
    make clean
    make "$1"
    mv *.bin ../../
    mv *.hex ../../

    #--------- ATtiny13 --------------
    export PATH="$PATH:/usr/local/etc/gcc_arm/avr/bin/"

    cd "$HOME/Documents/stm32-sine-master"
    if [ ! -d ./src/attiny13 ]; then
        unzip "$(dirname "$0")/../Web/firmware/attiny13.zip" -d ./src/
    fi
    cd ./src/attiny13
    avr-gcc -g -mmcu=attiny13 -Os -Os -o volt-pwm-attiny13.o volt-pwm-attiny13.c -DF_CPU=96000000
    avr-objcopy -R .eeprom -O binary volt-pwm-attiny13.o volt-pwm-attiny13.bin
    avr-objcopy -R .eeprom -O ihex volt-pwm-attiny13.o volt-pwm-attiny13.hex
    mv volt-pwm-attiny13.bin ../../
    mv volt-pwm-attiny13.hex ../../
    #---------------------------------

    su $SUDO_USER -c "xdg-open '$HOME/Documents/stm32-sine-master'"
fi