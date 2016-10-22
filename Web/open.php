<?php
    $command = "echo";

    if($_GET["app"] == "inkscape"){

		$args = " --verb dgkelectronics.com.encoder.disk.generator";
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            $command = "cmd.exe /c \"C:\\Progra~1\\Inkscape\\inkscape.com" .$args. "\"";
        }else{
            $command = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args;
        }
    }else if(isset($_FILES["file"])){

		$name = basename($_FILES['file']['tmp_name']);
        $tmp_name = "/tmp/$name.svg";
        move_uploaded_file($_FILES['file']['tmp_name'], $tmp_name);
		$args = " -f '" .$tmp_name. "' --verb EditSelectAll --verb SelectionUnGroup --verb SelectionSymDiff --verb command.extrude.openscad";
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            $command  = "cmd.exe /c \"C:\\Progra~1\\Inkscape\\inkscape.com" .$args. "\"";
        }else{
            $command  = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args;
        }
        header("Location:/index.php");

    }else if($_GET["app"] == "arm"){
        $command  = "arm";
    }else if($_GET["app"] == "openocd" || $_GET["app"] == "bootloader"){

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            $command = "cmd.exe /c '" .$_SERVER["DOCUMENT_ROOT"]. "/../Windows/openocd.bat'";
        }else{
            $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../openocd'";
        }
        header("Location:/bootloader.php");

    }else if($_GET["app"] == "source"){

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            $command = "cmd.exe /c '" .$_SERVER["DOCUMENT_ROOT"]. "/../Windows/source.bat'";
        }else{
            $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../source'";
        }
        header("Location:/compile.php");

    }else if($_GET["app"] == "eagle"){

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            //$command = "explorer.exe " .getenv("HOMEPATH"). "/Documents/pcb/";
            $command = "explorer.exe \"" .getcwd(). "/pcb/\"";
        }else{
            //$command = "open " .getenv("HOME"). "/Documents/pcb/";
            $command = "open \"" .getcwd(). "/pcb/\"";
        }
    }
    
    exec($command,$op);
    
    //Timeout
    //exec("timeout ". $timeout_in_sec. "s ". $cmd);
    //$pid = (int)$op[0];
    //echo $pid;
    
    echo $command;
?>