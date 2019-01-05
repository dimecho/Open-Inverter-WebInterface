$cantact = "$env:programfiles\cantact"

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
	Remove-Item -Recurse -Force $cantact
}else{
    if (-Not (Test-Path $cantact)){
		Elevate
		Add-Type -AssemblyName System.IO.Compression.FileSystem
		[System.IO.Compression.ZipFile]::ExtractToDirectory("$env:userprofile\Downloads\cantact-v0.3.0-alpha.zip", "$env:programfiles")
	}
	
    Set-Location "$cantact\bin"
	Start-Process ".\cantact64.exe"
}