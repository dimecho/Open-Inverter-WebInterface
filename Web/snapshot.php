<?php
	require "serial.php";
	
	if(isset($_GET["db"])){
		
		setParameters(getcwd() ."/db/" .$_GET["db"]. ".txt");
		echo "ok";
		
	}else if (count($_FILES)){
		
		setParameters($_FILES['file']['tmp_name']);
		header("Location:index.php");
		
	}else{
		
		date_default_timezone_set("America/Vancouver");
		ini_set("display_startup_errors", 1);
		ini_set("display_errors", 1);
		
		header ("Content-Type: text/json");
		header ("Content-Disposition: attachment; filename=\"snapshot " .date("F-j-Y g-ia"). ".txt\"");

		$read = readSerial("json\n");
		$array = json_decode($read, true);
		$values = array();
		foreach ($array as $key => $value) {
			$values[$key] = $value["value"];
		}

		echo json_encode($values, JSON_PRETTY_PRINT);
	}
	
	function setParameters($file)
	{
		$string = file_get_contents($file);
		$params = (array)json_decode($string);
		
		$uart = fopen($_SESSION["serial"], "r+"); //Read & Write
		//stream_set_blocking($uart, 1); //O_NONBLOCK
        //stream_set_timeout($uart, 30);
		
		fwrite($uart, "stop\n");
		
		fread($uart,1);
		
		foreach ($params as $name => $attributes)
		{
			//echo $name. ">" .$params[$name];
			fwrite($uart, "set " .$name. " " .$params[$name]. "\n");
			fread($uart,1);
		}
		
		fwrite($uart, "save\n");
		fread($uart,1);
		fclose($uart);
	}
?>