#if($args[0] -eq "uninstall") {
#}else{
    Start-Process "$env:USERPROFILE\Downloads\gcc-arm-none-eabi-5_4-2016q3-20160926-win32.exe" -Wait
#}