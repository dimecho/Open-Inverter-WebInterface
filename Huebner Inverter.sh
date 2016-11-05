#!/bin/sh

pkill -9 php
$(type -p php) -S 127.0.0.1:8080 -t "$(dirname "$0")/Web/" & #-c /usr/local/etc/php.ini
sleep 4

/usr/bin/firefox http://localhost:8080