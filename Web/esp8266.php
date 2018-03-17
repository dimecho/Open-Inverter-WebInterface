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
			timer = setInterval(progressTimer, 40);
		});

		$("#fileRAM").change(function() {
			i = 1;
			formName = "#formRAM";
			timer = setInterval(progressTimer, 40);
		});

		$("#browseSPIFFS").click(function(){
			$("#fileSPIFFS").trigger("click");
		});
		
		$("#browseRAM").click(function(){
			$("#fileRAM").trigger("click");
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
				<table class="table table-active bg-faded table-bordered">
					<tr>
						<td colspan="2">
							<span class="badge badge-lg badge-primary">flash-spiffs.bin contains SPIFFS file system</span><br/>
							<span class="badge badge-lg badge-primary">flash-ram.bin contains Arduino sketch</span><br/>
							<span class="badge badge-lg badge-danger">flash-full.bin contains entire 2MB flash</span>
						</td>
					</tr>
					<tr align="center">
						<td align="center">
							<button class="btn btn-primary" type="button" id="browseSPIFFS"><i class="glyphicon glyphicon-search"></i> Flash SPIFFS</button>
						</td>
						<td align="center">
							<button class="btn btn-primary" type="button" id="browseRAM"><i class="glyphicon glyphicon-search"></i> Flash RAM</button>
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
	<form method="POST" action="/update?cmd=0" enctype="multipart/form-data" id="formRAM">
        <input type='hidden' name='cmd' value='0' hidden />
		<input type="file" name="update" id="fileRAM" hidden />
		<input type="submit" hidden />
	</form>
	<form method="POST" action="/update?cmd=100" enctype="multipart/form-data" id="formSPIFFS">
        <input type='hidden' name='cmd' value='100' hidden />
		<input type="file" name="update" id="fileSPIFFS" hidden />
		<input type="submit" hidden />
	</form>
</body>
</html>