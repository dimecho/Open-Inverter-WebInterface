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
	
	$(document).ready(function() {
		$("#fileSPIFFS").change(function() {
			i = 1;
			formName = "#formSPIFFS";
			timer = setInterval(progressTimer, 250);
			//Format SPIFFS
			$.ajax("/format", {
		        success: function success(data) {
		            $.notify({ message: data }, { type: "success" });
		            $.ajax("/reset");
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
		<br/><br/>
		<div class="row">
			<div class="col">
			    <table class="table table-active table-bordered">
                    <tr>
                        <td>
                        	<form method="POST" action="/nvram">
                        		<fieldset class="form-group">
                        			<legend>ESP8266 Wireless Connection Mode:</legend>
		                        	<div class="form-check">
		                        		<label class="form-check-label">
									    <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked>
									        WiFi Access Point
									    </label>
									</div>
									<div class="form-check">
		                        		<label class="form-check-label">
									    <input type="radio" class="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2">
									        WiFi Client
									    </label>
									</div>
								</fieldset>
								<div class="form-group">
									<label class="sr-only" for="inputWiFiSSID">SSID</label>
									<div class="input-group">
								    	<div class="input-group-addon"><i class="glyphicon glyphicon-signal prefix"> </i></div>
								    	<input type="text" id="inputWiFiSSID" class="form-control" placeholder="SSID">
									</div>
								</div>
								<div class="form-group">
									<label class="sr-only" for="inputWiFiPassword">Password</label>
									<div class="input-group">
										<div class="input-group-addon"><i class="glyphicon glyphicon-lock prefix"> </i></div>
								    	<input type="password" id="inputWiFiPassword" class="form-control" placeholder="Password">
									</div>
								</div>
								<center><button type="submit" class="btn btn-success"><i class="glyphicon glyphicon-ok-sign"></i> Save</button></center>
                            </form>
                        </td>
                    </tr>
                </table>
				<table class="table table-active table-bordered">
					<tr align="center">
						<td align="center">
							<button class="btn btn-primary" type="button" id="browseSPIFFS"><i class="glyphicon glyphicon-th"></i> Flash SPIFFS</button>
						</td>
						<td align="center">
							<button class="btn btn-primary" type="button" id="browseSketch"><i class="glyphicon glyphicon-th"></i> Flash Sketch</button>
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