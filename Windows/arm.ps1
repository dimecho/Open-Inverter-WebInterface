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
	Start-Process "C:\Program Files (x86)\GNU Tools Arm Embedded\7 2018-q2-update\uninstall.exe" -Wait
	Start-Process "C:\SysGCC\ARM\uninstall.exe" -Wait
}else{
	Elevate
	Start-Process "$env:USERPROFILE\Downloads\gcc-arm-none-eabi-7-2018-q2-update-win32.exe" -Wait
	Move-Item "C:\Program Files (x86)\GNU Tools Arm Embedded\7 2018-q2-update" "C:\SysGCC\ARM" -Force
	Remove-Item "C:\Program Files (x86)\GNU Tools Arm Embedded\"
}