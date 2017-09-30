if($args[0] -eq "uninstall") {
	Remove-Item -Recurse -Force "C:\SysGCC\arm-eabi"
}else{
    Start-Process "$env:USERPROFILE\Downloads\arm-eabi-gcc6.2.0-r4.exe" -Wait
}