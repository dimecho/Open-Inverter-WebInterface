$mphidflash = "$env:userprofile\Downloads\mphidflash-1.6-win-32.exe"

if($args[0] -eq "uninstall") {
    Remove-Item -Recurse -Force $mphidflash
}else{
    Start-Process $mphidflash -ArgumentList "-w ""$PSScriptRoot..\Web\firmware\can\$($args[1]).hex""" -NoNewWindow -Wait
}