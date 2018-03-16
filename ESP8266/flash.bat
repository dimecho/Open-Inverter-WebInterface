::https://dl.espressif.com/dl/esptool-4dab24e-windows.zip
::https://github.com/igrr/mkspiffs/releases/download/0.2.3/mkspiffs-0.2.3-arduino-esp8266-win32.zip

@echo off
SET com=COM4

:Restore
	set INPUT=
	set /P INPUT=Restore Flash? (y/n): %=%
	If /I "%INPUT%"=="y" goto RestoreY 
	If /I "%INPUT%"=="n" goto RestoreN
	echo Incorrect input & goto Restore
	
:Backup
	set INPUT=
	set /P INPUT=Backup Flash? (y/n): %=%
	If /I "%INPUT%"=="y" goto BackupY
	If /I "%INPUT%"=="n" goto SPIFFS
	echo Incorrect input & goto Backup

:RestoreY
	esptool.exe --port %com% --baud 115200 write_flash 0x000000 flash-full.bin
	goto End
	
:RestoreN
	goto Backup
	
:BackupY
    ::4194304 mbits = 4MB, 2097152 mb = 2MB, 1048576 mbits = 1MB
    esptool.exe --port %com% --baud 115200 read_flash 0 2097152 flash-full.bin
	goto End
	
:End
	pause