var display;
var testRequest;
var testTimer;
var testArray = ["pot","din_mprot","din_emcystop","din_brake","din_start","din_forward","din_reverse","din_cruise"]; 
var testParam = testArray.join(',');
var activeTab = "#tabAnalog";

$(document).ready(function () {

	$(".pot").knob({
		"min":0,
        "max":4095,
		"fgColor":"#FF0000",
		"bgColor":"#FFFFFF",
        //"skin":"tron",
		//"thickness": 0.1,
		"readOnly":true,
		"displayInput":true,
		"angleOffset":90,
		"rotation":"anticlockwise",
		"displayPrevious": true,
		"value": 0
	});

    $('.nav-tabs a').click(function () {
        $(this).tab('show');
        //console.log(this);
    });

    $('.nav-tabs a').on('shown.bs.tab', function (event) {
        clearTimeout(testTimer);
        $(activeTab).hide();
        activeTab = event.target.hash;
        $(activeTab).show();
        loadTab();
    });
});

function loadTab() {

    if(activeTab == "#tabAnalog") {

    }else if(activeTab == "#tabHardware") {
        //$.notify({ message: 'Hardware v3.0 Only' }, { type: 'success' });

        $("#hardware-version").empty();
        $("#debugger-interface").empty();
        $("#serial-interface").empty();

        for (var i = 1; i <= 3; i++) {
            $("#hardware-version").append($("<option>",{value:i,selected:'selected'}).append("Hardware v" + i + ".0"));
        }
        if(os == "esp8266") {
            $("#debugger-interface").append($("<option>",{value:"swd-esp8266",selected:'selected'}).append("SWD over ESP8266"));
            $("#serial-interface").append($("<option>",{value:"uart-esp8266",selected:'selected'}).append("UART over ESP8266"));
        }else{
            for (var i = 0; i < jtag_interface.length; i++) {
                $("#debugger-interface").append($("<option>",{value:jtag_interface[i],selected:'selected'}).append(jtag_name[i]));
            }
            //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?com=list", {
            $.ajax("serial.php?com=list", {
                async: false,
                success: function(data) {
                    //console.log(data);
                    var s = data.split(',');
                    for (var i = 0; i < s.length; i++) {
                        if(s[i] != "")
                            $("#serial-interface").append($("<option>",{value:s[i]}).append(s[i]));
                    }
                }
            });
        }

        //$("#hardware-version").prop('selectedIndex', 0);
        $("#debugger-interface").prop('selectedIndex', 0);
        $("#serial-interface").prop('selectedIndex', 0);
        setHardwareImage();
    }
};

function stopTest() {

    $.notify({ message: 'Test Stopped.' }, { type: 'danger' });
    if(activeTab == "#tabAnalog") {
        testRequest.abort();
        clearTimeout(testTimer);
        for (var i = 1; i < testArray.length; i++) {
            $("#" + testArray[i]).addClass("circle-grey").removeClass("circle-red").removeClass("circle-green");
        }
    }
};

function startTest() {
    
    if(activeTab == "#tabAnalog") {
        $.notify({ message: 'Flip analog switches one-by-one.' }, { type: 'success' });
        for (var i = 1; i < testArray.length; i++) {
            $("#" + testArray[i]).addClass("circle-red").removeClass("circle-grey");
        }
        analogTest();
    }else if(activeTab == "#tabHardware") {
        $.fancybox.close();
        hardwareTest();
    }
};


function analogTest() {

    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?get=" + testParam, {
    testRequest = $.ajax("serial.php?get=" + testParam, {
        //async: false,
        success: function success(data) {

            //console.log(data);
            data = data.split("\n");

            $(".pot").val(parseInt(data[0])).trigger('change');
            
            for (var i = 1; i < data.length; i++) {
                //if(data[i].match(/[1]/)) { //slow
                if (parseInt(data[i]) === 1) { //faster
                    $("#" + testArray[i]).addClass("circle-green").removeClass("circle-red");
                }else{
                    $("#" + testArray[i]).addClass("circle-red").removeClass("circle-green");
                }
            }
            testTimer = setTimeout(function () {
                analogTest();
            }, 600);
        }
    });
};

function hardwareTest() {

	//$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?test=3", {
    testRequest = $.ajax("serial.php?test=3", {
		//async: false,
		success: function success(data) {
			console.log(data);

			data = data.split("\n");
		}
	});
};

function setHardwareImage() {

    var v = $("#hardware-version").val();

    if(v == 1) {
        $("#hardware-image").attr("src", "pcb/Hardware v1.0/test.png");
    }else if(v == 2) {
        $("#hardware-image").attr("src", "pcb/Hardware v2.0/test.png");
    }else if(v == 3) {
        $("#hardware-image").attr("src", "pcb/Hardware v3.0/test.png");
    }
};