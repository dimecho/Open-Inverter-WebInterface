<?php
    $GLOBALS["OS"] = "linux";
    $GLOBALS["X11"] = "/Applications/Utilities/XQuartz.app/Contents/MacOS/X11";
    $GLOBALS["Software"] = array (
        'xquartz' => array (
            'title' => "X Window System that runs on OSX",
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
            'title' => "C/C++ Compiler",
            'download' => array (
                'mac' => "",
                'windows' => "http://sysprogs.com/files/gnutoolchains/mingw32/mingw32-gcc4.8.1.exe",
                'linux' => "",
                'size' => 25,
                'version' => "4.8"
            ),
            'path' => array (
                'mac' => "/usr/bin/gcc",
                'windows' => "C:\\SysGCC\\MinGW32\\bin\\gcc.exe",
                'linux' => "/usr/bin/gcc"
            )
        ),
        'arm' => array (
            'title' => "GCC/ARM Compiler",
            'download' => array (
                'mac' => "https://launchpadlibrarian.net/287101378/gcc-arm-none-eabi-5_4-2016q3-20160926-mac.tar.bz2",
                'windows' => "https://launchpadlibrarian.net/gcc-arm-none-eabi-5_4-2016q3-20160926-win32.exe",
                'linux' => "",
                'size' => 100,
                'version' => "5.4"
            ),
            'path' => array (
                'mac' => "/usr/local/etc/gcc_arm/gcc-arm-none-eabi-5_4-2016q3/bin/gcc-arm-none-eabi",
                'windows' => "C:\\Program Files (x86)\\GNU Tools ARM Embedded\\5.4 2016q3\\gcc-arm-none-eabi.exe",
                'linux' => "/usr/share/gcc-arm-embedded/bin/gcc-arm-none-eabi"
            )
        ),
        'attiny' => array (
            'title' => "AVR Compiler",
            'download' => array (
                'mac' => "https://www.obdev.at/downloads/crosspack/CrossPack-AVR-20131216.dmg",
                'windows' => "http://heanet.dl.sourceforge.net/project/winavr/WinAVR/20100110/WinAVR-20100110-install.exe",
                'linux' => "",
                'size' => 40,
                'version' => "20131216"
            ),
            'path' => array (
                'mac' => "/usr/local/etc/gcc_arm/avr/bin/avrdude",
                'windows' => "C:\\Program Files\\Win-AVR\\avrdude.exe",
                'linux' => "/usr/bin/avrdude"
            )
        ),
        'arduino' => array (
            'title' => "Arduino IDE",
            'download' => array (
                'mac' => "https://downloads.arduino.cc/arduino-1.8.2-macosx.zip",
                'windows' => "https://downloads.arduino.cc/arduino-1.8.2-windows.exe",
                'linux' => "",
                'size' => 150,
                'version' => "1.8.2"
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
                'windows' => "https://www.python.org/ftp/python/3.6.0/python-3.6.0b3.exe",
                'linux' => "",
                'size' => 15,
                'version' => "3.6.0"
            ),
            'path' => array (
                'mac' => "/usr/bin/python",
                'windows' => getenv("HOMEPATH"). "\\AppData\\Local\\Programs\\Python\\Python36-32\\python.exe",
                'linux' => "/usr/bin/python"
            )
        ),
        'openscad' => array (
            'title' => "OpenSCAD is for creating 3D CAD objects",
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
            'title' => "Inkscape is a Vector Graphics Software",
            'download' => array (
                'mac' => "https://inkscape.org/en/gallery/item/3896/Inkscape-0.91-1-x11-10.7-x86_64.dmg",
                'windows' => "https://inkscape.org/gallery/item/10688/Inkscape-0.92.1.msi",
                'linux' => "",
                'size' => 70,
                'version' => "0.92.1"
            ),
            'path' => array (
                'mac' => "/Applications/Inkscape.app/Contents/MacOS/Inkscape",
                'windows' => "C:\\Program Files\\Inkscape\\inkscape.exe",
                'linux' => "/usr/share/applications/inkscape.desktop"
            )
        ),
        'openocd' => array (
            'title' => "OpenoCD Debugger",
            'download' => array (
                'mac' => "https://github.com/gnuarmeclipse/openocd/releases/download/gae-0.10.0-20160110/gnuarmeclipse-openocd-osx-0.10.0-201601101000-dev.pkg",
                'windows' => "https://github.com/gnuarmeclipse/openocd/releases/download/gae-0.10.0-20160110/gnuarmeclipse-openocd-win64-0.10.0-201601101000-dev-setup.exe",
                'linux' => "",
                'size' => 2.5,
                'version' => "0.10.0-20160110"
            ),
            'path' => array (
                'mac' => "/usr/local/etc/gcc_arm/openocd/bin/openocd",
                'windows' => "C:\\Program Files\\GNU ARM Eclipse\\OpenOCD\\openocd.exe",
                'linux' => "/usr/share/openocd/bin/openocd"
            )
        ),
        'eagle' => array (
            'title' => "AutoCAD EAGLE PCB Design Software",
            'download' => array (
                'mac' => "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/Autodesk_EAGLE_8.1.1_English_Mac_64bit.pkg",
                'windows' => "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/Autodesk_EAGLE_8.1.1_English_Win_64bit.exe",
                'linux' => "http://trial2.autodesk.com/NET17SWDLD/2017/EGLPRM/ESD/Autodesk_EAGLE_8.1.1_English_Linux_64bit.tar.gz",
                'size' => 100,
                'version' => "8.1.1"
            ),
            'path' => array (
                'mac' => "/Applications/EAGLE-8.1.1/Eagle.app/Contents/MacOS/Eagle",
                'windows' => "C:\\EAGLE-8.1.1\\bin\eagle.exe",
                'linux' => "/opt/eagle-8.1.1/bin/eagle"
            )
        ),
        'designsparkpcb' => array (
            'title' => "DesignSpark PCB",
            'download' => array (
                'mac' => "http://pcb.designspark.info/DesignSparkPCB_v8.0.exe",
                'windows' => "http://pcb.designspark.info/DesignSparkPCB_v8.0.exe",
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
                'mac' => getenv("HOME"). "/Documents/tumanako-inverter-fw-motorControl-master",
                'windows' => getenv("HOMEPATH"). "\\Documents\\tumanako-inverter-fw-motorControl-master",
                'linux' => getenv("HOME"). "/Documents/tumanako-inverter-fw-motorControl-master"
            )
        )
    );
    
    function detectOS()
    {
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
            $GLOBALS["OS"] = "mac";
        }elseif (strpos($_SERVER["HTTP_USER_AGENT"], "Windows") !== false) {
            $GLOBALS["OS"] = "windows";
        }
    }

    function commandOSCorrection($command)
    {
        $split = explode(" ",$command);

        if(!empty($split)){

            if ($GLOBALS["OS"] === "mac") {
                $command = $split[0]. "\"";
            }else if ($GLOBALS["OS"] === "windows") {
                $command = $split[0]. ".ps1\" -Arguments";
            }else if ($GLOBALS["OS"] === "linux") {
                $command = $split[0].".sh";
            }
            
            unset($split[0]);

            foreach ($split as $key){
                if ($GLOBALS["OS"] === "mac" || $GLOBALS["OS"] === "windows") {
                    $command .= " \"" .$key. "\""; //wrap individual arguments
                }else {
                    $command .= " " .$key; //no wrap
                }
            }
            if ($GLOBALS["OS"] === "linux")
                $command .= "\""; //close quote
        }else{
            $command .= "\"";
        }

        return $command;
    }

    function runCommand($command)
    {
        $command = commandOSCorrection($command);

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