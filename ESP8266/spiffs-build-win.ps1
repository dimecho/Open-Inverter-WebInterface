#==============
#Copy Files
#==============
Remove-Item -Recurse -Force .\spiffs -ErrorAction SilentlyContinue
New-Item -ItemType directory -Path .\spiffs\css
New-Item -ItemType directory -Path .\spiffs\js
New-Item -ItemType directory -Path .\spiffs\img
New-Item -ItemType directory -Path .\spiffs\font
New-Item -ItemType directory -Path .\spiffs\pcb
New-Item -ItemType directory -Path .\spiffs\pcb\v1.0
New-Item -ItemType directory -Path .\spiffs\pcb\v3.0

$phpfiles = 'index.php', 'header.php', 'footer.php', 'esp8266.php', 'can.php', 'graph.php', 'bootloader.php', 'firmware.php', 'simple.php', 'test.php', 'version.txt', 'description.csv'
foreach ($file in $phpfiles) {
  Copy-Item "..\Web\$file" -Destination .\spiffs
}

$cssfiles = 'mobile.css', 'animate.css', 'bootstrap.css', 'bootstrap.slate.css', 'ion.rangeSlider.css', 'icons.css', 'style.css'
foreach ($file in $cssfiles) {
  Copy-Item "..\Web\css\$file" -Destination .\spiffs\css
}

$jsfiles = 'esp8266.js', 'jquery.js', 'jquery.knob.js', 'potentiometer.js', 'bootstrap.js', 'ion.rangeSlider.js', 'bootstrap-notify.js', 'firmware.js', 'can.js', 'graph.js', 'jscolor.js', 'index.js', 'menu.js', 'simple.js', 'chart.js', 'chartjs-plugin-annotation.js', 'chartjs-plugin-datalabels.js', 'test.js', 'mobile.js'
foreach ($file in $jsfiles) {
  Copy-Item "..\Web\js\$file" -Destination .\spiffs\js
}

$imgfiles = 'background.png'
foreach ($file in $imgfiles) {
  Copy-Item "..\Web\img\$file" -Destination .\spiffs\img
}

Copy-Item "..\Web\js\menu-esp8266.json" -Destination .\spiffs\js\menu.json
Copy-Item "..\Web\pcb\Hardware v1.0\diagrams\test.png" -Destination .\spiffs\pcb\v1.0
Copy-Item "..\Web\pcb\Hardware v1.0\diagrams\esp8266.png" -Destination .\spiffs\pcb\v1.0
Copy-Item "..\Web\pcb\Hardware v3.0\diagrams\test.png" -Destination .\spiffs\pcb\v3.0
Copy-Item "..\Web\pcb\Hardware v3.0\diagrams\esp8266.png" -Destination .\spiffs\pcb\v3.0
Copy-Item ..\Web\font\icons.ttf -Destination .\spiffs\font
#Copy-Item ..\Web\font\icons.woff2 -Destination .\spiffs\font
#Copy-Item ..\Web\font\icons.woff -Destination .\spiffs\font

#======================
#Correct long filenames
#======================
Get-ChildItem .\spiffs -Recurse -Filter *.* | 
Foreach-Object {
	if (-Not (Test-Path $_.FullName -PathType Container)) {
		if($_.Name.length -gt 12){
			$i = "";
			Do {
				$longName = $_.Name
				$shortName = "$($_.BaseName.Substring(0,8))$($i)$($_.Extension)"
				$shortPath = "$(Split-Path -Path $_.FullName)\$($shortName)"
				Write-Host $shortPath
				$i = [int]$i+1
			} while(Test-Path $shortPath)

			Move-Item $_.FullName -Destination $shortPath

			Get-ChildItem .\spiffs -Recurse -Include *.php,*.css,*.js,*.json | 
			Foreach-Object {
				if (-Not (Test-Path $_.FullName -PathType Container)) {
					(Get-Content $_.FullName).Replace($longName, $shortName) | Set-Content $_.FullName
				}
			}
		}
	}
}
Get-ChildItem .\spiffs -Recurse -Filter *.php | 
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

if (-Not (Test-Path .\tools\yuicompressor-2.4.8.jar)) {
	Invoke-WebRequest -OutFile .\tools\yuicompressor-2.4.8.zip -Uri "https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.zip"
}

if (-Not (Test-Path .\tools\closure-compiler-v20190929.jar)) {
	Invoke-WebRequest -OutFile .\tools\compiler-20190929.zip -Uri "https://dl.google.com/closure-compiler/compiler-20190929.zip"
}

if (-Not (Test-Path .\tools\mkspiffs.exe)) {
	Invoke-WebRequest -OutFile .\tools\mkspiffs-0.2.3-arduino-esp8266-win32.zip -Uri "https://github.com/igrr/mkspiffs/releases/download/0.2.3/mkspiffs-0.2.3-arduino-esp8266-win32.zip"
}

if (-Not (Test-Path .\tools\bin\gzip.exe)) {
	Invoke-WebRequest -OutFile .\tools\gzip-1.3.12-1-bin.zip -Uri "http://sourceforge.mirrorservice.org/g/gn/gnuwin32/gzip/1.3.12-1/gzip-1.3.12-1-bin.zip"
}

Get-ChildItem .\tools -Filter *.zip | 
Foreach-Object {
    Expand-Archive -Path $_.FullName -DestinationPath .\tools -Force
    Remove-Item $_.FullName -ErrorAction SilentlyContinue
}
Move-Item .\tools\mkspiffs-0.2.3-arduino-esp8266-win32\mkspiffs.exe -Destination .\tools -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .\tools\mkspiffs-0.2.3-arduino-esp8266-win32 -ErrorAction SilentlyContinue

#==============
#Compress Files
#==============

Get-ChildItem .\spiffs\css -Filter *.css | 
Foreach-Object {
    Write-Host $_.FullName
    Start-Process java -ArgumentList "-jar ""$PSScriptRoot\tools\yuicompressor-2.4.8.jar"" --type css -o .\spiffs\css\$($_.Name) .\spiffs\css\$($_.Name)" -NoNewWindow -Wait
}

Get-ChildItem .\spiffs\js -Filter *.js | 
Foreach-Object {
    Write-Host $_.FullName
    Start-Process java -ArgumentList "-jar ""$PSScriptRoot\tools\closure-compiler-v20190929.jar"" --js_output_file .\spiffs\js\$($_.Name) --js .\spiffs\js\$($_.Name)" -NoNewWindow -Wait
}

Get-ChildItem .\spiffs -Recurse -Exclude *.php -Filter *.* | 
Foreach-Object {
    if (-Not (Test-Path $_.FullName -PathType Container)) {
        Start-Process .\tools\bin\gzip.exe -ArgumentList $_.FullName -NoNewWindow -Wait
        Move-Item "$($_.FullName).gz" -Destination $_.FullName
    }
}

#================
#Find Folder Size
#================
#Start-Process .\tools\mkspiffs.exe -ArgumentList "-c .\spiffs -b 8192 -p 256 -s 643072 flash-spiffs.bin" -NoNewWindow -PassThru -Wait
Start-Process .\tools\mkspiffs.exe -ArgumentList "-c .\spiffs -b 8192 -p 256 -s 600000 flash-spiffs.bin" -NoNewWindow -PassThru -Wait