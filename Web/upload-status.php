<?php

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
	}else if(isset($_FILES["spiffs"])) {
		$file_name = $_FILES["spiffs"]["name"];
		$file_tmp = $_FILES["spiffs"]["tmp_name"];
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
	if(isset($_POST["cmd"])) {
		$ajax_url .= "&cmd=" .urlencode($_POST["cmd"]);
	}
	$ajax_url .= "&interface=" .urlencode($ocd_interface). "\"";
?>
<script>
	$(document).ready(function() {
		var progressBar = $("#progressBar");
		for (i = 0; i < 100; i++) {
			setTimeout(function(){ progressBar.css("width", i + "%"); }, i*1000);
		}
		$.ajax({
			type: "GET",
			url: <?php echo $ajax_url; ?>,
			success: function(data){
				//console.log(data);
                deleteCookie("version");
				progressBar.css("width","100%");
				$("#output").append($("<pre>").append(data));
               
            <?php
                if (basename($_SERVER['PHP_SELF']) == "bootloader.php"){
			?>
				if(data.indexOf("shutdown command invoked") !=-1 || data.indexOf("jolly good") !=-1)
				{
					$.notify({ message: "Bootloader Complete" },{ type: "success" });
					$.notify({ message: "...Next Flash Firmware" },{ type: "warning" });
					setTimeout( function (){
						window.location.href = "firmware.php";
					},8000);
				}
			<?php
                }else if (basename($_SERVER['PHP_SELF']) == "firmware.php"){
            ?>
            	if(data.indexOf("shutdown command invoked") !=-1 || data.indexOf("jolly good") !=-1 || data.indexOf("Update done") !=-1){
                    $.notify({ message: "Flash Complete" },{ type: "success" });
                }
                if(data.indexOf("shutdown command invoked") !=-1 || data.indexOf("jolly good") !=-1){
                    $.notify({ message: "Plugin USB-RS232-TTL" },{ type: "warning" });
                    $.notify({ message: "Unlug JTAG Programmer" },{ type: "danger" });
                }
                setTimeout( function (){
                    window.location.href = "index.php";
                },12000);
            <?php
                }else{ //esp8266.php
            ?>
			if(data.indexOf("Failed to connect") !=-1){
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
		});
	});
</script>
<div class="progress progress-striped active">
    <div class="progress-bar" style="width:0%" id="progressBar"></div>
</div>
<br><br>
<div class="container" id="output"></div>