$currentVersion = 1.0
$currentBuild = 27
#=====================

Write-Host "`nHuebner Inverter - Console Management`n"  -ForegroundColor Green

function Elevate() {
	# Get the ID and security principal of the current user account
	$myWindowsID=[System.Security.Principal.WindowsIdentity]::GetCurrent()
	$myWindowsPrincipal = New-Object System.Security.Principal.WindowsPrincipal($myWindowsID)

	# Check to see if we are currently running "as Administrator"
	if (!$myWindowsPrincipal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)){
		$newProcess = New-Object System.Diagnostics.ProcessStartInfo "PowerShell"; # Create a new process object that starts PowerShell
		$newProcess.Arguments = "& '$PSCommandPath'" # Specify the current script path and name as a parameter
		$newProcess.Verb = "runas"; # Indicate that the process should be elevated
		[System.Diagnostics.Process]::Start($newProcess); # Start the new process
		exit # Exit from the current, unelevated, process
	}
}

function checkUpdates() {
	Try {
		$i = Get-Random -Minimum 1 -Maximum 3
		if($i -eq 1)
		{
			$data = New-Object System.Xml.XmlDocument
			$data.Load("http://github.com/poofik/huebner-inverter/raw/master/macOS/Info.plist")
			$plist = [xml]$data
			$plist.plist.dict |
			Foreach {
				$vals = $_.SelectNodes('string'); $_.SelectNodes('key') | 
				Foreach {$ht=@{};$i=0} {$ht[$_.'#text'] = $vals[$i++].'#text'} {
					$onlineVersion = (New-Object PSObject -Prop $ht | Select-Object -ExpandProperty CFBundleShortVersionString) -as [double]
					$onlineBuild = (New-Object PSObject -Prop $ht | Select-Object -ExpandProperty CFBundleVersion) -as [int]
				}
			}
			if($onlineVersion -eq $currentVersion -And $onlineBuild -eq $currentBuild){
				Write-Host "[Version:$onlineVersion Build:$onlineBuild]`n"
			}else{
				$title = "New Version:$onlineVersion  Build:$onlineBuild is Available"
				$message = "Go to GitHub to Download?"
				$yes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", ""
				$no = New-Object System.Management.Automation.Host.ChoiceDescription "&No", ""
				$options = [System.Management.Automation.Host.ChoiceDescription[]]($yes, $no)
				$result = $host.ui.PromptForChoice($title, $message, $options, 0) 
				switch ($result)
				{
					0 {openBrowser "https://github.com/poofik/Huebner-Inverter/releases"}
					#1 {}
				}
			}
		}
	}Catch{}
	startPHP "index.php"
}

function openBrowser($url) {
	$firefox = "C:\Program Files (x86)\Mozilla Firefox\firefox.exe"
	If (Test-Path $firefox){
		Start-Process $firefox $url
	}Else{
		# Open Internet Explorer
		$ie = New-Object -com InternetExplorer.Application;
		$ie.visible = $true;
		$ie.navigate($url);
	}
}

function startPHP($page) {
	if (-Not (Test-Path "$env:programfiles\PHP\php.exe")) {

		Elevate
	
		Write-Host "...Installing PHP"
		
		# Download PHP
		$phpFile = "php-5.6.27-Win32-VC11-x64.zip"
		if (-Not (Test-Path "$env:TEMP\$phpFile")) {
			Write-Host "Downloading PHP 5.6"  -ForegroundColor Green
			Invoke-WebRequest -Uri http://windows.php.net/downloads/releases/$phpFile -OutFile "$env:TEMP\$phpFile"
		}
		# Download Dio Extension
		#$phpDIO = "php_dio-0.0.7-5.6-ts-vc11-x64.zip"
		#if (-Not (Test-Path "$env:TEMP\$phpDIO")) {
		#	Invoke-WebRequest -Uri http://windows.php.net/downloads/pecl/releases/dio/0.0.7/$phpDIO -OutFile "$env:TEMP\$phpDIO"
		#}
		
		# Visual C++ Redistributable for Visual Studio 2012
		if (-Not (Test-Path 'HKLM:\SOFTWARE\Classes\Installer\Dependencies\{ca67548a-5ebe-413a-b50c-4b9ceb6d66c6}')) {
			Write-Host "Downloading C++ Redistributable for Visual Studio 2012"  -ForegroundColor Green
			Invoke-WebRequest -Uri https://download.microsoft.com/download/1/6/B/16B06F60-3B20-4FF2-B699-5E9B7962F9AE/VSU_4/vcredist_x64.exe -OutFile "$env:TEMP\vcredist_x64.exe"
			Start-Process "$env:TEMP\vcredist_x64.exe" /q:a -Wait
		}
	
		New-Item "$env:programfiles\PHP" -ItemType directory -ErrorAction SilentlyContinue

		$shell = new-object -com Shell.Application
		$zip = $shell.NameSpace("$env:TEMP\$phpFile")
		foreach($item in $zip.items())
		{
			$shell.Namespace("$env:programfiles\PHP\").copyhere($item)
		}
		#$zip = $shell.NameSpace("$env:TEMP\$phpDIO")
		#foreach($item in $zip.items())
		#{
		#	$shell.Namespace("$env:programfiles\PHP\ext").copyhere($item)
		#}
		Copy-Item "$PSScriptRoot\..\Windows\dio\php_dio.dll" "$env:programfiles\PHP\ext"
		
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
date.timezone=America/Los_Angeles
extension_dir = `'ext`'
extension=php_dio.dll
extension=php_curl.dll"

		# Firewall Configuration
		#if (!(Get-NetFirewallRule | where {$_.Name -eq "TCP8080"})) {
		#	New-NetFirewallRule -Name "TCP8080" -DisplayName "HTTP on TCP/8080" -Protocol tcp -LocalPort 8080 -Action Allow -Enabled True
		#}
		
		startPHP
		
	}else{
		# COM Port Configure
		$config_inc = "$PSScriptRoot\..\Web\config.inc"
		$comPort = findPort
		Copy-Item "$config_inc" "$config_inc.php" -force
		(Get-Content $config_inc).replace("deviceSet(""/dev/cu.usbserial"")", "deviceSet(""$comPort"")") | Set-Content "$config_inc.php"
		Write-Host "===================================="  -ForegroundColor Green
		Write-Host "COM port '$comPort' set in config.inc.php"  -ForegroundColor Green
		Write-Host "===================================="  -ForegroundColor Green
		
		#================================================
		#Quick Fix [give it a kick] - Prolific Driver Bug or Windows?
		#================================================
		$process = Start-Process -FilePath "$PSScriptRoot\..\Windows\putty.exe" -ArgumentList "-serial $comPort" -PassThru -WindowStyle Hidden
		try{
			$process | Wait-Process -Timeout 4 -ErrorAction Stop
		}catch{
			$process | Stop-Process -Force
		}
		#Somehow Putty fix sets maximum buffer size
		#================================================
        #Start-Process -FilePath "cmd.exe" -ArgumentList "/c mode ${comPort}: BAUD=115200 PARITY=n DATA=8 STOP=2 to=off dtr=off rts=off" -Wait
		
		openBrowser "http://127.0.0.1:8080/$page"
		
		# Start PHP Webserver
		$scriptPath = Split-Path -Parent $PSCommandPath
		Start-Process -FilePath "$env:programfiles\PHP\php.exe" -ArgumentList "-S 127.0.0.1:8080 -t ""$scriptPath\..\Web\"""
	}
}

function findPort {
	$timeout = 0
	DO
	{
		checkDrivers
		$portArray = ([System.IO.Ports.SerialPort]::GetPortNames() | select -first 1)
		ForEach ($item in $portArray)
		{
			return $item
		}
		Write-Host "... Waiting for RS232-USB"

		Start-Sleep -s 4
		
		$timeout++
	} While ($timeout -le 4)
}

function checkDrivers {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "Prolific"}
	if ($Driver)
	{
		if ([System.Diagnostics.FileVersionInfo]::GetVersionInfo("C:\Windows\System32\drivers\ser2pl64.sys").FileVersion -ne "3.3.2.105")
		{
			Elevate
			$oeminflist = gci "$env:windir\inf\*.*" -Include oem*.inf;
			foreach ($inf in $oeminflist) {
				Select-String -path $inf.FullName -Pattern "Prolific" -List| foreach {
					$oeminfmatches += $_.filename;
					Write-Host "Found $infname in $_.path";
					pnputil -f -d $_.filename
				}
			}
			Write-Host "...Installing Driver"
			pnputil -a ""$PSScriptRoot\..\Windows\driver\ProlificUsbSerial\ser2pl.inf""
			InfDefaultInstall ""$PSScriptRoot\..\Windows\driver\ProlificUsbSerial\ser2pl.inf""
		}
	}
}

function Uninstall {

	Elevate
	#Remove-NetFirewallRule -Name "TCP8080" -ErrorAction SilentlyContinue
	Remove-Item -Recurse -Force "$env:programfiles\PHP"
}

checkUpdates
#startPHP "serial.php?json=1"
