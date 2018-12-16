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
    });
});

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