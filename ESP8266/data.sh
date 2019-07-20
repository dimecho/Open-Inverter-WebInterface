#!/bin/bash

#==============
#Copy Files
#==============
mkdir -p data/css
mkdir -p data/js
mkdir -p data/img
mkdir -p data/fonts
mkdir -p data/firmware
mkdir -p data/firmware/img
mkdir -p data/pcb
mkdir -p data/pcb/v1.0
mkdir -p data/pcb/v3.0

array=(index.php header.php menu.php esp8266.php can.php graph.php bootloader.php firmware.php simple.php test.php version.txt description.csv)
for i in "${array[@]}"; do
    cp -rf ../Web/$i data
done

array=(alertify.css jquery.fancybox.css animate.css bootstrap.css ion.rangeSlider.css icons.css style.css)
for i in "${array[@]}"; do
    cp -rf ../Web/css/$i data/css
done

array=(jquery.js jquery.knob.js potentiometer.js jquery.fancybox.js alertify.js bootstrap.js ion.rangeSlider.js bootstrap-notify.js firmware.js can.js graph.js jscolor.js index.js menu.js simple.js chart.js chartjs-plugin-datalabels.js chartjs-plugin-zoom.js test.js mobile.js)
for i in "${array[@]}"; do
    cp -rf ../Web/js/$i data/js
done
cp -rf ../Web/js/menu-esp8266.json data/js/menu.json

array=(background.png safety.png)
for i in "${array[@]}"; do
    cp -rf ../Web/img/$i data/img
done

cp -rf  "../Web/pcb/Hardware v1.0/diagrams/test.png" data/pcb/v1.0
cp -rf  "../Web/pcb/Hardware v1.0/diagrams/esp8266.png" data/pcb/v1.0
cp -rf  "../Web/pcb/Hardware v3.0/diagrams/test.png" data/pcb/v3.0
cp -rf  "../Web/pcb/Hardware v3.0/diagrams/esp8266.png" data/pcb/v3.0
cp -rf ../Web/fonts/icons.ttf data/fonts
cp -rf ../Web/fonts/icons.woff data/fonts

#======================
#Correct long filenames
#======================
export LC_CTYPE=C
export LANG=C
for f in $(find data -type f -name '*.*'); do
    
    f="/"${f#"data/"} #remove path folder name
    o=$(basename "$f")
    o_size=${#f} #get path length

    #SPIFFS maximum file name of 32 bytes
    if [ $o_size -ge 32 ]; then
        d=$(dirname "$f")
        d_size=${#d}
        n=$(basename "$f")
        e="${o##*.}" # extention
        e_size=${#e}
        n="${n%.*}" # without extention
        n=${n:0:(32 - $d_size - $e_size - 3)}

        fe="$n.$e"
        nn="$d/$n.$e"
        nn_size=${#nn}

        echo "$nn"
        #echo "$o - $n"
        echo "$o_size:$nn_size"

        #================
        #Find and replace
        #================
        for ff in $(find ./data -type f -name '*.php' -o -name '*.js' -o -name '*.json' -o -name '*.css'); do
            sed -i '' 's/'"$o"'/'"$fe"'/g' "$ff"
            sed -i '' 's#\/\*\!#\/\*#' "$ff" #Remove required comments
            sed -i '' 's/'"pcb\/Hardware v1.0\/diagrams\/"'/'"pcb\/v1.0\/"'/g' "$ff"
            sed -i '' 's/'"pcb\/Hardware v3.0\/diagrams\/"'/'"pcb\/v3.0\/"'/g' "$ff"
        done

        mv -f "data/$f" "data/$nn"
    fi
done

#================
#Clean PHP
#================
for f in $(find ./data -name '*.php'); do
    php=false
    while read -r line; do
        if [[ $line == *"<?php"* ]]; then
            php=true
        fi
        if [[ $line == *"?>"* ]]; then
            php=false
        fi
        if [ $php = false ]; then
            echo "$line" >> "$f.p"
        else
            if [[ $line == *"include"* ]]; then
                #echo "<?php" >> "$f.p"
                echo "$line" >> "$f.p"
            else
                if [[ $line == *"<?php"* ]]; then
                    echo "<?php" >> "$f.p"
                fi
            fi
        fi
    done < "$f"
    mv "$f.p" "$f"
done

#====================
#Download Compressors
#====================

if [ ! -f tools/yuicompressor-2.4.8.jar ]; then
    curl -L -o tools/yuicompressor-2.4.8.zip -k -C - https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.zip
    cd tools
    unzip yuicompressor-2.4.8
    cd ../
fi

if [ ! -f tools/yuicompressor-2.4.8.jar ]; then
    curl -L -o tools/compiler-20180910.zip -k -C - https://dl.google.com/closure-compiler/compiler-20180910.zip
    cd tools
    unzip compiler-20180910
    cd ../
fi

if [ ! -f tools/mkspiffs ]; then
    curl -L -o tools/mkspiffs-0.2.3-arduino-esp8266-osx.tar.gz -k -C - https://github.com/igrr/mkspiffs/releases/download/0.2.3/mkspiffs-0.2.3-arduino-esp8266-osx.tar.gz
    cd tools
    gunzip -c mkspiffs-0.2.3-arduino-esp8266-osx.tar.gz | tar xopf -
    mv mkspiffs-0.2.3-arduino-esp8266-osx/mkspiffs ./
    rm -rf mkspiffs-0.2.3-arduino-esp8266-osx
    cd ../
fi

#==============
#Compress Files
#==============
for f in $(find data -name '*.css'); do
    java -jar tools/yuicompressor-2.4.8.jar --type css -o "$f" "$f"
done
#for f in $(find data -name '*.php'); do
#    java -jar tools/htmlcompressor-1.5.3.jar --preserve-php --type html -o "$f" "$f"
#done
echo " > Compress Javascript? (y/n)"
read yn
if [ $yn = y ]; then
    for f in $(find data -name '*.js'); do
        java -jar tools/closure-compiler-v20180910.jar --strict_mode_input=false --language_in ECMASCRIPT5 --js_output_file "$f-min.js" --js "$f"
        mv "$f-min.js" "$f"
    done
fi
for f in $(find data -type f -name '*.*' ! -name '*.bin' ! -name '*.php' ! -name '.gitignore'); do
    gzip "$f"
    mv "$f.gz" "$f"
done

./tools/mkspiffs -c ./data/ -b 8192 -p 256 -s $(($(du -ks data | cut -f1) * 1024)) flash-spiffs.bin
#./tools/mkspiffs -c ./data/ -b 8192 -p 256 -s 1028096 flash-spiffs.bin
#./tools/mkspiffs -i flash-spiffs.bin