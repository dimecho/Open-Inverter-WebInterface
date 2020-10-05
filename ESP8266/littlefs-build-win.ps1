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

cd $PSScriptRoot
#==============
#Copy Files
#==============
Remove-Item -Recurse -Force .\data -ErrorAction SilentlyContinue
New-Item -ItemType directory -Path .\data\css
New-Item -ItemType directory -Path .\data\js
New-Item -ItemType directory -Path .\data\img
New-Item -ItemType directory -Path .\data\font
New-Item -ItemType directory -Path .\data\pcb
New-Item -ItemType directory -Path .\data\pcb\v1.0
New-Item -ItemType directory -Path .\data\pcb\v3.0

$phpfiles = 'index.php', 'header.php', 'footer.php', 'esp8266.php', 'can.php', 'graph.php', 'bootloader.php', 'firmware.php', 'simple.php', 'test.php', 'version.txt', 'description.csv'
foreach ($file in $phpfiles) {
  Copy-Item "..\Web\$file" -Destination .\data
}

$cssfiles = 'mobile.css', 'animate.css', 'bootstrap.css', 'bootstrap.slate.css', 'ion.rangeSlider.css', 'icons.css', 'style.css'
foreach ($file in $cssfiles) {
  Copy-Item "..\Web\css\$file" -Destination .\data\css
}

$jsfiles = 'esp8266.js', 'jquery.core.js', 'jquery.knob.js', 'bootstrap.js', 'ion.rangeSlider.js', 'bootstrap-notify.js', 'firmware.js', 'can.js', 'graph.js', 'jscolor.js', 'index.js', 'menu.js', 'simple.js', 'chart.js', 'chartjs-plugin-annotation.js', 'chartjs-plugin-datalabels.js', 'test.js', 'mobile.js', 'language.js', 'test.json'
foreach ($file in $jsfiles) {
  Copy-Item "..\Web\js\$file" -Destination .\data\js
}

$imgfiles = 'background.png'
foreach ($file in $imgfiles) {
  Copy-Item "..\Web\img\$file" -Destination .\data\img
}

#Copy-Item .\server.key -Destination .\data
#Copy-Item .\server.cer -Destination .\data
Copy-Item "..\Web\js\menu-esp8266.json" -Destination .\data\js\menu.json
Copy-Item "..\Web\pcb\Hardware v1.0\diagrams\test.png" -Destination .\data\pcb\v1.0
Copy-Item "..\Web\pcb\Hardware v1.0\diagrams\esp8266.png" -Destination .\data\pcb\v1.0
Copy-Item "..\Web\pcb\Hardware v3.0\diagrams\test.png" -Destination .\data\pcb\v3.0
Copy-Item "..\Web\pcb\Hardware v3.0\diagrams\esp8266.png" -Destination .\data\pcb\v3.0
Copy-Item ..\Web\font\icons.woff2 -Destination .\data\font
#Copy-Item ..\Web\font\icons.woff -Destination .\data\font

#================
#Clean PHP
#================
Get-ChildItem .\data -Recurse -Filter *.php | 
Foreach-Object {
	if (-Not (Test-Path $_.FullName -PathType Container)) {
		$content = (Get-Content $_.FullName)
		$content = $content.Replace('pcb/Hardware v1.0/diagrams/', 'pcb/v1.0/')
		$content = $content.Replace('pcb/Hardware v3.0/diagrams/', 'pcb/v3.0/')

		For ($i=0; $i -le $($content | Measure-Object -Line | Select -ExpandProperty Lines); $i++) {
			$content = $content.Replace("  ", " ")
		}
		$content = $content.Replace(" <", "<").Replace("`t", "").Replace("`r", "").Replace("`n ", "`n") 
		$content | Set-Content $_.FullName
	}
}

#====================
#Download Compressors
#====================
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;

if(!(Test-Path .\tools -PathType Container)) { 
    New-Item -ItemType "directory" -Path .\tools
}

if (!(Test-Path .\tools\yuicompressor-2.4.8.jar)) {
	Invoke-WebRequest -OutFile .\tools\yuicompressor-2.4.8.zip -Uri "https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.zip"
}

if (!(Test-Path .\tools\closure-compiler-v20200224.jar)) {
	Invoke-WebRequest -OutFile .\tools\compiler-20200224.zip -Uri "https://dl.google.com/closure-compiler/compiler-20200224.zip"
}

if (!(Test-Path .\tools\mklittlefs.exe)) {
	Invoke-WebRequest -OutFile .\tools\x86_64-w64-mingw32-mklittlefs-295fe9b.zip -Uri "https://github.com/earlephilhower/mklittlefs/releases/download/3.0.0/x86_64-w64-mingw32-mklittlefs-295fe9b.zip"
}

if (!(Test-Path "C:\ProgramData\chocolatey\bin\gzip.exe")) {
	#Invoke-WebRequest -OutFile .\tools\gzip-1.3.12-1-bin.zip -Uri "http://sourceforge.mirrorservice.org/g/gn/gnuwin32/gzip/1.3.12-1/gzip-1.3.12-1-bin.zip"
  if(!(Test-Path "C:\ProgramData\chocolatey" -PathType Container)) {
    if (!(Test-Path .\tools\chocolatey.ps1)) {
      Invoke-WebRequest -OutFile .\tools\chocolatey.ps1 -Uri "https://chocolatey.org/install.ps1"
    }
    Elevate
    Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File ""$PSScriptRoot\tools\chocolatey.ps1""" -NoNewWindow -Wait
  }
  Start-Process powershell -ArgumentList "choco install gzip -y" -NoNewWindow -Wait
}

Get-ChildItem .\tools -Filter *.zip | 
Foreach-Object {
    Expand-Archive -Path $_.FullName -DestinationPath .\tools -Force
    Remove-Item $_.FullName -ErrorAction SilentlyContinue
}
Move-Item .\tools\mklittlefs\mklittlefs.exe -Destination .\tools -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\tools\mklittlefs-0.2.3-arduino-esp8266-win32 -ErrorAction SilentlyContinue

#==============
#Compress Files
#==============

Get-ChildItem .\data\css -Filter *.css | 
Foreach-Object {
    Write-Host $_.FullName
    Start-Process java -ArgumentList "-jar ""$PSScriptRoot\tools\yuicompressor-2.4.8.jar"" --type css -o ""$PSScriptRoot\data\css\$($_.Name)"" ""$PSScriptRoot\data\css\$($_.Name)""" -NoNewWindow -Wait
}

Get-ChildItem .\data\js -Filter *.js | 
Foreach-Object {
    Write-Host $_.FullName
    Start-Process java -ArgumentList "-jar ""$PSScriptRoot\tools\closure-compiler-v20190929.jar"" --js_output_file ""$PSScriptRoot\data\js\$($_.Name)"" --js ""$PSScriptRoot\data\js\$($_.Name)""" -NoNewWindow -Wait
}

Get-ChildItem .\data -Recurse -Exclude *.bin,*.php,*.key,*.cer -Filter *.* | 
Foreach-Object {
    if (-Not (Test-Path $_.FullName -PathType Container)) {
        Start-Process .\tools\bin\gzip.exe -ArgumentList $_.FullName -NoNewWindow -Wait
        Move-Item "$($_.FullName).gz" -Destination $_.FullName
    }
}

#================
#Find Folder Size
#================
#Start-Process .\tools\mklittlefs.exe -ArgumentList "-c .\data -b 8192 -p 256 -s 643072 flash-littlefs.bin" -NoNewWindow -PassThru -Wait
Start-Process .\tools\mklittlefs.exe -ArgumentList "-c .\data -b 8192 -p 256 -s 750000 flash-littlefs.bin" -NoNewWindow -PassThru -Wait