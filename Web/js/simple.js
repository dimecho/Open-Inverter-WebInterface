$(document).ready(function()
{
    $("#polepairs").slider({
        ticks: [2, 4, 6],
        step: 2,
        value: 2
    });

    $("#ampmin").slider({
        step: 1,
        reversed : true,
        value: 10
    });

    $("#fmax").slider({
        step: 1,
        value: 10
    });
    
    $("#idlespeed").slider({
        //ticks: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_positions: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_labels: ['Disabled', '0 RPM', '100 RPM', '200 RPM', '300 RPM', '400 RPM', '500 RPM'],
        step: 100,
        value: -100
    });
    
    $("#idlespeed-enabled").click(function() {
        if(this.checked) {
            $("#idlespeed").slider("enable");
        } else {
            $("#idlespeed").slider("disable");
            $("#idlespeed").slider({ value: -100});
        }
    });

     $("#brknormpedal-enabled").prop("checked");
    
    $("#brknormpedal-enabled").click(function() {
        if(this.checked) {
            $("#brknormpedal").slider("enable");
        } else {
            $("#brknormpedal").slider("disable");
            $("#brknormpedal").slider({ value: -50});
        }
    });
    
    $("#ampmin").mouseup(function(){
    
    });
    //var delay =  speed.slider('getValue');
});

function setValue()
{
    $.ajax("serial.php?start=2",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            span.removeClass('label-success');
            span.removeClass('label-warning');
            span.removeClass('label-important');
            span.addClass('label');

            if(data.indexOf("Inverter started") != -1)
            {
                span.addClass('label-success');
                span.text('started');
            }else{
                span.addClass('label-important');
                span.text('error');
            }
        }
    });
}
