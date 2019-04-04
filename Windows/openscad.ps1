if($args[0] -eq "uninstall") {
    Start-Process "C:\Program Files\OpenSCAD\Uninstall.exe" -Wait
}else{
    Start-Process "$env:USERPROFILE\Downloads\OpenSCAD-2019.01-RC4-x86-64-Installer.exe" -Wait
}