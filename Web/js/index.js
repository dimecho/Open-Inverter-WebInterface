var dev = 0;

$(document).ready(function()
{
    $('#parameters').editable({
        selector: 'a',
        url: 'serial.php',
        mode: 'popup',
        pk: '1',
        showbuttons: true,
        ajaxOptions: {
            type: 'get',
            //type: 'put',
            //dataType: 'json'
        },
        validate: function(value) {

			for (var i = 0; i < 2; i++) {
				if(dev === 0 && getJSONFloatValue("opmode") != "0" && this.id != 'fslipspnt'){
					stopInverter();
					if(i>0)
						return 'Inverter must not be in operating mode.';
				}
			}

            if(this.id == 'fmin'){
                if(parseFloat($.trim(value)) > parseFloat($("#fslipmin").text()))
                {
                    return 'Should be set below fslipmin';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray($.trim(value), [ '1', '2', '3,', '4', '6']) == -1)
                {
                    return 'Pole pairs = half # of motor poles';
                }
            }else  if(this.id == 'udcmin'){
                if(parseInt($.trim(value)) > parseInt($("#udcmax").text()))
                {
                    return 'Should be below maximum voltage (udcmax)';
                }
            }else  if(this.id == 'udcmax'){
                if(parseInt($.trim(value)) > parseInt($("#udclim").text())){
                    return 'Should be lower than cut-off voltage (udclim)';
                }
            }else if(this.id == 'udcsw'){
                if(parseInt($.trim(value)) > parseInt($("#udcmax").text())){
                    return 'Should be below maximum voltage (udcmax)';
                }
			}else if(this.id == 'fslipmin'){
				if(parseFloat($.trim(value)) <= parseFloat($("#fmin").text())){
					return 'Should be higher than start frequency (fmin)';
				}
            /*}else  if(this.id == 'fslipmax'){
                if($.trim(value) / 5 > $("#fslipmin").text())
                {
                    return 'If too high from fslipmin the motor will start to rock violently on startup.';
                }
            }else  if(this.id == 'ocurlim'){
                if($.trim(value) > 0)
                {
                    return 'Current limit should be set as negative';
                }*/
            }
        },
        success: function(response, newValue) {
            //console.log(response);
            if(response.indexOf("Set OK"))
            {
                var id = this.id;
                //console.log(this.id);
                
                var span = $("<span>", { class:"label label-warning offset1"}).append("changed");
                $("#" + id).parent().append(span);
                
                setTimeout(function(){
                    saveChanges(span);
                },1000);
                setTimeout(function(){
                    span.remove();
                },5000);
            }
        }
    });
    
    $("[rel=tooltip]").tooltip();
});