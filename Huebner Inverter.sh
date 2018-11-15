#!/usr/bin/env bash

checkUSB()
{
    shopt -s nocasematch
    for i in {0..30} ; do
        serial=$(ls /dev/ttyUSB* | tail -n 1) || echo ""
        if [[ $serial == *"usb"* ]]; then
echo "{
    \"serial\": {
        \"port\": \"$serial\",
        \"web\": 8081,
		\"timeout\": 12
    }
}" > "$(dirname "$0")/Web/js/serial.json"
            /usr/bin/firefox http://localhost:8080;bash
            return
        fi
        echo "... Waiting for RS232-USB"
        if [[ $i -eq 1 ]]; then
            /usr/bin/firefox http://localhost:8080/connect.html;bash
        fi
        sleep 2
    done
}

if [[ $(type -p php) ]]; then
    
    if id -nG "$USER" | grep -qw "dialout"; then
        echo "Permissions OK"
    else
        echo "... Fixing dialout permissions"
        sudo usermod -a -G dialout $USER
        sudo usermod -a -G tty $USER
    fi

    for file in ./Linux/*; do
        chmod +x "$file"
    done

    echo "Running as sudo ..."
    
    killall php
    php -S 0.0.0.0:8080 -t "$(dirname "$0")/Web/" &
    #php -S 0.0.0.0:8081 -t "$(dirname "$0")/Web/" &
    sleep 4
    
    checkUSB
else

    echo "PHP not Installed ...Install? [Y/n]"; read
    ./Linux/php.sh
fi