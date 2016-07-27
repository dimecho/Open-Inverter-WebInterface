
$(document).ready(function()
{
    buildSimpleParameters(loadJSON(0));

    $("#boost").slider({
        min: 0.0,
        max: 10.0,
        step: 0.1,
        precision: 1,
        tooltip_position:'left',
        //value: 3.8
    });

    $("#polepairs").slider({
        ticks: [2, 4, 6],
        step: 2,
        min: 2,
        max: 6,
    });

    $("#ampmin").slider({
        min: 1,
        max: 100,
        step: 1,
        //reversed : true,
        //value: 80
    });

    $("#udc").slider({
        min: 12,
        max: 400,
        range: true,
        //value: 55
    });

    $("#fmax").slider({
        step: 100,
        min: 100,
        max: 7000,
        //value: 10
    });

    $("#brknompedal").slider({
        min: 1,
        max: 100,
    });

    $("#idlespeed").slider({
        //ticks: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_positions: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_labels: ['Disabled', '0 RPM', '100 RPM', '200 RPM', '300 RPM', '400 RPM', '500 RPM'],
        min: 100,
        max: 1000,
        step: 100,
        enabled: false,
        //value: -100,
    });
    
    $("#idlespeed-enabled").click(function() {
        if(this.checked) {
            $("#idlespeed").slider("enable");
        } else {
            $("#idlespeed").slider("disable");
            $("#idlespeed").slider({ value: -100});
        }
    });

    $("#ex6").on("slide", function(slideEvt) {
        $("#ex6SliderVal").text(slideEvt.value);
    });
    
    $("#brknompedal-enabled").click(function() {
        if(this.checked) {
            $("#brknompedal").slider("enable");
        } else {
            $("#brknompedal").slider("disable");
            $("#brknompedal").slider({ value: -50});
        }
    });
    
    $("#ampmin").mouseup(function(){
    
    });
    //var delay =  speed.slider('getValue');
});

function buildSimpleParameters(json)
{
    var i = 0;
    var name = [];
    for(var k in json)
        name.push(k);
    //======================

    var motor = $("#parameters_Motor").empty().show();
    var battery = $("#parameters_Battery").empty().show();
    var tbody = $("<tbody>");
    var tr;
    var td1;
    var td2;
    var input;
    var udcmin = -1;
    var udcmax = -1;
    var brknompedal = -1;

    $.each(json, function()
    {
        console.log(this)

        tr = $("<tr>");

        if(name[i] == "polepairs")
        {
            input = $("<input>", {id:name[i], type:"text", "data-provide":"slider", "data-slider-value":this.value*2 });
            td1 = $("<td>").append("Poles");
            td2 = $("<td>").append(input);
            tbody.append(tr.append(td1).append(td2));
        }
        else if(name[i] == "boost")
        {
            input = $("<input>", {id:name[i], type:"text", "data-provide":"slider", "data-slider-value":this.value/350});
            td1 = $("<td>").append("Resistance (&#8486;)");
            td2 = $("<td>").append(input);
            tbody.append(tr.append(td1).append(td2));
        }
        else if(name[i] == "fmax")
        {
            input = $("<input>", {id:name[i], type:"text", "data-provide":"slider", "data-slider-value":this.value*30});
            td1 = $("<td>").append("Speed (RPM)");
            td2 = $("<td>").append(input);
            tbody.append(tr.append(td1).append(td2));
        }
        else if(name[i] == "idlespeed")
        {
            input = $("<input>", {id:name[i], type:"text", "data-provide":"slider", "data-slider-value":100});
            var e = $("<input>", {id:name[i]+"-enabled", type:"checkbox"});
            td1 = $("<td>").append("Idle (RPM)");
            td2 = $("<td>").append(input).append(e);
            tbody.append(tr.append(td1).append(td2));
        }
        else if(name[i] == "ampmin")
        {
            input = $("<input>", {id:name[i], type:"text", "data-provide":"slider", "data-slider-value":10});
            td1 = $("<td>").append("Torque (%)");
            td2 = $("<td>").append(input);
            tbody.append(tr.append(td1).append(td2));
        }
        else if(name[i] == "brknompedal")
        {
            brknompedal = this.value;
        }
        else if(name[i] == "udcmin")
        {
            udcmin = this.value;
        }
        else if(name[i] == "udcmax")
        {
            udcmax = this.value;
        }
        i++;
    });
    motor.append(tbody);

    tbody = $("<tbody>");

    if(udcmin != -1 && udcmax != -1)
    {
        input = $("<input>", {id:"udc", type:"text", "data-provide":"slider", "data-slider-value":"[" + udcmin + "," + udcmax + "]"});
        tr = $("<tr>");
        td1 = $("<td>").append("Voltage (V)");
        td2 = $("<td>").append(input);
        tbody.append(tr.append(td1).append(td2));
    }

    if(brknompedal != -1)
    {
        input = $("<input>", {id:"brknompedal", type:"text", "data-provide":"slider", "data-slider-value":brknompedal});
        var e = $("<input>", {id:"brknompedal-enabled", type:"checkbox"});
        tr = $("<tr>");
        td1 = $("<td>").append("Regenerative (%)");
        td2 = $("<td>").append(input).append(e);
        tbody.append(tr.append(td1).append(td2));
        if(brknompedal != -100)
            $("#brknompedal-enabled").prop("checked", true );
    }

    battery.append(tbody);

}

function setValue()
{
    //fmax - 200Hz would result in a maximum speed of about 6000rpm
    
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
