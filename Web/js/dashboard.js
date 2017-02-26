var din = ["din_mprot","din_emcystop","din_brake","din_start","din_forward","din_reverse","din_cruise"]; 

$(document).ready(function () {
    dashboardCheck();
});

function dashboardCheck(){
    
	$.ajax("serial.php?get=" + din.join(','), {
		//async: false,
		success: function success(data) {

			data = data.split("\n");
			
			if(data.length > din.length) {

				for (var i = 0, l = data.length; i < l; i++) {
					if (parseFloat(data[i]) === 1) {
						$("#" + din[i]).addClass("circle-green");
						$("#" + din[i]).removeClass("circle-red");
					}else{
						$("#" + din[i]).addClass("circle-red");
						$("#" + din[i]).removeClass("circle-green");
					}
				}
			}
			dashboardCheck();
		}
	});
}