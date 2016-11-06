#!/bin/bash

checkUSB()
{
    shopt -s nocasematch
    for ((i = 0 ; i < 30 ; i++ )); do
        if [ -f '/dev/$1*' ]; then
            serial=$(ls /dev/$1* | tail -n 1)
            if grep -q $serial "$(dirname "$0")/Web/config.inc.php"; then
                /usr/bin/firefox http://localhost:8080 &
            else
                cp -R "$(dirname "$0")/Web/config.inc" "$(dirname "$0")/Web/config.inc.php"
                sed -i -e "s~/dev/cu.usbserial~$serial~g" "$(dirname "$0")/Web/config.inc.php"
            fi
            echo "true"
            return
        fi
        echo "... Waiting for RS232-USB"
        if [[ $i -eq 1 ]]; then
            /usr/bin/firefox http://localhost:8080/connect.html &
        fi
        sleep 2
    done
    echo "false"
}

if [[ $(type -p php) ]]; then
    
    for file in ./Linux/*; do
        chmod +x "$file"
    done

    echo "Running as sudo ..."
    
    sudo killall php
    sudo $(type -p php) -S 127.0.0.1:8080 -t "$(dirname "$0")/Web/" &
    sleep 4
    
    checkUSB ttyUSB
    
    #if [[ "$(checkUSB ttyUSB)" == "false" ]];then
    #    checkUSB ttyS
    #fi
else

    echo "PHP not Installed ...Install? [Y/n]"
    read
    sudo apt-get update
    sudo apt-get install php php-curl
fi