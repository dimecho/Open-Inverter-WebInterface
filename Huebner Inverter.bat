@ECHO OFF

IF NOT EXIST %SYSTEMROOT%\System32\WindowsPowerShell\v1.0\powershell.exe (
    ECHO PowerShell is required for this script but is not installed on your machine.
    PAUSE
) ELSE (
    %SYSTEMROOT%\System32\WindowsPowerShell\v1.0\powershell.exe -ExecutionPolicy Bypass -File .\Windows\run.ps1
)