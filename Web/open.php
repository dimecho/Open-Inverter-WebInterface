<?php
    include_once("common.php");

    detectOS();

    if(isset($_GET["app"]))
    {
        $command = "echo";
        if($_GET["app"] == "inkscape"){
    		$args = " --verb dgkelectronics.com.encoder.disk.generator";
            if ($os === "Mac") {
                $command = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args;
            }else if ($os === "Windows") {
                $command = "cmd.exe /c \"\"C:\\Progra~1\\Inkscape\\inkscape.com\"\" " .$args. "";
            }
        }else if(isset($_FILES["file"])){
    		$name = basename($_FILES['file']['tmp_name']);
            $tmp_name = "/tmp/$name.svg";
            move_uploaded_file($_FILES['file']['tmp_name'], $tmp_name);
    		$args = " -f '" .$tmp_name. "' --verb EditSelectAll --verb SelectionUnGroup --verb SelectionSymDiff --verb command.extrude.openscad";
            if ($os === "Mac") {
                $command  = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args;
            }else if ($os === "Windows") {
                $command  = "cmd.exe /c \"C:\\Progra~1\\Inkscape\\inkscape.com\" " .$args. "";
            }
            header("Location:/index.php");
        }else if($_GET["app"] == "arm"){
            $command  = "arm";
        }else if($_GET["app"] == "openocd" || $_GET["app"] == "bootloader"){
            $command = runCommand("openocd");
            header("Location:/bootloader.php");
        }else if($_GET["app"] == "source"){
            $command = runCommand("source");
            header("Location:/compile.php");
        }else if($_GET["app"] == "eagle"){
            if ($os === "Mac") {
                $command = "open \"" .$_SERVER["DOCUMENT_ROOT"]. "/pcb\"";
            }else if ($os === "Windows") {
                //$command = "explorer.exe " .getenv("HOMEPATH"). "/Documents/pcb/";
                $command = "explorer.exe \"" .$_SERVER["DOCUMENT_ROOT"]. "\\pcb\"";
            }
        }
        
        exec($command,$op);
        
        //Timeout
        //exec("timeout ". $timeout_in_sec. "s ". $cmd);
        //$pid = (int)$op[0];
        //echo $pid;
        
        echo $command;
    }else{
        echo "open.php?app=";
    }
?>