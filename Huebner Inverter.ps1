#=============
# Version: 1.0
#=============

# Get the ID and security principal of the current user account
$myWindowsID=[System.Security.Principal.WindowsIdentity]::GetCurrent()
$myWindowsPrincipal=new-object System.Security.Principal.WindowsPrincipal($myWindowsID)

# Check to see if we are currently running "as Administrator"
if (!$myWindowsPrincipal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)){
	$newProcess = new-object System.Diagnostics.ProcessStartInfo "PowerShell"; # Create a new process object that starts PowerShell
	$newProcess.Arguments = "& '$PSCommandPath'" # Specify the current script path and name as a parameter
	$newProcess.Verb = "runas"; # Indicate that the process should be elevated
	[System.Diagnostics.Process]::Start($newProcess); # Start the new process
	exit # Exit from the current, unelevated, process
}
Write-Host "=========================================`nHuebner Inverter - Console Management`n========================================="  -ForegroundColor Green
Write-Host "1) Start Inverter"  -ForegroundColor Green
Write-Host "2) Stop Inverter"  -ForegroundColor Green
Write-Host "3) Upload Parameters"  -ForegroundColor Green
Write-Host "4) Download Parameters"  -ForegroundColor Green
Write-Host "5) Advanced Parameters"  -ForegroundColor Green
Write-Host "6) Wiring Diagram"  -ForegroundColor Green
Write-Host "7) Build Encoder"  -ForegroundColor Green

$result = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Select-Object Character

function startPHP($page) {
	if (-Not (Test-Path "$env:programfiles\PHP\php.exe")) {
	
		Write-Host "...Installing PHP"
		
		# Download PHP
		if (-Not (Test-Path "$env:TEMP\php-5.5.35-nts-Win32-VC11-x64.zip")) {
			Invoke-WebRequest -Uri http://windows.php.net/downloads/releases/php-5.5.35-nts-Win32-VC11-x64.zip -OutFile "$env:TEMP\php-5.5.35-nts-Win32-VC11-x64.zip"
		}
		# Download Dio Extension
		if (-Not (Test-Path "$env:TEMP\php_dio-0.0.7-5.5-nts-vc11-x64.zip")) {
			Invoke-WebRequest -Uri http://windows.php.net/downloads/pecl/releases/dio/0.0.7/php_dio-0.0.7-5.5-nts-vc11-x64.zip -OutFile "$env:TEMP\php_dio-0.0.7-5.5-nts-vc11-x64.zip"
		}
		
		# Visual C++ Redistributable for Visual Studio 2012
		if (-Not (Test-Path 'HKLM:\SOFTWARE\Classes\Installer\Dependencies\{ca67548a-5ebe-413a-b50c-4b9ceb6d66c6}')) {
			Invoke-WebRequest -Uri https://download.microsoft.com/download/1/6/B/16B06F60-3B20-4FF2-B699-5E9B7962F9AE/VSU_4/vcredist_x64.exe -OutFile "$env:TEMP\vcredist_x64.exe "
			Start-Process "$env:TEMP\vcredist_x64.exe " /q:a -Wait
		}
	
		New-Item "$env:programfiles\PHP" -ItemType directory -ErrorAction SilentlyContinue

		$shell = new-object -com Shell.Application
		$zip = $shell.NameSpace("$env:TEMP\php-5.5.35-nts-Win32-VC11-x64.zip")
		foreach($item in $zip.items())
		{
			$shell.Namespace("$env:programfiles\PHP\").copyhere($item)
		}
		$zip = $shell.NameSpace("$env:TEMP\php_dio-0.0.7-5.5-nts-vc11-x64.zip")
		foreach($item in $zip.items())
		{
			$shell.Namespace("$env:programfiles\PHP\ext").copyhere($item)
		}
		Rename-Item "$env:programfiles\PHP\php.ini-development" php.ini -ErrorAction SilentlyContinue
		Add-Content "$env:programfiles\PHP\php.ini" "
[WebPIChanges]
error_log=C:\WINDOWS\temp\PHP55_errors.log
upload_tmp_dir=C:\WINDOWS\temp
session.save_path=C:\WINDOWS\temp
cgi.force_redirect=0
cgi.fix_pathinfo=1
fastcgi.impersonate=1
fastcgi.logging=0
max_execution_time=300
date.timezone=America/Los_Angeles
extension_dir = `'ext`'
extension=php_dio.dll"

		# Firewall Configuration
		if (!(Get-NetFirewallRule | where {$_.Name -eq "TCP8080"})) {
			New-NetFirewallRule -Name "TCP8080" -DisplayName "HTTP on TCP/8080" -Protocol tcp -LocalPort 8080 -Action Allow -Enabled True
		}
		startPHP
		
	}else{
		# COM Port Configure
		$config_inc = "$PSScriptRoot\Web\config.inc.php"
		$comPort = findPort
		(Get-Content $config_inc).replace("deviceSet(""/dev/cu.usbserial"")", "deviceSet(""$comPort"")") | Set-Content $config_inc
		Write-Host "===================================="  -ForegroundColor Green 
		Write-Host "COM port '$comPort' set in config.inc.php"  -ForegroundColor Green
		Write-Host "===================================="  -ForegroundColor Green
		
		# Open Internet Explorer
		$ie = New-Object -com InternetExplorer.Application;
		$ie.visible = $true;
		$ie.navigate("http://127.0.0.1:8080/$page");
		
		# Start PHP Webserver
		
		$scriptPath = Split-Path -Parent $PSCommandPath
		Start-Process -FilePath "$env:programfiles\PHP\php.exe" -ArgumentList "-S 127.0.0.1:8080 -t ""$scriptPath\Web\""" -Wait
	}
}

function sendCommand($cmd) {
	$comPort = findPort
	$port= new-Object System.IO.Ports.SerialPort $comPort,115200,None,8,two
	$port.open()
	$port.Write("$cmd `r")
	start-sleep -s 1
	$read = $port.ReadExisting()
	if($read -ne "")
	{
		Write-Host "$read"  -ForegroundColor Red
	}else{
		Write-Host "$cmd Failed"  -ForegroundColor Red
	}
	$port.Close()
}

function sendDownload {
	$comPort = findPort
	$port= new-Object System.IO.Ports.SerialPort $comPort,115200,None,8,two
	$port.open()
	$port.Write("all `r")
	start-sleep -s 1
	$read = $port.ReadExisting()
	if($read -ne "")
	{
		Write-Host "$read"  -ForegroundColor Red
	}else{
		Write-Host "Download Failed"  -ForegroundColor Red
	}
	$port.Close()
}
		
function findPort {
	DO
	{
		$portArray = ([System.IO.Ports.SerialPort]::GetPortNames() | select -first 1)
		ForEach ($item in $portArray)
		{
			return $item
		}
		Write-Host "... Waiting for RS232-USB"
		Start-Sleep -s 4
	} While ($True)
}

function startInkscape {

}

function Uninstall {
	Remove-NetFirewallRule -Name "TCP8080" -ErrorAction SilentlyContinue
	Remove-Item -Recurse -Force "$env:programfiles\PHP"
}

switch ($result.character)
{
    1 {
		sendCommand "start"
	} 2 {
		sendCommand "stop"
	} 4 {
		sendDownload
	} 5 {
		startPHP "index.html"
	} 6 {
		startPHP "wiring.html"
	} 8 {
		Uninstall
	}
}