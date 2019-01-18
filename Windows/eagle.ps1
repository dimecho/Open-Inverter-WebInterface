if($args[0] -eq "uninstall") {
	Start-Process "C:\EAGLE 9.3.0\unins000.exe" -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\Autodesk_EAGLE_9.3.0_English_Win_64bit.exe" -Wait
}