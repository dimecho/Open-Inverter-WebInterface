<?php
	//set_time_limit(10000);

	$file_name = "";
	$file_tmp = "";
	$ajax_url = "\"" . basename($_SERVER['PHP_SELF']). "?ajax=1";

	$ocd_interface = "";
	if(isset($_POST["interface"])) {
		$ocd_interface = $_POST["interface"];
	}

	if(isset($_FILES["firmware"])) {
		$file_name = $_FILES["firmware"]["name"];
		$file_tmp = $_FILES["firmware"]["tmp_name"];
	}else if(isset($_FILES["filesystem"])) {
		$file_name = $_FILES["filesystem"]["name"];
		$file_tmp = $_FILES["filesystem"]["tmp_name"];
		$ajax_url .= "&littlefs=1";
	}

    $ocd_file = "";
	if ($os === "mac") {
		$ocd_file = "/tmp/" .$file_name;
	}elseif ($os === "windows") {
		$ocd_file = sys_get_temp_dir(). "\\" .$file_name;
		$ocd_interface = str_replace("/","\\",$ocd_interface);
	}else{
		$ocd_file = sys_get_temp_dir(). "/" .$file_name;
	}
	move_uploaded_file($file_tmp, $ocd_file);

	$ajax_url .= "&file=" .urlencode($ocd_file);
	$ajax_url .= "&interface=" .urlencode($ocd_interface). "\"";
?>
<script>
	var timerUploadCounter = 0;

	function firmwareUpdateRun() {

	    var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
            	var data = xhr.responseText;
				//console.log(data);

				timerUploadCounter = 100;
				
                deleteCookie('version');
				$('#output').append($('<pre>').append(data));
            <?php
                if (basename($_SERVER['PHP_SELF']) == "bootloader.php"){
			?>
				progressBootloaderAnalisys(data)
			<?php
                }else if (basename($_SERVER['PHP_SELF']) == "firmware.php"){
            ?>
            	progressFirmwareAnalisys(data);
            <?php
                }else{ //esp8266.php
            ?>
            if(data.indexOf('data verified') !=-1){
            	$.notify({ message: "ESP Ready! Scan WiFi" },{ type: "success" });
			}else if(data.indexOf('Failed to connect') !=-1){
				$.notify({ message: "GPIO 0 must be SOLDERED to 0" },{ type: "danger" });
				$.notify({ message: "Try swapping TX <-> RX" }, { type: "warning" });
			}
            <?php
                }
            ?>
                if(data.indexOf("Transmission Error") !=-1){
                    $.notify({ message: "USB power insufficeint, plug inverter to 12V" },{ type: "danger" });
                }else if(data.indexOf("timeout") !=-1){
                    $.notify({ message: "If Olimex is bricked, press reset button while flashing" },{ type: "warning" });
                }
            }
        };
        xhr.open('GET', <?php echo $ajax_url; ?>, true);
        xhr.send();

        firmwareProgress(100);
	};

	function firmwareProgress(speed) {
	    var timer = setInterval(function(){
	    	timerUploadCounter++;
	    	if(timerUploadCounter == 100) {
		        clearInterval(timer);
		    }
		    document.getElementsByClassName('progress-bar')[0].style.width = timerUploadCounter + '%';
	    }, speed);
	};
</script>
<div class="progress progress-striped active">
    <div class="progress-bar" style="width:0%" id="progressBar"></div>
</div>
<br><br>
<div class="container" id="output"></div>