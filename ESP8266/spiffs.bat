@echo off
SET com=COM4

:SPIFFSFlash
	set INPUT=
	set /P INPUT=Flash Filesystem (SPIFFS)? (y/n): %=%
	If /I "%INPUT%"=="y" goto SPIFFSFlashY
	If /I "%INPUT%"=="n" goto End
	echo Incorrect input & goto SPIFFSFlash

:SPIFFSFlashY
  ::================
  ::Download ESPTool
  ::================
  If Not Exist .\tools\esptool.exe (
    powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -OutFile ./tools/esptool-4dab24e-windows.zip -Uri https://dl.espressif.com/dl/esptool-4dab24e-windows.zip"
  )
  Call :UnZipFile "%~dp0tools\" "%~dp0tools\esptool-4dab24e-windows.zip"
	del .\tools\esptool-4dab24e-windows.zip

	"%~dp0\tools\esptool.exe" --port %com% --baud 115200 write_flash 0x100000 flash-spiffs.bin
	
:End
	pause

:UnZipFile <ExtractTo> <newzipfile>
  set vbs="%temp%\_.vbs"
  if exist %vbs% del /f /q %vbs%
  >%vbs%  echo Set fso = CreateObject("Scripting.FileSystemObject")
  >>%vbs% echo If NOT fso.FolderExists(%1) Then
  >>%vbs% echo fso.CreateFolder(%1)
  >>%vbs% echo End If
  >>%vbs% echo set objShell = CreateObject("Shell.Application")
  >>%vbs% echo set FilesInZip=objShell.NameSpace(%2).items
  >>%vbs% echo objShell.NameSpace(%1).CopyHere(FilesInZip)
  >>%vbs% echo Set fso = Nothing
  >>%vbs% echo Set objShell = Nothing
  cscript //nologo %vbs%
  if exist %vbs% del /f /q %vbs%