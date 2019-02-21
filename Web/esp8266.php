<!DOCTYPE html>
<html>
 <head>
	<?php include "header.php" ?>
	<script>
	var i = 1;
	var timer;
	var formName;
	
	function progressTimer() {
		var progressBar = $("#progressBar");
		progressBar.css("width", i + "%");
		i++;
		if(i == 100) {
			clearInterval(timer);
			$(formName).submit();
		}
	};

	function HiddenCheck(id,element) {
		if(element.checked) {
			$("#" + id).val("1");
		}else{
			$("#" + id).val("0");
		}
	};
	
	$(document).ready(function() {

		$.ajax("/nvram", {
            dataType: 'json',
	        success: function success(data) {
                console.log(data);
                if(data["nvram0"] == "0") {
                	$("#WiFiModeAP").prop("checked", true);
                }else{
                	$("#WiFiModeClient").prop("checked", true);
                }
                var bool_value = data["nvram1"] == "1" ? true : false;
                $("#WiFiHidden").val(data["nvram1"]);
                $("#WiFiHiddenCheckbox").prop("checked", bool_value);
                $("#WiFiChannel").val(data["nvram2"]);
                $("#WiFiSSID").val(data["nvram3"]);
                bool_value = data["nvram5"] == "1" ? true : false;
                $("#EnableSWD").val(data["nvram5"]);
                $("#EnableSWDCheckbox").prop("checked", bool_value);
                bool_value = data["nvram6"] == "1" ? true : false;
                $("#EnableCAN").val(data["nvram6"]);
                $("#EnableCANCheckbox").prop("checked", bool_value);
                $(".loader").hide();
                $("#parameters").show();
	        }
	    });

		$("#fileSPIFFS").change(function() {
			i = 1;
			formName = "#formSPIFFS";
			timer = setInterval(progressTimer, 250);
			//Format SPIFFS
			$.ajax("/format", {
		        success: function success(data) {
		            $.notify({ message: data }, { type: "success" });
		            $.ajax("/reset");
		            clearInterval(timer);
		            timer = setInterval(progressTimer, 50);
		        }
		    });
		});

		$("#fileSketch").change(function() {
			i = 1;
			formName = "#formSketch";
			timer = setInterval(progressTimer, 40);
		});

		$("#browseSPIFFS").click(function(){
			$("#fileSPIFFS").trigger("click");
		});
		
		$("#browseSketch").click(function(){
			$("#fileSketch").trigger("click");
		});
	});
	</script>
 </head>
 <body>
	<div class="container">
		<?php include "menu.php" ?>
		<div class="row">
			<div class="col">
			    <table class="table table-active table-bordered">
                    <tr>
                        <td>
                        	<center><div class="loader"></div></center>
                        	<form class="hidden" method="POST" action="/nvram" id="parameters" oninput='WiFiPasswordConfirm.setCustomValidity(WiFiPasswordConfirm.value != WiFiPassword.value ? "Passwords do not match." : "")'>
                        		<fieldset class="form-group">
                        			<legend>ESP8266 Wireless Connection:</legend>
		                        	<div class="form-check">
		                        		<label class="form-check-label">
									    <input type="radio" class="form-check-input" id="WiFiModeAP" name="WiFiMode" value="0">
									        WiFi Access Point
									    </label>
									</div>
									<div class="form-check">
		                        		<label class="form-check-label">
									    <input type="radio" class="form-check-input" id="WiFiModeClient" name="WiFiMode" value="1">
									        WiFi Client
									    </label>
									</div>
									<br>
									<div class="form-check">
									  <label class="form-check-label">
									  	<input type="hidden" id="WiFiHidden" name="WiFiHidden" value="0">
									    <input type="checkbox" id="WiFiHiddenCheckbox" class="form-check-input" onclick="HiddenCheck('WiFiHidden',this)">
									    	Hidden SSID
									  </label>
									</div>
								</fieldset>
								<div class="form-group">
									<label for="WiFiChannel">Channel</label>
									<div class="input-group">
										<div class="input-group-addon"><i class="icons icon-graph-bar p-3"></i></div>
										<select id="WiFiChannel" class="form-control" name="WiFiChannel">
											<option>1</option>
											<option>2</option>
											<option>3</option>
											<option>4</option>
											<option>5</option>
											<option>6</option>
											<option>7</option>
											<option>8</option>
											<option>9</option>
											<option>10</option>
											<option>11</option>
										</select>
									</div>
								</div> 
								<div class="form-group">
									<div class="input-group">
								    	<div class="input-group-addon"><i class="icons icon-wifi p-3"></i></div>
								    	<input type="text" id="WiFiSSID" name="WiFiSSID" class="form-control" placeholder="SSID" required>
									</div>
								</div>
								<div class="form-group">
									<div class="input-group">
										<div class="input-group-addon"><i class="icons icon-password p-3"></i></div>
								    	<input type="password" id="WiFiPassword" name="WiFiPassword" class="form-control" placeholder="Password" required>
									</div>
								</div>
								<div class="form-group">
									<div class="input-group">
										<div class="input-group-addon"><i class="icons icon-password p-3"></i></div>
								    	<input type="password" id="WiFiPasswordConfirm" name="WiFiPasswordConfirm" class="form-control" placeholder="Password Confirm">
									</div>
								</div>
								<div class="form-group">
									<div class="form-check">
									  <label class="form-check-label">
										  	<input type="hidden" id="EnableSWD" name="EnableSWD" value="0">
									    	<input type="checkbox" id="EnableSWDCheckbox" class="form-check-input" onclick="HiddenCheck('EnableSWD',this)"> Enable SWD
									  </label>
									</div>
									<div class="form-check">
									  <label class="form-check-label">
										  	<input type="hidden" id="EnableCAN" name="EnableCAN" value="0">
								    		<input type="checkbox" id="EnableCANCheckbox" class="form-check-input" onclick="HiddenCheck('EnableCAN',this)"> Enable CAN
									  </label>
									</div>
								</div>
								<center><button type="submit" class="btn btn-success"><i class="icons icon-ok"></i> Save</button></center>
                            </form>
                        </td>
                    </tr>
                </table>
				<table class="table table-active table-bordered">
					<tr align="center">
						<td align="center">
							<button class="btn btn-primary" type="button" id="browseSPIFFS"><i class="icons icon-chip"></i> Flash SPIFFS</button>
						</td>
						<td align="center">
							<button class="btn btn-primary" type="button" id="browseSketch"><i class="icons icon-chip"></i> Flash Sketch</button>
						</td>
					</tr>
					<tr align="center">
						<td colspan="2">
							<div class="progress progress-striped active">
								<div class="progress-bar" style="width:1%" id="progressBar"></div>
							</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	<form method="POST" action="/update?cmd=0" enctype="multipart/form-data" id="formSketch">
		<input type='hidden' name='cmd' value='0'>
		<input type="file" name="firmware" id="fileSketch" hidden />
		<input type="submit" hidden />
	</form>
	<form method="POST" action="/update?cmd=100" enctype="multipart/form-data" id="formSPIFFS">
		<input type='hidden' name='cmd' value='100'>
		<input type="file" name="spiffs" id="fileSPIFFS" hidden />
		<input type="submit" hidden />
	</form>
</body>
</html>