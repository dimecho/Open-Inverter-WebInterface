$shell = new-object -com Shell.Application

Set-Location "$env:USERPROFILE\Documents\"
if (-Not (Test-Path tumanako-inverter-fw-motorControl-master)){
	$zip = $shell.NameSpace("$env:USERPROFILE\Downloads\tumanako-inverter-fw-motorControl-master.zip")
	foreach($item in $zip.items())
	{
		$shell.Namespace("$env:USERPROFILE\Documents\").copyhere($item)
	}
}else{

    $env:Path += ";C:\mingw\bin"
    #$env:Path += ";C:\mingw\libexec\gcc\mingw32\4.3.3"
    $GCC_ARM = "C:\Program Files (x86)\GNU Tools ARM Embedded\5.4 2016q3"
    $env:Path += ";" + $GCC_ARM + "\bin"

    #--------- LIBOPENCM3 ------------
    Set-Location "$env:USERPROFILE\Documents\tumanako-inverter-fw-motorControl-master"
    if (-Not (Test-Path libopencm3)) {
        if (-Not (Test-Path "$env:USERPROFILE\Downloads\libopencm3-master.zip")) {
            Invoke-WebRequest -Uri "https://github.com/libopencm3/libopencm3/archive/master.zip" -OutFile "$env:USERPROFILE\Downloads\libopencm3-master.zip"
        }
        $zip = $shell.NameSpace("$env:USERPROFILE\Downloads\libopencm3-master.zip")
        foreach($item in $zip.items())
        {
            $shell.Namespace("$env:USERPROFILE\Documents\tumanako-inverter-fw-motorControl-master\").copyhere($item)
        }
    }

    if (-Not (Test-Path libopencm3\li\libopencm3_stm32f1.a)) {
        Set-Location libopencm3
        Start-Process "mingw32-make" -ArgumentList "TARGETS=stm32/f1" -Wait

        #Overwrite existing with new version
        Copy-Item lib "$GCC_ARM\arm-none-eabi\lib\" -Recurse
        Copy-Item include "$GCC_ARM\arm-none-eabi\include\" -Recurse
    }
    #--------- BOOTLOADER ------------

}