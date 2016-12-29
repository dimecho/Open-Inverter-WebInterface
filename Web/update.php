<?php

$version = 1.0;
$build = 30;

$_version = 0;
$_build = 0;

$CFBundleShortVersionString = false;
$CFBundleVersion = false;

$plist = file_get_contents(base64_decode("aHR0cDovL2dpdGh1Yi5jb20vcG9vZmlrL2h1ZWJuZXItaW52ZXJ0ZXIvcmF3L21hc3Rlci9tYWNPUy9JbmZvLnBsaXN0"));
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