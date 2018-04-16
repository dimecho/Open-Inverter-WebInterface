::https://dl.espressif.com/dl/esptool-4dab24e-windows.zip
::https://github.com/igrr/mkspiffs/releases/download/0.2.3/mkspiffs-0.2.3-arduino-esp8266-win32.zip

@echo off
SET com=COM4

::==============
::Copy Files
::==============
mkdir data\css
mkdir data\js
mkdir data\img
mkdir data\fonts
mkdir data\firmware
mkdir data\firmware\img

set array=index.php header.php menu.php esp8266.php can.php graph.php firmware.php simple.php tips.php switch-check.php motor-class.php version.txt tips.csv description.csv favicon.ico
for %%a in (%array%) do (
   copy ..\Web\%%a data
)

set array=alertify.css fancybox.css animate.css bootstrap.css bootstrap-slider.css glyphicons.css style.css
for %%a in (%array%) do (
   copy ..\Web\css\%%a data\css
)

set array=jquery.js jquery.knob.js potentiometer.js fancybox.js alertify.js bootstrap.js bootstrap-slider.js bootstrap-notify.js firmware.js can.js graph.js index.js menu.js simple.js chart.js chartjs-plugin-datalabels.js switch-check.js iconic.js mobile.js
for %%a in (%array%) do (
   copy ..\Web\js\%%a data\js
)
copy ..\Web\js\menu-esp8266.json data\js\menu.json
copy ..\Web\js\menu-esp8266.json data\js\menu-mobile.json

set array=background.png safety.png alert.svg battery.svg engine.svg idea.svg key.svg temperature.svg temp_indicator.png encoder_lowpass.png
for %%a in (%array%) do (
   copy ..\Web\img\%%a data\img
)

copy ..\Web\fonts\glyphicons-halflings-regular.woff2 data\fonts

copy ..\Web\firmware\attiny13.zip data\firmware
copy ..\Web\firmware\img\esp8266.jpg data\firmware\img

::======================
::Correct long filenames
::======================

::==============
::Compress Files
::==============
for /R %~dp0\data %%f in (*.css) do(
    java -jar %~dp0\yuicompressor.jar --type css -o "%%f" "%%f"
)

:CompressJava
	set INPUT=
	set /P INPUT=Compress Javascript? (y/n): %=%
	If /I "%INPUT%"=="y" goto CompressJavaY
	If /I "%INPUT%"=="n" goto GZip
	echo Incorrect input & goto CompressJava

:CompressJavaY
    for /R %~dp0\data %%f in (*.js) do(
        java -jar %~dp0\closure-compiler.jar --language_in ECMASCRIPT5 --js_output_file "%%f-min.js" --js "%%f"
        move "%%f-min.js" "%%f"
    )

:GZip
    for /R %~dp0\data %%f in (*.*) do(
        gzip "%%f"
    )

    mkspiffs.exe -p 256 -b 8192 -s 1028096 -c .\data\ flash-spiffs.bin
    ::mkspiffs.exe -i flash-spiffs.bin
    pause