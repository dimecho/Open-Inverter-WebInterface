var jtag_interface = [
	'interface/ftdi/olimex-arm-usb-ocd-h.cfg',
	'interface/ftdi/olimex-arm-usb-tiny-h.cfg',
    'interface/stlink-v2.cfg',
    'interface/ftdi/olimex-arm-jtag-swd.cfg',
	'interface/parport.cfg',
	'interface/ftdi/jtag-lock-pick_tiny_2.cfg'
];

var jtag_name = [
	'Olimex OCD-H',
	'Olimex Tiny-H',
    'ST-Link v2.0',
    'Olimex JTAG-SWD',
	'JTAG Wiggler',
	'Lock-Pick Tiny v2.0'
];

var timerProgress;
var timerProgressCounter = 0;

$(document).ready(function() {

	buildMenu(function() {

		var interface = document.getElementById('firmware-interface');

		if (typeof(interface) != 'undefined' && interface != null)
		{
			if(os == 'esp8266') {
				var option_uart = document.createElement('option');
				option_uart.value = 'uart-esp8266';
				option_uart.textContent = 'UART over ESP8266';
				interface.appendChild(option_uart);

				var option_swd = document.createElement('option');
				option_swd.value = 'swd-esp8266';
				option_swd.textContent = 'SWD over ESP8266';
				interface.appendChild(option_swd);

				var xhr = new XMLHttpRequest();
		        xhr.onload = function() {
		            if (xhr.status == 200) {
		            	var v = parseFloat(xhr.responseText)/1000;
						if(v < 3.0) {
							$.notify({ message: 'ESP Reporting Low Voltage'},{ type: 'danger' });
							$.notify({ message: 'Check 3.3V Regulator (' + v + 'V)'},{ type: 'warning' });
						}
		            }
		        };
		        xhr.open('GET', '/vcc', true);
		        xhr.send();
			}else{
				unblockSerial();

				document.getElementsByClassName('spinner-border')[0].classList.remove('d-none');

				for (var i = 0; i < jtag_interface.length; i++) {
					var option = document.createElement('option');
					option.value = jtag_interface[i];
					option.textContent = jtag_name[i];
					interface.appendChild(option);
				}
				interface.selectedIndex = 2;

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

				var path = window.location.pathname;
	            var page = path.split('/').pop();

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

function beginESP8266SWD() {
	
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.response);
			if(xhr.response.connected === true) {
				$.notify({ message: 'SWD over ESP8266 Connected' },{ type: 'success' });
				$.notify({ message: 'Hardware IDCode: ' + xhr.response.idcode },{ type: 'warning' });
			}else{
    			var nvram = new XMLHttpRequest();
    			nvram.responseType = 'json';
		        nvram.onload = function() {
		            if (nvram.status == 200) {
		    			if(nvram.response['nvram'][5] == '1') {
		                    $.notify({ message: 'SWD over ESP8266 Not Connected, Try Reset and different Power Source (USB may not be enough)' },{ type: 'danger' });
		                }else{
		                	$.notify({ message: 'SWD not Enabled in <a href="esp8266.php">ESP8266 Configuration</a>' },{ type: 'danger' });
		                }
		            }
		        };
		        nvram.open('GET', '/nvram', true);
		        nvram.send();
			}
        }
    };
    xhr.open('GET', '/swd/begin', true);
    xhr.send();
};

function setInterfaceImage(hw, i) {

	var interface = document.getElementById('firmware-interface')[i];
	//console.log(interface);

	if (typeof(interface) != 'undefined' && interface != null)
	{
		if(os == 'esp8266') {
			$('#jtag-txt').html('Solder <b>GPIO-0</b> to <b>1</b> and boot ESP8266 from flash.');
			
			if (hw == undefined) {
				var hardwareModal = new bootstrap.Modal(document.getElementById('hardware'), {});
        		hardwareModal.show();
	        }else{
	        	if(interface.value == 'swd-esp8266') {
					beginESP8266SWD();
				}
				if(hw == '2') {
				 	$('#jtag-image').attr('src','pcb/v3.0/esp8266.png');
				}else{
				 	$('#jtag-image').attr('src','pcb/v1.0/esp8266.png');
				}
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

	var oForm = document.getElementById('firmwareForm');

	if (file.toUpperCase().indexOf('.BIN') !=-1 || file.toUpperCase().indexOf('.HEX') !=-1) {

		if(os == 'esp8266') { //Special ESP8266 requirement
			
			progressTimer(100, function() {});

			var xhr = new XMLHttpRequest();
	        xhr.onload = function() {
	            if (xhr.status == 200) {
	                console.log(xhr.responseText);

	                var xhrForm = new XMLHttpRequest();
					xhrForm.onload = function() {
						console.log(xhrForm.responseText);
						timerProgressCounter = 100;
						if(xhrForm.responseText == ''){
							progressFirmwareAnalisysLogFile(file);
						}else{
							document.getElementById('firmware-result').textContent = xhrForm.responseText;
							progressFirmwareAnalisys(xhrForm.responseText);
						}
					};
					xhrForm.onerror = function() {
						console.log(xhrForm.responseText);
						timerProgressCounter = 100;
						if(xhrForm.responseText == ''){
							progressFirmwareAnalisysLogFile(file);
						}else{
							document.getElementById('firmware-result').textContent = xhrForm.responseText;
							progressFirmwareAnalisys(xhrForm.responseText);
						}
					};
					xhrForm.open(oForm.method, oForm.action, true);
					xhrForm.send(new FormData (oForm));
					//oForm.submit();
				}
	        };
	        xhr.open('GET', '/interface?i=' + document.getElementById('firmware-interface').value, true);
	        xhr.send();
		}else{
			 progressTimer(5, function() {
                oForm.submit();
            });
		}
	}else{
		$.notify({ message: 'File must be .bin or .hex format' }, { type: 'danger' });
	}
};

function progressBootloaderAnalisys(data) {

	if(data.indexOf('shutdown command invoked') !=-1 || data.indexOf('jolly good') !=-1)
	{
		$.notify({ message: "Bootloader Complete" },{ type: "success" });
		$.notify({ message: "...Next Flash Firmware" },{ type: "warning" });
		setTimeout( function (){
			window.location.href = "firmware.php";
		},8000);
	}
};

function progressFirmwareAnalisysLogFile(file) {
	var xhr = new XMLHttpRequest();
   	xhr.onload = function() {
        if (xhr.status == 200) {
        	document.getElementById('firmware-result').textContent = xhr.responseText;
            progressFirmwareAnalisys(xhr.responseText);
        }
    };
    xhr.open('GET', file + ".log", true);
    xhr.send();
};

function progressFirmwareAnalisys(data) {

	if(data.indexOf('shutdown command invoked') !=-1 || data.indexOf('jolly good') !=-1 || data.indexOf('Update Done') !=-1){
        $.notify({ message: "Flash Complete" },{ type: "success" });
         setTimeout(function() {
            window.location.href = 'index.php';
        },10000);
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