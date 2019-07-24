$dfu = "C:\Program Files (x86)\STMicroelectronics\Software\DfuSe v3.0.6"

if($args[0] -eq "uninstall") {
    Start-Process "msiexec.exe" -ArgumentList "/x {61D44ABF-A11F-4FA4-98E6-C05BBBD0B52A}" -NoNewWindow -Wait
}else{
    if (-Not (Test-Path $dfu)){
		$dfu_install = "$env:userprofile\Downloads\DfuSe_Demo_V3.0.6_Setup.exe"
        if (-Not (Test-Path $dfu_install)){
		  Add-Type -AssemblyName System.IO.Compression.FileSystem
		  [System.IO.Compression.ZipFile]::ExtractToDirectory("$env:userprofile\Downloads\en.stsw-stm32080.zip", "$env:userprofile\Downloads")
        }
        Start-Process $dfu_install -Wait
	}else{
        powershell.exe -ExecutionPolicy Bypass -Command "Start-Process ""$dfu\Bin\DfuSeDemo.exe"" -ArgumentList ""-c -d --v --fn '$PSScriptRoot\..\Web\firmware\can\$($args[0]).dfu'"""
    }
}