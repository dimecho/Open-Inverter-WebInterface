#if($args[0] -eq "uninstall") {
#}else{
    Start-Process "$env:USERPROFILE\Downloads\Autodesk_EAGLE_9.0.1_English_Win_64bit.exe" -ArgumentList "/auto" -Wait
#}