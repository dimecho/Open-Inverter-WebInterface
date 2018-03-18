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
			$.ajax("/9d813656-a9a6-4978-8dea-ffb3a8498b1c", {
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
				<table class="table table-active bg-faded table-bordered">
					<tr>
						<td colspan="2">
							<span class="badge badge-lg badge-warning">flash-spiffs.bin contains SPIFFS file system</span><br/>
							<span class="badge badge-lg badge-warning">flash-sketch.bin contains Arduino program</span><br/>
						</td>
					</tr>
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
        <input type='hidden' name='cmd' value='0' />
		<input type="file" name="update" id="fileSketch" hidden />
		<input type="submit" hidden />
	</form>
	<form method="POST" action="/update?cmd=100" enctype="multipart/form-data" id="formSPIFFS">
        <input type='hidden' name='cmd' value='100' />
		<input type="file" name="update" id="fileSPIFFS" hidden />
		<input type="submit" hidden />
	</form>
</body>
</html>