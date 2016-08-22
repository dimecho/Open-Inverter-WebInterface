<?php
    if(isset($_GET["app"]))
    {
        if($_GET["app"] == "inkscape")
        {
            if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
                $source  = "cmd.exe /c C:\\Program Files\\Inkscape\\inkscape.com";
            }else{
                $source  = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape";
            }
            $command  = $source. " --verb dgkelectronics.com.encoder.disk.generator";

        }else if($_GET["app"] == "inkscape_openscad"){

            if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
                $source  = "cmd.exe /c C:\\Program Files\\Inkscape\\inkscape.com";
            }else{
                $source  = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape";
            }
            $command  = $source. " -f '" .$_GET["file"]. "' --verb EditSelectAll --verb SelectionUnGroup --verb SelectionSymDiff --verb command.extrude.openscad";
        }else if($_GET["app"] == "arm"){
            $command  = "arm";
        }else if($_GET["app"] == "eagle"){

            if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
                $command = "explorer.exe " .getenv("HOMEPATH"). "/Documents/pcb/";
            }else{
                $command = "open " .getenv("HOME"). "/Documents/pcb/";
            }
        }

        echo $command;
        exec($command);
    }
?>