#if($args[0] -eq "uninstall") {
#}else{
    Start-Process "$env:USERPROFILE\Downloads\Autodesk_EAGLE_8.2.2_English_Win_64bit.exe" -ArgumentList "/auto" -Wait
#}