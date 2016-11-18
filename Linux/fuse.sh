#!/bin/bash

if [[ $(type -p avrdude) ]]; then
    avrdude -c $1 -p attiny13 -P $2 -U lfuse:w:0x7A:m -U hfuse:w:0xFF:m
else
    sudo apt-get update
    sudo apt-get install avrdude
fi