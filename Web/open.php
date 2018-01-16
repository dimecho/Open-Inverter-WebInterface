<?php
    include("common.php");

    $os = detectOS();
    $osclient = detectClientOS();
    $software = getSoftware();

    //OSX Fix: If XQuartz remains running apps do not open properly.
    $killXQuartz = "kill -9 `ps -A | grep XQuartz | awk '{print $1}'`";

    if(isset($_GET["app"]))
    {
        $command = "echo";
        
        if($_GET["app"] == "inkscape")
        {
    		$args = " --verb dgkelectronics.com.encoder.disk.generator";
            if ($os === "mac") {
                exec($killXQuartz);
                $command = $software["xquartz"]["path"]["mac"]. " \"/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args. "\" > /dev/null 2>&1 &";
            }else if ($os === "windows") {
                $command = "cmd.exe /c \"\"C:\\Program Files (x86)\\Inkscape\\inkscape.com\"\" " .$args. "";
            }else if ($os === "linux") {
                $command = "su \$SUDO_USER -c \"inkscape " .$args. "\"";
            }

        }else if($_GET["app"] == "gcc")
        {
            header("Location:/sourcecode.php");
        }else if($_GET["app"] == "arm")
        {
            $command  = "arm";
        }else if($_GET["app"] == "openocd" || $_GET["app"] == "bootloader")
        {
            $command = runCommand("openocd","");
            header("Location:/bootloader.php");
        }else if($_GET["app"] == "source")
        {
            $command = runCommand("source","");
            header("Location:/sourcecode.php");
        }else if($_GET["app"] == "arduino")
        {
            $args = $_SERVER["DOCUMENT_ROOT"]. "/dashboard/arduino/lcd_display/lcd_display.ino";
            if ($os === "mac") {
                $command = "/Applications/Arduino.app/Contents/MacOS/Arduino \"" .$args. "\" > /dev/null 2>&1 &";
            }else if ($os === "windows") {
				$command = "C:\\Progra~2\\Arduino\\arduino.exe \"" .$args. "\" > NUL";
            }else if ($os === "linux") {
                $command = "su \$SUDO_USER -c \"arduino '" .$args. "'\"";
            }
        }else if($_GET["app"] == "eagle")
        {
            if ($os === "mac") {
                $command = "open \"" .$_SERVER["DOCUMENT_ROOT"]. "/pcb\"";
            }else if ($os === "windows") {
                $command = "explorer.exe \"" .$_SERVER["DOCUMENT_ROOT"]. "\\pcb\"";
            }else if ($os === "linux") {
                $command = "su \$SUDO_USER -c \"xdg-open '" .$_SERVER["DOCUMENT_ROOT"]. "/pcb'\"";
            }
        }
        
        exec($command,$op);
        
        //Timeout
        //exec("timeout ". $timeout_in_sec. "s ". $cmd);
        //$pid = (int)$op[0];
        //echo $pid;
        
        echo $command;

    }else if(isset($_FILES["file"])) {
		
		 if ($os === "mac") {
			$tmp_name = "/tmp/" .basename($_FILES['file']['tmp_name']). ".svg";
		}else{
			$tmp_name = sys_get_temp_dir(). "/" .basename($_FILES['file']['tmp_name']). ".svg";
		}
        move_uploaded_file($_FILES['file']['tmp_name'], $tmp_name);
		
        $args = " -f \"" .$tmp_name. "\" --verb EditSelectAll --verb SelectionUnGroup --verb SelectionSymDiff --verb command.extrude.openscad";
        if ($os === "mac") {
            exec($killXQuartz);
            $command = $software["xquartz"]["path"]["mac"]. " \"/Applications/Inkscape.app/Contents/Resources/bin/inkscape" .$args. "\" > /dev/null 2>&1 &";
        }else if ($os === "windows") {
            $command = "C:\\Progra~1\\Inkscape\\inkscape.com" .$args. " > NUL";
        }else if ($os === "linux") {
            $command = "su \$SUDO_USER -c \"inkscape" .$args. "\"";
        }
		header("Location:/encoder.php");
		
        exec($command);
		
    }else{
        echo "/open.php?app=";
    }
?>