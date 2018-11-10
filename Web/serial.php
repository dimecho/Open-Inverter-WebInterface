<?php
    session_start();

	error_reporting(E_ERROR | E_PARSE);

    header("Access-Control-Allow-Origin: *");
	
    if(isset($_SESSION["timeout"]))
	{
		set_time_limit($_SESSION["timeout"]);
	}else{
		set_time_limit(12);
	}

    if(isset($_GET["init"]))
    {
       echo serialDevice($_GET["init"]);
    }
    else if(isset($_GET["serial"]))
    {
        echo $_GET["serial"];
        $json = json_decode(file_get_contents("js/serial.json"), true);
        $json['serial']['port'] = $_GET["serial"];
        file_put_contents("js/serial.json", json_encode($json));
        unset($_SESSION["serial"]);
    }
    else if(isset($_GET["com"]))
    {
        $uname = strtolower(php_uname('s'));
        if (strpos($uname, "darwin") !== false) {
            $command = "ls /dev/cu.*";
        }else if (strpos($uname, "win") !== false) {
            $command = "powershell.exe -ExecutionPolicy Bypass -Command \"Write-Host $([System.IO.Ports.SerialPort]::GetPortNames())\"";
        }else if (strpos(php_uname('m'), "arm") !== false) {
            $command = "ls /dev/ttyAMA*";
        }else{
            $command = "ls /dev/ttyUSB*";
        }

		$output = shell_exec($command);
        $output = str_replace("\n", ",", $output);
        $output = str_replace(" ", ",", $output);
        $output = rtrim($output,",");

        echo $output;
        /*
        if(strpos($com,"Error") === true)
        {
            echo serialDevice();
        }
		*/
    }
    else if(isset($_GET["pk"]) && isset($_GET["name"]) && isset($_GET["value"]))
    {
        echo readSerial("set " .$_GET["name"]. " " .$_GET["value"]);
    }
    else if(isset($_GET["get"]))
    {
        $uname = strtolower(php_uname('s'));

        if (strpos($uname, "darwin") !== false && strpos($_GET["get"],",") !== false) //Multi-value support for Mac
        {
            $split = explode(",",$_GET["get"]);
            for ($x = 0; $x < count($split); $x++)
                echo readSerial("get " .$split[$x]). "\n";
        }else{
            echo readSerial("get " .$_GET["get"]);
        }
    }
    else if(isset($_GET["stream"]))
    {
        $l = 1; //loop
        $t = 0; //delay

        if(isset($_GET["loop"]))
            $l = intval($_GET["loop"]);
        if(isset($_GET["delay"]))
            $t = intval($_GET["delay"]) * 1000;

        streamSerial("get " .$_GET["stream"], $l, $t);
    }
    else if(isset($_GET["command"]))
    {
        echo readSerial($_GET["command"]);
    }
    else if(isset($_GET["average"]))
    {
		echo calculateAverage(readArray($_GET["average"],6));
    }
    else if(isset($_GET["median"]))
    {
        echo calculateMedian(readArray($_GET["median"],3));
    }

    function serialDevice($speed)
    {
		$errors = "";
		
		$com = $_SESSION["serial"];
		if(!isset($com)) {
			$json = json_decode(file_get_contents("js/serial.json"), true);
			$_SESSION["serial"] = $json['serial']['port'];
			$_SESSION["timeout"] = $json['serial']['timeout'];
			$com = $json['serial']['port'];
		}
		
		$uname = strtolower(php_uname('s'));
	
		if (strpos($uname, "windows") !== false) {
			$errors = exec("mode " .$com. ": BAUD=" . $speed. " PARITY=n DATA=8 STOP=2");
			if(strpos($errors ,"Invalid") === false)
				$errors = "";
		}else if (strpos($uname, "darwin") !== false) {
			//exec("screen " .$com. " " .$speed. " &");
			//stty -f $serial 115200 parodd cs8 cstopb -crtscts -echo & cat $serial &
			//stty -f $serial 115200 & screen $serial 115200 &

		}else{
			#Raspberry Pi Fix
			if (strpos(php_uname('m'), "arm") !== false) {
				exec("minicom -b " .$speed. " -o -D " .$com. " &");
				exec("killall minicom");
			}
			
			#Linux set TTY speed
			$errors = exec("stty -F " .$com. " " .$speed. " -parenb cs8 cstopb");
			#$errors .= shell_exec("stty -F " .$com. " clocal -crtscts -ixon -ixoff");
		}

		if($errors != "")
			return "Error: " . $errors;
		
		$uart = fopen($com, "r+");
		
		if($uart)
		{
			fwrite($uart, "fastuart " .$speed. "\n");
			echo fgets($uart);
			echo fgets($uart);
			fclose($uart);
			
		}else{
            return "Error: Cannot open ". $com;
        }

        return $com;
    }
	
	function readArray($cmd,$n)
    {
        $com = $_SESSION["serial"];
        if(strpos($com,"Error") !== false)
            return $com;

        $arr = array();
		$cmd = "get " .$cmd. "\n";
		$uart = fopen($com, "r+"); //Read & Write
        
        fwrite($uart, $cmd);
        $read = fgets($uart); //echo

        for ($x = 0; $x <= $n; $x++)
        {
            fwrite($uart, "!");
            $read = fgets($uart);
            $read = ltrim($read, "!");

            array_push($arr, (float)$read);
        }

        fclose($uart);
        
		return $arr;
    }
	
    function readSerial($cmd)
    {
        $com = $_SESSION["serial"];

        if(strpos($com,"Error") !== false)
            return $com;

		$cmd = $cmd. "\n";
		$uart = fopen($com, "r+"); //Read & Write
        //stream_set_blocking($uart, 0); //O_NONBLOCK
        //stream_set_timeout($uart, 8);
        
        fwrite($uart, $cmd); //fputs($uart, $cmd);
        $read = fgets($uart); //echo

        //DEBUG
		//echo $uart;
        //echo $cmd;
        //echo $read;

		//if ($cmd === $read){ //echo OK
			if($cmd === "json\n"){
				$read = fread($uart,9500);
				while (substr($read, -4) !== "}\r\n}")
					$read .= fread($uart,1);
			}else if($cmd === "all\n"){
				$read = fread($uart,1000);
				while (substr($read, -7) !== "tm_meas")
					$read .= fread($uart,1);
				$read .= "\t\t59652322";
			}else{
				if(strpos($cmd,",") !== false) //Multi-value support
				{
					$read = "";
					$streamCount = 0;
					$streamLength = substr_count($cmd, ',');

					while($streamCount <= $streamLength)
					{
						$read .= fgets($uart);
						$streamCount++;
					}

				}else{
					$read = fgets($uart);
					/*
					while(!feof($uart)){
						$read.=stream_get_contents($uart, 2);	
					}
					*/
				}
			}
			$read = str_replace("\r", "", $read);
			$read = rtrim($read, "\n");
		//}else{
		//	$read = "Error: Received corrupted echo ...check cables";
		//}
		fclose($uart);
        
        return $read;
    }

    function streamSerial($cmd,$loop,$delay)
    {
        $com = $_SESSION["serial"];
        $streamLength = substr_count($cmd, ',');
        $cmd = $cmd. "\n";
        $uart = fopen($com, "r+"); //Read & Write

        fwrite($uart, $cmd);
        $read = fgets($uart); //echo

        for ($i = 0; $i < $loop; $i++)
        {
            $streamCount = 0;

            if($i != 0)
                fwrite($uart, "!");
            
            ob_end_flush();
            while($streamCount <= $streamLength)
            {
                $read = fgets($uart);
                $read = ltrim($read, "!");
                
                echo str_replace("\r", "", $read);
                
                usleep($delay);
                $streamCount++;
            }
            ob_start();
        }

        fclose($uart);
    }

    function calculateMedian($arr)
    {
        $count = count($arr); // total numbers in array
        $middleval = floor(($count-1)/2); // find the middle value, or the lowest middle value

        if($count % 2) { // odd number, middle is the median
            $median = $arr[$middleval];
        } else { // even number, calculate avg of 2 medians
            $low = $arr[$middleval];
            $high = $arr[$middleval+1];
            $median = (($low+$high)/2);
        }
        return round($median,2);
    }

    function calculateAverage($arr)
    {
        $count = count($arr); // total numbers in array
        foreach ($arr as $value) {
            $total = $total + $value; // total value of array numbers
        }
        $average = ($total/$count); // get average value
        return round($average,2);
    }
?>