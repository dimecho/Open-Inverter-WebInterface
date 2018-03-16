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
		if(i >= 100) {
			clearInterval(timer);
			setTimeout(function (){
				$($formName).submit();
			},1000);
		}
	};
	
	$(document).ready(function() {
		$("#fileSPIFFS").change(function() {
			i = 1;
			formName = "#formSPIFFS";
			timer = setInterval(progressTimer, 200);
		});
		$("#fileRAM").change(function() {
			i = 1;
			formName = "#formRAM";
			timer = setInterval(progressTimer, 200);
		});
	});
	
	$(document).on('click', '.browseSPIFFS', function(evt){
		$('#fileSPIFFS').trigger('click');
	});
	
	$(document).on('click', '.browseRAM', function(evt){
		$('#fileRAM').trigger('click');
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
							<span class="badge badge-lg badge-danger">Select SPIFFS first and RAM second</span><br/>
							<span class="badge badge-lg badge-info">flash-spiffs.bin contains SPIFFS file system</span><br/>
							<span class="badge badge-lg badge-info">flash-ram.bin contains Arduino compiled program</span><br/>
							<span class="badge badge-lg badge-warning">flash-full.bin contains entire 2MB flash</span>
						</td>
					</tr>
					<tr align="center">
						<td align="center">
							<button class="browseSPIFFS btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Flash SPIFFS</button>
						</td>
						<td align="center">
							<button class="browseRAM btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Flash RAM</button>
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
	<form action="/update" method="POST" id="formRAM" enctype="multipart/form-data">
		<input name="update" type="file" id="fileRAM" />
		<input type="submit" hidden/>
	</form>
	<form action="/update" method="POST" id="formSPIFFS" enctype="multipart/form-data">
		<input name="update" type="file" id="fileSPIFFS" />
		<input type="submit" hidden/>
	</form>
</body>
</html>