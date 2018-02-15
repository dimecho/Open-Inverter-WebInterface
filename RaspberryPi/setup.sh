#!/bin/bash

sudo sh -c "sudo echo 'deb http://mirrordirector.raspbian.org/raspbian/ jessie main contrib non-free rpi' >> /etc/apt/sources.list"

echo "...Refreshing Package List"
sudo aptitude update

echo " > Upgrade Raspberry Pi? (y/n)"
read yn
if [ $yn = y ]; then
	sudo aptitude -y upgrade
fi

echo "...Installing Web Server"
sudo aptitude install -y php5-common php5-cgi php5

htmlLocation="/var/www/html"
echo "...Installing Web Files ${htmlLocation}"
cd /tmp
wget -N https://github.com/poofik/Huebner-Inverter/releases/download/1.0/Huebner.Inverter.Linux.tgz
tar -xvzf Huebner.Inverter.Linux.tgz
rm Huebner.Inverter.Linux.tgz
sudo mkdir -p $htmlLocation
sudo cp -rf ./Web/* $htmlLocation
rm -r ./Web
rm -r ./Linux

echo "...Configuring Web Files (config.inc.php)"
echo " > Enter Serial (Example: /dev/ttyAMA0)"
read dev_serial
sudo cp -R $htmlLocation/config.inc $htmlLocation/config.inc.php
sudo sed -i -e "s~/dev/cu.usbserial~$dev_serial~g" $htmlLocation/config.inc.php

echo "...Configuring PHP Autostart"
rclocal="/etc/rc.local"
sudo sh -c "sudo echo '#!/bin/bash
sudo -u www-data php -S 0.0.0.0:8080 -t /var/www/html/ &
exit 0' > ${rclocal}"
sudo chmod 755 $rclocal

echo "...Setting Web Server Permissions"
sudo adduser www-data www-data
sudo chown -R www-data:www-data /var/www
sudo chmod -R 755 /var/www
sudo usermod -a -G www-data pi #Optional: SFTP uploads

echo "...Setting TTY Permissions"
sudo aptitude install -y minicom
ls -la /dev/ttyAMA0
sudo systemctl enable serial-getty@ttyAMA0.service
sudo usermod -a -G dialout www-data
sudo usermod -a -G tty www-data
#UART on the Pi-3 you will need to disable bluetooth
sudo systemctl disable hciuart
sudo sh -c "sudo echo '
enable_uart=1
dtoverlay=pi3-disable-bt' >> /boot/config.txt"
sudo sed -i -e "s/console=serial0,115200//g" /boot/cmdline.txt

# [ TESTING ]
#stty -a -F /dev/ttyAMA0
#sudo lsof /dev/ttyAMA0
#minicom -b 115200 -o -D /dev/ttyAMA0

echo " > Enable WiFi Access Point? (y/n)"
read yn
if [ $yn = y ]; then

    sudo aptitude install -y hostapd dnsmasq
    sudo systemctl stop dnsmasq
    sudo systemctl stop hostapd

    echo "Enter WiFi SSID (Example: Inverter)"
    read wifi_ssid

    echo "Enter WiFi WPA Password (Example: inverter123)"
    read wifi_password

    echo "Enter WiFi IP (Example: 192.168.42.1)"
    read wifi_ip

    echo "...Configuring Static IP Address [$wifi_ip]"
    sudo sh -c "sudo echo 'denyinterfaces wlan0' >> /etc/dhcpcd.conf"

    sudo sh -c "sudo echo 'allow-hotplug wlan0
    iface wlan0 inet static
    address $wifi_ip
    netmask 255.255.255.0' > /etc/network/interfaces.d/wlan0"

    #sudo service dhcpcd restart
    sudo ifdown wlan0
    sudo ifup wlan0

    echo "...Configuring DHCP Server"
    IFS=. read -ra ary <<<"$wifi_ip"
    sudo sh -c "sudo echo 'interface=wlan0
dhcp-range=${ary[0]}.${ary[1]}.${ary[2]}.2,${ary[0]}.${ary[1]}.${ary[2]}.200,255.255.255.0,24h' >> /etc/dnsmasq.conf"

    echo "...Configuring Access Point"
    sudo sh -c "sudo echo 'interface=wlan0
driver=nl80211
ssid=$wifi_ssid
hw_mode=g
channel=2
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=$wifi_password
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCMP' > /etc/hostapd/hostapd.conf"

    #Raspberry Pi 3 Wi-Fi module seems to require the following additional parameters:
    #sudo sh -c "sudo echo 'ieee80211n=1' >> /etc/hostapd/hostapd.conf"

    echo "...Auto-Start Access Point"
    sudo sh -c "sudo echo 'DAEMON_CONF=\"/etc/hostapd/hostapd.conf\"' > /etc/default/hostapd"

    sudo service hostapd start
    sudo service dnsmasq start
fi

echo " > Enable SSH? (y/n)"
read yn
if [ $yn = y ]; then
    sudo systemctl enable ssh
    sudo systemctl start ssh
fi

echo " > Reboot now? (y/n)"
read yn
if [ $yn = y ]; then
	sudo reboot
fi