$esptool = "$env:userprofile\Downloads\esptool.exe"

if($args[0] -eq "uninstall") {
    Remove-Item -Recurse -Force $esptool
}else{
    if (-Not (Test-Path $esptool)) {
		Add-Type -AssemblyName System.IO.Compression.FileSystem
		[System.IO.Compression.ZipFile]::ExtractToDirectory("$env:userprofile\Downloads\esptool-4dab24e-windows.zip", "$env:userprofile\Downloads")
	}else{

        $FILE = $($args[0]).Replace("\","\\")
        $ADDRESS="0x000000"

        if ($args[2] -eq 'littlefs') { $ADDRESS="0x100000" }
        if ($args[0] -like '*.hex') { $ADDRESS="" }

        Start-Process $esptool -ArgumentList "--chip esp8266 --port $($args[1]) --baud 115200 write_flash $($ADDRESS) ""$($FILE)""" -NoNewWindow -Wait
    }
}