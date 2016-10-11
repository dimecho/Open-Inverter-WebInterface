<?php

require "php_serial.class.php";

$serial = new phpSerial;

if (!$serial->deviceSet("/dev/cu.SLAB_USBtoUART")) die();

$serial->confBaudRate(115200);
$serial->confParity("none");
$serial->confCharacterLength(8);
$serial->confStopBits(2);
$serial->confFlowControl("none");
$serial->echoOff();
$serial->deviceOpen();
    
?>
