if($args[0] -eq "uninstall") {
	Remove-Item -Recurse -Force "$env:userprofile\Downloads\USBtinViewer_v$($args[1]).jar"
}else{
    Start-Process "javaw.exe" -ArgumentList "-jar $env:userprofile\Downloads\USBtinViewer_v$($args[0]).jar"
}