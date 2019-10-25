$cantact = "$env:programfiles\cantact"

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
	Remove-Item -Recurse -Force $cantact
}else{
    if (-Not (Test-Path $cantact))
    {
		Elevate $args[0]
        $zip = Start-Job -ScriptBlock {Expand-Archive -Path "$env:userprofile\Downloads\cantact-v0.3.0-alpha.zip" -DestinationPath "$env:programfiles" -Force} -ArgumentList $args[0]
	    Wait-Job $zip
    }

    Start-Process "cmd" -ArgumentList "/c ""del /q '\\?\$env:userprofile\AppData\Roaming\.cantact\'"""
	Start-Process "$cantact\bin\cantact64.exe"
}