#if($args[0] -eq "uninstall") {
#}else{
    Start-Process "$env:USERPROFILE\Downloads\python-3.6.2.exe" -Wait
#}