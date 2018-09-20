if($args[0] -eq "uninstall") {
    Start-Process "C:\Program Files (x86)\Arduino\uninstall.exe" -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\arduino-1.8.6-windows.exe" -Wait
}