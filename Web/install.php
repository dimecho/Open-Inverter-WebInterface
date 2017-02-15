<?php

    include_once("common.php");

    detectOS();

    if(!isset($_GET["url"]) && isset($_GET["app"]))
    {
        set_time_limit(10000);
        
        exec(runCommand($_GET["app"]), $output, $return);
        
        //echo "$command\n";
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }
    else if(isset($_GET["remove"]))
    {
        checkARMCompiler(true);
        checkAVRCompiler(true);

        echo "done";
    }

    function checkArduino()
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/Applications/Arduino.app/Contents/MacOS/Arduino";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\Program Files\Arduino\\arduino.exe";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/opt/arduino/bin/arduino";
        }
        if(is_file($path)) {
                echo "openExternalApp('arduino')";
        }else{
            echo "confirmDownload('arduino')";
        }
    }

    function checkEagle()
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/Applications/EAGLE-7.7.0/Eagle.app/Contents/MacOS/Eagle";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\EAGLE-7.7.0\\bin\eagle.exe";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/opt/eagle-7.7.0/bin/eagle";
        }
        if(is_file($path)) {
                echo "openExternalApp('eagle')";
        }else{
            echo "confirmDownload('eagle')";
        }
    }

    function checkOpenOCD()
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/usr/local/etc/gcc_arm/openocd";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\Program Files\\GNU ARM Eclipse\\OpenOCD";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/usr/share/openocd";
        }
        if(is_dir($path)) {
            //if(checkSource("tumanako-inverter-fw-motorControl-sync_motor")){
                echo "openExternalApp('openocd')";
            //}else{
            //    echo "confirmDownload('openocd')";
            //}
        }else{
            echo "confirmDownload('openocd')";
        }
    }

    function checkAVRCompiler($remove)
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/usr/local/etc/gcc_arm/avr/bin/avrdude";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\Program Files\\Win-AVR\\avrdude.exe";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/usr/bin/avrdude";
        }
        if(is_file($path)) {
            if($remove)
            {
                removeDirectory($path);
            }else{
                echo "openExternalApp('attiny')";
            }
        }else{
            echo "confirmDownload('attiny')";
        }
    }

    function checkARMCompiler($remove)
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/usr/local/etc/gcc_arm/gcc-arm-none-eabi-5_4-2016q3";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\Program Files (x86)\\GNU Tools ARM Embedded\\5.4 2016q3";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/usr/share/gcc-arm-embedded";
        }
        if(is_dir($path))
        {
            if($remove)
            {
                removeDirectory($path);
            }else{
                if(checkGCCCompiler())
                {
                    if(checkPythonCompiler())
                    {
                        if(checkSource("tumanako-inverter-fw-motorControl-master"))
                        {
                            echo "openExternalApp('source')";
                        }else{
                            echo "confirmDownload('source')";
                        }
                    }else{
                        echo "confirmDownload('python')";
                    }
                }else{
                    echo "confirmDownload('gcc')";
                }
            }
        }else{
            echo "confirmDownload('arm')";
        }
    }

    function checkSource($src)
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = getenv("HOME"). "/Documents/" . $src;
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = getenv("HOMEPATH"). "\\Documents\\" . $src;
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = getenv("HOME"). "/Documents/" . $src;
        }
        if(is_dir($path)) {
            return true;
        }else{
            return false;
        }
    }

    function checkGCCCompiler()
    {
        if ($GLOBALS["OS"] === "Mac" || $GLOBALS["OS"] === "Linux") {
            $path = "/usr/bin/gcc";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\SysGCC\\MinGW32\\bin\\gcc.exe";
        }
        if(is_file($path)) {
            return true;
        }else{
            return false;
        }
    }

    function checkPythonCompiler()
    {
        if ($GLOBALS["OS"] === "Mac" || $GLOBALS["OS"] === "Linux") {
            $path = "/usr/bin/python";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = getenv("HOMEPATH"). "\\AppData\\Local\\Programs\\Python\\Python36-32\\python.exe";
        }
        if(is_file($path)) {
            return true;
        }else{
            return false;
        }
    }

    function checkInkscape()
    {
        $xquartz = true;
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/Applications/Inkscape.app/Contents/MacOS/Inkscape";
            if(!is_file($GLOBALS["X11"])) {
                $xquartz = false;
            }
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\Program Files\\Inkscape\\inkscape.exe";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/usr/share/applications/inkscape.desktop";
        }
        if(is_file($path)) {
            if($xquartz == true)
            {
                echo "openExternalApp('inkscape')";
            }else{
                echo "confirmDownload('xquartz')";
            }
        }else{
            echo "confirmDownload('inkscape')";
        }
    }

    function checkOpenSCAD()
    {
        if ($GLOBALS["OS"] === "Mac") {
            $path = "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD";
        }else if ($GLOBALS["OS"] === "Windows") {
            $path = "C:\\Program Files\\OpenSCAD\\OpenSCAD.exe";
        }else if ($GLOBALS["OS"] === "Linux") {
            $path = "/usr/share/applications/openscad.desktop";
        }
        if(is_file($path)) {
            echo "openExternalApp('openscad')";
        }else{
            echo "confirmDownload('openscad')";
        }
    }

    function removeDirectory($path) {
        $files = glob($path . '/*');
        foreach ($files as $file) {
            is_dir($file) ? removeDirectory($file) : unlink($file);
        }
        rmdir($path);
        return;
    }
?>