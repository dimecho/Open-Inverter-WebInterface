if($args[0] -eq "uninstall") {
	Remove-Item -Recurse -Force "$env:USERPROFILE\AppData\Local\Programs\Python\Python38"
}else{
    Start-Process "$env:USERPROFILE\Downloads\python-3.8.0-amd64.exe" -Wait
}