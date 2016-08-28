SET CurrentDir=%~dp0
SET GNUTools="C:\Program Files (x86)\GNU Tools ARM Embedded\5.4 2016q2"

IF NOT EXIST "%USERPROFILE%\Documents\firmware" (
	Call :UnZipFile "%USERPROFILE%\Documents\" "%USERPROFILE%\Downloads\inverter.zip"
)

::set PATH=%PATH%;"C:\Program Files (x86)\GNU Tools ARM Embedded\5.4 2016q2\bin"

cd "%USERPROFILE%\Documents\firmware"

::--------- SOURCECODE ------------
IF NOT EXIST "%USERPROFILE%\Documents\firmware\src" (
	bitsadmin.exe /transfer "sync_motor" https://github.com/tumanako/tumanako-inverter-fw-motorControl/archive/sync_motor.zip "%USERPROFILE%\Downloads\sync_motor.zip"
	Call :UnZipFile "%USERPROFILE%\Documents\" "%USERPROFILE%\Downloads\sync_motor.zip"
)

::--------- LIBOPENCM3 ------------
IF NOT EXIST "%USERPROFILE%\Documents\firmware\libopencm3" (
	bitsadmin.exe /transfer "libopencm3" https://github.com/libopencm3/libopencm3/archive/master.zip "%USERPROFILE%\Downloads\libopencm3.zip"
	Call :UnZipFile "%USERPROFILE%\Documents\" "%USERPROFILE%\Downloads\libopencm3.zip"
)

::--------- BOOTLOADER ------------
cd "%USERPROFILE%\Documents\bootloader"
IF NOT EXIST "%GNUTools%\arm-none-eabi\lib\libopencm3_stm32f1.a" (
	robocopy "%USERPROFILE%\Documents\firmware\libopencm3\lib" "%GNUTools%\arm-none-eabi\lib" /s /e
)

::--------- FIRMWARE --------------
cd "%USERPROFILE%\Documents\firmware\src"
IF NOT EXIST "%USERPROFILE%\Documents\firmware\src\include" (
	robocopy "%USERPROFILE%\Documents\firmware\libopencm3\include" "%USERPROFILE%\Documents\firmware\src\include" /s /e
)


IF NOT EXIST "%GNUTools%\bin\make.exe" (
	copy "%CurrentDir%\libiconv2.dll" "%GNUTools%\bin"
	copy "%CurrentDir%\libintl3.dll" "%GNUTools%\bin"
	copy "%CurrentDir%\make.exe" "%GNUTools%\bin"
}

make clean
make

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