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
	Elevate
    Remove-Item -Recurse -Force "C:\SysGCC"
    Remove-Item -Recurse -Force "C:\msys64"
}else{
    $console=$args[0]
    if ($console -eq 1){
		Set-Location "$env:USERPROFILE\Downloads\"
        
        Start-Process "mingw64-gcc4.7.1.exe" -Wait
		
        if (-Not (Test-Path "msys2-x86_64-20180531.exe")) {
            Write-Host "Downloading MinGW - GNU for Windows"  -ForegroundColor Yellow
            Invoke-WebRequest -Uri "https://sourceforge.mirrorservice.org/m/ms/msys2/Base/x86_64/msys2-x86_64-20180531.exe" -OutFile "msys2-x86_64-20180531.exe"
        }
        Write-Host "Installing MinGW - GNU for Windows" -ForegroundColor Green
        Start-Process "msys2-x86_64-20180531.exe" -Wait
        
        Stop-Process -ProcessName cmd
    }else{
        Start-Process -FilePath "cmd.exe" -ArgumentList "/k ""powershell.exe -ExecutionPolicy Bypass -File ""$PSCommandPath"" 1"" 2>&1"
    }
}