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
        $("#serial2-interface").empty();

        $("#hardware-version").append($("<option>",{value:1}).append("Hardware v1.0"));
        $("#hardware-version").append($("<option>",{value:3}).append("Hardware v3.0"));
        
        if(os == "esp8266") {
            $("#debugger-interface").append($("<option>",{value:"swd-esp8266"}).append("SWD over ESP8266"));
            $("#serial2-interface").append($("<option>",{value:"uart-esp8266"}).append("UART over ESP8266"));
        }else{
            for (var i = 0; i < jtag_interface.length; i++) {
                $("#debugger-interface").append($("<option>",{value:jtag_interface[i]}).append(jtag_name[i]));
            }
            $("#debugger-interface").prop('selectedIndex', 0);

            $.ajax("serial.php?com=list", {
                async: false,
                success: function(data) {
                    var s = data.split('\n');
                    for (var i = 0; i < s.length; i++) {
                        if(s[i] != "")
                            $("#serial2-interface").append($("<option>",{value:s[i]}).append(s[i]));
                    }
                    $("#serial2-interface").prop('selectedIndex', 0);
                }
            });
        }

        $("#hardware-version").change(function() {
            setHardwareImage();
        });

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

        var d = $("#debugger-interface").val();
        var s = "";

        if(d.indexOf("stlink-v2") != -1 || d.indexOf("olimex-arm-jtag-swd") != -1) {
            s = checkSoftware("stlink");
        }else{
            s = checkSoftware("openocd");
        }

        if(s.indexOf("openExternalApp") != -1)
        {
            hardwareTest();
        }
    }
};

function analogTest() {

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

    $("#hardware-image").hide();
    $(".loader").show();

    var d = $("#debugger-interface").val();
    
    testRequest = $.ajax("test.php?flash=1&debugger=" + d , {
        async: false,
        success: function success(data) {
            console.log(data);

            if(data.indexOf("jolly good") != -1 || data.indexOf("shutdown command invoked") !=-1) {
                $.notify({ message: 'Flashed stm32-test.bin sucessfully.' }, { type: 'success' });

                setTimeout(function () {
                    $.notify({ message: 'Running GPIO tests.' }, { type: 'warning' });
                    hardwareTestResults();
                }, 2000);
            }else{
                $.notify({ message: 'Flash Error, try again.' }, { type: 'danger' });
            }
        }
    });
};

function hardwareTestResults() {

    var v = $("#hardware-version").val();
    var s = $("#serial2-interface").val();

    $.ajax("serial.php?test=" + v + "&serial=" + s, {
        async: false,
        success: function success(data) {

            console.log(data);

            if(data === "")
            {
                $(".loader").hide();
                $("#hardware-image").show();
                $.notify({ message: 'Test Check Failed' }, { type: 'danger' });
            }else{
                var results = $("#hardware-results");
                results.empty();
                data = data.split("\n");

                for (var i = 1; i < data.length; i++) {

                    var row = $("<div>",{class: "row"});
                    var col = $("<div>",{class: "col"});

                    col.append(data[i].replace("[31;1;1m", "<b style='color:red'>").replace("[32;1;1m", "<b style='color:green'>").replace("[0;0;0m", "</b>"));
                    row.append(col);
                    results.append(row);
                }
                $(".loader").hide();
            }
        }
    });
};

function setHardwareImage() {

    var v = $("#hardware-version").val();

    if(v == 1) {
        $("#hardware-image").attr("src", "pcb/Hardware v1.0/diagrams/test.png");
    }else if(v == 2) {
        $("#hardware-image").attr("src", "pcb/Hardware v2.0/diagrams/test.png");
    }else if(v == 3) {
        $("#hardware-image").attr("src", "pcb/Hardware v3.0/diagrams/test.png");
    }

    $("#hardware-image").show();
};