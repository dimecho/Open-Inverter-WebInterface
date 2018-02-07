#!/bin/bash

cp -rf ./tools ~/Documents/Arduino

#==============
#Copy Files
#==============

array=( index.php header.php menu.php can.php graph.php firmware.php simple.php tips.php switch-check.php motor-class.php version.txt tips.csv description.csv favicon.ico)
for i in "${array[@]}"; do
    cp -rf ../Web/$i data
done

array=( alertify.css animate.css bootstrap.css bootstrap-editable.css bootstrap-slider.css glyphicons.css spin.css style.css )
for i in "${array[@]}"; do
    cp -rf ../Web/css/$i data/css
done

array=( jquery.js jquery.knob.js jszip.js alertify.js bootstrap.js bootstrap-editable.js bootstrap-slider.js bootstrap-notify.js can.js graph.js index.js menu.js status.js simple.js chart.js chartjs-plugin-datalabels.js switch-check.js svg-injector.js )
for i in "${array[@]}"; do
    cp -rf ../Web/js/$i data/js
done
cp -rf ../Web/js/menu-esp8266.json data/js/menu.json
cp -rf ../Web/js/menu-esp8266.json data/js/menu-mobile.json

array=( background.png safety.png alert.svg battery.svg engine.svg idea.svg key.svg magnet.svg plug.svg temperature.svg motor-class.png clear.png loading.gif esp8266.png )
for i in "${array[@]}"; do
    cp -rf ../Web/img/$i data/img
done

cp -rf ../Web/fonts/glyphicons-halflings-regular.ttf data/fonts
cp -rf ../Web/fonts/glyphicons-halflings-regular.woff data/fonts


#==============
#Compress Files
#==============
for f in $(find data/ -type f -name '*.*' ! -name '*.php' ! -name '.gitignore'); do
    gzip "$f"
    mv "$f.gz" "$f"
done

#./esptool.py -p /dev/cu.usbserial read_flash 0x000000 1048576 Huebner.Inverter.ESP8266.bin
#./esptool.py -p /dev/cu.usbserial write_flash 0x000000 Huebner.Inverter.ESP8266.bin
