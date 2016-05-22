<?php

require('php_serial.class.php');
require('config.inc.php');
require('InverterTerminal.class.php');

$term = new InverterTerminal($serial);

if (count($_FILES))
{
    $string = file_get_contents($_FILES['userfile']['tmp_name']);
    $params = (array)json_decode($string);

    echo json_decode($string);

    $term->sendCmd("stop");
    
    foreach ($combined as $name => $attributes)
    {
        if ($attributes->isparam)
        {
            $term->sendCmd("set ".$name." ".$params[$name], false, 0.01);
        }
    }

    $term->getValues($combined);
}

?>