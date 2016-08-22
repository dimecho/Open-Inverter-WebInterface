<?php

if(!isset($_GET["url"]) && isset($_GET["app"]))
{
    set_time_limit(10000);

    if (strpos($_SERVER["HTTP_USER_AGENT"], 'Windows') !== false) {
        $command = "cmd.exe /c \"" .$_SERVER["DOCUMENT_ROOT"]. "\\..\\Windows\\" .$_GET["app"]. ".bat\"";
    }else{
        $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../" . $_GET["app"] . "'";
    }

    $output = exec($command);
    //echo $output;
    echo "done";
}
else if(isset($_GET["remove"]))
{
    if($_GET["remove"] == "arm")
    {
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
            $path = "/usr/local/gcc_arm";
        }else{
            $path = "C:\\Program Files\\GCC_ARM";
        }
        removeDirectory($path);
    }else if($_GET["remove"] == "avr")
    {
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
            $path = "/usr/local/CrossPack-AVR-20131216";
        }else{
            $path = "C:\\Program Files\\Win-AVR";
        }
        removeDirectory($path);
    }
    echo "done";
}

function checkEagle()
{
    if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
        $path = "/Applications/EAGLE-7.6.0/Eagle.app";
    }else{
        $path = "C:\\Program Files\\Eagle";
    }
    if(is_dir($path)) {
        if(checkSource())
        {
            echo "\"openExternalApp('eagle')\"";
        }else{
            echo "\"confirmDownload('source')\"";
        }
    }else{
        echo "\"confirmDownload('eagle')\"";
    }
}

function checkAVRCompiler()
{
    if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
        $path = "/usr/local/CrossPack-AVR/bin/avr-gcc";
    }else{
        $path = "C:\\Program Files\\Win-AVR";
    }
    if(is_file($path)) {
        if(checkSource())
        {
            echo "\"openExternalApp('attiny')\"";
        }else{
            echo "\"confirmDownload('source')\"";
        }
    }else{
        echo "\"confirmDownload('attiny')\"";
    }
}

function checkARMCompiler()
{
    if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
        $path = "/usr/local/gcc_arm/gcc-arm-none-eabi-5_4-2016q2";
    }else{
        $path = "C:\\Program Files\\GCC_ARM";
    }
    if(is_dir($path))
    {
        if(checkSource())
        {
            echo "\"openExternalApp('source')\"";
        }else{
            echo "\"confirmDownload('source')\"";
        }
    }else{
        echo "\"confirmDownload('arm')\"";
    }
}

function checkCompiler()
{
    if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
        $path = "/usr/local/gcc_arm";
    }else{
        $path = "C:\\Program Files\\GCC_ARM";
    }
    if(is_dir($path)) {
        return true;
    }else{
        return false;
    }       
}

function checkSource()
{
    if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
        $path = getenv("HOMEPATH"). "\\Documents\\Firmware";
    }else{
        $path = getenv("HOME"). "/Documents/Firmware";
    }
    if(is_dir($path)) {
        return true;
    }else{
        return false;
    }
}

function checkInkscape()
{
    $xquartz = true;
    if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
        $path = "/Applications/Inkscape.app";
        if(!is_dir("/Applications/Utilities/XQuartz.app")) {
            $xquartz = false;
        }
    }else{
        $path = "C:\\Program Files\\Inkscape";
    }
    if(is_dir($path)) {
        if($xquartz == true)
        {
            echo "\"openExternalApp('inkscape')\"";
        }else{
            echo "\"confirmDownload('xquartz')\"";
        }
    }else{
        echo "\"confirmDownload('inkscape')\"";
    }
}

function checkOpenSCAD()
{
    if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
        $path = "/Applications/OpenSCAD.app";
    }else{
        $path = "C:\\Program Files\\OpenSCAD";
    }
    if(is_dir($path)) {
        echo "\"openExternalApp('openscad')\"";
    }else{
        echo "\"confirmDownload('openscad')\"";
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