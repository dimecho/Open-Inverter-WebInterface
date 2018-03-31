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

array=( index.php header.php menu.php esp8266.php can.php graph.php firmware.php simple.php tips.php switch-check.php motor-class.php version.txt tips.csv description.csv favicon.ico)
for i in "${array[@]}"; do
    cp -rf ../Web/$i data
done

array=( alertify.css fancybox.css animate.css bootstrap.css bootstrap-slider.css glyphicons.css style.css)
for i in "${array[@]}"; do
    cp -rf ../Web/css/$i data/css
done

array=( jquery.js jquery.knob.js potentiometer.js fancybox.js alertify.js bootstrap.js bootstrap-slider.js bootstrap-notify.js firmware.js can.js graph.js index.js menu.js simple.js chart.js chartjs-plugin-datalabels.js switch-check.js iconic.js mobile.js)
for i in "${array[@]}"; do
    cp -rf ../Web/js/$i data/js
done
cp -rf ../Web/js/menu-esp8266.json data/js/menu.json
cp -rf ../Web/js/menu-esp8266.json data/js/menu-mobile.json

array=( background.png safety.png alert.svg battery.svg engine.svg idea.svg key.svg temperature.svg temp_indicator.png encoder_lowpass.png)
for i in "${array[@]}"; do
    cp -rf ../Web/img/$i data/img
done

#cp -rf ../Web/fonts/glyphicons-halflings-regular.ttf data/fonts
#cp -rf ../Web/fonts/glyphicons-halflings-regular.woff data/fonts
cp -rf ../Web/fonts/glyphicons-halflings-regular.woff2 data/fonts

cp -rf ../Web/firmware/attiny13.zip data/firmware
cp -rf ../Web/firmware/img/esp8266.jpg data/firmware/img

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
        for ff in $(find data -type f -name '*.php' -o -name '*.js' -o -name '*.css'); do
            sed -i '' 's/'"$o"'/'"$fe"'/g' "$ff"
            sed -i '' 's#\/\*\!#\/\*#' "$ff" #Remove required comments
        done

        mv -f "data/$f" "data/$nn"
    fi
done

#==============
#Compress Files
#==============
for f in $(find data -name '*.css'); do
    java -jar ~/yuicompressor.jar --type css -o "$f" "$f"
done
#for f in $(find data -name '*.php'); do
#    java -jar ~/htmlcompressor-1.5.3.jar --preserve-php --type html -o "$f" "$f"
#done
echo " > Compress Javascript? (y/n)"
read yn
if [ $yn = y ]; then
    for f in $(find data -name '*.js'); do
        java -jar ~/closure-compiler.jar --language_in ECMASCRIPT5 --js_output_file "$f-min.js" --js "$f"
        mv "$f-min.js" "$f"
    done
fi
for f in $(find data -type f -name '*.*' ! -name '*.php' ! -name '.gitignore'); do
    gzip "$f"
    mv "$f.gz" "$f"
done

mkspiffs -c ./data/ -b 8192 -p 256 -s $(($(du -ks data | cut -f1) * 1024)) flash-spiffs.bin
#mkspiffs -c ./data/ -b 8192 -p 256 -s 1028096 flash-spiffs.bin
#mkspiffs -i flash-spiffs.bin