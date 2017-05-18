<?php

    require('config.inc.php');

    set_time_limit(30);

    error_reporting(E_ERROR | E_PARSE);
    
    if(isset($_GET["com"]))
    {
		if (PHP_OS === 'WINNT') {
			echo serialDevice();
			return;
		}else if (PHP_OS === 'Darwin') {
            $command = "ls /dev/cu.*";
		}else{
			$command = "ls /dev/ttyUSB*";
		}
		
		$output = exec($command);

        //foreach ($output as $line) {
        //    echo "$line\n";
        //}
		
        echo str_replace(" ", ",", $output);
		
    }else{
	
        if(isset($_GET["pk"]) && isset($_GET["name"]) && isset($_GET["value"]))
        {
            echo readSerial("set " .$_GET["name"]. " " .$_GET["value"]);
        }
        else if(isset($_GET["get"]))
        {
            if(strpos($_GET["get"],",") !== false) //Multi-value support
            {
                $split = explode(",",$_GET["get"]);
                for ($x = 0; $x < count($split); $x++)
                    echo readSerial("get " .$split[$x]). "\n";
            }else{
                echo readSerial("get " .$_GET["get"]);
            }
        }
        else if(isset($_GET["command"]))
        {
            echo readSerial($_GET["command"]);
        }
        else if(isset($_GET["average"]))
        {
			echo readAverage($_GET["average"]);
        }
    }
	
	function readAverage($cmd)
    {
		$cmd = "get " .urldecode($cmd). "\r";
		$read = "";
		$sum = 0;
		
		$uart = fopen(serialDevice(), "r+"); //Read & Write
        stream_set_blocking($uart, false); //O_NONBLOCK
        stream_set_timeout($uart, 8);

		fwrite($uart, $cmd);
		while($read .= fread($uart, 1))
		{
			if(strpos($read,$cmd) !== false) //Reached end of echo
			{
				for ($x = 0; $x < 10; $x++)
				{
					fwrite($uart, "!");
					fread($uart, 1); //Remove echo
					$read = "";
					while($read .= fread($uart, 1))
						if(strpos($read,"\n") !== false)
							break;
					$sum += (float)$read;
				}
				break;
			}
		}
		fclose($uart);

		return $sum/10;
    }
	
    function readSerial($cmd)
    {
		$cmd = urldecode($cmd). "\r";
        $read = "";

		$uart = fopen(serialDevice(), "r+"); //Read & Write
        stream_set_blocking($uart, false); //O_NONBLOCK
        stream_set_timeout($uart, 8);
        
		fwrite($uart, $cmd);
        
        while($read .= fread($uart, 1))
        {
            if(strpos($read,$cmd) !== false) //Reached end of echo
            {
                //Continue reading
                $read = "";
                if($cmd === "json\r"){
                    do {
                        $read .= fread($uart, 1);
                        json_decode($read);
                    } while (json_last_error() != JSON_ERROR_NONE);
                }else if($cmd === "all\r"){
                    while($read.= fread($uart, 1))
                        if(strpos($read,"tm_meas") !== false)
                            break;
                    $read .= "\t\t59652322";
                //OSX has trouble reading sequencial command
                /*
                }else if(strpos($cmd,",") !== false){ //Multi-value support
                    $split = explode(",",$cmd);
                    for ($x = 0; $x < count($split); $x++) {
                        $r = "";
                        while($r .= fread($uart, 1))
                            if(strpos($r,"\n") !== false)
                                break;
                        $read .= $r;
                    }
                */
                //TODO: commnad=errors
                }else{
                    while($read .= fread($uart, 1))
                        if(strpos($read,"\n") !== false)
                            break;
                }
                $read = rtrim($read ,"\r");
                $read = rtrim($read ,"\n");
                break;
            }
        }
        
		//$read = fgets($uart);
		//while(!feof($uart)){
			//$read .= stream_get_contents($fd, 1);
			//$read .= fgets($uart);
		//}
		fclose($uart);

        return $read;
    }
?>