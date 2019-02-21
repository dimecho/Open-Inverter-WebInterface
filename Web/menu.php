<div class="row">
	<div class="col">
		<div class="container bg-light">
			<div class="row">
				<div class="col-auto mr-auto">
					<nav class="navbar" id="buildNav"></nav>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="row mt-3"></div>
<form action="snapshot.php" method="POST" enctype="multipart/form-data">
	<input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();" accept=".txt">
	<input type="submit" hidden>
</form>
<a class="macdrivers" data-fancybox data-src="#macdrivers" href="javascript:;"></a>
<div class="hidden" id="macdrivers" style="width:60%;border-radius:5px">
	<center>
		<img src="img/majove-logo.png" />
		<br><br>
		<p>Recommended Mac Drivers: <a href="#">mac-usb-serial.com</a></p>
		<br>
		<button class="browse btn btn-primary" type="button" onClick="$.fancybox.close();window.open('https://www.mac-usb-serial.com','_blank');"><i class="icons icon-download"></i> Download</button>
	</center>
</div>
<a class="serial" data-fancybox data-src="#serial" href="javascript:;"></a>
<div class="hidden" id="serial" style="width:60%;border-radius:5px">
	<p>Select Serial Interface:</p>
	<select name="interface" class="form-control" form="serialForm" id="serial-interface"></select>
	<br>
	<button class="browse btn btn-primary" type="button" onClick="selectSerial();$.fancybox.close();"><i class="icons icon-save"></i> Save</button>
</div>
<a class="hardware" data-fancybox data-src="#hardware" href="javascript:;"></a>
<div class="hidden" id="hardware" style="width:60%;border-radius:5px">
	<p>Select Hardware Version:</p>
	<select name="hardware" class="form-control" form="hardwareForm" id="hwver">
		<option value=0>Hardware v1.0</option>
		<option value=1>Hardware v2.0</option>
		<option value=2>Hardware v3.0</option>
	</select>
	<br>
	<button class="browse btn btn-primary" type="button" onClick="selectHardware();$.fancybox.close();"><i class="icons icon-save"></i> Save</button>
</div>
<a class="safety" data-fancybox data-src="#warning" href="javascript:;"></a>
<div class="hidden" id="warning" style="width:60%;border-radius:5px">
	<center>
		<img src="img/safety.png" />
	</center>
	<p>
	This project is for educational purpose. High power electronics can cause damage, death or injury. You have decided to build your own inverter so you are responsible for what you do.
	</p>
	<table class="table">
		<tr>
			<td>
				<center><button type="button" class="btn btn-danger" onClick="$.fancybox.close();setCookie('safety', 1, 360);location.reload();"><i class="icons icon-power"></i> I Agree</button></center>
			</td>
		</tr>
	</table>
</div>