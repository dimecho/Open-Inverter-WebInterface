#if($args[0] -eq "uninstall") {
#}else{
    Start-Process "$env:USERPROFILE\Downloads\gcc-arm-none-eabi-6-2017-q1-update-win32.exe" -Wait
#}