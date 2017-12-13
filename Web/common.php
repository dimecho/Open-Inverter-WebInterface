<?php
    $GLOBALS["OS"] = "linux";
    $GLOBALS["X11"] = "/Applications/Utilities/XQuartz.app/Contents/MacOS/X11";
    $GLOBALS["Software"] = array (
        'xquartz' => array (
            'title' => "XQuartz - Window X System",
            'download' => array (
                'mac' => "https://dl.bintray.com/xquartz/downloads/XQuartz-2.7.11.dmg",
                'windows' => "",
                'linux' => "",
                'size' => 75,
                'version' => "2.7.11"
            ),
            'path' => array (
                'mac' => $GLOBALS["X11"],
                'windows' => "",
                'linux' => ""
            )
        ),
        'gcc' => array (
            'title' => "GCC Compiler",
            'download' => array (
                'mac' => "",
                'windows' => "http://sysprogs.com/files/gnutoolchains/mingw64/mingw64-gcc4.7.1.exe",
                'linux' => "",
                'size' => 25,
                'version' => (PHP_OS === 'WINNT' ? "4.7.1" : shell_exec("gcc -dumpversion"))
            ),
            'path' => array (
                'mac' => "/usr/bin/gcc",
                'windows' => "C:\\SysGCC\\MinGW64\\bin\\gcc.exe",
                'linux' => "/usr/bin/gcc"
            )
        ),
        'arm' => array (
            'title' => "ARM Embedded Compiler",
            'download' => array (
                'mac' => "https://developer.arm.com/-/media/Files/downloads/gnu-rm/6-2017q2/gcc-arm-none-eabi-6-2017-q2-update-mac.tar.bz2",
                'windows' => "http://sysprogs.com/files/gnutoolchains/arm-eabi/arm-eabi-gcc6.2.0-r4.exe",
                'linux' => "",
                'size' => 100,
                'version' => "6.2"
            ),
            'path' => array (
                'mac' => "/usr/local/etc/gcc_arm/gcc-arm-none-eabi-6-2017-q2-update/bin/arm-none-eabi-gcc",
                'windows' => "C:\\SysGCC\\arm-eabi\\bin\\arm-eabi-gcc.exe",
                'linux' => "/usr/share/gcc-arm-embedded/bin/gcc-arm-none-eabi"
            )
        ),
        'attiny' => array (
            'title' => "AVR Compiler",
            'download' => array (
                'mac' => "https://www.obdev.at/downloads/crosspack/CrossPack-AVR-20131216.dmg",
                'windows' => "http://sysprogs.com/files/gnutoolchains/avr/avr-gcc5.3.0.exe",
                'linux' => "",
                'size' => 40,
                'version' => "20131216"
            ),
            'path' => array (
                'mac' => "/usr/local/etc/gcc_arm/avr/bin/avrdude",
                'windows' => "C:\\SysGCC\\avr\\bin\\avrdude.exe",
                'linux' => "/usr/bin/avrdude"
            )
        ),
        'arduino' => array (
            'title' => "Arduino IDE",
            'download' => array (
                'mac' => "https://downloads.arduino.cc/arduino-1.8.5-macosx.zip",
                'windows' => "https://downloads.arduino.cc/arduino-1.8.5-windows.exe",
                'linux' => "",
                'size' => 150,
                'version' => "1.8.5"
            ),
            'path' => array (
                'mac' => "/Applications/Arduino.app/Contents/MacOS/Arduino",
                'windows' => "C:\\Program Files (x86)\Arduino\\arduino.exe",
                'linux' => "/opt/arduino/bin/arduino"
            )
        ),
        'python' => array (
            'title' => "Python",
            'download' => array (
                'mac' => "",
                'windows' => "https://www.python.org/ftp/python/3.6.2/python-3.6.2.exe",
                'linux' => "",
                'size' => 15,
                'version' => (PHP_OS === 'WINNT' ? "3.6.2" : shell_exec("python -c 'import sys; print(\".\".join(map(str, sys.version_info[:3])))'"))
            ),
            'path' => array (
                'mac' => "/usr/bin/python",
                'windows' => getenv('USERPROFILE'). "\\AppData\\Local\\Programs\\Python\\Python36-32\\python.exe",
                'linux' => "/usr/bin/python"
            )
        ),
        'openscad' => array (
            'title' => "OpenSCAD - 3D CAD",
            'download' => array (
                'mac' => "http://files.openscad.org/OpenSCAD-2015.03-3.dmg",
                'windows' => "http://files.openscad.org/OpenSCAD-2015.03-x86-64-Installer.exe",
                'linux' => "",
                'size' => 25,
                'version' => "2015.03"
            ),
            'path' => array (
                'mac' => "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD",
                'windows' => "C:\\Program Files\\OpenSCAD\\OpenSCAD.exe",
                'linux' => "/usr/share/applications/openscad.desktop"
            )
        ),
        'inkscape' => array (
            'title' => "Inkscape - Vector Graphics Software",
            'download' => array (
                'mac' => "https://inkscape.org/en/gallery/item/11269/Inkscape-0.92.2-1-x11-10.7-x86_64.dmg",
                'windows' => "https://inkscape.org/en/gallery/item/11263/inkscape-0.92.2-x64.msi",
                'linux' => "",
                'size' => 70,
                'version' => "0.92.2"
            ),
            'path' => array (
                'mac' => "/Applications/Inkscape.app/Contents/MacOS/Inkscape",
                'windows' => "C:\\Program Files\\Inkscape\\inkscape.exe",
                'linux' => "/usr/share/applications/inkscape.desktop"
            )
        ),
        'openocd' => array (
            'title' => "OpenOCD Debugger",
            'download' => array (
                'mac' => "https://github.com/gnu-mcu-eclipse/openocd/releases/download/v0.10.0-4-20171004-0812-dev/gnu-mcu-eclipse-openocd-0.10.0-4-20171004-0812-dev-osx.pkg",
                'windows' => "https://github.com/gnu-mcu-eclipse/openocd/releases/download/v0.10.0-4-20171004-0812-dev/gnu-mcu-eclipse-openocd-0.10.0-4-20171004-0812-dev-win64-setup.exe",
                'linux' => "",
                'size' => 2.5,
                'version' => "0.10.0-4-20171004"
            ),
            'path' => array (
                'mac' => "/usr/local/etc/gcc_arm/openocd/bin/openocd",
                'windows' => "C:\\Program Files\\GNU ARM Eclipse\\OpenOCD\\openocd.exe",
                'linux' => "/usr/share/openocd/bin/openocd"
            )
        ),
        'eagle' => array (
            'title' => "AutoCAD Eagle - PCB Design Software",
            'download' => array (
                'mac' => "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/Autodesk_EAGLE_8.4.3_English_Mac_64bit.pkg",
                'windows' => "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/Autodesk_EAGLE_8.4.3_English_Win_64bit.exe",
                'linux' => "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/Autodesk_EAGLE_8.4.3_English_Linux_64bit.tar.gz",
                'size' => 100,
                'version' => "8.4.3"
            ),
            'path' => array (
                'mac' => "/Applications/EAGLE-8.4.3/Eagle.app/Contents/MacOS/Eagle",
                'windows' => "C:\\EAGLE-8.4.3\\bin\eagle.exe",
                'linux' => "/opt/eagle-8.4.3/bin/eagle"
            )
        ),
        'designsparkpcb' => array (
            'title' => "DesignSpark - PCB Design Software",
            'download' => array (
                'mac' => "http://pcb.designspark.info/DesignSparkPCB_v8.0.exe",
                'windows' => "http://pcb.designspark.info/DesignSparkPCB_v8.1_Beta.exe",
                'linux' => "http://pcb.designspark.info/DesignSparkPCB_v8.0.exe",
                'size' => 65,
                'version' => "8.0"
            ),
            'path' => array (
                'mac' => "/Applications/DesignSparkPCB.app/Contents/MacOS/DesignSparkPCB",
                'windows' => "C:\\Program Files (x86)\\DesignSpark\\DesignSpark PCB 8.0\\DesignSpark.exe",
                'linux' => ""
            )
        ),
        'source' => array (
            'title' => "Inverter Source Code",
            'download' => array (
                'all' => "https://github.com/tumanako/tumanako-inverter-fw-motorControl/archive/master.zip",
                'size' => 1,
                'version' => "3.25"
            ),
            'path' => array (
                'mac' => getenv("HOME"). "/Documents/tumanako-inverter-fw-motorControl-master/src/sine/sine_core.h",
                'windows' => getenv('USERPROFILE'). "\\Documents\\tumanako-inverter-fw-motorControl-master\\src\\sine\\sine_core.h",
                'linux' => getenv("HOME"). "/Documents/tumanako-inverter-fw-motorControl-master/src/sine/sine_core.h"
            )
        ),
        'php' => array (
            'title' => "PHP Compiler",
            'download' => array (
                'mac' => "",
                'windows' => "",
                'linux' => "",
                'size' => 1,
                'version' => (PHP_OS === 'WINNT' ? "5.6" : phpversion())
            ),
            'path' => array (
                'mac' => "/usr/bin/php",
                'windows' => "C:\\Program Files\\PHP\\php.exe",
                'linux' => ""
            )
        )
    );
    
    function detectOS()
    {
        $uname = strtolower(php_uname('s'));
        if (strpos($uname, "darwin") !== false) {
            $GLOBALS["OS"] = "mac";
        }else if (strpos($uname, "win") !== false) {
            $GLOBALS["OS"] = "windows";
        }
    }

    function commandOSCorrection($command,$args)
    {
        if ($GLOBALS["OS"] === "windows") {
            $command = $command. ".ps1";
            //if(!empty($args))
            //   $command .= "\" -Arguments";
        }else if ($GLOBALS["OS"] === "linux") {
            $command = $command.".sh";
        }

        if(!empty($args)){

            if ($GLOBALS["OS"] === "mac" || $GLOBALS["OS"] === "windows") {
                
                $command = $command. "\"";
                $split = explode(" ",$args);
                foreach ($split as $key){
                    $command .= " \"" .$key. "\""; //wrap individual arguments
                }
            }else{
                $command .= " " .$args. "\""; //no wrap
            }
        }else{
            $command .= "\""; //close quote
        }

        return $command;
    }

    function runCommand($command,$args)
    {
        $command = commandOSCorrection($command,$args);

        if ($GLOBALS["OS"] === "mac") {
            return "\"" .$_SERVER["DOCUMENT_ROOT"]. "/../" .$command. " 2>&1 &";
        }else if ($GLOBALS["OS"] === "windows") {
            return "powershell.exe -ExecutionPolicy Bypass -File \"" .$_SERVER["DOCUMENT_ROOT"] . "\\..\\Windows\\" .$command. " 2>&1";
        }else if ($GLOBALS["OS"] === "linux") {
            if(is_file("/usr/bin/gnome-terminal")){
                //More transparent of what's going on
                return "gnome-terminal -e 'bash -c \"" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" .$command. ";bash' 2>&1";
            }else{
                //Process behind the scenes
                return "\"" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" .$command. " 2>&1";
            }
        }
        return "echo";
    }
?>