$openocd = "$env:programfiles\xPack\OpenOCD\0.10.0-13"

function Elevate() {
    # Get the ID and security principal of the current user account
    $myWindowsID=[System.Security.Principal.WindowsIdentity]::GetCurrent()
    $myWindowsPrincipal = New-Object System.Security.Principal.WindowsPrincipal($myWindowsID)

    # Check to see if we are currently running "as Administrator"
    if (!$myWindowsPrincipal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)){
        Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File ""$PSCommandPath"" $args" -verb runas
        exit
    }
}

if($args[0] -eq "uninstall") {
	Elevate $args[0]
	Remove-Item -Recurse -Force (Split-Path ($openocd) -Parent)
}else{
    if (-Not (Test-Path $openocd)){
		Elevate
        Expand-Archive -Path "$env:userprofile\Downloads\xpack-openocd-0.10.0-13-win32-x64.zip" -DestinationPath "$env:programfiles" -Force -Verbose
  	}else{
        Set-Location "$openocd\bin"
		$FILE = $($args[0]).Replace("\","\\")
        $ADDRESS=" 0x08000000"

        if ($args[2] -eq 'ram') { $ADDRESS=" 0x08001000" }
        if ($args[0] -like '*.hex') { $ADDRESS="" }
        
		Start-Process ".\openocd.exe" -ArgumentList "-f ..\scripts\$($args[1]) -f ..\scripts\board\olimex_stm32_h103.cfg  -c ""init"" -c ""reset halt"" -c ""flash write_image erase unlock $($FILE)$($ADDRESS)"" -c ""reset"" -c ""shutdown""" -NoNewWindow -Wait
	}
}