if($args[0] -eq "uninstall") {
	Start-Process "msiexec.exe" -ArgumentList "/x {81922150-317E-4BB0-A31D-FF1C14F707C5}" -NoNewWindow -Wait
}else{
    Start-Process "msiexec.exe" -ArgumentList "/i $env:USERPROFILE\Downloads\inkscape-0.92.3-x64.msi" -Wait
    If (-not (Test-Path "$env:APPDATA\inkscape\extensions")) {
        New-Item -ItemType Directory -Path "$env:APPDATA\inkscape\extensions" -Force
    } 
    Copy-Item "$PSScriptRoot\..\Web\encoder\extensions\*" "$env:APPDATA\inkscape\extensions"
    Copy-Item "$PSScriptRoot\..\Web\encoder\preferences.xml" "$env:APPDATA\inkscape\preferences.xml"
}