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
    
    # Download PHP
    $phpFile = "php-7.1.11-Win32-VC14-x64.zip"
    if (-Not (Test-Path "$env:TEMP\$phpFile")) {
    	Write-Host "Downloading PHP 7"  -ForegroundColor Green
        Write-Host ""
    	Invoke-WebRequest -Uri http://windows.php.net/downloads/releases/$phpFile -OutFile "$env:TEMP\$phpFile"
    }

    # Visual C++ Redistributable for Visual Studio 2015
    if (-Not (Test-Path 'HKLM:\SOFTWARE\Classes\Installer\Dependencies\{d992c12e-cab2-426f-bde3-fb8c53950b0d}')) {
    	Write-Host "Downloading C++ Redistributable for Visual Studio 2015"  -ForegroundColor Green
        Write-Host ""
    	Invoke-WebRequest -Uri https://download.microsoft.com/download/6/A/A/6AA4EDFF-645B-48C5-81CC-ED5963AEAD48/vc_redist.x64.exe -OutFile "$env:TEMP\vc_redist.x64.exe"
    	Start-Process "$env:TEMP\vc_redist.x64.exe" /q:a -Wait
    }

    New-Item "$env:programfiles\PHP" -ItemType directory -ErrorAction SilentlyContinue

    $shell = new-object -com Shell.Application
    $zip = $shell.NameSpace("$env:TEMP\$phpFile")
    foreach($item in $zip.items())
    {
    	$shell.Namespace("$env:programfiles\PHP\").copyhere($item)
    }

    Rename-Item "$env:programfiles\PHP\php.ini-development" php.ini -ErrorAction SilentlyContinue
    Add-Content "$env:programfiles\PHP\php.ini" "
[HuebnerInverter]
error_log=C:\WINDOWS\Temp\PHP7_errors.log
upload_tmp_dir=C:\WINDOWS\Temp
session.save_path=C:\WINDOWS\Temp
allow_url_fopen=1
cgi.force_redirect=0
cgi.fix_pathinfo=1
fastcgi.impersonate=1
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