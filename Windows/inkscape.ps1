if($args[0] -eq "uninstall") {
    #HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
    Start-Process "msiexec.exe" -ArgumentList "/x $env:USERPROFILE\Downloads\Inkscape-0.92.1.msi" -Wait
}else{
    Start-Process "msiexec.exe" -ArgumentList "/i $env:USERPROFILE\Downloads\Inkscape-0.92.1.msi" -Wait
    If (-not (Test-Path "$env:APPDATA\inkscape\extensions")) {
        New-Item -ItemType Directory -Path "$env:APPDATA\inkscape\extensions" -Force
    } 
    Copy-Item "$PSScriptRoot\..\Web\encoder\extensions\*" "$env:APPDATA\inkscape\extensions"
    Copy-Item "$PSScriptRoot\..\Web\encoder\preferences.xml" "$env:APPDATA\inkscape\preferences.xml"
}