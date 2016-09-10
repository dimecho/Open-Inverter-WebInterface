<?php
require('config.inc.php');

if(isset($_GET["db"])){
    
    setParameters(getcwd() ."/db/" .$_GET["db"]. ".txt");
    echo "ok";
    
}else if (count($_FILES)){

    setParameters($_FILES['file']['tmp_name']);
    header("Location:/index.php");
}

function setParameters($file)
{
    $string = file_get_contents($file);
    $params = (array)json_decode($string);

    foreach ($params as $name => $attributes)
    {
        //echo $name. ">" .$params[$name];
        $serial->sendMessage("set " .$name. " " .$params[$name]. "\n");
        $read = $serial->readPort();
    }
}

?>