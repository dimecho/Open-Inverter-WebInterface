#!/bin/bash

cp -rf ./tools ~/Documents/Arduino

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

array=( alertify.css fancybox.css animate.css bootstrap.css bootstrap-editable.css bootstrap-slider.css glyphicons.css spin.css style.css )
for i in "${array[@]}"; do
    cp -rf ../Web/css/$i data/css
done

array=( jquery.js jquery.knob.js potentiometer.js fancybox.js alertify.js bootstrap.js bootstrap-editable.js bootstrap-slider.js bootstrap-notify.js firmware.js can.js graph.js index.js menu.js status.js simple.js chart.js chartjs-plugin-datalabels.js switch-check.js svg-injector.js )
for i in "${array[@]}"; do
    cp -rf ../Web/js/$i data/js
done
cp -rf ../Web/js/menu-esp8266.json data/js/menu.json
cp -rf ../Web/js/menu-esp8266.json data/js/menu-mobile.json

array=( background.png safety.png alert.svg battery.svg engine.svg idea.svg key.svg magnet.svg plug.svg temperature.svg slow.svg fast.svg motor-class.png clear.png loading.gif esp8266.png temp_indicator.png encoder_lowpass.png)
for i in "${array[@]}"; do
    cp -rf ../Web/img/$i data/img
done

cp -rf ../Web/fonts/glyphicons-halflings-regular.ttf data/fonts
cp -rf ../Web/fonts/glyphicons-halflings-regular.woff data/fonts
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
            sed -i '' 's/   //g' "$ff"
        done

        mv -f "data/$f" "data/$nn"
    fi
done

#==============
#Compress Files
#==============
for f in $(find data -type f -name '*.*' ! -name '*.php' ! -name '.gitignore'); do
    gzip "$f"
    mv "$f.gz" "$f"
done
