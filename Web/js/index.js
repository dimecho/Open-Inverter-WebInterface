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
            async: false,
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

            var notify = $.notify({
                    message: this.id + " = " + $.trim(value),
                },{
                    //allow_dismiss: false,
                    //showProgressbar: true,
                    type: 'warning'
            });
        },
        success: function(response, newValue)
        {
            console.log("'" + response + "'");

            //if(response === "Set OK\n"){
                //var id = this.id;
                //console.log(this.id);
                
                $.ajax("serial.php?command=save",{
                    //async: false,
                    success: function(data)
                    {
                        //console.log(data);

                        if(data.indexOf("Parameters stored") != -1)
                        {
                            $.notify({
                                message: data,
                            },{
                                type: 'success'
                            });
                            
                            //setTimeout(function() {
                            //    notify.update({'type': 'success', 'message': data, 'progress': 25});
                            //}, 2000);

                        }else{
                            
                            $.notify({
                                icon: 'glyphicon glyphicon-warning-sign',
                                title: 'Error',
                                message: data,
                            },{
                                type: 'danger'
                            });
                            
                            //setTimeout(function() {
                            //    notify.update({'type': 'error', 'message': data, 'progress': 25});
                            //}, 2000);
                        }
                    }
                });
            //}
        }
    });
    
    $("[rel=tooltip]").tooltip();
});