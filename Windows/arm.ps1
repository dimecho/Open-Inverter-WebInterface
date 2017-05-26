if($args[0] -eq "uninstall") {
	Start-Process "C:\Program Files (x86)\GNU Tools ARM Embedded\6 2017-q1-update\uninstall.exe" -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\gcc-arm-none-eabi-6-2017-q1-update-win32.exe" -Wait
}