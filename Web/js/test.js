var knobValue = 0;
var knobTimer;
var display;
var testRequest;
var testTimer;
var testArray = ['pot','din_mprot','din_emcystop','din_brake','din_start','din_forward','din_reverse','din_cruise']; 
var testParam = testArray.join(',');
var activeTab = '#tabAnalog';

var can_interface = [
	'firmware/img/canable.jpg',
	'firmware/img/usb2can.png',
	'firmware/img/can-mcp2515.jpg'
];

var can_name = [
	'CANable',
	'USB2CAN',
	'MCP2515'
];

$(document).ready(function () {

    $('.nav-tabs a').click(function () {
        clearTimeout(testTimer);
        //$(activeTab).hide();
        activeTab = this.hash;
        //$(activeTab).show();
        loadTab();
    });
    //hardwareTestProcess('', function() {});
    //displayHWVersion();

    if(os == 'esp8266') {
        $('#can-interface').append($('<option>',{value:can_interface[2]}).append('CAN over ESP8266 with MCP2515'));
        $('.d-none.nav-item').removeClass('d-none'); //.show();
    }else{
        for (var i = 0; i < can_interface.length; i++) {
            $('#can-interface').append($('<option>',{value:can_interface[i]}).append(can_name[i]));
        }
        $('.d-none.nav-item').removeClass('d-none'); //.show();
    }

    $('.knob').knob({
        'displayPrevious': true,
        'value': 0,
        change: function change(value) {
            if (value <= knobValue + 5) { //Avoid hard jumps
                //console.log(value);
                clearTimeout(knobTimer);
                knobTimer = setTimeout(function () {
                    setParameter('fslipspnt', value);
                }, 80);
                knobValue = value;
            } else {
                console.log('!' + value + '>' + knobValue);
                $('.knob').val(knobValue).trigger('change');
            }
        }
    });
    
    $('.knob').val(0).trigger('change');
});

$(document).on('click', '.browse', function(){
    var file = $('.file');
    file.trigger('click');
});

function loadTab() {

    if(activeTab == '#tabAnalog') {
		
		$('.pot').knob({
			'min':0,
			'max':4095,
			'fgColor':'#FF0000',
			'bgColor':'#FFFFFF',
			//'skin':'tron',
			//'thickness': 0.1,
			'readOnly':true,
			'displayInput':true,
			'angleOffset':90,
			'rotation':'anticlockwise',
			'displayPrevious': true,
			'value': 0
		});
	//}else if(activeTab == '#tabDigital') {
    }else if(activeTab == '#tabHardware') {

		$('#hardware-version').empty();
        $('#debugger-interface').empty();
        $('#serial2-interface').empty();
		
		//0=Rev1, 1=Rev2, 2=Rev3, 3=Tesla
		$('#hardware-version').append($('<option>',{value:0}).append('Hardware v1.0'));
        $('#hardware-version').append($('<option>',{value:1}).append('Hardware v2.0'));
		$('#hardware-version').append($('<option>',{value:2}).append('Hardware v3.0'));
		$('#hardware-version').change(function() {
			setHardwareImage();
		});

        if(os == 'esp8266') {
            $('#debugger-interface').append($('<option>',{value:'swd-esp8266'}).append('SWD over ESP8266'));
            $('#serial2-interface').append($('<option>',{value:'uart-esp8266'}).append('UART over ESP8266'));
 			$('#firmware-file-path').val('[Select Binary File]');
        }else{
            for (var i = 0; i < jtag_interface.length; i++) {
                $('#debugger-interface').append($('<option>',{value:jtag_interface[i]}).append(jtag_name[i]));
            }
            $('#debugger-interface').prop('selectedIndex', 0);

            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.status == 200) {
                    //console.log(xhr.responseText);
                    if(xhr.responseText.length > 1) {
                        var s = xhr.responseText.split('\n');
                        for (var i = 0; i < s.length; i++) {
                        if(s[i] != '')
                            $('#serial2-interface').append($('<option>',{value:s[i]}).append(s[i]));
                        }
                        $('#serial2-interface').prop('selectedIndex', 0);
                    }
                }
            };
            xhr.open('GET', 'serial.php?com=list', false);
            xhr.send();
        }
        console.log(hardware);

        if (hardware == undefined) {
            $('#hardware-version').prop('selectedIndex', 2);
        }else{
            $('#hardware-version').prop('selectedIndex', hardware);
        }

        setHardwareImage();
    }
};

function stopTest() {

    $.notify({ message: 'Test Stopped.' }, { type: 'danger' });
    if(activeTab == '#tabAnalog') {
        testRequest.abort();
        clearTimeout(testTimer);
        for (var i = 1; i < testArray.length; i++) {
            $('#' + testArray[i]).addClass('circle-grey').removeClass('circle-red').removeClass('circle-green');
        }
    }
};

function startTest() {
    
    if(activeTab == '#tabAnalog') {
        $.notify({ message: 'Flip analog switches one-by-one.' }, { type: 'success' });
        for (var i = 1; i < testArray.length; i++) {
            $('#' + testArray[i]).addClass('circle-red').removeClass('circle-grey');
        }
        analogTest();
    }else if(activeTab == '#tabHardware') {

        if(os == 'esp8266') {
        	hardwareTestFlash();
        }else{
        	var d = $('#debugger-interface').val();
	        var s = '';

	        if(d.indexOf('stlink-v2') != -1 || d.indexOf('olimex-arm-jtag-swd') != -1) {
	            s = 'stlink';
	        }else{
	            s = 'openocd';
	        }
            checkSoftware(s, '', function(result) {
                if(result.indexOf('openExternalApp') != -1) {
                    hardwareTestFlash();
                }
            });
    	}
    }
};

function analogTest() {

    testRequest = $.ajax('serial.php?get=' + testParam, {
        //async: false,
        success: function success(data) {

            //console.log(data);
            data = data.split('\n');

            $('.pot').val(parseInt(data[0])).trigger('change');
            
            for (var i = 1; i < data.length; i++) {
                //if(data[i].match(/[1]/)) { //slow
                if (parseInt(data[i]) == 1) { //faster
                    $('#' + testArray[i]).addClass('circle-green').removeClass('circle-red');
                }else{
                    $('#' + testArray[i]).addClass('circle-red').removeClass('circle-green');
                }
            }
            testTimer = setTimeout(function () {
                analogTest();
            }, 600);
        }
    });
};

function hardwareTestFlash(file) {

	var xhr2 = !! ( window.FormData && ('upload' in ($.ajaxSettings.xhr()) ));
	if(xhr2 == false) {
		$.notify({ message: 'Browser does not support FormData()' }, { type: 'danger' });
		return;
	}
	
    //$('#hardware-image').addClass('d-none'); //.hide();
    $('.spinner-border').removeClass('d-none'); //.show();

    if(os == 'esp8266') { //Special ESP8266 requirement
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
            }
        };
        xhr.open('GET', '/interface?i=' + $('#debugger-interface').val(), false);
        xhr.send();
    }

	var formData = new FormData();
	if($('.file').length > 0) {
		formData.append('file', $('.file')[0].files[0]);
	}
    formData.append('flash', 1);
	formData.append('interface', $('#debugger-interface').val());

    testRequest = $.ajax('test.php', {
		type: 'POST',
        data: formData,
		cache: false,
		contentType: false,
		processData: false,
        timeout: 8000,
        success: function success(data) {
            console.log(data);
            if(data.indexOf('jolly good') != -1 || data.indexOf('shutdown command invoked') !=-1) {
                $.notify({ message: 'Flashed stm32-test.bin sucessfully.' }, { type: 'success' });
                setTimeout(function () {
                	hardwareTestRun();
                }, 2000);
            }else{
                $.notify({ message: 'Flash Error, Try again' }, { type: 'danger' });
                if(data.indexOf('stlink_flash_loader_run') != -1) {
                	$.notify({ message: 'Check SWD cables, Reset, Try again'}, { type: 'warning' });
                }else{
					$.notify({ message: data }, { type: 'warning' });
				}
				$('.spinner-border').addClass('d-none'); //.hide();
				//$('#hardware-image').removeClass('d-none'); //.show();
            }
        },
        error:function() {
            $.notify({ message: 'Timed Out ...Reset Power to Board' }, { type: 'danger' });
            $('.spinner-border').addClass('d-none'); //.hide();
        }
    });
};

function hardwareTestRun() {
    $.notify({ message: 'Running GPIO tests.' }, { type: 'warning' });
    hardwareTestResults();
};

function hardwareTestResults() {

	var v = $('#hardware-version').val();
    var s = $('#serial2-interface').val();

    $('.spinner-border').removeClass('d-none'); //.show();

    setCookie('hardware', v, 1);
	
    $.ajax('serial.php?test=' + v + '&serial=' + s, {
        //async: false,
        timeout: 3000,
        success: function success(data) {
            console.log(data);
            if(data == '') {
                $.notify({ message: 'Test Check Failed' }, { type: 'danger' });
            }else if (data.indexOf('Unknown command') != -1) {
                $.notify({ message: 'Current Firmware OK' }, { type: 'success' });
                $.notify({ message: 'Flash Test Firmware' }, { type: 'warning' });
            }else{
            	hardwareTestProcess(data, function() {
                    var results = $('#hardware-results');
                    results.empty();
                    data = data.split('\n');
                    for (var i = 1; i < data.length; i++) {
                        var row = $('<div>',{class: 'row'});
                        var col = $('<div>',{class: 'col'});
                        col.append(data[i].replace('[31;1;1m', '<b style="color:red">').replace('[32;1;1m', '<b style="color:green">').replace('[0;0;0m', '</b>'));
                        row.append(col);
                        results.append(row);
                    }
                });
            }
			$('.spinner-border').addClass('d-none'); //.hide();
        },
        error:function() {
            $.notify({ message: 'Timed Out ...Reset Power to Board' }, { type: 'danger' });
            $('.spinner-border').addClass('d-none'); //.hide();
        }
    });
};

function hardwareTestProcess(data, callback) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            for(var key in xhr.response) {
                //console.log(key + ':' + json[key]);
                data = data.replace(new RegExp(key + ' ', 'g'), key + ' (' + json[key].toUpperCase() + ') ');
                data = data.replace(new RegExp(key + ',', 'g'), key + ' (' + json[key].toUpperCase() + '),');
                callback(data);
            }
        }
    };
    xhr.open('GET', 'js/test.json', true);
    xhr.send();
};

function setFirmwareFile() {

	var ext = $('.file').val().split('.').pop();
	if(ext == 'bin' || ext == 'hex') {
		$('#firmware-file-path').val($('.file').val().split('\\').pop().split('/').pop());
		$.notify({ message: 'Ready for Firmware Flash' }, { type: 'success' });
	}else{
		$.notify({ message: 'File must be .bin or .hex' }, { type: 'danger' });
	}
}

function setHardwareImage() {
    var hwrev = $('#hardware-version').val();
	
	if(hwrev == '2') {
		$('#hardware-image').attr('src','pcb/Hardware v3.0/diagrams/test.png');
		if(os != 'esp8266') {
			$('#debugger-interface').prop('selectedIndex', 2); //ST-Link
		}
	}else{
		$('#hardware-image').attr('src','pcb/Hardware v1.0/diagrams/test.png');
	}
	//$('#hardware-image').removeClass('d-none'); //.show();
};