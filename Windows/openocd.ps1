$openocd = "$env:programfiles\GNU MCU Eclipse"

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
	Remove-Item -Recurse -Force $openocd
}else{
    if (-Not (Test-Path $openocd)){
		Elevate
        $shell = new-object -com Shell.Application
		$zip = $shell.NameSpace("$env:userprofile\Downloads\gnu-mcu-eclipse-openocd-0.10.0-8-20180512-1921-win64.zip")
		foreach($item in $zip.items())
		{
			$shell.Namespace($env:programfiles).copyhere($item)
		}
	}else{
        Set-Location "$openocd\OpenOCD\0.10.0-8-20180512-1921\bin"
		$FILE = $($args[0]).Replace("\","\\")
        $ADDRESS=" 0x08000000"

        if ($args[2] -eq 'ram') { $ADDRESS=" 0x20000000" }
        if ($args[0] -like '*.hex') { $ADDRESS="" }
        
		Start-Process ".\openocd.exe" -ArgumentList "-f ..\scripts\$($args[1]) -f ..\scripts\board\olimex_stm32_h103.cfg  -c ""init"" -c ""reset halt"" -c ""flash write_image erase unlock $($FILE)$($ADDRESS)"" -c ""reset"" -c ""shutdown""" -NoNewWindow -Wait
	}
}