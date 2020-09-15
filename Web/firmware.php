<?php
    include_once("common.php");
	$os = detectOS();

    if(isset($_GET["ajax"]))
    {
		$file = urldecode($_GET["file"]);
		$interface = urldecode($_GET["interface"]);
		
		if (strpos($interface, "interface") !== false) {
            if (strpos($interface, "stlink-v2") !== false) {
                $command = runCommand("stlink", $file. " ram", $os, 0);
            }else{
                $command = runCommand("openocd", $file. " " .$interface. " ram", $os, 0);
            }
			exec($command, $output, $return);
			echo sys_get_temp_dir();
			echo "\n$command\n";
			foreach ($output as $line) {
				echo "$line\n";
			}
		}else{
		
			$uart = fopen($interface, "rb+"); //Read & Write
			//stream_set_blocking($uart, 1); //O_NONBLOCK
			//stream_set_timeout($uart, 30);
			
			if(!$uart)
				return $interface;
			
			$PAGE_SIZE_BYTES = 1024;
			$len = filesize($file);
			
			if ($len < 1) {
				print "File is empty\n";
				exit;
			}
			
			$handle = fopen($file, "rb");
			$read = fread($handle, $len);
			$data = bytearray($read);
			fclose($handle);
			
			$pages = ($len + $PAGE_SIZE_BYTES - 1) / $PAGE_SIZE_BYTES;
			
            print "File length is " .$len. " bytes/" .$pages. " pages\n";

			while((count($data) % $PAGE_SIZE_BYTES) > 0) //Fill remaining bytes with zeros, prevents corrupted endings
				array_push($data, 0);

            print "Adjusted ending with zeros to " .count($data). " bytes\n";
			
			print "Resetting device...\n";
			
			# Clear the initialization Bug
			#-----------------------------
			fwrite($uart, "hello\n");
            fgets($uart); //echo
            fgets($uart); //ok
			#-----------------------------
			fwrite($uart, "reset\n");
			
			$c = wait_for_char($uart,array('S','2')); //Wait for size request
			
			print "Ready " .$c. "\n";
			
			if($c == '2') //version 2 bootloader
			{
				fwrite($uart, chr(0xAA)); //Send magic
				print "Sending *magic* 0xAA\n";
				wait_for_char($uart,array('S'));
			}
			
			print "Sending number of pages.." .$pages. "\n";
			
			fwrite($uart, chr($pages)); //Use 'chr', sending 'int' will cause Transmission Error
			//fputs($uart,$pages);
			
			wait_for_char($uart,array('P')); //Wait for page request
			
			ob_flush();
			
			$page = 0;
			$done = false;
			$idx = 0;
			
			while($done != true)
			{
				print "Sending page " .$page. " ...\n";
				
				$crc = calcStmCrc($data, $idx, $PAGE_SIZE_BYTES);
                print "Checksum " .$crc. "\n";

				$c = "";
				while ($c != "C")
				{
					$idx = $page * $PAGE_SIZE_BYTES;
					$cnt = 0;
					
					while ($cnt < $PAGE_SIZE_BYTES)
					{
						fwrite($uart, chr($data[$idx]));
						//print unpack("H*", chr($data[$idx]));
						$idx++;
						$cnt++;
					}
					
					$c = fread($uart,1);

					if ($c == "T")
						print "Transmission Error\n";
				}
			  
				print "Sending CRC...\n";
				
				fwrite($uart, chr($crc & 0xFF));
				fwrite($uart, chr(($crc >> 8) & 0xFF));
				fwrite($uart, chr(($crc >> 16) & 0xFF));
				fwrite($uart, chr(($crc >> 24) & 0xFF));
				
				$c = fread($uart,1);
				
				if ('D' == $c) {
					print "CRC correct!\n";
					print "Update done!\n";
					$done = true;
				}else if ('E' == $c) {
					print "CRC error!\n";
				}else if ('P' == $c) {
					print "CRC correct!\n";
					$page = $page + 1;
				}
			}
			fclose($uart);
		}
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/firmware.js"></script>
    </head>
    <body>
    	<div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col">
					<table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <button type="button" class="btn btn-primary" onClick="window.open('https://github.com/jsphuebner/stm32-sine')"><i class="icons icon-download"></i> <span id="text_download">Download Firmware</span></button>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered">
                    	<tr>
                            <td>
							<?php
	                        if(isset($_FILES["firmware"])) {
								require "upload-status.php";
	                        }else{
	                        ?>
							<center>
                            <div class="spinner-border text-dark"></div>
                            <div class="input-group w-100">
                                <div class="input-group-addon d-none w-75">
									<form enctype="multipart/form-data" action="firmware.php" method="POST" id="firmwareForm">
										<input name="firmware" type="file" class="file" accept=".bin,.hex" onchange="firmwareUpload()" hidden>
										<select name="interface" class="form-control" onchange="setInterfaceImage(this.selectedIndex)" id="firmware-interface"></select>
										<input type="submit" hidden />
									</form>
								</div>
                                <div class="input-group-addon d-none w-25 text-center">
									<button class="browse btn btn-primary" type="button" id="browseFile"><i class="icons icon-select"></i> Select stm32_sine.bin</button>
								</div>
                            </div>
                            <br><br><h2 id="jtag-name"></h2>
                            <span class="badge badge-lg bg-warning" id="jtag-txt"></span><br><br>
                            <img src="" id="jtag-image" class="img-thumbnail rounded" />
							</center>
							<?php
	                            } 
	                        ?>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <?php include "footer.php" ?>
    </body>
</html>
<?php
    }

    function calcStmCrc($data, $idx, $len)
    {
        $cnt = 0;
        $crc = 0xffffffff;
        
        while ($cnt < $len)
        {
            $word = $data[$idx] | ($data[$idx+1] << 8) | ($data[$idx+2] << 16) | ($data[$idx+3] << 24);
            $cnt = $cnt + 4;
            $idx = $idx + 4;

            $crc = $crc ^ $word;
            for($i = 0; $i < 32; $i++)
            {
                if ($crc & 0x80000000)
                {
                    $crc = (($crc << 1) ^ 0x04C11DB7) & 0xffffffff; //Polynomial used in STM32
                }else{
                    $crc = ($crc << 1) & 0xffffffff;
                }
            }
        }
        
        return $crc;
    }
    
    function bytearray($s)
    {
        return array_slice(unpack("C*", "\0".$s), 1);
    }
    
    function wait_for_char($uart, $c)
    {
        while($recv_char = fread($uart,1))
        {
			//print ">" . $recv_char. "\n";
            foreach($c as $item){
                if($recv_char == $item)
                    return $recv_char;
			}
        }
        return -1;
    }
?>