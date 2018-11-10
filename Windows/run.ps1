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
	
	$firefox = "$env:programfiles\Mozilla Firefox\firefox.exe"
    $edge = "$env:windir\SystemApps\Microsoft.MicrosoftEdge_8wekyb3d8bbwe\MicrosoftEdge.exe"

	If (Test-Path $firefox){
        # Open FireFox
		$app = Get-Process firefox -ErrorAction SilentlyContinue
		if (!$app) {
			Start-Process $firefox $url
		}
    }ElseIf (Test-Path $edge){
        # Open Edge
        $app = Get-Process MicrosoftEdge -ErrorAction SilentlyContinue
        if (!$app) {
            Start-Process $edge $url
        }
	}Else{
		# Open Internet Explorer
		$app = Get-Process iexplore -ErrorAction SilentlyContinue
		if (!$app) {
			$ie = New-Object -com InternetExplorer.Application;
			$ie.visible = $true;
			$ie.navigate($url);
		}
	}
}

function startPHP($page) {

	if (-Not (Test-Path "$env:programfiles\PHP\php.exe")) {

		Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File ""$PSScriptRoot\php.ps1""" -Wait
		startPHP
		
	}else{

        $scriptPath = Split-Path $PSScriptRoot -Parent

		# COM Port Configure

		$comPort = findPort

		if ($comPort)
		{
			$serial_json = "$scriptPath\Web\js\serial.json"
			$json = Get-Content "$serial_json" -Raw | ConvertFrom-Json
			$json.serial.port = $comPort + ":"
			$json.serial.web = 8081
			$json | ConvertTo-Json  | Set-Content "$serial_json"

			Write-Host "===================================="  -ForegroundColor Green
			Write-Host "COM port '$comPort' set in serial.json"  -ForegroundColor Green
			Write-Host "===================================="  -ForegroundColor Green
			
			#================================================
			#Quick Fix [give it a kick] - Prolific Driver Bug or Windows?
			#================================================
			$process = Start-Process -FilePath "$PSScriptRoot\puttytel.exe" -ArgumentList "-serial $($comPort) -sercfg 115200,8,n,2,N" -PassThru -WindowStyle Hidden
			try{
				$process | Wait-Process -Timeout 5 -ErrorAction Stop
			}catch{
				$process | Stop-Process -Force
			}
			#Somehow Putty fix sets maximum buffer size
			#================================================
			#Start-Process -FilePath "cmd.exe" -ArgumentList "/c mode $($comPort): BAUD=115200 PARITY=n DATA=8 STOP=2" -NoNewWindow -Wait
			Start-Process -FilePath "cmd.exe" -ArgumentList "/c mode $($comPort):/status" -NoNewWindow -Wait
		}

        # Start PHP Webserver
        Start-Process -FilePath "taskkill.exe" -ArgumentList "/F /IM php.exe /T" -NoNewWindow -Wait
        Start-Process -FilePath "$env:programfiles\PHP\php.exe" -ArgumentList "-S 0.0.0.0:8080 -t ""$scriptPath\\Web""" -NoNewWindow
        Start-Process -FilePath "$env:programfiles\PHP\php.exe" -ArgumentList "-S 0.0.0.0:8081 -t ""$scriptPath\\Web""" -NoNewWindow
		
		Start-Sleep -s 2
		
		# Open Web Browser
		openBrowser "http://127.0.0.1:8080/$page"
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
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "USB"}
	if ($Driver)
	{
		Write-Host "`nThere are still Errors with USB driver ...Check Manually`n" -ForegroundColor Red
		devmgmt.msc
	}
}

function checkProlificDriver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "Prolific"}
	if ($Driver)
	{
		if ([System.Diagnostics.FileVersionInfo]::GetVersionInfo("C:\Windows\System32\drivers\ser2pl64.sys").FileVersion -ne "3.3.2.102")
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
			pnputil -a "$($PSScriptRoot)\driver\ProlificUsbSerial\ser2pl.inf"
			InfDefaultInstall "$($PSScriptRoot)\driver\ProlificUsbSerial\ser2pl.inf"
		}
	}
}

function checkCP2102Driver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "CP210"}
	if ($Driver)
	{
		Elevate
		Write-Host "...Installing Driver"
		pnputil -a "$($PSScriptRoot)\driver\CP210x\silabser.inf"
		InfDefaultInstall "$($PSScriptRoot)\driver\CP210x\silabser.inf"
	}
}

function checkFTDIDriver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "FTDI"}
	if ($Driver)
	{
		Elevate
		Write-Host "...Installing Driver"
		pnputil -a "$($PSScriptRoot)\driver\FTDIUsbSerial\ftdibus.inf"
		InfDefaultInstall "$($PSScriptRoot)\driver\FTDIUsbSerial\ftdibus.inf"
		pnputil -a "$($PSScriptRoot)\driver\FTDIUsbSerial\ftdiport.inf"
		InfDefaultInstall "$($PSScriptRoot)\driver\FTDIUsbSerial\ftdiport.inf"
	}
}

function checkOlimexDriver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "Olimex" }
	if ($Driver)
	{
		Elevate
		Write-Host "...Installing Driver"
		pnputil -a "$($PSScriptRoot)\driver\WinUSB\Olimex_OpenOCD_JTAG_ARM-USB-OCD-H_(Interface_0).inf"
		InfDefaultInstall "$($PSScriptRoot)\driver\WinUSB\Olimex_OpenOCD_JTAG_ARM-USB-OCD-H_(Interface_0).inf"
		pnputil -a "$($PSScriptRoot)\driver\WinUSB\Olimex_OpenOCD_JTAG_ARM-USB-OCD-H_(Interface_1).inf"
		InfDefaultInstall "$($PSScriptRoot)\driver\WinUSB\Olimex_OpenOCD_JTAG_ARM-USB-OCD-H_(Interface_1).inf"
	}
}

function checkSTLinkDriver {
    
    $Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "STLink"}
    if ($Driver)
    {
        Elevate
        Write-Host "...Installing Driver"
        pnputil -a "$($PSScriptRoot)\driver\WinUSB\STM32_STLink.inf"
        InfDefaultInstall "$($PSScriptRoot)\driver\WinUSB\STM32_STLink.inf"
    }
}

function checkDrivers {

    checkProlificDriver
    checkCP2102Driver
    checkFTDIDriver
	checkOlimexDriver
    checkSTLinkDriver
}

startPHP "index.php"