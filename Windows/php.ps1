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
    Stop-Process -ProcessName php -Force
    Remove-Item -Recurse -Force "$env:programfiles\PHP"
    #Remove-NetFirewallRule -Name "TCP8080" -ErrorAction SilentlyContinue
}else{
    Elevate
    Write-Host "...Installing PHP"

    $AllProtocols = [System.Net.SecurityProtocolType]'Ssl3,Tls,Tls11,Tls12'
    [System.Net.ServicePointManager]::SecurityProtocol = $AllProtocols
    
    # Download PHP
    $phpFile = "php-7.4.8-Win32-vc15-x64.zip"
    if (-Not (Test-Path "$env:userprofile\Downloads\$phpFile")) {
    	Write-Host "Downloading PHP 7.4"  -ForegroundColor Green
        Write-Host "$env:userprofile\Downloads\$phpFile"
        Invoke-WebRequest -Uri "https://windows.php.net/downloads/releases/archives/$phpFile" -OutFile "$env:userprofile\Downloads\$phpFile" -Debug
    }

    # Visual C++ Redistributable for Visual Studio
	$vcFile = "VC_redist.x64.exe"
    $vc2019 = "SOFTWARE\Classes\Installer\Dependencies\VC,redist.x64,amd64,14.24,bundle\Dependents\{282975d8-55fe-4991-bbbb-06a72581ce58}"
    #$vc2017 = "HKLM:SOFTWARE\Classes\Installer\Dependencies\,,amd64,14.0,bundle\Dependents\{e2ee15e2-a480-4bc5-bfb7-e9803d1d9823}"
    #$vc2015 = "HKLM:SOFTWARE\Classes\Installer\Dependencies\{d992c12e-cab2-426f-bde3-fb8c53950b0d}"
    
    if (-Not (Test-Path vc2019)) {
    	if (-Not (Test-Path "$env:userprofile\Downloads\$vcFile")) {
			Write-Host "Downloading C++ Redistributable for Visual Studio 2019"  -ForegroundColor Green
			Write-Host "$env:userprofile\Downloads\$vcFile"
			Invoke-WebRequest -Uri "https://aka.ms/vs/16/release/$vcFile" -OutFile "$env:userprofile\Downloads\$vcFile" -Debug
		}
		Start-Process "$env:userprofile\Downloads\$vcFile" /q:a -Wait
    }

    New-Item "$env:programfiles\PHP" -ItemType directory -ErrorAction SilentlyContinue

    $shell = new-object -com Shell.Application
    $zip = $shell.NameSpace("$env:userprofile\Downloads\$phpFile")
    foreach($item in $zip.items())
    {
    	$shell.Namespace("$env:programfiles\PHP\").copyhere($item)
    }

    Rename-Item "$env:programfiles\PHP\php.ini-development" php.ini -ErrorAction SilentlyContinue
    Add-Content "$env:programfiles\PHP\php.ini" "
[HuebnerInverter]
allow_url_fopen=1
cgi.force_redirect=0
cgi.fix_pathinfo=1
fastcgi.impersonate=0
fastcgi.logging=0
date.timezone=America/Los_Angeles
extension_dir=ext
extension=php_curl.dll
extension=php_openssl.dll"

    # Firewall Configuration
    #if (!(Get-NetFirewallRule | where {$_.Name -eq "TCP8080"})) {
    #   New-NetFirewallRule -Name "TCP8080" -DisplayName "HTTP on TCP/8080" -Protocol tcp -LocalPort 8080 -Action Allow -Enabled True
    #}
}