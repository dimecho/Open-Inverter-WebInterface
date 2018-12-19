$AllProtocols = [System.Net.SecurityProtocolType]'Ssl3,Tls,Tls11,Tls12'
[System.Net.ServicePointManager]::SecurityProtocol = $AllProtocols

if (-Not (Test-Path "$PSScriptRoot\tools\esptool.exe")) {
  Write-Host "Downloading ESPTool" -ForegroundColor Green
  Invoke-WebRequest -Uri "https://dl.espressif.com/dl/esptool-4dab24e-windows.zip" -OutFile "$PSScriptRoot\tools\esptool-4dab24e-windows.zip" -Debug
  $shell = new-object -com Shell.Application
  $zip = $shell.NameSpace("$PSScriptRoot\tools\esptool-4dab24e-windows.zip")
  foreach($item in $zip.items())
  {
    $shell.Namespace("$PSScriptRoot\tools\").copyhere($item)
  }
}

$portArray  = ([System.IO.Ports.SerialPort]::GetPortNames() | select -first 1)

ForEach ($comPort in $portArray)
{
  Start-Process -FilePath "$PSScriptRoot\tools\esptool.exe" -ArgumentList "--port $($comPort) --baud 115200 write_flash 0x000000 flash-sketch.bin" -NoNewWindow -Wait
}