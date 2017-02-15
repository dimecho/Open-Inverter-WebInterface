Start-Process "msiexec.exe" -ArgumentList "/i $env:USERPROFILE\Downloads\inkscape-0.91-x64.msi" -Wait
Copy-Item "$PSScriptRoot\..\Web\encoder\extensions\*" "$env:APPDATA\inkscape\extensions"
Copy-Item "$PSScriptRoot\..\Web\encoder\preferences.xml" "$env:APPDATA\inkscape\preferences.xml"