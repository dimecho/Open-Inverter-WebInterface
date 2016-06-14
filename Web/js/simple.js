
$(document).ready(function()
{
    buildMenu(loadJSON(0));

    $("#boost").slider({
        min: 0.0,
        max: 10.0,
        precision: 1,
        //value: 3.8
    });

    $("#polepairs").slider({
        ticks: [2, 4, 6],
        step: 2,
        min: 2,
        max: 6,
        focus: true
    });

    $("#ampmin").slider({
        min: 1,
        max: 100,
        step: 1,
        //reversed : true,
        //value: 80
    });

    $("#fmax").slider({
        step: 100,
        min: 100,
        max: 7000,
        //value: 10
    });
    
    $("#idlespeed").slider({
        //ticks: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_positions: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_labels: ['Disabled', '0 RPM', '100 RPM', '200 RPM', '300 RPM', '400 RPM', '500 RPM'],
        min: 100,
        max: 1000,
        step: 100,
        //value: -100,
        enabled: false
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

function buildMenu(json)
{
    var i = 0;
    var name = [];
    for(var k in json)
        name.push(k);
    //======================

    var menu = $("#parameters_Motor").empty().show();
    var tbody = $("<tbody>");
    var tr;
    var input;
    var td1;
    var td2;

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
            input = $("<input>", {id:name[i], type:"text", "data-provide":"slider", "data-slider-value":this.value/448});
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
        i++;
    });
    menu.append(tbody);
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
