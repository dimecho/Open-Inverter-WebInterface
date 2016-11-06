Start-Process "$env:USERPROFILE\Downloads\mingw32-gcc4.7.2.exe" -Wait

if (-Not (Test-Path "C:\Python27\python.exe")){
    if (-Not (Test-Path "$env:USERPROFILE\Downloads\python-2.7.msi")) {
        Write-Host "Downloading Python 2.7" -ForegroundColor Green
        Invoke-WebRequest -Uri "http://www.python.org/ftp/python/2.7/python-2.7.msi" -OutFile "$env:USERPROFILE\Downloads\python-2.7.msi"
    }
    Start-Process "msiexec.exe" -ArgumentList "/i $env:USERPROFILE\Downloads\python-2.7.msi" -Wait
}