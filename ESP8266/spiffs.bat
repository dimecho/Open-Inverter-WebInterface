::https://dl.espressif.com/dl/esptool-4dab24e-windows.zip

@echo off
SET com=COM4

:SPIFFSFlash
	set INPUT=
	set /P INPUT=Flash Filesystem (SPIFFS)? (y/n): %=%
	If /I "%INPUT%"=="y" goto SPIFFSFlashY
	If /I "%INPUT%"=="n" goto End
	echo Incorrect input & goto SPIFFSFlash

:SPIFFSFlashY
	esptool.exe --port %com% --baud 115200 write_flash 0x100000 flash-spiffs.bin
	
:End
	pause