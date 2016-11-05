<?php
    include_once("common.php");
    
    detectOS();

    set_time_limit(10000);

    if(isset($_GET["com"]))
    {
        if ($os === "Mac") {
            $command = "ls /dev/cu.*";
        }else if ($os === "Windows") {
            $command = "";
        }else if ($os === "Linux") {
            $command = "ls /dev/tty.*";
        }

        $output = exec($command);

        //foreach ($output as $line) {
        //    echo "$line\n";
        //}

        echo str_replace(" ", ",", $output);

    }else{

        require('config.inc.php');

        if(isset($_GET["pk"]) && isset($_GET["name"]) && isset($_GET["value"]))
        {
            echo sendToSerial("set " .$_GET["name"]. " " .$_GET["value"],$serial);
        }
        else if(isset($_GET["get"]))
        {
            echo sendToSerial("get " . $_GET["get"],$serial);
        }
        else if(isset($_GET["command"]))
        {
           echo sendToSerial($_GET["command"],$serial);
        }
    }

    function sendToSerial($cmd,$serial)
    {
        $cmd = urldecode($cmd). "\n";
        $serial->sendMessage($cmd);
        $read = $serial->readPort();
        
        if ($cmd === "json\n" || $cmd === "all\n"){
            //Strange behavior when receiving chunks in OSX
            //==============================================
            $x = 0;
            while($x <= 10 && json_decode($read) != true)
            //while($x <= 8 && strpos($read, $cmd) == false)
            {
                //sleep(1);
                $serial->sendMessage("\n");
                $read .= $serial->readPort();
                $x++;
            }
            //==============================================
        }

        $read = str_replace($cmd,"",$read); //Remove serial echo
        
        return $read;
    }
?>