$AllProtocols = [System.Net.SecurityProtocolType]'Ssl3,Tls,Tls11,Tls12'
[System.Net.ServicePointManager]::SecurityProtocol = $AllProtocols

if (-Not (Test-Path "$PSScriptRoot\tools\esptool.exe")) {
  Write-Host "Downloading ESPTool" -ForegroundColor Green
  New-Item -ItemType directory -Path .\tools -ErrorAction SilentlyContinue
  Invoke-WebRequest -Uri "https://dl.espressif.com/dl/esptool-4dab24e-windows.zip" -OutFile "$PSScriptRoot\tools\esptool-4dab24e-windows.zip" -Debug
  $shell = new-object -com Shell.Application
  $zip = $shell.NameSpace("$PSScriptRoot\tools\esptool-4dab24e-windows.zip")
  foreach($item in $zip.items())
  {
    $shell.Namespace("$PSScriptRoot\tools\").copyhere($item)
  }
}

$portArray = ([System.IO.Ports.SerialPort]::GetPortNames() | select -first 1)
$binArray = Get-ChildItem "$PSScriptRoot" -Filter *sketch*.bin

if($binArray.Count -gt 0)
{
    Write-Host "`nBinary detected`n" -ForegroundColor Yellow
    for ($i=1; $i -le $binArray.Count; $i++) {
        Write-Host "$($i)) $($binArray[$i-1])" -ForegroundColor Green
    }
}else{
    Write-Host "`nNo Binary detected - You need to build from source`n" -ForegroundColor Yellow
    return
}

$binSelect = Read-Host -Prompt "`nSelect file to flash (Example: 1)"
if($binSelect -le $binArray.Count)
{
    $binFile = $($binArray[$binSelect-1])
    write-Host $binFile
    if($portArray.Count -gt 0)
    {
        ForEach ($comPort in $portArray)
        {
            Start-Process -FilePath "$PSScriptRoot\tools\esptool.exe" -ArgumentList "--port $($comPort) --baud 115200 write_flash 0x000000 $($binFile)" -NoNewWindow -Wait
        }
    }else{
        Write-Host "`nRS232-TTL adapter NOT detected - FAILED`n" -ForegroundColor Red
    }
}else {
    Write-Host "`n$($binSelect) is not a valid value`n" -ForegroundColor Red
}