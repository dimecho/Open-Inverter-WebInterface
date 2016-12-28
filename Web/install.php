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

    function checkEagle()
    {
        global $os;
        if ($os === "Mac") {
            $path = "/Applications/EAGLE-7.7.0/Eagle.app/Contents/MacOS/Eagle";
        }else if ($os === "Windows") {
            $path = "C:\\EAGLE-7.7.0\\bin\eagle.exe";
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
        global $os;
        if ($os === "Mac") {
            $path = "/usr/local/etc/gcc_arm/avr/bin/avrdude";
        }else if ($os === "Windows") {
            $path = "C:\\Program Files\\Win-AVR\\avrdude.exe";
        }else if ($os === "Linux") {
            $path = "/usr/bin/avrdude";
        }
        if(is_file($path)) {
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

    function checkGCCCompiler()
    {
        global $os;
        if ($os === "Mac" || $os === "Linux") {
            $path = "/usr/bin/gcc";
        }else if ($os === "Windows") {
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
        global $os;
        if ($os === "Mac" || $os === "Linux") {
            $path = "/usr/bin/python";
        }else if ($os === "Windows") {
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
<script>
function buildEncoderAlert()
{
    alertify.buildEncoder("Build encoder",
        function() {
            $.ajax("open.php?app=inkscape");
        },
        function() {
            <?php checkOpenSCAD(); ?>;
            //$.ajax("open.php?app=inkscape_openscad");
        }
    );
}
</script>