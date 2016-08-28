
SET openocd="C:\Program Files\GNU ARM Eclipse\OpenOCD"

IF NOT EXIST "%openocd%" (
    start /wait "%USERPROFILE%\Downloads\gnuarmeclipse-openocd-win64-0.10.0-201601101000-dev-setup.exe"
)ELSE(
    cd "%openocd%\0.10.0-201601101000-dev"
    openocd.exe -f ./scripts/interface/ftdi/%1.cfg -f ./scripts/board/olimex_stm32_h103.cfg  -c "init" -c "reset init" -c "halt" -c "flash write_image erase %0 0x08000000" -c "reset" -c "shutdown" 
)