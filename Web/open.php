<?php
    include_once("common.php");

    detectOS();

    //OSX Fix: If XQuartz remains running apps do not open properly.
    $killXQuartz = "kill -9 `ps -A | grep XQuartz | awk '{print $1}'`";

    if(isset($_GET["app"]))
    {
        $command = "echo";
        
        if($_GET["app"] == "inkscape")
        {
    		$args = " --verb dgkelectronics.com.encoder.disk.generator";
            if ($GLOBALS["OS"] === "Mac") {
                exec($killXQuartz);
                $command = $GLOBALS["X11"]. " \"/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args. "\" 2>&1 &";
            }else if ($GLOBALS["OS"] === "Windows") {
                $command = "cmd.exe /c \"\"C:\\Progra~1\\Inkscape\\inkscape.com\"\" " .$args. "";
            }else if ($GLOBALS["OS"] === "Linux") {
                $command = "su \$SUDO_USER -c \"inkscape " .$args. "\"";
            }

        }else if($_GET["app"] == "gcc")
        {
            header("Location:/compile.php");
        }else if($_GET["app"] == "arm")
        {
            $command  = "arm";
        }else if($_GET["app"] == "openocd" || $_GET["app"] == "bootloader")
        {
            $command = runCommand("openocd");
            header("Location:/bootloader.php");
        }else if($_GET["app"] == "source")
        {
            $command = runCommand("source");
            header("Location:/compile.php");
        }else if($_GET["app"] == "arduino")
        {
            $args = $_SERVER["DOCUMENT_ROOT"]. "/arduino/lcd_display/lcd_display.ino";
            if ($GLOBALS["OS"] === "Mac") {
                $command = "/Applications/Arduino.app/Contents/MacOS/Arduino \"" .$args. "\"";
            }else if ($GLOBALS["OS"] === "Windows") {
                $command = "arduino.exe \"" .$args. "\"";
            }else if ($GLOBALS["OS"] === "Linux") {
                $command = "su \$SUDO_USER -c \"arduino '" .$args. "'\"";
            }
        }else if($_GET["app"] == "eagle")
        {
            if ($GLOBALS["OS"] === "Mac") {
                $command = "open \"" .$_SERVER["DOCUMENT_ROOT"]. "/pcb\"";
            }else if ($GLOBALS["OS"] === "Windows") {
                $command = "explorer.exe \"" .$_SERVER["DOCUMENT_ROOT"]. "\\pcb\"";
            }else if ($GLOBALS["OS"] === "Linux") {
                $command = "su \$SUDO_USER -c \"xdg-open '" .$_SERVER["DOCUMENT_ROOT"]. "/pcb'\"";
            }
        }
        
        exec($command,$op);
        
        //Timeout
        //exec("timeout ". $timeout_in_sec. "s ". $cmd);
        //$pid = (int)$op[0];
        //echo $pid;
        
        echo $command;

    }else if(isset($_FILES["file"]))
    {
        $name = basename($_FILES['file']['tmp_name']);
        $tmp_name = "/tmp/$name.svg";
        move_uploaded_file($_FILES['file']['tmp_name'], $tmp_name);

        $args = " -f '" .$tmp_name. "' --verb EditSelectAll --verb SelectionUnGroup --verb SelectionSymDiff --verb command.extrude.openscad";
        if ($GLOBALS["OS"] === "Mac") {
            exec($killXQuartz);
            $command = $GLOBALS["X11"]. " \"/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args. "\" 2>&1 &";
        }else if ($GLOBALS["OS"] === "Windows") {
            $command = "cmd.exe /c \"\"C:\\Progra~1\\Inkscape\\inkscape.com\"\"" .$args. "";
        }else if ($GLOBALS["OS"] === "Linux") {
            $command = "su \$SUDO_USER -c \"inkscape" .$args. "\"";
        }
        exec($command,$op);
        //header("Location:/index.php");
    }else{
        echo "open.php?app=";
    }
?>