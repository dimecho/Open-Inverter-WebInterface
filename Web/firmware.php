<?php

    require('config.inc.php');

    error_reporting(E_ERROR | E_PARSE);
	
    if(isset($_GET["ajax"]))
    {
		//TODO: dynamic - $_GET["serial"]
		
		$uart = fopen(serialDevice(), "rb+"); //Read & Write
		stream_set_blocking($uart, 1); //O_NONBLOCK
        stream_set_timeout($uart, 30);
        
        $PAGE_SIZE_BYTES = 1024;
		$file = urldecode($_GET["file"]);
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
		
		wait_for_char($uart,'S'); //Wait for size request
		
        print "Sending number of pages.." .$pages. "\n";
		
		fwrite($uart, chr($pages)); //Use 'chr', sending 'int' will cause Transmission Error
		//fputs($uart,$pages);
		
		wait_for_char($uart,'P'); //Wait for page request
		
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
		
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                var file = $('.file');
                file.trigger('click');
            });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10">
                    <table class="table table-active bg-light table-bordered">
                        <tbody>
                        <?php if(isset($_FILES["firmware"])){ ?>
                            <tr>
                                <td>
                                    <script>
                                        $(document).ready(function() {
											
                                            var progressBar = $("#progressBar");
                                            for (var i = 0; i < 100; i++) {
                                                setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                                            }
                                            $.ajax({
                                                type: "GET",
                                                url:
                                                <?php
                                                    echo "'/firmware.php?ajax=1";
                                                    if (strpos(strtolower(php_uname('s')), "darwin") !== false) {
                                                        $tmp_name = "/tmp/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }else{
                                                        $tmp_name = sys_get_temp_dir(). "/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    echo "&file=" .urlencode($tmp_name);
                                                    echo "&serial=" .urlencode($_POST["serial"]). "'";
                                                ?>,
                                                success: function(data){
                                                    deleteCookie("version");
                                                    //console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                    setTimeout( function (){
                                                        window.location.href = "/index.php";
                                                    },6400);
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <span class="badge badge-lg badge-warning ">Tip: If Olimex is bricked, try pressing "reset" button while flashing</span>
                                    <br/><br/>
                                    <div id="output"></div>
                                </td>
                            </tr>
                        <?php }else{ ?>
                            <script>
                                $(document).ready(function() {
                                    $.ajax({
                                        async: false,
                                        type: "GET",
                                        url: "/serial.php?com=list",
                                        success: function(data){
                                            //console.log(data);
                                            var s = data.split(',');
                                            for (var i = 0; i < s.length; i++) {
                                                $("#serialList").append($("<option>",{value:s[i],selected:'selected'}).append(s[i]));
                                            }
                                        }
                                    });
                                });
                            </script>
                            <tr>
                                <td>
                                    <center>
                                        <div class="input-group" style="width:60%">
                                            <span class="input-group-addon" style="width:90%">
                                                <select name="serial" class="form-control" form="Aform" id="serialList" style="width:100%"></select>
                                            </span>
                                            <span class="input-group-addon">
                                                <button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select BIN</button>
                                            </span>
                                        </div>
                                        <br><br>
                                        <span class="badge badge-lg badge-warning">Caution: Main board for Olimex powered with 3.3V - Double check your USB-TTL adapter.</span>
                                        <br>
                                        <br>
                                        <img src="/firmware/img/usb_ttl.jpg">
                                    </center>
                                </td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-lg-1"></div>
            </div>
        </div>
        <form enctype="multipart/form-data" action="/firmware.php" method="POST" id="Aform">
            <input name="firmware" type="file" class="file" hidden onchange="javascript:this.form.submit();"/>
            <input type="submit" hidden/>
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
	
	function wait_for_char($uart,$c)
	{
		while($recv_char = fread($uart,1))
		{
			//print $recv_char. "\n";
			if($recv_char == $c)
				break;
		}
	}
?>