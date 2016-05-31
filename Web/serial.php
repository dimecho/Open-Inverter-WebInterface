<?php

require('php_serial.class.php');
require('config.inc.php');

$read = "";
$cmd = "all";

if( $_GET["save"]){

    $serial->sendMessage("save\n");
    $read = $serial->readPort();

}else if( $_GET["start"]){

    $serial->sendMessage("start 2\n");
    $read = $serial->readPort();

}else if( $_GET["stop"]){

    $serial->sendMessage("stop\n");
    $read = $serial->readPort();
}else if( $_GET["pk"] && $_GET["name"] && $_GET["value"]){
    
    $serial->sendMessage("set " . $_GET["name"] . " " . $_GET["value"] . "\n");
    $read = $serial->readPort();

}else if( $_GET["errors"]){

    $serial->sendMessage("errors\n");
    $read = $serial->readPort();

}else if( $_GET["default"]){

    $serial->sendMessage("defaults\n");
    $read = $serial->readPort();

}else{

    if($_GET["json"])
    {
        $cmd = "json";
    }else{
        $cmd = "get " . $_GET["i"];
    }

    $x = 0;

    $serial->sendMessage($cmd . "\n");

    while($x <= 100)
    {
        usleep(1000);
        $str = $serial->readPort(256);
        if(strlen($str) == 0)
        {
            $x++;
        }else{
            $read .= $str;
        }
    }
}
echo $read;
?>