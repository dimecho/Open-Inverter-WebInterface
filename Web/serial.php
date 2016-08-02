<?php

require('config.inc.php');

$read = "";
$cmd = "all";

if(isset($_GET["save"])){

    $serial->sendMessage("save\n");
    $read = $serial->readPort();

}else if(isset($_GET["start"])){

    $serial->sendMessage("start 2\n");
    $read = $serial->readPort();

}else if(isset($_GET["stop"])){

    $serial->sendMessage("stop\n");
    $read = $serial->readPort();
    
}else if(isset($_GET["pk"]) && isset($_GET["name"]) && isset($_GET["value"])){
    
    $serial->sendMessage("set " . $_GET["name"] . " " . $_GET["value"] . "\n");
    $read = $serial->readPort();

}else if(isset($_GET["default"])){

    $serial->sendMessage("defaults\n");
    $read = $serial->readPort();

}else if(isset($_GET["errors"])){

    $serial->sendMessage("errors\n");
    $read = $serial->readPort();

}else{

    $cmd = "";

    if(isset($_GET["json"]))
    {
        $cmd = "json";
    }
    else if(isset($_GET["i"]))
    {
        $cmd = "get " . $_GET["i"];
    }

    $serial->sendMessage($cmd . "\n");
   
    if (strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh') !== false) {
        $x = 0;
        while($x <= 10)
        {
            usleep(1000);
            $str = $serial->readPort();
            if(strlen($str) == 0)
            {
                $x++;
            }else{
                $read .= $str;
            }
        }
    }else{
        $read = $serial->readPort();
    }
}
echo $read;
?>