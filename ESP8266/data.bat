@echo off
setlocal EnableDelayedExpansion
set com=COM4

::==============
::Copy Files
::==============
del /s /f /q data\*.*
mkdir data\css
mkdir data\js
mkdir data\img
mkdir data\fonts
::mkdir data\firmware
mkdir data\pcb
mkdir data\pcb\v1.0
mkdir data\pcb\v3.0

set array=index.php header.php menu.php esp8266.php can.php graph.php bootloader.php firmware.php simple.php test.php version.txt description.csv
for %%a in (%array%) do (
  copy ..\Web\%%a data
)

set array=alertify.css jquery.fancybox.css animate.css bootstrap.css ion.rangeSlider.css icons.css style.css
for %%a in (%array%) do (
  copy ..\Web\css\%%a data\css
)

set array=jquery.js jquery.knob.js potentiometer.js jquery.fancybox.js alertify.js bootstrap.js ion.rangeSlider.js bootstrap-notify.js firmware.js can.js graph.js jscolor.js index.js menu.js simple.js chart.js chartjs-plugin-datalabels.js chartjs-plugin-zoom.js test.js mobile.js
for %%a in (%array%) do (
  copy ..\Web\js\%%a data\js
)
copy ..\Web\js\menu-esp8266.json data\js\menu.json

set array=background.png safety.png
for %%a in (%array%) do (
  copy ..\Web\img\%%a data\img
)

copy "..\Web\pcb\Hardware v1.0\diagrams\test.png" data\pcb\v1.0
copy "..\Web\pcb\Hardware v1.0\diagrams\esp8266.png" data\pcb\v1.0
copy "..\Web\pcb\Hardware v3.0\diagrams\test.png" data\pcb\v3.0
copy "..\Web\pcb\Hardware v3.0\diagrams\esp8266.png" data\pcb\v3.0
::copy ..\Web\fonts\icons.ttf data\fonts
copy ..\Web\fonts\icons.woff data\fonts

::======================
::Correct long filenames
::======================
::for /?

for /R "%~dp0\data" %%F in (*.*) do (
	if NOT "%%~nxF" == "%%~nxsF" (
		SET N=%%~nxsF
		CALL :LCase N R
		echo %%~nxF !R!
		move /y "%%~F" "%%~pF\!R!"
		for /f "" %%a in ('findstr /M /C:"%%~nxF" /S "%~dp0\data\*.php"') do (
			echo %%a
			powershell -ExecutionPolicy Bypass -Command "(Get-Content %%a).replace('%%~nxsF', '!R!') | Set-Content %%a"
		)
		for /f "" %%a in ('findstr /M /C:"%%~nxF" /S "%~dp0\data\*.js"') do (
			echo %%a
			powershell -ExecutionPolicy Bypass -Command "(Get-Content %%a).replace('%%~nxsF', '!R!') | Set-Content %%a"
		)
		for /f "" %%a in ('findstr /M /C:"%%~nxF" /S "%~dp0\data\*.json"') do (
			echo %%a
			powershell -ExecutionPolicy Bypass -Command "(Get-Content %%a).replace('%%~nxsF', '!R!') | Set-Content %%a"
		)
		for /f "" %%a in ('findstr /M /C:"%%~nxF" /S "%~dp0\data\*.css"') do (
			echo %%a
			powershell -ExecutionPolicy Bypass -Command "(Get-Content %%a).replace('%%~nxsF', '!R!') | Set-Content %%a"
		)
	)
)

for /R "%~dp0\data" %%F in (*.js) do (
	powershell -ExecutionPolicy Bypass -Command "(Get-Content %%F).replace('pcb/Hardware v1.0/diagrams/', 'pcb/v1.0/') | Set-Content %%F"
	powershell -ExecutionPolicy Bypass -Command "(Get-Content %%F).replace('pcb/Hardware v3.0/diagrams/', 'pcb/v3.0/') | Set-Content %%F"
)

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
If Not Exist .\tools\bin\gzip.exe (
  powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -OutFile ./tools/gzip-1.3.12-1-bin.zip -Uri http://sourceforge.mirrorservice.org/g/gn/gnuwin32/gzip/1.3.12-1/gzip-1.3.12-1-bin.zip"
)

for %%F in ("%~dp0\tools\*.zip") do (
	Call :UnZipFile "%~dp0tools\" "%~dp0tools\%%~nxF"
	del .\tools\%%~nxF
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
forfiles /p .\ /s /m *.js /c "cmd /c java -jar %~dp0tools\closure-compiler-v20180910.jar --strict_mode_input=false --language_in ECMASCRIPT5 --js_output_file @file --js @file"

:GZip
for /R "%~dp0\data" %%F in (*.*) do (
	::Exclude php files
	if NOT "%%~xF" == ".php" (
		"%~dp0\tools\bin\gzip.exe" "%%F"
		move /y "%%F.gz" "%%F"
	)
)

::================
::Find Folder Size
::================
set /a value=0
set /a fs=0
FOR /R .\data %%I IN (*) DO (
	set /a value=%%~zI
	set /a fs_ondisk+="((!value!-1)/4096+1)*4096"
	set /a fs_ondisk+=256
	set /a fs+=%%~zI
)
echo Size: %fs%
echo Size on disk: %fs_ondisk%

::"%~dp0\tools\mkspiffs.exe" -c .\data\  -b 8192 -p 256 -s %fs_ondisk% flash-spiffs.bin
"%~dp0\tools\mkspiffs.exe" -c .\data\  -b 8192 -p 256 -s 643072 flash-spiffs.bin
::"%~dp0\tools\mkspiffs.exe" -c .\data\  -b 8192 -p 256 -s 1028096 flash-spiffs.bin
::"%~dp0\tools\mkspiffs.exe" -i flash-spiffs.bin
pause
GOTO:EOF

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

:LCase
:UCase
:: Converts to upper/lower case variable contents
:: Syntax: CALL :UCase _VAR1 _VAR2
:: Syntax: CALL :LCase _VAR1 _VAR2
:: _VAR1 = Variable NAME whose VALUE is to be converted to upper/lower case
:: _VAR2 = NAME of variable to hold the converted value
:: Note: Use variable NAMES in the CALL, not values (pass "by reference")

SET _UCase=A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
SET _LCase=a b c d e f g h i j k l m n o p q r s t u v w x y z
SET _Lib_UCase_Tmp=!%1!
IF /I "%0"==":UCase" SET _Abet=%_UCase%
IF /I "%0"==":LCase" SET _Abet=%_LCase%
FOR %%Z IN (%_Abet%) DO SET _Lib_UCase_Tmp=!_Lib_UCase_Tmp:%%Z=%%Z!
SET %2=%_Lib_UCase_Tmp%
GOTO:EOF