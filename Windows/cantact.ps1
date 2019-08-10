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
    if (-Not (Test-Path $cantact)){
		Elevate $args[0]
		Add-Type -AssemblyName System.IO.Compression.FileSystem
		[System.IO.Compression.ZipFile]::ExtractToDirectory("$env:userprofile\Downloads\cantact-v$($args[0])-alpha.zip", "$env:programfiles")
	}

	#fixes java updates
    #Remove-Item –Path "$env:userprofile\AppData\Roaming\.cantact" –Recurse –Force
    
	Start-Process "$cantact\bin\cantact64.exe"
}