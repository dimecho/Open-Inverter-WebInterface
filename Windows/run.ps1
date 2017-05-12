Write-Host "`nHuebner Inverter - Console Management`n"  -ForegroundColor Green

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

		Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File ""$PSScriptRoot\..\Windows\php.ps1""" -Wait
		startPHP
		
	}else{
		# COM Port Configure
		$config_inc = "$PSScriptRoot\..\Web\config.inc"
		$comPort = findPort
		if ($comPort)
		{
			Copy-Item "$config_inc" "$config_inc.php" -force
			(Get-Content $config_inc).replace("/dev/cu.usbserial", "$comPort") | Set-Content "$config_inc.php"
			Write-Host "===================================="  -ForegroundColor Green
			Write-Host "COM port '$comPort' set in config.inc.php"  -ForegroundColor Green
			Write-Host "===================================="  -ForegroundColor Green
		}
		
		# Open Web Browser
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

function checkProlificDriver {
	
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

function checkCP2102Driver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "CP2102"}
	if ($Driver)
	{
		Elevate
		Write-Host "...Installing Driver"
		pnputil -a ""$PSScriptRoot\..\Windows\driver\CP210x\slabvcp.inf""
		InfDefaultInstall ""$PSScriptRoot\..\Windows\driver\CP210x\slabvcp.inf""
	}
}

function checkFTDIDriver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "FTDI"}
	if ($Driver)
	{
		Elevate
		Write-Host "...Installing Driver"
		pnputil -a ""$PSScriptRoot\..\Windows\driver\FTDIUsbSerial\ftdiport.inf""
		InfDefaultInstall ""$PSScriptRoot\..\Windows\driver\FTDIUsbSerial\ftdiport.inf""
	}
}

function checkDrivers {

    checkProlificDriver
    checkCP2102Driver
    checkFTDIDriver
}

startPHP "index.php"