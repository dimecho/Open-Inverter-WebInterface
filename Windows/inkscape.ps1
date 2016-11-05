Start-Process "msiexec.exe" -ArgumentList "/i $env:USERPROFILE\Downloads\inkscape-0.91-x64.msi" -Wait
Copy-Item "$PSScriptRoot\encoder\extensions" "C:\Program Files\Inkscape\share\extensions" -Recurse