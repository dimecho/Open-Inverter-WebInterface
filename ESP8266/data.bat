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

::copy ../Web/fonts/glyphicons-halflings-regular.ttf data/fonts
::copy ../Web/fonts/glyphicons-halflings-regular.woff data/fonts
copy ..\Web\fonts\glyphicons-halflings-regular.woff2 data\fonts

copy ..\Web\firmware\attiny13.zip data\firmware
copy ..\Web\firmware\img\esp8266.jpg data\firmware\img

::======================
::Correct long filenames
::======================

forfiles /p .\data /s /m * /c "cmd /c echo @path & echo @file"

::====================
::Download Compressors
::====================

If Not Exist .\tools\yuicompressor-2.4.8.jar (
  powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -OutFile ./tools/yuicompressor-2.4.8.zip -Uri https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.zip"
)

If Not Exist .\tools\closure-compiler-v20180910.jar (
  powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -OutFile ./tools/compiler-20180910.zip -Uri https://dl.google.com/closure-compiler/compiler-20180910.zip"
)

If Not Exist .\tools\mkspiffs.exe (
  powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -OutFile ./tools/mkspiffs-0.2.3-arduino-esp8266-win32.zip -Uri https://github.com/igrr/mkspiffs/releases/download/0.2.3/mkspiffs-0.2.3-arduino-esp8266-win32.zip"
)

for %%a in ("%~dp0\tools\*.zip") do (
  Call :UnZipFile "%~dp0tools\" "%~dp0tools\%%~nxa"
	del .\tools\%%~nxa
)

move .\tools\mkspiffs-0.2.3-arduino-esp8266-win32\mkspiffs.exe .\tools\
rmdir .\tools\mkspiffs-0.2.3-arduino-esp8266-win32

::==============
::Compress Files
::==============
forfiles /p .\ /s /m *.css /c "cmd /c java -jar %~dp0tools\yuicompressor-2.4.8.jar --type css -o @file @file"

:CompressJava
	set INPUT=
	set /P INPUT=Compress Javascript? (y/n): %=%
	If /I "%INPUT%"=="y" goto CompressJavaY
	If /I "%INPUT%"=="n" goto GZip
	echo Incorrect input & goto CompressJava

:CompressJavaY
	forfiles /p .\ /s /m *.js /c "cmd /c java -jar %~dp0tools\closure-compiler-v20180910.jar --language_in ECMASCRIPT5 --js_output_file @file --js @file"

:GZip
  for /R %~dp0\data %%f in (*.*) do (
    gzip "%%f"
  move "%%f.gz" "%%f"
  )

  "%~dp0\tools\mkspiffs.exe" -c .\data\  -b 8192 -p 256 -s 1028096 flash-spiffs.bin
  ::"%~dp0\tools\mkspiffs.exe" -i flash-spiffs.bin
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