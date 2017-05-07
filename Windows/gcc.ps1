function Elevate() {
    # Get the ID and security principal of the current user account
    $myWindowsID=[System.Security.Principal.WindowsIdentity]::GetCurrent()
    $myWindowsPrincipal = New-Object System.Security.Principal.WindowsPrincipal($myWindowsID)

    # Check to see if we are currently running "as Administrator"
    if (!$myWindowsPrincipal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)){
        Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File ""$PSCommandPath""" -verb runas
        exit
    }
}

if($args[0] -eq "uninstall") {
    Write-Host "...Removing GCC"
    Remove-Item -Recurse -Force "C:\mingw"
    Remove-Item -Recurse -Force "C:\msys-1.0.10"
}else{
    $console=$args[0]
    if ($console -eq 1){
        Write-Host "Installing GNU toolchain for MinGW" -ForegroundColor Green
        Start-Process "$env:USERPROFILE\Downloads\mingw32-gcc4.8.1.exe" -Wait
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
}