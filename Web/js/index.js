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
            
            if($("#opmode").text() != "0" && this.id != 'ampnom'){
                /*
                Allow to change potentiometer while in manual mode.
                Otherwise stop the inverter before changing parameters
                */
                stopInverter();
                setTimeout(function(){
                    //TODO: make this ajax
                    window.location.href = "/index.php";
                },2000);
                return 'Inverter must not be in operating mode.';
            }

            if(this.id == 'fmin'){
                if($.trim(value) > $("#fslipmin").text())
                {
                    return 'Should be set below fslipmin';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray($.trim(value), [ '1', '2', '3,', '4', '6']) == -1)
                {
                    return 'Pole pairs = half # of motor poles';
                }
            }else  if(this.id == 'udcmin'){
                if($.trim(value) > $("#udcmax").text())
                {
                    return 'Should be below maximum voltage (udcmax)';
                }
            }else  if(this.id == 'udcmax'){
                if($.trim(value) > $("#udclim").text())
                {
                    return 'Should be lower than cut-off voltage (udclim)';
                }
            }else  if(this.id == 'udcsw'){
                if($.trim(value) > $("#udcmax").text())
                {
                    return 'Should be below maximum voltage (udcmax)';
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
                },1500);
                setTimeout(function(){
                    span.remove();
                },5000);
            }
        }
    });
    
    $("[rel=tooltip]").tooltip();
});