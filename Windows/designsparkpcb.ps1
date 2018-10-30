if($args[0] -eq "uninstall") {
}else{
    Start-Process "$env:USERPROFILE\Downloads\DesignSparkPCB_v8.1.1.exe" -Wait
}