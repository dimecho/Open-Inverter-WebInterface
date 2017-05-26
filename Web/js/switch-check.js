var din = ["din_mprot","din_emcystop","din_brake","din_start","din_forward","din_reverse","din_cruise","pot"]; 

$(document).ready(function () {
	$(".pot").knob({
		//"displayPrevious": true,
		"value": 0
	});
    dashboardCheck();
});

function dashboardCheck(){
    
	$.ajax("serial.php?get=" + din.join(','), {
		//async: false,
		success: function success(data) {

			data = data.split("\n");
			
			if(data.length > din.length) {

				for (var i = 0; i < data.length-1; i++) {

					if (parseFloat(data[i]) === 1) {
						$("#" + din[i]).addClass("circle-green");
						$("#" + din[i]).removeClass("circle-red");
					}else{
						$("#" + din[i]).addClass("circle-red");
						$("#" + din[i]).removeClass("circle-green");
					}
				}
				$(".pot").val(data[data.length-1]);
			}
			setTimeout(function () {
		        dashboardCheck();
		    }, 500);
		}
	});
};