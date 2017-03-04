<?php

$version = 1.0;
$build = 32;

$_version = 0;
$_build = 0;

$CFBundleShortVersionString = false;
$CFBundleVersion = false;

$plist = file_get_contents(base64_decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3Bvb2Zpay9odWVibmVyLWludmVydGVyL21hc3Rlci9tYWNPUy9JbmZvLnBsaXN0"));
$lines = explode("\n", $plist);
foreach ($lines as $line)
{
    if($_version === 0 && $CFBundleShortVersionString) {
        $_version = trim($line);
        $_version = str_replace("<string>", "", $_version);
        $_version = str_replace("</string>", "", $_version);
    }

    if($_build === 0 && $CFBundleVersion) {
        $_build = trim($line);
        $_build = str_replace("<string>", "", $_build);
        $_build = str_replace("</string>", "", $_build);
    }

    if (strpos($line, "CFBundleShortVersionString") !== false)
        $CFBundleShortVersionString = true;
    else if(strpos($line, "CFBundleVersion") !== false)
        $CFBundleVersion = true;
}

if(floatval($_version) > $version || floatval($_build) > $_build)
    echo "version:$_version build:$_build";

?>