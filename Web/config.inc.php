<?php

require('php_serial.class.php');

set_time_limit(30);

$serial = new phpSerial;

if (!$serial->deviceSet("/dev/cu.usbserial")) die();

$serial->confBaudRate(115200);
$serial->confParity("none");
$serial->confCharacterLength(8);
$serial->confStopBits(1);
$serial->confFlowControl("none");
$serial->echoOff();
$serial->deviceOpen();

?>
