if($args[0] -eq "uninstall") {
    Start-Process "C:\Program Files\GNU ARM Eclipse\OpenOCD\Uninstall.exe" -Wait
}else{
    $openocd = "C:\Program Files\GNU ARM Eclipse\OpenOCD"
    if (-Not (Test-Path $openocd)){
        Start-Process "$env:USERPROFILE\Downloads\gnu-mcu-eclipse-openocd-0.10.0-4-20171004-0812-dev-win64-setup.exe" -Wait
    }else{
        Set-Location "$openocd%\0.10.0-4-20171004-0812-dev"

        $ADDRESS=" 0x08000000"

        if ("$1" -like '*.hex') { $ADDRESS="" }

        Start-Process "openocd.exe" -ArgumentList "-f ./scripts/$1 -f ./scripts/board/olimex_stm32_h103.cfg  -c ""init"" -c ""reset halt"" -c ""flash write_image erase unlock $0$ADDRESS"" -c ""reset"" -c ""shutdown"""
    }
}