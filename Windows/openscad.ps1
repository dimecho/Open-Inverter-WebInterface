if($args[0] -eq "uninstall") {
    Start-Process "C:\Program Files\OpenSCAD\Uninstall.exe" -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\OpenSCAD-$($args[0])-x86-64-Installer.exe" -Wait
}