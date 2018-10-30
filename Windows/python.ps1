if($args[0] -eq "uninstall") {
	Remove-Item -Recurse -Force "$env:USERPROFILE\AppData\Local\Programs\Python\Python37"
}else{
    Start-Process "$env:USERPROFILE\Downloads\python-3.7.1-amd64.exe" -Wait
}