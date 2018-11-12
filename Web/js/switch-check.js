var display;
var PotRefreshTimer;
var din = ["din_mprot","din_emcystop","din_brake","din_start","din_forward","din_reverse","din_cruise","pot","udc"]; 

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
	
	//clearTimeout(StatusRefreshTimer);
	buildTips();
    dashboardCheck();
});

function dashboardCheck() {

	//$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?get=" + din.join(','), {
    $.ajax("serial.php?get=" + din.join(','), {
		//async: false,
		success: function success(data) {

			//console.log(data);
			data = data.split("\n");

			if (parseInt(data[0]) === 1) {

				$(".pot").val(parseInt(data[7])).trigger('change');
                
                //var v = "   " + data[8];
                //display.setValue(v.substr(-6));
				
				for (var i = 0; i < data.length-2; i++) {
					
					//if(data[i].match(/[1]/)) { //slow
					if (parseInt(data[i]) === 1) { //faster
						$("#" + din[i]).addClass("circle-green").removeClass("circle-red");
					}else{
						$("#" + din[i]).addClass("circle-red").removeClass("circle-green");
					}
				}

                PotRefreshTimer = setTimeout(function () {
                    clearTimeout(PotRefreshTimer);
                    dashboardCheck(notify);
                }, 800);

			}else {
                $.notify({ message: 'Olimex is not plugged into Main Board' }, { type: 'danger' });
            }
		}
	});
};