@ECHO OFF

IF NOT EXIST %SYSTEMROOT%\System32\WindowsPowerShell\v1.0\powershell.exe (
    ECHO PowerShell is required for this script but is not installed on your machine.
    PAUSE
) ELSE (
    goto Run
)

:Run
powershell.exe -ExecutionPolicy Bypass -Command "exit $PSVersionTable.PSVersion.Major"
SET PSVer=%errorlevel%
ECHO PowerShell Version %PSVer%

IF %PSVer% geq 5 (
    powershell.exe -ExecutionPolicy Bypass -File .\Windows\run.ps1
) ELSE (
    ECHO Download and Install PowerShell 5.1
    PAUSE
    START iexplore http://aka.ms/wmf5download
)