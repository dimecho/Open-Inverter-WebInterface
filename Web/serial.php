<?php

    require('config.inc.php');

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
            echo readSerial("get " . $_GET["get"]);
        }
        else if(isset($_GET["command"]))
        {
			echo readSerial($_GET["command"]);
        }
        else if(isset($_GET["average"]))
        {
			readAverage("get " + $_GET["average"]);
        }
    }
	
	function readAverage($cmd)
    {
		$cmd = "get " .urldecode($cmd). "\r";
		$sum = 0;

		if (PHP_OS === 'WINNT')
		{
			$uart = dio_open(serialDevice(), O_RDONLY); //Read
			dio_write($uart, $cmd);
			dio_read($uart, 1);
			for ($x = 0; $x <= 10; $x++) {
				dio_write($uart, "!");
				$sum += (float)str_replace('!', '', dio_read($uart, 1024));
			}
		    dio_close($uart);

		}else{
			
			$uart = fopen(serialDevice(), "r"); //Read
			fwrite($uart, $cmd);
			fread($uart,1);
			for ($x = 0; $x <= 10; $x++) {
				fwrite($uart, "!");
				$sum += (float)str_replace('!', '', fread($uart, 1024));
			}
		    fclose($uart);
		}
		
		return $sum / 10;
    }
	
    function readSerial($cmd)
    {
		$cmd = urldecode($cmd). "\r";

		if (PHP_OS === 'WINNT')
		{
			$uart = dio_open(serialDevice(), O_RDWR); //Read & Write
			dio_write($uart, $cmd);
			$read = dio_read($uart, 65536);
			dio_close($uart);

		}else{
			
			$uart = fopen(serialDevice(), "r+"); //Read & Write
			//stream_set_timeout($uart, 0, 100);
			//stream_set_blocking($uart,0);
			
			fwrite($uart, $cmd);
			$read = fread($uart, 65536);
			//while(!feof($uart)){
				//$read .= stream_get_contents($fd, 128);
				//$read .= fgets($uart);
			//}
		    fclose($uart);
		}
		
        $read = str_replace($cmd,"",$read); //Remove serial echo

        return $read;
    }
?>