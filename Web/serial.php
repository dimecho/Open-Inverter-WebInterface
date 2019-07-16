<?php
session_start();

    //header("Access-Control-Allow-Origin: *");
    header("Content-Type: text/plain");
    header("Cache-Control: no-cache");

    error_reporting(E_ERROR | E_PARSE);
    
    if(isset($_SESSION["timeout"]))
    {
        set_time_limit($_SESSION["timeout"]);
    }else{
        set_time_limit(12);
    }

    if(isset($_GET["init"]))
    {
        //if($_GET["init"] !== $_SESSION["speed"]) {
            $_SESSION = array();
            session_unset();

            echo serialDevice($_GET["init"]);
    }
    else if(isset($_GET["os"]))
    {
        $uname = strtolower(php_uname('s'));
        if (strpos($uname, "darwin") !== false) {
            echo "osx";
        }else if (strpos($uname, "win") !== false) {
            echo "windows";
        }else if (strpos(php_uname('m'), "arm") !== false) {
            echo "linux"; //"pi";
        }else{
            echo "linux";
        }
    }
    else if(isset($_GET["test"]))
    {
		if(isset($_GET["serial"])) {
            $_SESSION["serial"] = $_GET["serial"];
		}
		echo readSerial("\n");
    }
    else if(isset($_GET["serial"]))
    {
        $json = json_decode(file_get_contents("js/serial.json"), true);
        $json['serial']['port'] = $_GET["serial"];
        file_put_contents("js/serial.json", json_encode($json));
        
        $_SESSION = array();
        session_unset();
        
        $uname = strtolower(php_uname('s'));
        if (strpos($uname, "darwin") !== false) {
            echo dirname(dirname(dirname(__DIR__)));
            //exec("pkill \"Huebner Inverter\"");
            exec("\"../../MacOS/Huebner Inverter\" reload > /dev/null 2>&1 &");
            //exec("open -g -a \"" . dirname(dirname(dirname(__DIR__))). "\" reload");
        }
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

        exec($command, $output, $return);
        $output = str_replace(" ", "\n", $output); //Windows Fix

        foreach ($output as $line) {
            if (strpos($line, "Bluetooth") == false) {
                echo "$line\n";
            }
        }
        /*
        $output = shell_exec($command);
        $output = str_replace("\n", ",", $output);
        $output = str_replace(" ", ",", $output);
        $output = rtrim($output,",");

        echo $output;
        */
        /*
        if(strpos($com,"Error") === true)
        {
            echo serialDevice();
        }
        */
    }
    else if(isset($_GET["pk"]) && isset($_GET["name"]) && isset($_GET["value"]))
    {
        echo readSerial("set " .$_GET["name"]. " " .$_GET["value"]. "\n");
    }
    else if(isset($_GET["get"]))
    {
        /*
        if (strpos($_GET["get"],",") !== false) //Multi-value support for Mac
        {
            $split = explode(",",$_GET["get"]);
            for ($x = 0; $x < count($split); $x++)
            {
                echo readSerial("get " .$split[$x]). "\n";
            }
        }
        */
        echo readSerial("get " .$_GET["get"]. "\n");
    }
    else if(isset($_GET["stream"]))
    {
        $l = 1; //loop
        $t = 0; //delay

        if(isset($_GET["loop"]))
            $l = intval($_GET["loop"]);
        if(isset($_GET["delay"]))
            $t = intval($_GET["delay"]) * 1000;

        streamSerial("get " .$_GET["stream"]. "\n", $l, $t);
    }
    else if(isset($_GET["command"]))
    {
        echo readSerial($_GET["command"]. "\n");
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
            $_SESSION["speed"] = $json['serial']['speed'];
            $com = $_SESSION["serial"];
        }
        
        $read = fastUART($com,$speed);
        $uname = strtolower(php_uname('s'));

        if (strpos($uname, "windows") !== false) {
            exec("mode " .$com. ": BAUD=" . $speed. " PARITY=n DATA=8 STOP=1", $mode);
            print_r($mode);
            if(strpos($errors ,"Invalid") !== false)
                $errors = "Error:";
        }else if (strpos($uname, "darwin") !== false) {
            /*
            exec("minicom -D " .$com. " -b " .$speed. " -t vt100", $output);
            print_r($output);
            exec("killall minicom");
            */
            exec("stty -f " .$com, $stty);
            print_r($stty);
        }else{
            #Raspberry Pi Fix
            if (strpos(php_uname('m'), "arm") !== false) {
                exec("minicom -D " .$com. " -b " .$speed. " &");
                exec("killall minicom");
            }
            #Linux set TTY speed
            exec("stty -F " .$com. " " .$speed. " -parenb cs8 cstopb");
            exec("stty -F " .$com, $stty);
            print_r($stty);
        }

        if($errors != "")
            return "Error: " . $errors;

        $err = substr($read, 0, 2);

        if($err === "2D" || $err === "w}"){
            return $read;
        }else{
            echo $read;
            $uart = fopen($com, "r+");
            stream_set_blocking($uart, 0); //O_NONBLOCK
            stream_set_timeout($uart, 8);
            
            if($uart)
            {
                fwrite($uart, "hello\n");
                //echo fgets($uart); //echo
                //echo fgets($uart); //ok
                echo uart_read_line($uart); //echo
                echo uart_read_line($uart); //ok
                fclose($uart);
            }else{
                return "Error: Cannot open ". $com;
            }
        }
        return $com;
    }
    
    function uart_read_line($uart)
    {
        while(substr($read, -1) !== "\n") {
            $read .= stream_get_contents($uart, 1);
        }

        return $read;
    }

    function uart_read_echo($uart,$cmd)
    {
        $l = strlen($cmd);
        //echo "[". $l. "]\n";

        //Loop receive echo, otherwise partial echo may come in
        do {
            $read .= stream_get_contents($uart, 1);
            //echo "[". $read. "] " . strlen($read) . "\n";
        } while(strlen($read) < $l); //a bit slow but reliable

        return $read;
    }

    function uart_read_eof($uart,$end)
    {
        if (php_uname('s') == "Windows NT") {
			//Windows does not set "stream_set_blocking"
			//PHP Bug https://bugs.php.net/bug.php?id=47918
			while(true) {
				$read .= stream_get_contents($uart, 1);
				foreach($end as $item) {
					if(strpos($read, $item) == true) {
						break 2;
					}
				}
			}
			$read .= uart_read_line($uart);
		}else{
			//Works well for Macs with auto timer.
			$timer = 10000;
			do {
				usleep($timer);
				$n = stream_get_contents($uart, -1);
				//echo "[" . strlen($n) . "]"; //DEBUG
				if($n != "") {
					$read .= $n;
					$timer--; //once we get going quicker to read ending.
				}else{
					$timer++;
				}
			} while($timer > 1000000); //1 second
		}

        return $read;
    }

    function fastUART($com,$speed)
    {
        $uart = fopen($com, "r+");
        stream_set_blocking($uart, 0); //O_NONBLOCK
        stream_set_timeout($uart, 8);
        
        if($uart)
        {
            $cmd = "fastuart " .$speed. "\n";

            if($speed != "921600")
                $cmd = "fastuart 0\n";

            fwrite($uart,$cmd);
            $read = uart_read_echo($uart,$cmd); //echo
            $err = substr($read, 0, 2);

            if($err === "2D" || $err === "w}"){ //Bootloader loop detected or wrong speed
                fclose($uart);
                return $read;
            }

            echo $read;

            $read = uart_read_line($uart); //fread($uart,26); //ok

            if(strpos($read, "OK") !== false)
            {
                $_SESSION["speed"] = $speed;
                $read .= uart_read_line($uart); //speed
            }
            fclose($uart);

            return $read;
        }else{
        	fclose($uart);
            return "Error: ". $com;
        }
    }
    
    function readArray($cmd,$n)
    {
        $arr = array();
        $com = $_SESSION["serial"];
        $uart = fopen($com, "r+"); //Read & Write
        stream_set_blocking($uart, 0); //O_NONBLOCK
        stream_set_timeout($uart, 8);

        if($uart)
        {
            $cmd = "get " .$cmd. "\n";

            fwrite($uart, $cmd);
            $read = uart_read_echo($uart,$cmd); //echo

            for ($x = 0; $x <= $n; $x++)
            {
                fwrite($uart, "!");
                $read = uart_read_line($uart); //fgets($uart);
                $read = ltrim($read, "!");

                array_push($arr, (float)$read);
            }
            fclose($uart);
            return $arr;
        }else{
        	fclose($uart);
            return "Error: ". $com;
        }
    }
    
    function readSerial($cmd)
    {
        $com = $_SESSION["serial"];
        $uart = fopen($com, "r+"); //Read & Write
        stream_set_blocking($uart, 0); //O_NONBLOCK
        stream_set_timeout($uart, 8);
        //print_r(stream_get_meta_data($uart));

        if($uart)
        {
            //while(stream_get_meta_data($uart)["unread_bytes"] > 0) //flush all previous output
            //    stream_get_contents($uart, -1);
            
            fwrite($uart, $cmd); //fputs($uart, $cmd);
            $read = uart_read_echo($uart,$cmd); //echo

            //DEBUG
            //echo $com;
            //echo $uart;
            //echo "\"" .$cmd. "\"";
            //echo "\"" .$read. "\"";

            if(substr($read, 0, 2) === "2D"){ //Bootloader loop detected
                fclose($uart);
                return "2D";
            }else if($cmd == "\n"){ //Hardware test
                $read = uart_read_line($uart);
                //Avoid freezing if no test firmware flashed
                if(strpos($read, "Unknown command") === false) {
                    $read .= uart_read_eof($uart,array("All tests","one test"));
                }
            }else if($cmd === "json\n"){
                $read = stream_get_contents($uart, 1024); //fread($uart,1024);
                for ($i = 0; $i < 9; $i++) {
                    $read .= stream_get_contents($uart, 1024); //fread($uart,1024);
                }
                while (substr($read, -6) !== "}\r\n}\r\n"){
                    $read .= stream_get_contents($uart, 1); //fread($uart,1);
                }
            }else if($cmd === "all\n" || $cmd === "errors\n"){
                $read = uart_read_eof($uart,array("\r"));
            }else if($cmd === "save\n"){
                $read = uart_read_line($uart); //fgets($uart); //CRC
                $read .= uart_read_line($uart); //fgets($uart); //CAN
            }else{
                if(strpos($cmd,",") !== false) //Multi-value support
                {
                    $read = "";
                    $streamCount = 0;
                    $streamLength = substr_count($cmd, ',');

                    while($streamCount <= $streamLength)
                    {
                        $read .= uart_read_line($uart); //fgets($uart);
                        $streamCount++;
                    }
                }else{
                    $read = fgets($uart);
                }
            }
            fclose($uart);
            
            $read = str_replace("\r", "", $read);
            $read = rtrim($read, "\n");
            
            return $read;
        }else{
        	fclose($uart);
            return "Error: ". $com;
        }
    }

    function streamSerial($cmd,$loop,$delay)
    {
        $com = $_SESSION["serial"];
        $uart = fopen($com, "r+"); //Read & Write
        stream_set_blocking($uart, 0); //O_NONBLOCK
        stream_set_timeout($uart, 8);

        if($uart)
        {
            $streamLength = substr_count($cmd, ',');
        
            fwrite($uart, $cmd);
            $read = uart_read_line($uart); //fgets($uart); //echo

            for ($i = 0; $i < $loop; $i++)
            {
                $streamCount = 0;

                if($i != 0)
                    fwrite($uart, "!");
                
                ob_end_flush();
                while($streamCount <= $streamLength)
                {
                    $read = uart_read_line($uart); //fgets($uart);
                    $read = ltrim($read, "!");
                    
                    echo str_replace("\r", "", $read);
                    
                    usleep($delay);
                    $streamCount++;
                }
                ob_start();
            }
            fclose($uart);

        }else{
        	fclose($uart);
            return "Error: ". $com;
        }
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