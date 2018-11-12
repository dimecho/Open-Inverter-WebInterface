<?php
    include_once("common.php");
    error_reporting(E_ERROR | E_PARSE);
	$os = detectOS();

    if(isset($_GET["ajax"]))
    {
		$file = urldecode($_GET["file"]);
		$interface = urldecode($_GET["interface"]);
		
		if (strpos($interface, "interface") !== false) {
			$command = runCommand("openocd", $file. " " .$interface. " ram", $os);
			exec($command, $output, $return);
			echo sys_get_temp_dir();
			echo "\n$command\n";
			foreach ($output as $line) {
				echo "$line\n";
			}
		}else{
			$uart = fopen($_SESSION["serial"], "r+"); //Read & Write
			//stream_set_blocking($uart, 1); //O_NONBLOCK
			//stream_set_timeout($uart, 30);
			
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
			
			$pages = round(($len + $PAGE_SIZE_BYTES - 1) / $PAGE_SIZE_BYTES);
			
			while((count($data) % $PAGE_SIZE_BYTES) > 0) //Fill ramaining bytes with zeros, prevents corrupted endings
				array_push($data, 0);

			print "File length is " .$len. " bytes/" .$pages. " pages\n";
			
			print "Resetting device...\n";
			
			fwrite($uart, "reset\r");
			
			$c = wait_for_char($uart,array('S','2')); //Wait for size request

			if($c == '2') //version 2 bootloader
			{
				fwrite($uart, 0xAA); //Send magic
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
				$c = "";
				
				while ($c != "C")
				{
					$idx = $page * $PAGE_SIZE_BYTES;
					$cnt = 0;
					
					while ($cnt < $PAGE_SIZE_BYTES)
					{
						fwrite($uart, chr($data[$idx]));
						//print chr($data[$idx]);
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
        <?php include "header.php"; ?>
        <script type="text/javascript" src="js/firmware.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php"; ?>
            <br/>
            <div class="row">
                <div class="col">
					<table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <button type="button" class="btn btn-primary" onClick="window.open('https://github.com/jsphuebner/stm32-sine')"><i class="glyphicon glyphicon-circle-arrow-down"></i> Download Firmware</button>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered">
						<?php if(isset($_FILES["firmware"])){ ?>
                        <tr>
                            <td>
								<script>
									$(document).ready(function() {
										var progressBar = $("#progressBar");
										for (i = 0; i < 100; i++) {
											setTimeout(function(){ progressBar.css("width", i + "%"); }, i*1000);
										}
										$.ajax({
											type: "GET",
											url:
											<?php
												//$tmp_dir = ini_get('upload_tmp_dir') ? ini_get('upload_tmp_dir') : sys_get_temp_dir();
												echo "'";
												echo "firmware.php?ajax=1";
												$ocd_interface = $_POST["interface"];
												if ($os === "mac") {
													$ocd_file = "/tmp/" .$_FILES['firmware']["name"];
												}elseif ($os === "windows") {
													$ocd_file = sys_get_temp_dir(). "\\" .$_FILES['firmware']["name"];
													$ocd_interface = str_replace("/","\\",$ocd_interface);
												}else{
													$ocd_file = sys_get_temp_dir(). "/" .$_FILES['firmware']["name"];
												}
												move_uploaded_file($_FILES['firmware']['tmp_name'], $ocd_file);
												echo "&file=" .urlencode($ocd_file);
												echo "&interface=" .urlencode($ocd_interface);
												echo "'";
											?>,
											success: function(data){
												//console.log(data);
                                                deleteCookie("version");
												progressBar.css("width","100%");
												$("#output").append($("<pre>").append(data));
                                                if(data.indexOf("shutdown command invoked") !=-1)
                                                {
                                                    $.notify({ message: "Flash Complete" },{ type: 'success' });
                                                    $.notify({ message: "Use USB-RS232" },{ type: 'warning' });
                                                    $.notify({ message: "Unlug JTAG Programmer" },{ type: 'danger' });
                                                }
                                                setTimeout( function (){
                                                    window.location.href = "index.php";
                                                },12000);
											}
										});
									});
								</script>
								<div class="progress progress-striped active">
                                    <div class="progress-bar" style="width:0%" id="progressBar"></div>
                                </div>
                                <br/><span class="badge badge-lg badge-warning">Tip: If Olimex is bricked, try pressing "reset" button while flashing</span><br/><br/>
                                <div id="output"></div>
							</td>
                        </tr>
						<?php }else{ ?>
						<script>
                                $(document).ready(function() {
									//$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?com=list", {
                                    $.ajax("serial.php?com=list", {
										success: function(data) {
											//console.log(data);
											var s = data.split(',');
											for (var i = 0; i < s.length; i++) {
												if(s[i] != "")
													$("#firmware-interface").append($("<option>",{value:s[i]}).append(s[i]));
											}
										}
									});
                                    for (var i = 0; i < jtag_interface.length; i++) {
                                        $("#firmware-interface").append($("<option>",{value:jtag_interface[i],selected:'selected'}).append(jtag_interface[i]));
                                    }
                                    $("#firmware-interface").prop('selectedIndex', 0);
									$(".loader").hide();
									$(".input-group-addon").show();
                                    setInterfaceImage();
                                });
                        </script>
						<tr>
                            <td>
								<center>
                                <div class="loader"></div>
                                <div class="input-group w-100">
                                    <span class="input-group-addon hidden w-75">
                                        <select name="interface" class="form-control" form="firmwareForm" onchange="setInterfaceImage()" id="firmware-interface"></select>
                                    </span>
                                    <span class="input-group-addon hidden w-25">
										<center>
											<button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select stm32_sine.bin</button>
										</center>
									</span>
                                </div>
                                <br/><br/>
                                <h2 id="jtag-name"></h2>
                                <span class="badge badge-lg badge-warning" id="jtag-txt"></span><br/>
                                <img src="" id="jtag-image" class="rounded" />
								</center>
                            </td>
                        </tr>
						<?php } ?>
                    </table>
                </div>
            </div>
        </div>
        <form enctype="multipart/form-data" action="firmware.php" method="POST" id="firmwareForm">
            <input name="firmware" type="file" class="file" hidden onchange="firmwareUpload()" />
        </form>
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
            //print $recv_char. "\n";
            foreach($c as $item)
                if($recv_char == $item)
                    return $recv_char;
        }
        return -1;
    }
?>