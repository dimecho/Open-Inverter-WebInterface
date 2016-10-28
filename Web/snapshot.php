<?php
    require('serial.php');

    date_default_timezone_set("America/Vancouver");
    ini_set("display_startup_errors", 1);
    ini_set("display_errors", 1);
    
    header ("Content-Type: text/json");
    header ("Content-Disposition: attachment; filename=\"snapshot-" .date("F_j_Y g-ia"). ".txt\"");

    $read = sendToSerial("all",$serial);
    $split = split("\n", $read);
    $values = array();

    for ($i = 0; $i < count($split); $i++)
    {
        $s = split("\t", $split[$i]);
        if (trim($s[0]) != "")
        {
            $values[$s[0]] = str_replace("\r", "", $s[2]);
        }
    }

    echo json_encode($values, JSON_PRETTY_PRINT);
?>