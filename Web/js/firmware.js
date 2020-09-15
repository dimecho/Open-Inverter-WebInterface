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
			            setInterfaceImage(interface.selectedIndex);
			        };
			        xhr.open('GET', 'serial.php?com=list', true);
			        xhr.send();
		    	}else{
		    		setInterfaceImage(interface.selectedIndex);
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

function setInterfaceImage(i) {

	var interface = document.getElementById('firmware-interface')[i];
	//console.log(interface);

	if (typeof(interface) != 'undefined' && interface != null)
	{
		if(os == 'esp8266') {
			$('#jtag-txt').html('Solder <b>GPIO-0</b> to <b>1</b> and boot ESP8266 from flash.');
			
			//0=Rev1, 1=Rev2, 2=Rev3, 3=Tesla
			if (hardware == undefined) {
				$('#hardware').modal(); //Manual Select
	        }else{
	        	if(interface.value == 'swd-esp8266') {
					beginESP8266SWD();
				}
				if(hardware == '2') {
				 	$('#jtag-image').attr('src','pcb/v3.0/esp8266.png');
				}else{
				 	$('#jtag-image').attr('src','pcb/v1.0/esp8266.png');
				}
	        }
		}else{
			$('#jtag-txt').html('');
	        $('#jtag-name').html(jtag_name[i]);

			if(interface.value.indexOf('stlink-v2') != -1) {
				$('#jtag-image').attr('src', 'pcb/Hardware v1.0/diagrams/stlinkv2.png');
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

function firmwareUpload() {

	var file = $('.file').get(0).files[0].name;

	if (file.toUpperCase().indexOf('.BIN') !=-1 || file.toUpperCase().indexOf('.HEX') !=-1) {
		if(os == 'esp8266') { //Special ESP8266 requirement
			var xhr = new XMLHttpRequest();
	        xhr.onload = function() {
	            if (xhr.status == 200) {
	                console.log(xhr.responseText);
					document.getElementById('firmwareForm').submit();
				}
	        };
	        xhr.open('GET', '/interface?i=' + $('#firmware-interface').val(), true);
	        xhr.send();
		}else{
			document.getElementById('firmwareForm').submit();
		}
	}else{
		$.notify({ message: 'File must be .bin or .hex format' }, { type: 'danger' });
	}
};