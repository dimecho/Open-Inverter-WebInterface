#!/bin/bash
#/var/www/html/

sudo apt-get install apache2 -y
sudo apt-get install php5 libapache2-mod-php5 -y
usermod -a -G dialout www-data
reboot