$cangaroo = "$env:programfiles\cangaroo"

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
	Remove-Item -Recurse -Force $cangaroo
}else{
    if (-Not (Test-Path $cangaroo)){
		Elevate $args[0]
        Expand-Archive -Path "$env:userprofile\Downloads\cangaroo-win32-0363ce7.zip" -DestinationPath "$env:programfiles" -Force
		Rename-Item "$env:programfiles\dist" $cangaroo
	}
	
    Start-Process "$cangaroo\cangaroo.exe"
}