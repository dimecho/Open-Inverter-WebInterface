::https://dl.espressif.com/dl/esptool-4dab24e-windows.zip
::https://github.com/igrr/mkspiffs/releases/download/0.2.3/mkspiffs-0.2.3-arduino-esp8266-win32.zip

@echo off
SET com=COM4

:SPIFFS
	set INPUT=
	set /P INPUT=Build Filesystem (SPIFFS)? (y/n): %=%
	If /I "%INPUT%"=="y" goto SPIFFSY
	If /I "%INPUT%"=="n" goto SPIFFSFlash
	echo Incorrect input & goto SPIFFS
	
:SPIFFSFlash
	set INPUT=
	set /P INPUT=Flash Filesystem (SPIFFS)? (y/n): %=%
	If /I "%INPUT%"=="y" goto SPIFFSFlashY
	echo Incorrect input & goto SPIFFSFlash

:SPIFFSY
    mkspiffs.exe -p 256 -b 8192 -s 1028096 -c ./data/ flash-spiffs.bin
    ::mkspiffs.exe -i flash-spiffs.bin
	goto SPIFFSFlash
	
:SPIFFSFlashY
	esptool.exe --port %com% --baud 115200 write_flash 0x100000 flash-spiffs.bin
	
:End
	pause