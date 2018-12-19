if($args[0] -eq "uninstall") {
	Start-Process "msiexec.exe" -ArgumentList "/x {D81000AA-D25A-463B-98BF-E09585325711}" -NoNewWindow -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\DesignSparkPCB_v8.1.1.exe" -Wait
}