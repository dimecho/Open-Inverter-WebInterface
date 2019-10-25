<div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
<div class="row mt-5"></div>
<div class="row mt-5"></div>
<form action="snapshot.php" method="POST" enctype="multipart/form-data">
	<input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();" accept=".txt">
	<input type="submit" hidden>
</form>
<a class="macdrivers" data-fancybox data-src="#macdrivers" href="#"></a>
<div class="hidden bg-light" id="macdrivers" style="width:60%;border-radius:5px">
	<center>
		<img src="" />
		<br><br>
		<p>Recommended Mac Drivers: <a href="#">mac-usb-serial.com</a></p>
		<br>
		<button class="btn btn-primary" type="button" onClick="$.fancybox.close();window.open('https://www.mac-usb-serial.com','_blank');"><i class="icons icon-download"></i> Download</button>
	</center>
</div>
<a class="serial" data-fancybox data-src="#serial" href="#"></a>
<div class="hidden bg-light" id="serial" style="width:60%;border-radius:5px">
	<p>Select Serial Interface:</p>
	<select name="interface" class="form-control" form="serialForm" id="serial-interface"></select>
	<br>
	<button class="btn btn-primary" type="button" onClick="selectSerial();$.fancybox.close();"><i class="icons icon-save"></i> Save</button>
</div>
<a class="hardware" data-fancybox data-src="#hardware" href="#"></a>
<div class="hidden bg-light" id="hardware" style="width:60%;border-radius:5px">
	<p>Select Hardware Version:</p>
	<select name="hardware" class="form-control" form="hardwareForm" id="hwver">
		<option value=0>Hardware v1.0</option>
		<option value=1>Hardware v2.0</option>
		<option value=2>Hardware v3.0</option>
	</select>
	<br>
	<button class="btn btn-primary" type="button" onClick="selectHardware();$.fancybox.close();"><i class="icon-save"></i> Save</button>
</div>
<a class="safety" data-fancybox data-src="#warning" href="#"></a>
<div class="hidden bg-light" id="warning" style="width:60%;border-radius:5px">
    <div class="row">
     	<div class="col-3"></div>
        <div class="col-6 text-dark border" align="center">
            <div class="bg-warning"><h1 class="icon-alert">WARNING</h1></div>
	        <div class="row">
	         	<div class="col"><h2>HIGH VOLTAGE</h2></div>
	         	<div class="col"><h1 class="icon-electric-shock display-3"></h1></div>
	        </div>
        </div>
        <div class="col-3"></div>
    </div>
    <div class="row mt-3">
     	<div class="col">
     		<p>
This project is for educational purpose. High power electronics can cause damage, death or injury. You have decided to build your own inverter so you are responsible for what you do.
</p>
     	</div>
    </div>
	<table class="table">
		<tr>
			<td>
				<center><button type="button" class="btn btn-danger" onClick="$.fancybox.close();setCookie('safety', 1, 360);location.reload();"><i class="icon-power"></i> I Agree</button></center>
			</td>
		</tr>
	</table>
</div>