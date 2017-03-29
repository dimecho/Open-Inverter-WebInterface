<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

require("phpserial.class.php");

$serial = new phpSerial;

if (!$serial->deviceSet("/dev/ttyAMA0")) die();

$serial->confBaudRate(115200);
$serial->confParity("none");
$serial->confCharacterLength(8);
$serial->confStopBits(2);
$serial->confFlowControl("none");
$serial->echoOff();
$serial->deviceOpen();

?>