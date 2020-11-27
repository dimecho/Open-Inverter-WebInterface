var jtag_interface = [
    'interface/stlink-v2.cfg',
	'interface/ftdi/olimex-arm-usb-ocd-h.cfg',
	'interface/ftdi/olimex-arm-usb-tiny-h.cfg',
    'interface/ftdi/olimex-arm-jtag-swd.cfg',
	'interface/parport.cfg',
	'interface/ftdi/jtag-lock-pick_tiny_2.cfg'
];

var jtag_name = [
    'ST-Link v2.0',
	'Olimex OCD-H',
	'Olimex Tiny-H',
    'Olimex JTAG-SWD',
	'JTAG Wiggler',
	'Lock-Pick Tiny v2.0'
];

var timerProgress;
var timerProgressCounter = 0;

$(document).ready(function() {

	buildMenu(function() {

		var interface = document.getElementById('firmware-interface');
		document.getElementsByClassName('spinner-border')[0].classList.remove('d-none');

		if (typeof(interface) != undefined && interface != null)
		{
			var path = window.location.pathname;
	        var page = path.split('/').pop();

			if(os == 'esp8266') {

				var jtag_interface = ['swd-esp8266'];
				var jtag_name = ['SWD over ESP8266'];

				if(page != 'bootloader.php') {
					jtag_interface.push('uart-esp8266');
					jtag_name.push('UART over ESP8266');
				}

				displayHWVersion();

				var xhr = new XMLHttpRequest();
		        xhr.onload = function() {
		            if (xhr.status == 200) {
		            	var v = parseFloat(xhr.responseText)/1000;
						if(v < 3.0) {
							$.notify({ message: 'ESP Reporting Low Voltage'},{ type: 'danger' });
							$.notify({ message: 'Check 3.3V Regulator (' + v + 'V)'},{ type: 'warning' });
						}
						beginESP8266SWD(hardware);
		            }
		        };
		        xhr.open('GET', '/vcc', true);
		        xhr.send();
			}else{
				unblockSerial();

				displayHWVersion();

				for (var i = 0; i < hardware_name.length; i++) {
					var tab = document.createElement('a');
					tab.classList.add('nav-link');
					if(hardware == undefined)
						hardware = 2;
					if(hardware == i)
							tab.classList.add('active');
					tab.href = '#tab' + hardware_name[i].replace(' ','_').replace('.','_');
					tab.id = i;
					tab.textContent = hardware_name[i];
					tab.setAttribute('data-toggle', 'tab');
					tab.setAttribute('role', 'tab');
					tab.onclick = function() {
						//console.log(this.id);
						setInterfaceImage(this.id,interface.selectedIndex);
					};
					document.getElementById('hardwareTabs').appendChild(tab);

					var pane = document.createElement('div');
					pane.id = 'tab' + hardware_name[i].replace(' ','_').replace('.','_');
					pane.setAttribute('role', 'tabpanel');
					pane.classList.add('tab-pane');
					pane.classList.add('container');
					if(hardware == i) {
						pane.classList.add('show');
						pane.classList.add('active');
					}

					var img = document.createElement('img');
					img.id = 'hardware-image';
					img.class = 'img-thumbnail rounded';
					pane.appendChild(img);

					document.getElementById('hardwareTabContent').appendChild(pane);
				}

				if(page != 'bootloader.php') {
					var xhr = new XMLHttpRequest();
			        xhr.onload = function() {
			            if (xhr.status == 200) {
			                //console.log(xhr.responseText);
							if(xhr.responseText.length > 1) {
								var s = xhr.responseText.split('\n');
								for (var i = 0; i < s.length; i++) {
									if(s[i] != '') {
										var option = document.createElement('option');
										option.value = s[i];
										option.textContent = s[i];
										interface.appendChild(option);
									}
								}
		            			interface.selectedIndex = (jtag_interface.length + s.length - 2);
							}
			            }
			            setInterfaceImage(hardware,interface.selectedIndex);
			        };
			        xhr.open('GET', 'serial.php?com=list', true);
			        xhr.send();
		    	}else{
		    		setInterfaceImage(hardware,interface.selectedIndex);
		    	}
			}

			for (var i = 0; i < jtag_interface.length; i++) {
				var option = document.createElement('option');
				option.value = jtag_interface[i];
				option.textContent = jtag_name[i];
				interface.appendChild(option);
			}

			document.getElementsByClassName('spinner-border')[0].classList.add('d-none');
			$('.input-group-addon').removeClass('d-none'); //.show();

			document.getElementById('browseFile').onclick = function () {

				document.getElementsByClassName('file')[0].click();
		    };
		}else{
			firmwareUpdateRun();
		}
	});
});

function beginESP8266SWD(hw) {
	
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.response);
			if(xhr.response.connected === true) {
				$.notify({ message: 'SWD over ESP8266 Connected' },{ type: 'success' });
				$.notify({ message: 'Hardware IDCode: ' + xhr.response.idcode },{ type: 'warning' });
				document.getElementById('swd-options').classList.remove('d-none');
			}else{
				if (hw == undefined) {
        			var hardwareModal = new bootstrap.Modal(document.getElementById('hardware'), {});
            		hardwareModal.show();
				}else if(hw == '2') {
				 	$('#jtag-image').attr('src','pcb/v3.0/esp8266.png');
				}else{
				 	$('#jtag-image').attr('src','pcb/v1.0/esp8266.png');
				}
			}
        }
    };
    xhr.open('GET', '/swd/begin', true);
    xhr.send();
};

function hardResetSWD() {

	var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            $.notify({ message: 'Hardware Reset' }, { type: 'success' });
        }
    };
    xhr.open('GET', '/swd/reset?hard', true);
    xhr.send();
};

function setInterfaceImage(hw, i) {

	var interface = document.getElementById('firmware-interface')[i];
	//console.log(interface);

	if (typeof(interface) != undefined && interface != null)
	{
		if(os == 'esp8266') {
			
        	if(interface.value == 'swd-esp8266') {
				beginESP8266SWD(hw);
			}else{
				document.getElementById('swd-options').classList.add('d-none');
			}
		}else{
			$('#jtag-txt').html('');
	        $('#jtag-name').html(jtag_name[i]);

        	if(interface.value.indexOf('stlink-v2') != -1) {
        		var findImage = 'pcb/' + hardware_name[hardware] + '/diagrams/stlinkv2.png';
        		
        		var xhr = new XMLHttpRequest();
                xhr.cache = true;
                xhr.onload = function() {
                    if (xhr.status == 200) {
                    	$('#jtag-image').attr('src', findImage);
                    }else{
                    	if(hw == '2') {
							$('#jtag-image').attr('src', 'pcb/' + hardware_name[hw] + '/diagrams/pinout.png');
                    	}else{
                            var finder = new XMLHttpRequest();
                            finder.cache = true;
                            finder.onload = function() {
                                if (finder.status == 200) {
                                    console.log('>' + finder.responseText);
                                    $('#jtag-image').attr('src', finder.responseText);
                                }
                            };
                            finder.open('GET', 'common.php?find=stlinkv2&ext=png&hw=Hardware v1.0/diagrams', false);
                            finder.send();
                    	}
                    }
                };
				xhr.open('GET', findImage, true);
                xhr.send();
				
				checkSoftware('stlink');
	        }else if(interface.value.indexOf('olimex-arm-jtag-swd') != -1) {
	            $('#jtag-image').attr('src', 'firmware/img/olimex-arm-jtag-swd.jpg');
	            checkSoftware('openocd');
			}else if(interface.value.indexOf('interface') != -1) {
	            var img = interface.value.split('/').pop().slice(0, -4);
				$('#jtag-image').attr('src', 'firmware/img/' + img + '.jpg');
				checkSoftware('openocd');
			}else{
				$('#jtag-image').attr('src','firmware/img/usb_ttl.jpg');
				$('#jtag-txt').html('Caution: Main board Olimex is powered with 3.3V - Double check your TTL-USB adapter.');
	            $('#jtag-name').html('USB-TTL');
			}
		}
	}
};

function firmwareUpload(file) {

	var oForm = document.getElementById('firmware-form');
	var results = document.getElementById('firmware-result');
	var results_show = document.getElementById('firmware-result-show');
	
	results.textContent = "";

	if(os == 'esp8266') {
		
		if (file.name.toUpperCase().indexOf('.BIN') == -1) {
			$.notify({ message: 'File must be .bin format' }, { type: 'danger' });
			return;
		}
		var interface = document.getElementById('firmware-interface');

		var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
                console.log(xhr.responseText);

                var xhrSubmit = new XMLHttpRequest();
                xhrSubmit.seenBytes = 0;
				xhrSubmit.onreadystatechange = function() {
					if(xhrSubmit.readyState == 3) {
					    var data = xhrSubmit.responseText; //xhrSubmit.response.substr(xhrSubmit.seenBytes);
					    //console.log(data);
					    
					    if(results_show.checked)
					    	results.textContent = data;

					    if(data == '' || data.indexOf('Error') != -1) {
					    	$.notify({ message: 'Error ' + data }, { type: 'danger' });
					    }else{
						    var s = data.split('\n');
							//console.log("pages: " + s.length + " Size: " + ((s.length-1) * 16));

							var progress = 0;
							if(interface.value == 'swd-esp8266') {
						    	progress = Math.round(100 * ((s.length-1) * 16) / file.size);
							}else{
								var pages = (file.size / 1024) + 1;
								progress = Math.round(100 * ((s.length-1) / 3) / pages);
							}
						    document.getElementsByClassName('progress-bar')[0].style.width = progress + '%';
						    xhrSubmit.seenBytes = data.length;
						}
					}else if(xhrSubmit.readyState == 4 && xhrSubmit.status == 200) {
						document.getElementsByClassName('progress-bar')[0].style.width = '100%';

						var status = xhrSubmit.response.substr(xhrSubmit.seenBytes);
						if(file.size <= 4096) {
							progressBootloaderAnalisys('jolly good');
						}else{
							progressFirmwareAnalisys(status);
						}
					}
				};
				xhrSubmit.onerror = function() {
					var data = xhrSubmit.responseText;
					//console.log(data);

					results.textContent = data;
					$.notify({ message: 'Error: Flashing Stopped'},{ type: 'danger' });
					$.notify({ message: 'Power Cycle Recommended'},{ type: 'warning' });
				};
				xhrSubmit.open('POST', '/firmware.php', true);
				xhrSubmit.send(new FormData (oForm));
				//oForm.submit();

				if(interface.value == 'swd-esp8266' && file.size > 4096) {
					setTimeout( function () {
						$.notify({ message: 'Patience, Firmware takes 2-3 minutes ...'},{ type: 'warning' });
					},10000);
				}
			}
        };
        xhr.open('GET', '/interface?i=' + interface.value, true);
        xhr.send();
	}else{
		if (file.name.toUpperCase().indexOf('.BIN') == -1 || file.name.toUpperCase().indexOf('.HEX') == -1) {
			$.notify({ message: 'File must be .bin or .hex format' }, { type: 'danger' });
			return;
		}
		progressTimer(5, function() {
            oForm.submit();
        });
	}
};

function progressBootloaderAnalisys(data) {

	if(data.indexOf('shutdown command invoked') !=-1 || data.indexOf('jolly good') !=-1)
	{
		$.notify({ message: "Bootloader Complete" },{ type: "success" });
		$.notify({ message: "...Next Flash Firmware" },{ type: "warning" });
		setTimeout( function () {
			window.location.href = "firmware.php";
		},8000);
	}
};

function progressFirmwareAnalisys(data) {

	if(data.indexOf('shutdown command invoked') !=-1 || data.indexOf('jolly good') !=-1 || data.indexOf('Update Done') !=-1){
        $.notify({ message: "Flash Complete" },{ type: "success" });
        setTimeout(function() {
            window.location.href = 'index.php';
        },10000);
    }else if(data.indexOf('bricked') !=-1){
    	$.notify({ message: "STM32 is bricked - Try SWD Flashing" },{ type: "danger" });
    }else if(data.indexOf('CRC error') !=-1){
		$.notify({ message: "Detected CRC Errors" },{ type: "danger" });
		$.notify({ message: "Check RX/TX Cables" },{ type: "warning" });
    }else if(data.indexOf('Resetting device ...') !=-1){
    	$.notify({ message: "Detected Reset Issue" },{ type: "danger" });
    	$.notify({ message: "Check STM32 Reset Capacitor" },{ type: "warning" });
    }else if(data.indexOf('shutdown command invoked') !=-1 || data.indexOf('jolly good') !=-1){
        $.notify({ message: "Plugin USB-TTL" },{ type: "warning" });
        $.notify({ message: "Unlug JTAG Programmer" },{ type: "danger" });
    }else if(data.indexOf('Invalid flash type') !=-1){
		$.notify({ message: "Recommended updating <a href='https://www.st.com/en/development-tools/stsw-link007.html'>ST-Link Firmware</a>" },{ type: "warning" });
	}else if(data.indexOf('Resource busy') !=-1){
    	$.notify({ message: "Wrong USB-TTL Selected ...Try Again" },{ type: "warning" });
    	 setTimeout(function() {
            window.location.href = 'firmware.php';
        },8000);
    }
};

function progressTimer(speed, callback) {
    clearInterval(timerProgress);

    timerProgress = setInterval(function() {
        timerProgressCounter++;
        if(timerProgressCounter == 100) {
            clearInterval(timerProgress);
            callback();
        }
        document.getElementsByClassName('progress-bar')[0].style.width = timerProgressCounter + '%';
    }, speed);
};