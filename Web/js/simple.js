var saveTimer;

$(document).ready(function () {

    buildSimpleParameters();

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

    //var delay =  speed.slider('getValue');

    $.notify({ message: 'Experimental Area' }, { type: 'danger' });
});

function calculateCurve(value) {

    var fweak = $("#freq")[0].value * (value[1] / 1.41) / value[0];
    console.log(fweak);
};

function simpleRow(id, txt) {

    var input = $("<input>", { id: id, type: "text", "data-provide": "slider" });
    var td1 = $("<td>",{width:"20%"}).append(txt);
    var td2 = $("<td>",{align:"center"}).append(input);
    var tr = $("<tr>").append(td1).append(td2)

    return tr;
};

function buildSimpleParameters() {

    $(".loader").show();

    var json = sendCommand("json");

    if(Object.keys(json).length > 0)
    {
        var motor = $("#parameters_Motor").empty();
        var battery = $("#parameters_Battery").empty();

        //=======================
        motor.append(simpleRow("polepairs", "Poles"));
        motor.append(simpleRow("udcnom", "Motor Rating (V)"));
        motor.append(simpleRow("boost", "Resistance (&#8486;)"));
        motor.append(simpleRow("fweak", "Speed (RPM)"));
        motor.append(simpleRow("idlespeed", "Idle (RPM)"));
        motor.append(simpleRow("ampmin", "Torque (%)"));
        motor.append(simpleRow("fmax", "Frequency (Hz)"));
        motor.append(simpleRow("pwm", "Pulse Width Modulation (kHz)"));

        battery.append(simpleRow("udc", "Voltage (V)"));
        battery.append(simpleRow("ocurlim", "Current (A)"));
        battery.append(simpleRow("brknom", "Regenerative (%)"));
        //=======================

        $("#polepairs").slider({
            ticks: [2, 4, 6, 8, 10],
            step: 2,
            min: 2,
            max: 10,
            value: json.polepairs.value * 2
        }).on('slideStop', function (e) {
            validateInput("polepairs",e.value/2);
            setParameter("polepairs",e.value/2,true,true);
        });
        //=======================
        $("#udcnom").slider({
            min: 12,
            max: 480,
            step: 1,
            value: json.udcnom.value,
            precision: 1,
            tooltip_position: 'left'
        }).on('slideStop', function (e) {
            validateInput("udcnom",e.value);
            setParameter("udcnom",e.value,true,true);
        });
        //=======================
        //TODO: account for battery voltage
        $("#boost").slider({
            min: 0.0,
            max: 10.0,
            step: 0.1,
            value: json.boost.value/1000,
            precision: 1,
            tooltip_position: 'left'
        }).on('slideStop', function (e) {
            validateInput("boost",e.value*1000);
            setParameter("boost",e.value*1000,true,true);
        });
        //=======================
        $("#fweak").slider({
            min: 0,
            max: 5000,
            step: 100,
            value: Math.round(json.fweak.value / json.fmax.value * 5000), //(json.udcmax.value / 1.41 / json.udcmax.value),
            enabled: false
        });
        //=======================
        $("#idlespeed").slider({
            min: -100,
            max: 3000,
            step: 1,
            ticks: [-100, 100, 500, 1000, 2000, 3000],
            //ticks_positions: [-100, 100, 500, 1000, 2000, 3000],
            ticks_labels: ['Disabled', '100 RPM', '500 RPM', '1000 RPM', '2000 RPM', '3000 RPM'],
            value: json.idlespeed.value
        }).on('slideStop', function (e) {
            validateInput("idlespeed",e.value);
            setParameter("idlespeed",e.value,true,true);
        });
        //=======================
        //TODO: calculate true torque - fweak,boost etc
        $("#ampmin").slider({
            min: 1,
            max: 100,
            step: 1,
            value: json.ampmin.value
        }).on('slideStop', function (e) {
            validateInput("ampmin",e.value);
            setParameter("ampmin",e.value,true,true);
        });
        //=======================
        $("#fmax").slider({
            step: 1,
            min: 20,
            max: 200,
            value: json.fmax.value
        }).on('slideStop', function (e) {
            //console.log(e.value);
            //calculateCurve(e.value);   //calculate fweak
            validateInput("fmax",e.value);
            setParameter("fmax",e.value,true,true);
        });
        //=======================
        $("#pwm").slider({
            min: 0,
            max: 4,
            step: 1,
            ticks: [4,3,2,1,0],
            ticks_labels: ["1.1 Hz", "2.2 Hz", "4.4 Hz", "8.8 Hz", "17.6 Hz"],
            value: json.pwmfrq.value
        }).on('slideStop', function (e) {
            //console.log(e.value);
            //calculateCurve(e.value);   //calculate fweak
            validateInput("pwmfrq",e.value);
            setParameter("pwmfrq",e.value,true,true);
        });
        //=======================
        $("#udc").slider({
            min: 12,
            max: 54,
            value: [json.udcmin.value, json.udcmax.value],
            range: true
        }).on('slideStop', function (e) {

            slider_adjustment("udc",[400,220,120,54]);
            if (e.value[1] < 55) {
                //set fmin 0.5
                //set boost 10000
            }
            //calculateCurve(e.value); //calculate fweak

            validateInput("udcmin",e.value[0]);
            validateInput("udcmax",e.value[1]);

            clearTimeout(saveTimer);
            saveTimer = setTimeout(function(){
                setParameter("udcmin",e.value[0],true,true);
                setParameter("udcmax",e.value[1],true,true);
            }, 2000);
        });
        slider_adjustment("udc",[400,220,120,54]);
        //=======================
        $("#ocurlim").slider({
            step: 1,
            min: 0,
            max: 100,
            value: 0-json.ocurlim.value,
            focus: false
        }).on('slideStop', function (e) {
            slider_adjustment("ocurlim",[800,400,200,100]);

            validateInput("ocurlim",(0-e.value));

            clearTimeout(saveTimer);
            saveTimer = setTimeout(function(){
                setParameter("ocurlim",(0-e.value),true,true);
            }, 1000);
        });
        slider_adjustment("ocurlim",[800,400,200,100]);
        //=======================
        $("#brknom").slider({
            min: 1,
            max: 90,
            value: json.brknom.value,
            focus: false
        }).on('slideStop', function (e) {
            validateInput("brknom",e.value);
            setParameter("brknom",e.value,true,true);
        });

        motor.show();
        battery.show();
    }
    $(".loader").hide();
};

function slider_adjustment(id,array) {

    var value = $("#" + id).data('slider').getValue();
    var v;

    if(value instanceof Array) { //check if value is a range
        v = value[1];
    }else{
        v = value;
    }

    //console.log(value);
    for (var i = 1; i < array.length; i++) {
        if (v >= array[i]){
            $("#" + id).slider({max:array[i-1]});
            break;
        }
    }
    $("#" + id).slider('setValue', value); //refresh
    //$("#" + id).bootstrapSlider('refresh');
};

function sanityCheck() {

    var version = getJSONFloatValue("version");
    var mprot = getJSONFloatValue("din_mprot");
    var emcystop = getJSONFloatValue("din_emcystop");
    var forward = getJSONFloatValue("din_forward");
    var reverse = getJSONFloatValue("din_reverse");
    var ocur = getJSONFloatValue("din_ocur");

    if (version < 3.18){
        $.notify({ message: "You need at least firmware version 3.18 to run this program" }, { type: "danger" });
        return false;
    }

    if (mprot === 0){
        $.notify({ message: "Motor Protection Input (Pin 11) needs to be connected to 12V to continue" }, { type: "warning" });
    }else if (emcystop === 0) {
        $.notify({ message: "Emergency Stop Input (Pin 17) needs to be connected to 12V to continue" }, { type: "warning" });
    }else if (ocur === 1) {
        $.notify({ message: "The overcurrent limit is tripped, please check il1gain, il2gain and ocurlim, they must have the same sign" }, { type: "warning" });
    }else if ((forward === 0 && reverse === 0) || (forward === 1 && reverse === 1)) {
        $.notify({ message: "Either forward or reverse must be connected to 12V to continue" }, { type: "warning" });
    }else{
        //$.notify({ message: "Sanity check passed, continuing" }, { type: "success" });
        return true;
    }

    return false;
};

function modeCheck(i,fn) {

    //console.log(fn);

    setTimeout(function() {

        var opmode = getJSONFloatValue("opmode");
        if (opmode === 1 || opmode === 5)
            i = 30;

        if(i === 0)
            $.notify({ message: "Now start the inverter with the start signal Pin 7" }, { type: "warning" });

        if (opmode === 1 || opmode === 4)
            i = 30;

        i++;

        if (i < 30){
          modeCheck(i,fn);
        }else{
            //Putting inverter into raw sine mode
            startInverter(5);

            fn = (typeof fn == "function") ? fn : window[fn];
            fn.apply(this, [0]);
        }
        
    }, 1000);
};

function boostTuning_start() {

    alertify.confirm("Safety Check", "Please be aware that the current you entered will actually be run through motor and power stage\nDo you understand the consequences of that [y/N]?\n", function () {
        
        setParameter("fweak",400);
        setParameter("boost",0);

        alertify.confirm("Safety Check", "Now put the car into the highest gear and pull the handbrake, torque will be put on the motor!!\n", function () {
            var notify = $.notify({ message: "Current: " + current }, { type: "danger" });

            setParameter("fslipspnt",1.5);
            setParameter("ampnom",100);

            var current = 0;
            var boost = 900;
            var i = 0;
            
            while (current < ampMax && i < 1000) {
                boost = boost + max((ampMax - current) * 10, 50);
                setParameter("boost",boost);
                sleep(500);
                current = getJSONAverageFloatValue("il1rms");
                notify.update({ message: "Current: " + current, type: "success" });
                sleep(100);
                i++;
            }
            setParameter("ampnom","0");
            $.notify({ message: "A boost value of " + boost + " results in your required current" }, { type: "success" });

        }, function () {});

    }, function () {});
};

function boostTuning(wait) {

    if(sanityCheck() === true)
    {
        if(wait === undefined){
            modeCheck(0,"boostTuning");
        }else{
            var ampMax = 0
            var ocurlim = getJSONFloatValue("ocurlim");

            if (ampMax === 0 || ampMax > (ocurlim * 0.6)){

                alertify.prompt("Current Limit: " + ocurlim, "What is your intended RMS motor current [A]?", "", function (event, ampRMS) {
                    ampMax = ampRMS;

                    if (ampMax > (ocurlim * 0.6)){
                        $.notify({ message: "The value you entered is dangerously close to your power stage limit!! Please correct."}, { type: "danger" });
                    }else{
                        boostTuning_start();
                    }
                }, function () {});
            }else{
                boostTuning_start();
            }
        }
    }
};

function fweakTuning(wait) {

    if(sanityCheck() === true)
    {
        if(wait === undefined){
            modeCheck(0,"fweakTuning");
        }else{
            $.notify({ message: "Very little torque is now put on the motor. The shaft should not spin. If it does, lock it" }, { type: "success" });

            var fmax = getJSONFloatValue("fmax");
            var ampnom = getJSONFloatValue("ampnom");

            setParameter("fslipspnt",0);
            setParameter("fmax",1000);
            setParameter("ampnom",10);

            var fweak = 200;
            var notify = $.notify({ message: "Starting fweak " + fweak }, { type: "success" });
            var i = 0;

            while (i < 100) {
                var i2 = fweak;
                var i1 = i2 / 2;

                setParameter("fweak",fweak);
                notify.update({ message: "Trying fweak " + fweak, type: "warning"});
                setParameter("fslipspnt",i1);
                sleep(1000);
                var currentStart = getJSONAverageFloatValue("il2rms");
                sleep(1000);
                setParameter("fslipspnt",i2);
                sleep(1000);
                var currentEnd = getJSONAverageFloatValue("il2rms");
                setParameter("fslipspnt","0");

                var ratio = currentEnd / currentStart;
                notify.update({ message: ratio + " " + currentStart + " " + currentEnd, type: "success" });
                //This is basically a locked rotor test. Twice the frequency transfers
                //twice as much energy onto the rotor. Therefor we expect twice the current
                if (ratio < 2.2 && ratio > 2) {
                    $.notify({ message: "A value of " + fweak + " for fweak will result in even torque over the frequency range" }, { type: "success" });
                    break;
                } else {
                    fweak = fweak * (ratio / 2.1);

                    if (fweak < 10 || fweak > 990) {
                        $.notify({ message: "Out of range, please check your power supply" }, { type: "danger" });
                        break;
                    }
                }
                i++;
            }
            //set values to original
            setParameter("fmax",fmax);
            setParameter("ampnom",ampnom);
        }
    }
};

function polePairTest(wait) {

    if(sanityCheck() === true)
    {
        if(wait === undefined){
            modeCheck(0,"polePairTest");
        }else{
            alertify.confirm("Safety Check", "Mark your motor shaft with something to observe when it finishes a rotation\nWill now slowly spin the shaft", function () {

                setParameter("ampnom",50);
                setParameter("fslipspnt",2);

                setTimeout(function() {

                    setParameter("fslipspnt",0);
                    alertify.prompt("Input", "How many turns did the shaft complete in 10s? (Round up)", "", function (event, turns) {
                        var polepairs = Math.floor(20 / turns);
                        $.notify({ message: "The motor has " + polepairs + " pole pairs" }, { type: "success" });
                        setParameter("polepairs",polepairs);
                        return polepairs;
                    }, function () {});
                }, 10000);

            }, function () {});
        }
    }
};

function numimpTest(wait) {

    if(sanityCheck() === true)
    {
        if (wait === undefined){
            modeCheck(0,"numimpTest");
        }else{
            alertify.confirm("Safety Check", "We will now spin the motor shaft @60Hz and try to determine how many pulses per rotation we get\n", function () {
 
                setParameter("numimp",8);
                setParameter("ampnom",70);

                var polepairs = getJSONFloatValue("polepairs");
                var expectedSpeed = 59.9 * 60 / polepairs;
                rampFrequency(0, 60);

                setTimeout(function() {
                    var speed = getJSONAverageFloatValue("speed");
                    setParameter("ampnom",0);
                    var numimp = round(speed / expectedSpeed * 8);
                    $.notify({ message: 'Your encoder seems to have ' + numimp + ' pulses per rotation' }, { type: 'success' });
                    setParameter("numimp",numimp);
                }, 2000);
            }, function () {});
        }
    }
};

function rampFrequency(_from, to) {
    
    for (var framp = _from; framp < to; framp++) {
        setParameter("fslipspnt",framp);
    }
};

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
};