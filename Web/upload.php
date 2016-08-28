<?php
require('config.inc.php');

if (count($_FILES))
{
    $string = file_get_contents($_FILES['file']['tmp_name']);
    $params = (array)json_decode($string);

    foreach ($params as $name => $attributes)
    {
        //echo $name. ">" .$params[$name];
        $serial->sendMessage("set " .$name. " " .$params[$name]. "\n");
        $read = $serial->readPort();
    }
}

header("Location:/index.php");

?>