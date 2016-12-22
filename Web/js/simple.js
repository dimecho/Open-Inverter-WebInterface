$(document).ready(function () {

    buildSimpleParameters(loadJSON(0));

    $("#boost").slider({
        min: 0.0,
        max: 10.0,
        step: 0.1,
        precision: 1,
        tooltip_position: 'left'
    });

    $("#polepairs").slider({
        ticks: [2, 4, 6],
        step: 2,
        min: 2,
        max: 6
    });

    $("#ampmin").slider({
        min: 1,
        max: 100,
        step: 1
    });

    $("#udc").slider({
        min: 12,
        max: 400,
        range: true
    });

    $("#ocurlim").slider({
        step: 100,
        min: 0,
        max: 1000
    });

    $("#freq").slider({
        step: 10,
        min: 20,
        max: 120
    });

    $("#fmax").slider({
        step: 100,
        min: 100,
        max: 7000
    });

    $("#brknompedal").slider({
        min: 1,
        max: 100
    });

    $("#idlespeed").slider({
        //ticks: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_positions: [-100, 0, 100, 200, 300, 400, 500],
        //ticks_labels: ['Disabled', '0 RPM', '100 RPM', '200 RPM', '300 RPM', '400 RPM', '500 RPM'],
        min: 100,
        max: 1000,
        step: 100,
        enabled: false
    });

    $("#idlespeed-enabled").click(function () {
        if (this.checked) {
            $("#idlespeed").slider("enable");
        } else {
            $("#idlespeed").slider("disable");
            $("#idlespeed").slider({ value: -100 });
        }
    });

    $("#ex6").on("slide", function (slideEvt) {
        $("#ex6SliderVal").text(slideEvt.value);
    });

    $("#brknompedal-enabled").click(function () {
        if (this.checked) {
            $("#brknompedal").slider("enable");
        } else {
            $("#brknompedal").slider("disable");
            $("#brknompedal").slider({ value: -50 });
        }
    });

    /*
    $(".slider").on('slideStop', function(e) {
        //console.log(e);
        console.log(e.target.nextSibling.id + ":" + e.value);
    });
    */

    $("#udc").on('slideStop', function (e) {
        //console.log(e.value);

        if (e.value[1] < 55) {
            //set fmin 0.5

            //set boost 10000
        }

        calculateCurve(e.value); //calculate fweak
    });

    $("#freq").on('slideStop', function (e) {
        //console.log(e.value);

        //calculateCurve(e.value);   //calculate fweak
    });

    $("#ocurlim").on('slideStop', function (e) {
        var ocurlim = 0 - e.value;
        console.log(ocurlim);
    });

    //var delay =  speed.slider('getValue');

    $.notify({ message: 'Experimental Area' }, { type: 'danger' });
});

function calculateCurve(value) {

    var fweak = $("#freq")[0].value * (value[1] / 1.41) / value[0];
    console.log(fweak);
};

function buildSimpleParameters(json) {

    if (json === undefined) return;

    var motor = $("#parameters_Motor").empty().show();
    var battery = $("#parameters_Battery").empty().show();
    var tbody = $("<tbody>");
    var td1;
    var td2;
    var input;

    //=======================
    input = $("<input>", { id: "polepairs", type: "text", "data-provide": "slider", "data-slider-value": json.polepairs.value * 2 });
    tr = $("<tr>");
    td1 = $("<td>").append("Poles");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", { id: "fmax", type: "text", "data-provide": "slider", "data-slider-value": json.fmax.value * 30 });
    tr = $("<tr>");
    td1 = $("<td>").append("Speed (RPM)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", { id: "idlespeed", type: "text", "data-provide": "slider", "data-slider-value": 100 });
    var e = $("<input>", { id: "idlespeed-enabled", type: "checkbox" });
    tr = $("<tr>");
    td1 = $("<td>").append("Idle (RPM)");
    td2 = $("<td>").append(input).append(e);
    tbody.append(tr.append(td1).append(td2));

    var v = json.fweak.value / (json.udcmax.value / 1.41 / json.udcmax.value);
    input = $("<input>", { id: "freq", type: "text", "data-provide": "slider", "data-slider-value": v });
    tr = $("<tr>");
    td1 = $("<td>").append("Frequency (Hz)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", { id: "ampmin", type: "text", "data-provide": "slider", "data-slider-value": json.ampmin.value });
    tr = $("<tr>");
    td1 = $("<td>").append("Torque (%)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    motor.append(tbody);
    //=======================

    tbody = $("<tbody>");
    input = $("<input>", { id: "udc", type: "text", "data-provide": "slider", "data-slider-value": "[" + json.udcmin.value + "," + json.udcmax.value + "]" });
    tr = $("<tr>");
    td1 = $("<td>").append("Voltage (V)");
    td2 = $("<td>").append(input);
    tbody.append(tr.append(td1).append(td2));

    input = $("<input>", { id: "ocurlim", type: "text", "data-provide": "slider", "data-slider-value": 0 - json.ocurlim.value });
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

    input = $("<input>", { id: "brknompedal", type: "text", "data-provide": "slider", "data-slider-value": json.brknompedal.value });
    var e = $("<input>", { id: "brknompedal-enabled", type: "checkbox" });
    tr = $("<tr>");
    td1 = $("<td>").append("Regenerative (%)");
    td2 = $("<td>").append(input).append(e);
    tbody.append(tr.append(td1).append(td2));
    if (json.brknompedal.value != -100) $("#brknompedal-enabled").prop("checked", true);
    //=======================

    battery.append(tbody);
};

function sanityCheck() {};

function modeCheck() {

    var i = 0;

    while (i < 100) {
        opmode = getJSONFloatValue("opmode");

        if (opmode === 1 || opmode === 4) break;

        if (i === 0) $.notify({ message: 'Now start the inverter with the start signal Pin 7' }, { type: 'danger' });

        i++;

        sleep(2000);
    }
};

function boostTuning() {

    alertify.prompt('Input', 'What is your intended RMS motor current [A]?', '', function (evt, ampMax) {

        $.ajax("serial.php?pk=1&name=fweak&value=400");
        $.ajax("serial.php?pk=1&name=boost&value=0");

        alertify.confirm("Safety Check", "Now put the car into the highest gear and pull the handbrake, torque will be put on the motor!!\n", function () {
            var notify = $.notify({ message: "Current: " + current }, { type: 'danger' });

            $.ajax("serial.php?pk=1&name=fslipspnt&value=1.5");
            $.ajax("serial.php?pk=1&name=ampnom&value=100");

            var current = 0;
            var boost = 900;
            var i = 0;

            while (current < ampMax && i < 1000) {
                boost = boost + max((ampMax - current) * 10, 50);
                $.ajax("serial.php?pk=1&name=boost&value=" + boost, { async: false });
                sleep(500);
                current = getJSONAverageFloatValue("il1rms");
                notify.update({ message: 'Current: ' + current, type: 'success' });
                sleep(100);
                i++;
            }
            $.notify({ message: 'A boost value of ' + boost + ' results in your required current' }, { type: 'success' });

            $.ajax("serial.php?pk=1&name=ampnom&value=0");
        }, function () {});
    }, function () {});
};

function fweakTuning(ampnom) {

    $.notify({ message: 'Very little torque is now put on the motor. The shaft should not spin. If it does, lock it' }, { type: 'danger' });

    var fmax = getJSONFloatValue("fmax");
    $.ajax("serial.php?pk=1&name=fslipspnt&value=0");
    $.ajax("serial.php?pk=1&name=fmax&value=1000");
    $.ajax("serial.php?pk=1&name=ampnom&value=" + ampnom);

    var fweak = 200;
    var i = 0;

    while (i < 100) {
        var i2 = fweak;
        var i1 = i2 / 2;
        $.ajax("serial.php?pk=1&name=fweak&value=" + fweak, { async: false });
        var notify = $.notify({ message: 'Trying fweak ' + fweak }, { type: 'danger' });

        $.ajax("serial.php?pk=1&name=fslipspnt&value=" + i1, { async: false });
        sleep(1000);
        var currentStart = getJSONAverageFloatValue("il2rms");
        sleep(1000);
        $.ajax("serial.php?pk=1&name=fslipspnt&value=" + i2, { async: false });
        sleep(1000);
        var currentEnd = getJSONAverageFloatValue("il2rms");
        $.ajax("serial.php?pk=1&name=fslipspnt&value=0", { async: false });

        var ratio = currentEnd / currentStart;
        notify.update({ message: ratio + " " + currentStart + " " + currentEnd, type: 'success' });
        //This is basically a locked rotor test. Twice the frequency transfers
        //twice as much energy onto the rotor. Therefor we expect twice the current
        if (ratio < 2.2 && ratio > 2) {
            $.notify({ message: 'A value of ' + fweak + ' for fweak will result in even torque over the frequency range' }, { type: 'success' });
            break;
        } else {
            fweak = fweak * (ratio / 2.1);

            if (fweak < 10 || fweak > 990) {
                $.notify({ message: 'Out of range, please check your power supply' }, { type: 'danger' });
                break;
            }
        }
        i++;
    }
    $.ajax("serial.php?pk=1&name=fmax&value=" + fmax);
};

function polePairTest() {

    alertify.confirm("Safety Check", "Mark your motor shaft with something to observe when it finishes a rotation\nWill now slowly spin the shaft", function () {
        $.ajax("serial.php?pk=1&name=ampnom&value=50");
        $.ajax("serial.php?pk=1&name=fslipspnt&value=2");
        sleep(10000);
        $.ajax("serial.php?pk=1&name=fslipspnt&value=0");

        alertify.prompt('Input', 'How many turns did the shaft complete in 10s? (Round up)', '', function (evt, turns) {
            var polepairs = Math.floor(20 / turns);
            $.notify({ message: 'The motor has ' + polepairs + ' pole pairs' }, { type: 'success' });
            $.ajax("serial.php?pk=1&name=polepairs&value=" + polepairs);
            return polepairs;
        }, function () {});
    }, function () {});
};

function numimpTest() {

    alertify.confirm("Safety Check", "We will now spin the motor shaft @60Hz and try to determine how many pulses per rotation we get\n", function () {
        $.ajax("serial.php?pk=1&name=numimp&value=8");
        $.ajax("serial.php?pk=1&name=ampnom&value=70");

        var polepairs = getJSONFloatValue("polepairs");
        var expectedSpeed = 59.9 * 60 / polepairs;
        rampFrequency(0, 60);
        sleep(2000);
        var speed = getJSONAverageFloatValue("speed");
        $.ajax("serial.php?pk=1&name=ampnom&value=0");
        var numimp = round(speed / expectedSpeed * 8);
        $.notify({ message: 'Your encoder seems to have ' + numimp + ' pulses per rotation' }, { type: 'success' });
        $.ajax("serial.php?pk=1&name=numimp&value=" + numimp);
    }, function () {});
};

function rampFrequency(_from, to) {
    
    for (var framp = _from; framp < to; framp++) {
        $.ajax("serial.php?pk=1&name=fslipspnt&value=" + framp);
    }
};

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
};