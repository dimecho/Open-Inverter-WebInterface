$console=$args[0]
if ($console -eq 1){
    Write-Host "Installing GNU toolchain for MinGW" -ForegroundColor Green
    Start-Process "$env:USERPROFILE\Downloads\mingw32-gcc4.7.2.exe" -Wait
    if (-Not (Test-Path "$env:USERPROFILE\Downloads\MSYS-1.0.11.exe")) {
    	Write-Host "Downloading MinGW - GNU for Windows"  -ForegroundColor Yellow
    	Invoke-WebRequest -Uri "http://sourceforge.mirrorservice.org/m/mi/mingw/MSYS/Base/msys-core/msys-1.0.11/MSYS-1.0.11.exe" -OutFile "$env:USERPROFILE\Downloads\MSYS-1.0.11.exe"
    }
    Write-Host "Installing MinGW - GNU for Windows" -ForegroundColor Green
    Start-Process "$env:USERPROFILE\Downloads\MSYS-1.0.11.exe" -Wait
    Stop-Process -ProcessName cmd
}else{
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k ""powershell.exe -ExecutionPolicy Bypass -File ""$PSCommandPath"" 1"" 2>&1"
}