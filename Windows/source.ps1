$shell = new-object -com Shell.Application

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
    Remove-Item -Recurse -Force "$env:USERPROFILE\Documents\stm32-sine-master"
}else{
    $console=$args[0]
    
    Set-Location "$env:USERPROFILE\Documents\"
    if (-Not (Test-Path stm32-sine-master)) {
        Write-Host "UnZipping Source Code" -ForegroundColor Yellow
    	$zip = $shell.NameSpace("$env:USERPROFILE\Downloads\stm32-sine-master.zip")
    	foreach($item in $zip.items())
    	{
    		$shell.Namespace("$env:USERPROFILE\Documents\").copyhere($item)
    	}
    }else{
        if ($console -eq 1)
        {
			$GCC_WIN = "C:\SysGCC\MinGW32"
			$GCC_ARM = "C:\SysGCC\ARM"
			$MSYS = "C:\msys64\usr"

            $env:Path += ";$GCC_WIN\bin"
            $env:Path += ";$GCC_ARM\bin"
			$env:Path += ";$MSYS\bin"
			
    		#--------- MSYS Fix --------------
			Rename-Item "$GCC_WIN\bin\mingw32-make.exe" "$GCC_WIN\bin\make.exe" -ErrorAction SilentlyContinue
    		Rename-Item "$MSYS\bin\find.exe" "$MSYS\bin\sfind.exe" -ErrorAction SilentlyContinue
    		Copy-Item "$MSYS\bin\sh.exe" "$MSYS\bin\shell.exe" -ErrorAction SilentlyContinue
			
            #--------- LIBOPENCM3 ------------
            Set-Location "$env:USERPROFILE\Documents\stm32-sine-master"
            if (-Not (Test-Path "libopencm3\*")) {
                if (-Not (Test-Path "$env:USERPROFILE\Downloads\libopencm3-master.zip")) {
                    Write-Host "Downloading Libopencm3" -ForegroundColor Green
					[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
					Invoke-WebRequest -Uri "https://github.com/jsphuebner/libopencm3/archive/master.zip" -OutFile "$env:USERPROFILE\Downloads\libopencm3-master.zip"
                    #Invoke-WebRequest -Uri "https://github.com/libopencm3/libopencm3/archive/master.zip" -OutFile "$env:USERPROFILE\Downloads\libopencm3-master.zip"
                }
                Write-Host "UnZipping Libopencm3" -ForegroundColor Yellow
                $zip = $shell.NameSpace("$env:USERPROFILE\Downloads\libopencm3-master.zip")
                foreach($item in $zip.items())
                {
                    $shell.Namespace("$env:USERPROFILE\Documents\stm32-sine-master\").copyhere($item)
                }
                Remove-Item libopencm3 -ErrorAction SilentlyContinue
                Rename-Item libopencm3-master libopencm3 -ErrorAction SilentlyContinue
            }
			Set-Location libopencm3
            if (-Not (Test-Path lib\libopencm3_stm32f1.a)) {
                Write-Host "Building libopencm3" -ForegroundColor Green
				Elevate
                $env:Path += ";$env:USERPROFILE\AppData\Local\Programs\Python\Python38\"
                $env:Path += ";$env:USERPROFILE\AppData\Local\Programs\Python\Python38\Scripts\"
    			
    			make.exe clean
                make.exe TARGETS=stm32/f1
				
				Write-Host "Updating libopencm3" -ForegroundColor Green
				
				#Overwrite existing with new version
				Copy-Item lib "$GCC_ARM\arm-none-eabi\" -Recurse -Force
				Copy-Item include "$GCC_ARM\arm-none-eabi\" -Recurse -Force
				#A Fix
				Copy-Item "$GCC_ARM\arm-none-eabi\lib\cortex-m-generic.ld" "$GCC_ARM\arm-none-eabi\lib\libopencm3_stm32f1.ld" -Force
            }
            #--------- LIBOPENINV ------------
            Set-Location "$env:USERPROFILE\Documents\stm32-sine-master"
            if (-Not (Test-Path "libopeninv\*")) {
                if (-Not (Test-Path "$env:USERPROFILE\Downloads\libopeninv-master.zip")) {
                    Write-Host "Downloading libopeninv" -ForegroundColor Green
                    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
                    Invoke-WebRequest -Uri "https://github.com/jsphuebner/libopeninv/archive/master.zip" -OutFile "$env:USERPROFILE\Downloads\libopeninv-master.zip"
                }
                Write-Host "UnZipping libopeninv" -ForegroundColor Yellow
                $zip = $shell.NameSpace("$env:USERPROFILE\Downloads\libopeninv-master.zip")
                foreach($item in $zip.items())
                {
                    $shell.Namespace("$env:USERPROFILE\Documents\stm32-sine-master\").copyhere($item)
                }
                Remove-Item libopeninv -ErrorAction SilentlyContinue
                Rename-Item libopeninv-master libopeninv -ErrorAction SilentlyContinue
            }
            #--------- BOOTLOADER ------------
            Set-Location "$env:USERPROFILE\Documents\stm32-sine-master\src"
            if (-Not (Test-Path bootloader)) {
				if (-Not (Test-Path "$env:USERPROFILE\Downloads\tumanako-inverter-fw-bootloader-master.zip")) {
                    Write-Host "Downloading tumanako-inverter-fw-bootloader" -ForegroundColor Green
					[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
					Invoke-WebRequest -Uri "https://github.com/jsphuebner/tumanako-inverter-fw-bootloader/archive/master.zip" -OutFile "$env:USERPROFILE\Downloads\tumanako-inverter-fw-bootloader-master.zip"
                }
                Write-Host "UnZipping tumanako-inverter-fw-bootloader" -ForegroundColor Yellow
                $zip = $shell.NameSpace("$env:USERPROFILE\Downloads\tumanako-inverter-fw-bootloader-master.zip")
                foreach($item in $zip.items())
                {
                    $shell.Namespace("$env:USERPROFILE\Documents\stm32-sine-master\src\").copyhere($item)
                }
                Rename-Item tumanako-inverter-fw-bootloader-master bootloader
            }
			Set-Location bootloader
            make.exe clean
            make.exe
			Set-Location bootupdater
			make.exe clean
            make.exe
            #--------- FIRMWARE --------------
            Set-Location "$env:USERPROFILE\Documents\stm32-sine-master"
            make.exe clean
            make.exe
            make.exe CONTROL=FOC
            #--------- ATtiny13 --------------
			$GCC_AVR = "C:\SysGCC\avr"
			$env:Path += ";$GCC_AVR\bin"
			
            Set-Location "$env:USERPROFILE\Documents\stm32-sine-master\src"
            if (-Not (Test-Path attiny13)) {
                Copy-Item -Path  "$(Split-Path $PSScriptRoot -Parent)\Web\pcb\Hardware v1.0\firmware\attiny13" -Destination "$env:USERPROFILE\Documents\stm32-sine-master\src\" -Recurse
            }
            avr-gcc.exe -g -mmcu=attiny13 -Os -Os -o volt-pwm-attiny13.o volt-pwm-attiny13.c -DF_CPU=96000000
            avr-objcopy.exe -R .eeprom -O binary volt-pwm-attiny13.o volt-pwm-attiny13.bin
            avr-objcopy.exe -R .eeprom -O ihex volt-pwm-attiny13.o volt-pwm-attiny13.hex
            Move-Item volt-pwm-attiny13.bin (Split-Path (Get-Location) -Parent) -ErrorAction SilentlyContinue
            Move-Item volt-pwm-attiny13.hex (Split-Path (Get-Location) -Parent) -ErrorAction SilentlyContinue
            #---------------------------------

            Start-Process "explorer.exe" -ArgumentList "$env:USERPROFILE\Documents\stm32-sine-master\"

        }else{
            Start-Process -FilePath "cmd.exe" -ArgumentList "/k ""powershell.exe -ExecutionPolicy Bypass -File ""$PSCommandPath"" 1"" 2>&1"
        }
    }
}