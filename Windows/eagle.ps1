if($args[0] -eq "uninstall") {
	Start-Process "C:\EAGLE $($args[1])\unins000.exe" -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\Autodesk_EAGLE_$($args[0])_English_Win_64bit.exe" -Wait
}