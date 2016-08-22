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

            if(this.id == 'fmin'){
                if($.trim(value) > $("#fslipmin").text())
                {
                    return 'Should be set below fslipmin';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray($.trim(value), [ '1', '2', '3,', '4']) == -1)
                {
                    return 'Motor poles = twice # of pole pairs';
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
            /*
            }else  if(this.id == 'ocurlim'){
                if($.trim(value) > 0)
                {
                    return 'Current limit should be set as negative';
                }
                */
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