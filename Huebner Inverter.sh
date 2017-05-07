#!/usr/bin/env bash

checkUSB()
{
    shopt -s nocasematch
    for i in {0..30} ; do
        serial=$(ls /dev/ttyUSB* | tail -n 1) || echo ""
        if [[ $serial == *"usb"* ]]; then
            if grep -q $serial "$(dirname "$0")/Web/config.inc.php"; then
                i=30
            else
                cp -R "$(dirname "$0")/Web/config.inc" "$(dirname "$0")/Web/config.inc.php"
                sed -i -e "s~/dev/cu.usbserial~$serial~g" "$(dirname "$0")/Web/config.inc.php"
            fi
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
    
    for file in ./Linux/*; do
        chmod +x "$file"
    done

    echo "Running as sudo ..."
    
    sudo killall php
    sudo $(type -p php) -S 127.0.0.1:8080 -t "$(dirname "$0")/Web/" &
    sleep 4
    
    checkUSB
else

    echo "PHP not Installed ...Install? [Y/n]"; read
    ./Linux/php.sh
fi