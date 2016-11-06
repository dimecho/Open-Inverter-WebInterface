<?php
    include_once("common.php");
    
    detectOS();
    
    if(!isset($_GET["url"]) && isset($_GET["app"]))
    {
        set_time_limit(10000);
        
        exec(runCommand($_GET["app"]) . " 2>&1", $output, $return);
        
        //echo "$command\n";
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }
    else if(isset($_GET["remove"]))
    {
        if($_GET["remove"] == "arm")
        {
            checkARMCompiler(true);
        }
        else if($_GET["remove"] == "avr")
        {
            checkAVRCompiler(true);
        }
        echo "done";
    }

    function checkEagle()
    {
        global $os;
        if ($os === "Mac") {
            $path = "/Applications/EAGLE-7.7.0/Eagle.app/Contents/MacOS/Eagle";
        }else if ($os === "Windows") {
            $path = "C:\\EAGLE-7.7.0\\Eagle.exe";
        }else if ($os === "Linux") {
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
        global $os;
        if ($os === "Mac") {
            $path = "/usr/local/etc/gcc_arm/openocd";
        }else if ($os === "Windows") {
            $path = "C:\\Program Files\\GNU ARM Eclipse\\OpenOCD";
        }else if ($os === "Linux") {
            $path = "/usr/local/etc/gcc_arm/openocd";
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
        global $os;
        if ($os === "Mac") {
            $path = "/usr/local/etc/gcc_arm/avr";
        }else if ($os === "Windows") {
            $path = "C:\\Program Files\\Win-AVR";
        }else if ($os === "Linux") {
            $path = "/usr/local/etc/gcc_arm/avr";
        }
        if(is_dir($path)) {
            if($remove)
            {
                removeDirectory($path);
            }else{
                if(checkSource("tumanako-inverter-fw-motorControl-master"))
                {
                    echo "openExternalApp('attiny')";
                }else{
                    echo "confirmDownload('source')";
                }
            }
        }else{
            echo "confirmDownload('attiny')";
        }
    }

    function checkARMCompiler($remove)
    {
        global $os;
        if ($os === "Mac") {
            $path = "/usr/local/etc/gcc_arm/gcc-arm-none-eabi-5_4-2016q3";
        }else if ($os === "Windows") {
            $path = "C:\\Program Files (x86)\\GNU Tools ARM Embedded\\5.4 2016q3";
        }else if ($os === "Linux") {
            $path = "/usr/local/etc/gcc_arm/gcc-arm-none-eabi-5_4-2016q3";
        }
        if(is_dir($path))
        {
            if($remove)
            {
                removeDirectory($path);
            }else{
                if(checkCompiler())
                {
                    if(checkSource("tumanako-inverter-fw-motorControl-master"))
                    {
                        echo "openExternalApp('source')";
                    }else{
                        
                        echo "confirmDownload('source')";
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
        global $os;
        if ($os === "Mac") {
            $path = getenv("HOME"). "/Documents/" . $src;
        }else if ($os === "Windows") {
            $path = getenv("HOMEPATH"). "\\Documents\\" . $src;
        }else if ($os === "Linux") {
            $path = getenv("HOME"). "/Documents/" . $src;
        }
        if(is_dir($path)) {
            return true;
        }else{
            return false;
        }
    }

    function checkCompiler()
    {
        global $os;
        if ($os === "Mac") {
            $path = "/usr/bin/gcc";
        }else if ($os === "Windows") {
            $path = "C:\\mingw\\bin\\gcc.exe";
        }else if ($os === "Linux") {
            $path = "/usr/bin/gcc";
        }
        if(is_file($path)) {
            return true;
        }else{
            return false;
        }
    }

    function checkInkscape()
    {
        global $os;
        $xquartz = true;
        if ($os === "Mac") {
            $path = "/Applications/Inkscape.app/Contents/MacOS/Inkscape";
            if(!is_dir("/Applications/Utilities/XQuartz.app")) {
                $xquartz = false;
            }
        }else if ($os === "Windows") {
            $path = "C:\\Program Files\\Inkscape\\inkscape.exe";
        }else if ($os === "Linux") {
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
        global $os;
        if ($os === "Mac") {
            $path = "/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD";
        }else if ($os === "Windows") {
            $path = "C:\\Program Files\\OpenSCAD\\OpenSCAD.exe";
        }else if ($os === "Linux") {
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