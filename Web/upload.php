<?php

	require('config.inc.php');

	if(isset($_GET["db"])){
		
		setParameters(getcwd() ."/db/" .$_GET["db"]. ".txt",$serial);
		echo "ok";
		
	}else if (count($_FILES)){
		
		setParameters($_FILES['file']['tmp_name'],$serial);
		
		header("Location:/index.php");
	}

	function setParameters($file,$serial)
	{
		$string = file_get_contents($file);
		$params = (array)json_decode($string);
		
		$uart = fopen(serialDevice(), "r+"); //Read & Write
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