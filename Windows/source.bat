SET CurrentDir=%~dp0

cd "%USERPROFILE%\Documents\"
IF NOT EXIST tumanako-inverter-fw-motorControl-master (
	Call :UnZipFile "%USERPROFILE%\Documents\" "%USERPROFILE%\Downloads\master.zip"
) ELSE (

    SET GCC_ARM="C:\Program Files (x86)\GNU Tools ARM Embedded\5.4 2016q3"
    ::set PATH=%PATH%;"C:\Program Files (x86)\GNU Tools ARM Embedded\5.4 2016q3\bin"

    cd "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master"
    ::--------- LIBOPENCM3 ------------
    IF NOT EXIST libopencm3 (
    	bitsadmin.exe /transfer "libopencm3" https://github.com/libopencm3/libopencm3/archive/master.zip "%USERPROFILE%\Downloads\libopencm3.zip"
    	Call :UnZipFile "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\" "%USERPROFILE%\Downloads\libopencm3.zip"
        robocopy "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\libopencm3\lib" "%GCC_ARM%\arm-none-eabi\lib" /s /e
        robocopy "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\libopencm3\include" "%GCC_ARM%\arm-none-eabi\include" /s /e
        ::robocopy "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\libopencm3\include" "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\src\sine\include" /s /e
    )

    ::--------- GNU MAKE ------------
    IF NOT EXIST "%GCC_ARM%\bin\make.exe" (
        copy "%CurrentDir%\libiconv2.dll" "%GCC_ARM%\bin"
        copy "%CurrentDir%\libintl3.dll" "%GCC_ARM%\bin"
        copy "%CurrentDir%\make.exe" "%GCC_ARM%\bin"
    }

    ::--------- BOOTLOADER ------------
    cd "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master"
    IF NOT EXIST .\src\bootloader (
        Call :UnZipFile "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\src\" "%CurrentDir%\..\Web\firmware\bootloader.zip"
    )
    cd .\src\bootloader
    make clean
    make
    move stm32_loader.bin ../../
    move stm32_loader.hex ../../

    ::--------- FIRMWARE --------------
    cd "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\src\sine"
    make clean
    make
    move stm32_sine.bin ../../
    move stm32_sine.hex ../../

    ::--------- ATtiny13 ------------
    cd "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master"
    IF NOT EXIST .\src\attiny13 (
        Call :UnZipFile "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master\src\" "%CurrentDir%\..\Web\firmware\attiny13.zip"
    )
    cd .\src\attiny13
    ::---------------------------------

    explorer "%USERPROFILE%\Documents\tumanako-inverter-fw-motorControl-master"
)

::---------------------------------
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