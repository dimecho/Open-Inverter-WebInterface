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

function openBrowser {

    $httpURL = "http://127.0.0.1:8080"
    $progID = (Get-ItemProperty HKCU:\Software\Microsoft\windows\Shell\Associations\UrlAssociations\http\UserChoice).Progid
    $httpKey = (Get-Item -Path Registry::HKLM\SOFTWARE\Classes\$progID\shell\open\command)
    
    if ($httpKey -ne $null)
    {
        $command = $httpKey.GetValue("", "iexplore.exe")
        $exeIndex = $command.ToLower().IndexOf(".exe")
        if ($exeIndex -gt -1)
        {
            $endOfCommand = $command.IndexOf('"', $exeIndex)
            $startOfCommand = $command.LastIndexOf('"', $exeIndex - 1)
            if ($startOfCommand -gt -1 -And $endOfCommand -gt -1)
            {
                $command = $command.Substring($startOfCommand + 1, $endOfCommand - 1)
                $browser = Get-Process | Where Path -eq $command
                if ($browser -eq $null) {
                    Start-Process $command $httpURL
                }
                return
            }
        }
    }

    $ie = New-Object -com InternetExplorer.Application
    $ie.visible = $true
    $ie.navigate($httpURL)
}

function startPHP {

    $hardwaretype = Get-WmiObject -Class Win32_ComputerSystem -Property PCSystemType
    $computer = "Laptop"

    if ($hardwaretype.PCSystemType -ne 2) {
        $computer = "Desktop"
    }

    if ((Get-WmiObject -Class Win32_ComputerSystem).PartOfDomain -eq $true) {
        
        Write-Host "Detected Domain Controller!" -ForegroundColor Red
        Write-Host "`nYou are using a WORK $($computer)." -ForegroundColor Yellow
        Write-Host "`nThis app may not work properly due to Group Policy restrictions." -ForegroundColor Yellow
        Write-Host "`nPlease use a PERSONAL $($computer).`n" -ForegroundColor Yellow
        
        Write-Host "Press any key to continue...";
        [void][System.Console]::ReadKey($true)
    }

	if (-Not (Test-Path "$env:programfiles\PHP\php.exe")) {

		Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File ""$PSScriptRoot\php.ps1""" -Wait
		startPHP
		
	}else{

        $scriptPath = Split-Path $PSScriptRoot -Parent

		# COM Port Configure

		$comPort = findPort

		if ($comPort)
		{
			[int]$comID = 1
			[int]::TryParse($comPort.Replace("COM",""),[ref]$comID)
			if ($comID -ge 10)
			{
				Write-Host "`nCOM10 and above do not work with Windows ...Change COM# Manually`n" -ForegroundColor Red
				devmgmt.msc
			}
			$serial_json = "$scriptPath\Web\js\serial.json"
			$json = Get-Content "$serial_json" -Raw | ConvertFrom-Json
			$json.serial.port = $comPort #+ ":"
			$json.serial.web = 8080
			$json.serial.speed = 115200
			$json | ConvertTo-Json  | Set-Content "$serial_json"

			Write-Host "===================================="  -ForegroundColor Green
			Write-Host "COM port '$comPort' set in serial.json"  -ForegroundColor Green
			Write-Host "===================================="  -ForegroundColor Green
			
			#================================================
			#Quick Fix [give it a kick] - Prolific Driver Bug or Windows?
			#================================================
            $timeouted = $null
			$process = Start-Process -FilePath "$PSScriptRoot\puttytel.exe" -ArgumentList "-serial $($comPort) -sercfg 115200,8,n,1,N" -PassThru -WindowStyle Hidden
			$process | Wait-Process -Timeout 4 -ErrorAction SilentlyContinue -ErrorVariable timeouted
			if ($timeouted) {
                Get-Process -Name putty -ErrorAction SilentlyContinue | Stop-Process
                Get-Process -Name puttytel -ErrorAction SilentlyContinue | Stop-Process
                Start-Sleep -s 2
            }
			
			#Somehow Putty fix sets maximum buffer size
			#================================================
			Start-Process -FilePath "cmd.exe" -ArgumentList "/c mode $($comPort):/status" -NoNewWindow -Wait
		}

        # Start PHP Webserver
        Get-Process -Name "php" -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Process -FilePath "$env:programfiles\PHP\php.exe" -ArgumentList "-S 127.0.0.1:8080 -t ""$scriptPath\\Web""" -NoNewWindow
		Start-Sleep -s 2
		
		# Open Web Browser
        openBrowser
	}
}

function findPort {

    Write-Host "`nUse RS232-TTL adapter, USB-RS232 is not enough`n" -ForegroundColor Yellow

	$timeout = 0
	DO
	{
		checkDrivers
		$portArray = ([System.IO.Ports.SerialPort]::GetPortNames() | Sort-Object ) #| Select -First 1)
		
        if($portArray.Count -gt 1)
        {
            Write-Host "`nMultiple COM detected`n" -ForegroundColor Yellow
            for ($i=0; $i -lt $portArray.Count; $i++) {
                $portName = (Get-WmiObject -query "SELECT * FROM Win32_PnPEntity" | Where {$_.Name -Match $portArray[$i]}).Name
                $portName = $portName -Replace "\($($portArray[$i])\)",""
                Write-Host "$($portArray[$i]) $portName" -ForegroundColor Green
            }
            $portCOM = Read-Host -Prompt "`nEnter COM (Example: COM2)"
            ForEach ($item in $portArray) {
                if($portCOM.ToUpper() -eq $item) {
                    return $item
                }
            }
            Write-Host "`n$($portCOM) is not a valid value`n" -ForegroundColor Red
        }else{
           	ForEach ($item in $portArray) {
                return $item
            }
        }

		Write-Host "... Waiting for USB-RS232-TTL"
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
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ ($_.Status -match "Error" -or $_.Name -match "CONTACT YOUR SUPPLIER") -and ($_.Name -match "Prolific" -or $_.Name -match "PL2303" -or $_.Name -match "USB-Serial") }
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

function checkLibUSBDriver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and ($_.Name -match "Olimex" -or $_.Name -match "STLink") }
	if ($Driver)
	{
		Write-Host "...Correcting Drivers"
		
		$zadig = "zadig-2.4.exe"
		if (-Not (Test-Path "$env:userprofile\Downloads\$zadig")) {
			Write-Host "Downloading Utility"  -ForegroundColor Green
			Write-Host "$env:userprofile\Downloads\$zadig"
			Invoke-WebRequest -Uri "https://zadig.akeo.ie/downloads/$zadig" -OutFile "$env:userprofile\Downloads\$zadig" -Debug
		}
		Write-Host "Recommended WinUSB - libusb drivers do not work well with Olimex"  -ForegroundColor Green
		Start-Process "$env:userprofile\Downloads\$zadig" /q:a -Wait
	}
}

function checkCANtactDriver {
    
    $Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "CANtact" }
    if ($Driver)
    {
        Elevate
        Write-Host "...Installing Driver"
        pnputil -a "$($PSScriptRoot)\driver\CANtact\cantact.inf"
        InfDefaultInstall "$($PSScriptRoot)\driver\CANtact\cantact.inf"
    }
}

function checkDrivers {

    checkProlificDriver
    checkCP2102Driver
    checkLibUSBDriver
    checkCANtactDriver
}

startPHP