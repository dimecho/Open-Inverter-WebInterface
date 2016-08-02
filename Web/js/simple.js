
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

    $("#ocurlim").slider({
        step: 100,
        min: 0,
        max: 1000,
        //value: 10
    });

    $("#freq").slider({
        step: 10,
        min: 20,
        max: 120,
        //value: 10
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
    
    /*
    $(".slider").on('slideStop', function(e) {
        //console.log(e);
        console.log(e.target.nextSibling.id + ":" + e.value);
    });
    */

    $("#udc").on('slideStop', function(e) {
        //console.log(e.value);
     
        if (e.value[1] < 55)
        {
            //set fmin 0.5

            //set boost 10000
        }

        calculateCurve(e.value);   //calculate fweak
    });

    $("#freq").on('slideStop', function(e) {
        //console.log(e.value);
        
        //calculateCurve(e.value);   //calculate fweak
    });


    $("#ocurlim").on('slideStop', function(e) {
        var ocurlim = 0 - e.value;
        console.log(ocurlim);
    });


    //var delay =  speed.slider('getValue');
});

function calculateCurve(value)
{
    var fweak = $("#freq")[0].value * (value[1]/1.41)/value[0];
    console.log(fweak);
}

function buildSimpleParameters(json)
{
    var motor = $("#parameters_Motor").empty().show();
    var battery = $("#parameters_Battery").empty().show();
    var tbody = $("<tbody>");
    var td1;
    var td2;
    var input;

    //=======================
    input = $("<input>", {id:"polepairs", type:"text", "data-provide":"slider", "data-slider-value":json.polepairs.value*2 });
    tr = $("<tr>");
    td1 = $("<td>").append("Poles");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", {id:"fmax", type:"text", "data-provide":"slider", "data-slider-value":json.fmax.value*30});
    tr = $("<tr>");
    td1 = $("<td>").append("Speed (RPM)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", {id:"idlespeed", type:"text", "data-provide":"slider", "data-slider-value":100});
    var e = $("<input>", {id:"idlespeed-enabled", type:"checkbox"});
    tr = $("<tr>");
    td1 = $("<td>").append("Idle (RPM)");
    td2 = $("<td>").append(input).append(e);
    tbody.append(tr.append(td1).append(td2));

    var v = json.fweak.value/((json.udcmax.value / 1.41)/json.udcmax.value);
    input = $("<input>", {id:"freq", type:"text", "data-provide":"slider", "data-slider-value":v});
    tr = $("<tr>");
    td1 = $("<td>").append("Frequency (Hz)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));
    
    input = $("<input>", {id:"ampmin", type:"text", "data-provide":"slider", "data-slider-value":json.ampmin.value});
    tr = $("<tr>");
    td1 = $("<td>").append("Torque (%)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    motor.append(tbody);
    //=======================

    tbody = $("<tbody>");
    input = $("<input>", {id:"udc", type:"text", "data-provide":"slider", "data-slider-value":"[" + json.udcmin.value + "," + json.udcmax.value + "]"});
    tr = $("<tr>");
    td1 = $("<td>").append("Voltage (V)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", {id:"ocurlim", type:"text", "data-provide":"slider", "data-slider-value":0-json.ocurlim.value});
    tr = $("<tr>");
    td1 = $("<td>").append("Current (A)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));
    
    /*
    input = $("<input>", {id:"boost", type:"text", "data-provide":"slider", "data-slider-value":json.boost.value/350});
    tr = $("<tr>");
    td1 = $("<td>").append("Resistance (&#8486;)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));
    */

    input = $("<input>", {id:"brknompedal", type:"text", "data-provide":"slider", "data-slider-value":json.brknompedal.value});
    var e = $("<input>", {id:"brknompedal-enabled", type:"checkbox"});
    tr = $("<tr>");
    td1 = $("<td>").append("Regenerative (%)");
    td2 = $("<td>").append(input).append(e);
    tbody.append(tr.append(td1).append(td2));
    if(json.brknompedal.value != -100)
        $("#brknompedal-enabled").prop("checked", true );
    //=======================

    battery.append(tbody);
}

function setValue()
{
    //fmax - 200Hz would result in a maximum speed of about 6000rpm
    //udcsw should be set to about 80% of your nominal pack voltage.
    
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
