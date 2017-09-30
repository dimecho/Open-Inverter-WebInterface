if($args[0] -eq "uninstall") {
	Remove-Item -Recurse -Force "C:\SysGCC\avr"
}else{
    Start-Process "$env:USERPROFILE\Downloads\avr-gcc5.3.0.exe" -Wait
	Copy-Item "$PSScriptRoot\driver\avrdude\*" "C:\SysGCC\avr\bin" -Force -Recurse
}