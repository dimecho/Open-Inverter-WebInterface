
start /wait msiexec.exe /i %USERPROFILE%\Downloads\inkscape-0.91-x64.msi

cd .\encoder\extensions
copy *.* "C:\Program Files\Inkscape\share\extensions"