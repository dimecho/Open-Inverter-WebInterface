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

#if($args[0] -eq "uninstall") {
#}else{
    checkDrivers
#}

function checkProlificDriver {
	
	$Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ ($_.Status -match "Error" -or $_.Name -match "CONTACT YOUR SUPPLIER") -and ($_.Name -match "Prolific" -or $_.Name -match "PL2303" -or $_.Name -match "USB-Serial") }
	if ($Driver)
	{
		if ([System.Diagnostics.FileVersionInfo]::GetVersionInfo("C:\Windows\System32\driver\ser2pl64.sys").FileVersion -ne "3.3.2.102")
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

function checkCH341Driver {
    
    $Driver = Get-WmiObject Win32_PNPEntity | Where-Object{ $_.Status -match "Error" -and $_.Name -match "USB2.0-Serial"}
    if ($Driver)
    {
        Elevate
        Write-Host "...Installing Driver"
        pnputil -a "$($PSScriptRoot)\driver\CH341\CH341SER.INF"
        InfDefaultInstall "$($PSScriptRoot)\driver\CH341\CH341SER.INF"
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
    checkCH341Driver
    checkCP2102Driver
    checkLibUSBDriver
    checkCANtactDriver
}