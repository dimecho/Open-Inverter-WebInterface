var saveTimer;
var knobValue_syncofs = 0;
var knobValue_manualid = 0;
var ctxFont = 14;
var ctxFontColor = '#808080';
var ctxDashColor = 'black';

var _snshs = [0, 1, 2];
var snshs = ['JCurve', 'Semikron (Skiip82)', 'MBB600'];

var _snsm = [12, 13, 14];
var snsm = ['KTY83-110', 'KTY84-130', 'Leaf'];

$(document).ready(function () {

    $.notify({ message: 'Experimental Area' }, { type: 'danger' });

    buildMenu(function() {
        buildSimpleParameters();

        $('#brknompedal-enabled').click(function () {
            if (this.checked) {
                $('#brknompedal').slider('enable');
            } else {
                $('#brknompedal').slider('disable');
                $('#brknompedal').slider({ value: -50 });
            }
        });
    });
});

function calculateCurve(value) {

    var fweak = $('#freq')[0].value * (value[1] / 1.41) / value[0];
    console.log(fweak);
};

function simpleRow(id, txt) {

    var input = $('<input>', { id: id, type: 'text', 'data-provide': 'slider' });
    var td1 = $('<td>',{width:'20%'}).append(txt);
    var td2 = $('<td>',{align:'center'}).append(input);
    var tr = $('<tr>').append(td1).append(td2)

    return tr;
};

function buildSimpleParameters() {

  var tuneButtons = document.getElementsByClassName('btn');
  tuneButtons[1].classList.remove('d-none');
    document.getElementById('loader-parameters').classList.remove('d-none');

    sendCommand('json', 0, function(json) {
        if(Object.keys(json).length > 0)
        {
            var motor = $('#parameters_Motor').empty();
            var battery = $('#parameters_Battery').empty();
            var tuneButtons = document.getElementsByClassName('btn');
            
            motor.append(simpleRow('polepairs', 'Poles'));
            if(json.version.unit.indexOf('foc') != -1) {
                tuneButtons[1].classList.remove('d-none');

            }else{
                tuneButtons[0].classList.remove('d-none');
                tuneButtons[2].classList.remove('d-none');
                tuneButtons[3].classList.remove('d-none');
                tuneButtons[4].classList.remove('d-none');

                motor.append(simpleRow('udcnom', 'Motor Rating'));
                $('#udcnom').ionRangeSlider({
                    skin: 'big',
                    grid: true,
                    step: 1,
                    min: 12,
                    max: 480,
                    from: json.udcnom.value,
                    postfix: ' Volt',
                    onFinish: function (e) {
                        validateInput(json,'udcnom',e.from);
                        setParameter('udcnom',e.from,true,true);
                    }
                });
                motor.append(simpleRow('boost', 'Resistance'));
                //TODO: account for battery voltage
                $('#boost').ionRangeSlider({
                    skin: 'big',
                    grid: true,
                    step: 0.1,
                    min: 0.0,
                    max: 10.0,
                    from: json.boost.value/1000,
                    postfix: ' &#8486;',
                    onFinish: function (e) {
                        validateInput(json,'boost',e.from*1000);
                        setParameter('boost',e.from*1000,true,true);
                    }
                });
                motor.append(simpleRow('fweak', 'Speed'));
                $('#fweak').ionRangeSlider({
                    skin: 'big',
                    grid: true,
                    step: 100,
                    min: 0,
                    max: 5000,
                    from: Math.round(json.fweak.value / json.fmax.value * 5000), //(json.udcmax.value / 1.41 / json.udcmax.value),
                    postfix: ' RPM'
                });
                motor.append(simpleRow('ampmin', 'Torque'));
                //TODO: calculate true torque - fweak,boost etc
                $('#ampmin').ionRangeSlider({
                    skin: 'big',
                    grid: true,
                    step: 1,
                    min: 1,
                    max: 100,
                    from: json.ampmin.value,
                    postfix: ' %',
                    onFinish: function (e) {
                        validateInput(json,'ampmin',e.from);
                        setParameter('ampmin',e.from,true,true);
                    }
                });
            }
            motor.append(simpleRow('idlespeed', 'Idle'));
            motor.append(simpleRow('fmax', 'Frequency'));
            motor.append(simpleRow('pwm', 'Pulse Width Modulation'));
            motor.append(simpleRow('encmode', 'Encoder Mode'));

            battery.append(simpleRow('udc', 'Voltage'));
            battery.append(simpleRow('ocurlim', 'Current'));
            battery.append(simpleRow('brknom', 'Regenerative'));
            //=======================
            /*
            $('#polepairs').slider({
                ticks: [2, 4, 6, 8, 10],
                step: 2,
                min: 2,
                max: 10,
                value: json.polepairs.value * 2
            }).on('slideStop', function (e) {
                validateInput(json,'polepairs',e.value/2);
                setParameter('polepairs',e.value/2,true,true);
            });
            */
            var polepairs_values = [2, 4, 6, 8, 10];
            $('#polepairs').ionRangeSlider({
                skin: 'big',
                values: polepairs_values,
                from: polepairs_values.indexOf(json.polepairs.value * 2),
                onFinish: function (e) {
                    validateInput(json,'polepairs',e.from_value/2);
                    setParameter('polepairs',e.from_value/2,true,true);
                }
            });
            //=======================
            /*
            $('#udcnom').slider({
                min: 12,
                max: 480,
                step: 1,
                value: json.udcnom.value,
                precision: 1,
                tooltip_position: 'left'
            }).on('slideStop', function (e) {
                validateInput(json,'udcnom',e.value);
                setParameter('udcnom',e.value,true,true);
            });
            */
            //=======================
            $('#idlespeed').ionRangeSlider({
                skin: 'big',
                grid: true,
                step: 1,
                min: 0,
                max: 2000,
                from: json.idlespeed.value,
                postfix: ' RPM',
                onFinish: function (e) {
                    validateInput(json,'idlespeed',e.from);
                    setParameter('idlespeed',e.from,true,true);
                }
            });
            //=======================
            $('#fmax').ionRangeSlider({
                skin: 'big',
                grid: true,
                step: 1,
                min: 20,
                max: 200,
                from: json.fmax.value,
                postfix: ' Hz',
                onFinish: function (e) {
                    //console.log(e.from);
                    //calculateCurve(e.from);   //calculate fweak
                    validateInput(json,'fmax',e.from);
                    setParameter('fmax',e.from,true,true);
                }
            });
            //=======================
            var pwm_values = ['17.6', '8.8', '4.4', '2.2', '1.1'];
            console.log(json.pwmfrq.value);
            $('#pwm').ionRangeSlider({
                skin: 'big',
                grid: true,
                values: pwm_values,
                step: 1,
                min: 0,
                max: 4,
                from: pwm_values.indexOf(json.pwmfrq.value),
                postfix: ' kHz',
                onFinish: function (e) {
                    //console.log(e.from);
                    //calculateCurve(e.from);   //calculate fweak
                    validateInput(json,'pwmfrq',e.from);
                    setParameter('pwmfrq',e.from,true,true);
                }
            });
            //=======================
            var encmode_values = ['Single', 'AB', 'ABZ', 'SPI', 'Resolver'];
            console.log(json.encmode.value);
            $('#encmode').ionRangeSlider({
                skin: 'big',
                grid: true,
                values: encmode_values,
                step: 1,
                min: 0,
                max: 4,
                from: encmode_values.indexOf(json.encmode.value),
                onFinish: function (e) {
                    //console.log(e.from);

                    clearTimeout(saveTimer);
                    saveTimer = setTimeout(function(){
                        validateInput(json,'encmode',e.from);
                        setParameter('encmode',e.from,true,true);
                    }, 1500);
                }
            });
            //=======================
            $('#udc').ionRangeSlider({
                skin: 'big',
                grid: true,
                type: 'double',
                step: 1,
                min: 10,
                max: 400,
                from: json.udcmin.value,
                to: json.udcmax.value,
                postfix: ' Volt',
                onFinish: function (e) {
                    /*
                    slider_adjustment('udc',[400,220,120,54]);
                    if (e.to < 55) {
                        //set fmin 0.5
                        //set boost 10000
                    }
                    */
                    //calculateCurve(e.from); //calculate fweak

                    //validateInput(json,'udcmin',e.from);
                    //validateInput(json,'udcmax',e.to);

                    clearTimeout(saveTimer);
                    saveTimer = setTimeout(function(){
                        setParameter('udcmin',e.from,true,true);
                        setParameter('udcmax',e.to,true,true);
                    }, 2000);
                }
            });
            //slider_adjustment('udc',[400,220,120,54]);
            //=======================
            $('#ocurlim').ionRangeSlider({
                skin: 'big',
                grid: true,
                step: 1,
                min: 0,
                max: 200,
                from: 0-json.ocurlim.value,
                postfix: ' Amp',
                onFinish: function (e) {
                    //slider_adjustment('ocurlim',[800,400,200,100]);

                    validateInput(json,'ocurlim',(0-e.from));

                    clearTimeout(saveTimer);
                    saveTimer = setTimeout(function(){
                        setParameter('ocurlim',(0-e.from),true,true);
                    }, 1500);
                }
            });
            //slider_adjustment('ocurlim',[800,400,200,100]);
            //=======================
            $('#brknom').ionRangeSlider({
                skin: 'big',
                grid: true,
                step: 1,
                min: 0,
                max: 90,
                from: json.brknom.value,
                postfix: ' %',
                onFinish: function (e) {
                    validateInput(json,'brknom',e.from);
                    setParameter('brknom',e.from,true,true);
                }
            });
            
            motor.removeClass('d-none'); //.show();
            battery.removeClass('d-none'); //.show();
        }
        $('#loader-parameters').addClass('d-none'); //.hide();
    });
};

function slider_adjustment(id,array) {

    var value = $('#' + id).data('slider').getValue();
    var v;

    if(value instanceof Array) { //check if value is a range
        v = value[1];
    }else{
        v = value;
    }

    //console.log(value);
    for (var i = 1; i < array.length; i++) {
        if (v >= array[i]){
            $('#' + id).slider({max:array[i-1]});
            break;
        }
    }
    $('#' + id).slider('setValue', value); //refresh
    //$('#' + id).bootstrapSlider('refresh');
};

function sanityCheck() {

    $.notify({ message: 'Checking Safety ...' }, { type: 'success' });

    //var version = getJSONFloatValue('version');
    var mprot = getJSONFloatValue('din_mprot');
    var emcystop = getJSONFloatValue('din_emcystop');
    var forward = getJSONFloatValue('din_forward');
    var reverse = getJSONFloatValue('din_reverse');
    var ocur = getJSONFloatValue('din_ocur');
    /*
    if (version < 3.18){
        $.notify({ message: 'You need at least firmware version 3.18 to run this program' }, { type: 'danger' });
        return false;
    }
    */
    if (mprot === 0){
        $.notify({ message: 'Motor Protection Input (Pin 11) needs to be connected to 12V to continue' }, { type: 'warning' });
    }else if (emcystop === 0) {
        $.notify({ message: 'Emergency Stop Input (Pin 17) needs to be connected to 12V to continue' }, { type: 'warning' });
    }else if (ocur === 1) {
        $.notify({ message: 'The overcurrent limit is tripped, please check il1gain, il2gain and ocurlim, they must have the same sign' }, { type: 'warning' });
    }else if ((forward === 0 && reverse === 0) || (forward === 1 && reverse === 1)) {
        $.notify({ message: 'Either forward or reverse must be connected to 12V to continue' }, { type: 'warning' });
    }else{
        //$.notify({ message: 'Sanity check passed, continuing' }, { type: 'success' });
        return true;
    }

    return false;
};

function modeCheck(mode, callback) {

    var i = 0;

    var wait = setInterval(function() {
        if(i === 0) {
            $.notify({ message: 'Now Start the Inverter with a Start Signal' }, { type: 'warning' }); //Pin 7 (Rev1/2)
        }else if(i > 30) {
            clearInterval(wait);
            callback();
        }
        getJSONFloatValue('opmode', function (opmode) {
            if (opmode === mode) {
                clearInterval(wait);
                $.notify({ message: 'Putting inverter into raw Sine Mode' }, { type: 'warning' });
                startInverterMode(5);
                callback();
            }
        });
        i++;
    }, 1000);
};

function syncofsTuning()
{
    //if(sanityCheck() === true) {
        getJSONFloatValue('opmode', function (opmode) {
            opmode = 2; //DEBUG

            if (opmode == 2)
            {
                var syncofsTuningModal = document.getElementById('syncofsTuning');
                new bootstrap.Modal(syncofsTuningModal, {}).show();

                var loader = $('<div>',{ class:'spinner-border text-dark'});
                var canvasGraph = $('<canvas>');
                var canvasMotor = $('<canvas>');

                $('#syncofs').val(0).trigger('change');
                $('#manualid').val(0).trigger('change');

                $('#syncofsTuningMotor').empty();
                $('#syncofsTuningMotor').append(loader);
                $('#syncofsTuningMotor').append(canvasMotor);

                $('#syncofsTuningGraph').empty();
                $('#syncofsTuningGraph').append(loader);
                $('#syncofsTuningGraph').append(canvasGraph);

                var red = 'rgb(255, 99, 132)';
                var blue = 'rgb(54, 162, 235)';
                var yellow = 'rgb(255, 205, 86)';

                getScript('js/chart.js', function () {
                    getScript('js/chartjs-plugin-annotation.js', function () {
                        getJSONFloatValue('polepairs', function ( polepairs) {
                            polepairs = 4; //DEBUG
                            //========================
                            var shift_oneeighty = 0.5;
                            var syncofs = knobValue_syncofs;
                            if(syncofs > 512) { //TODO: check for correctness
                                shift_oneeighty = 2;
                            }
                            var syncofs_angle = gen_syncofs_angle(syncofs);
                            var visual_angle = syncofs_angle;
                            //========================

                            var chart_stator_datasets = {
                                data: gen_stator_data(polepairs*2),
                                backgroundColor: gen_stator_data_color(polepairs*2),
                                //data: gen_stator_data(8),
                                //backgroundColor: gen_stator_data_color(8),
                                //borderWidth:0
                            };
                            var chart_syncofs_datasets = {
                                data: gen_syncofs_data(polepairs*2,visual_angle),
                                backgroundColor: gen_stator_syncofs_color(polepairs*2),
                                //data: gen_syncofs_data(8,visual_angle),
                                //backgroundColor: gen_stator_syncofs_color(8),
                                borderWidth:0
                            };
                            var chart_rotor_datasets = {
                                data: [360],
                                backgroundColor: [],
                                borderWidth:0
                            };

                            dataMotor = {
                                labels: [],
                                datasets: [chart_stator_datasets, chart_syncofs_datasets, chart_rotor_datasets]
                            };

                            for (var i = 90; i > 0; i--) {
                                dataMotor.labels.push(0-i);
                            }
                            for (var i = 0; i < 90; i++) {
                                dataMotor.labels.push(i);
                            }

                            optionsMotor = {
                                //responsive: true,
                                //maintainAspectRatio: true,
                                rotation: Math.PI,
                                //cutoutPercentage: 20,
                                legend: {
                                    display: false
                                },
                                /*elements: {
                                    arc: {
                                        borderWidth: 2
                                    }
                                },*/
                                tooltips: {
                                    enabled: false      
                                },
                                scales: {
                                    xAxes: [{
                                        gridLines: {
                                            display:false
                                        },
                                        ticks: {
                                            display: false
                                        }
                                    }],
                                    yAxes: [{
                                        /*gridLines: {
                                            display:false
                                        },*/
                                        ticks: {
                                            display: false
                                        }
                                    }]
                                },
                                annotation: {
                                    //drawTime: 'afterDatasetsDraw',
                                    annotations: [{
                                        type: 'line',
                                        id: 'm-line-0',
                                        mode: 'vertical',
                                        scaleID: 'x-axis-0',
                                        value: visual_angle,
                                        endValue: 0-visual_angle,
                                        //borderColor: 'rgb(255, 0, 0)',
                                        //borderWidth: 1,
                                        label: {
                                            enabled: true,
                                            xAdjust: -50,
                                            yAdjust: 0,
                                            content: 'Offset ' + syncofs_angle.toFixed(1) + '°',
                                            position: 'top'
                                        }
                                    },{
                                        type: 'line',
                                        id: 'm-line-2',
                                        mode: 'horizontal',
                                        scaleID: 'y-axis-0',
                                        value: 0.5,
                                        borderWidth: 0,
                                        label: {
                                            enabled: true,
                                            yAdjust: -12,
                                            content: '49152 (270°)',
                                            position: 'left'
                                        }
                                    },{
                                        type: 'line',
                                        id: 'm-line-3',
                                        mode: 'horizontal',
                                        scaleID: 'y-axis-0',
                                        value: 0.5,
                                        borderWidth: 0,
                                        label: {
                                            enabled: true,
                                            yAdjust: -12,
                                            content: '16384 (90°)',
                                            position: 'right'
                                        }
                                    }]
                                }
                            };

                            loader.hide();

                            var chartMotor = new Chart(canvasMotor, {
                                type: 'pie', //'doughnut'
                                data: dataMotor,
                                options: optionsMotor
                            });

                            var img = new Image();
                            img.src = 'img/rotate.png';
                            img.onload = function() {

                                //console.log(chart.canvas);
                                var canvasPattern = document.createElement('canvas');
                                var ctxPattern = canvasPattern.getContext('2d');
                                canvasPattern.width  = chartMotor.canvas.parentNode.clientWidth - img.width/2;
                                canvasPattern.height = chartMotor.canvas.parentNode.clientHeight - img.height - 10;

                                //Flip Horizontally
                                //-----------------
                                ctxPattern.translate(canvasPattern.width, 0);
                                ctxPattern.scale(-1, 1);
                                //-----------------
                                
                                ctxPattern.drawImage(img,
                                    canvasPattern.width / 2 - img.width / 2,
                                    canvasPattern.height / 2 - img.height / 2
                                );
                                
                                ctxPattern.fillStyle = ctxPattern.createPattern(canvasPattern, 'no-repeat');

                                //DEBUG
                                /*
                                var link = document.createElement('a');
                                link.download = 'canvas.png';
                                link.href = canvasPattern.toDataURL('image/png');
                                link.click();
                                */
                                
                                chartMotor.data.datasets[2].backgroundColor = [ctxPattern.fillStyle];
                            }

                            //==========================
                            var chart_speed_datasets = {
                                type: 'line',
                                label: 'speed',
                                backgroundColor: 'rgba(255,99,132, 0.5)',
                                borderColor: 'rgba(255,99,132)',
                                borderWidth: 2,
                                data: [],
                                yAxisID: 'y-axis-0',
                            };

                            var syncofs_variable = [];

                            for (var i = 0; i <= 65530 ; i+=10) {
                                syncofs_variable.push(i);
                                chart_speed_datasets.data.push(100);
                            }

                            data = {
                                labels: syncofs_variable,
                                datasets: [chart_speed_datasets]
                            };

                            options = {
                                responsive: true,
                                //maintainAspectRatio: true,
                                elements: {
                                    point:{
                                        radius: 0
                                    }
                                },
                                tooltips: {
                                    enabled: false,
                                },
                                scales: {
                                    xAxes: [{
                                        id: 'x-axis-0',
                                        position: 'bottom',
                                        scaleLabel: {
                                            display: true,
                                            fontColor: ctxFontColor,
                                            fontSize: ctxFont,
                                            labelString: 'syncofs'
                                        },
                                        ticks: {
                                            fontColor: ctxFontColor,
                                            fontSize: ctxFont
                                        },
                                        gridLines: {
                                            color: ctxFontColor
                                        }
                                    }],
                                    yAxes: [{
                                        id: 'y-axis-0',
                                        position: 'right',
                                        ticks: {
                                            display: false,
                                            suggestedMin: 0,
                                            suggestedMax: 100
                                        },
                                        gridLines: {
                                            drawOnChartArea: false
                                        }
                                    },{
                                        id: 'y-axis-1',
                                        position: 'left',
                                        scaleLabel: {
                                            display: true,
                                            labelString: 'manualid (Amps)',
                                            fontColor: ctxFontColor,
                                            fontSize: ctxFont
                                        },
                                        ticks: {
                                            reverse: true,
                                            display: true,
                                            fontColor: ctxFontColor,
                                            fontSize: ctxFont,
                                            suggestedMin: 0,
                                            suggestedMax: 100
                                        },
                                        gridLines: {
                                            drawOnChartArea: false
                                        }
                                    }]
                                },
                                annotation: {
                                    annotations: [{
                                        type: 'line',
                                        id: 'a-line-0',
                                        mode: 'vertical',
                                        scaleID: 'x-axis-0',
                                        value: knobValue_syncofs,
                                        borderColor: 'rgb(0, 0, 0)',
                                        borderWidth: 2,
                                        label: {
                                          content: "syncofs=" + knobValue_syncofs,
                                          enabled: true,
                                          position: 'left'
                                        }
                                    }]
                                }
                            };

                            loader.hide();
                            
                            var chartGraph = new Chart(canvasGraph, {
                                type: 'line',
                                data: data,
                                options: options
                            });

                            $('#syncofs').knob({
                                min: 0,
                                max: 65535,
                                step: 10,
                                stopper: true,
                                value: 0,
                                release: function(value) {
                                     if (value <= knobValue_syncofs + 1000000) { //Avoid hard jumps
                                   //if (value <= knobValue_syncofs + 10000) { //Avoid hard jumps
                                        //console.log(value);
                                        knobValue_syncofs = value;

                                        polepairs = 4; //DEBUG
                                        //========================
                                        var shift_oneeighty = 0.5;
                                        var syncofs = knobValue_syncofs;
                                        if(syncofs > 512) { //TODO: check for correctness
                                            shift_oneeighty = 2;
                                        }
                                        var syncofs_angle = gen_syncofs_angle(syncofs);
                                        var visual_angle = syncofs_angle;

                                        console.log(syncofs + ' @ ' + syncofs_angle.toFixed(0) + '°, Shift 180° = ' + (syncofs/shift_oneeighty) + ' @ ' + (syncofs_angle/shift_oneeighty).toFixed(1) + '°');
                                        console.log('Visual Angle:' + visual_angle + '°');
                                        
                                        //========================
                                        var chart_syncofs_datasets = {
                                            data: gen_syncofs_data(polepairs*2,visual_angle),
                                            backgroundColor: gen_stator_syncofs_color(polepairs*2),
                                            //data: gen_syncofs_data(8,visual_angle),
                                            //backgroundColor: gen_stator_syncofs_color(8),
                                            borderWidth:0
                                        };

                                        //chartMotor.annotation.elements['m-line-0'].options.value = visual_angle;
                                        //chartMotor.annotation.elements['m-line-0'].options.endValue = 0-visual_angle;
                                        chartMotor.annotation.elements['m-line-0'].options.label.content = 'Offset ' + syncofs_angle.toFixed(0) + '°';
                                        chartMotor.data.datasets[1] = chart_syncofs_datasets;
                                        chartMotor.update();

                                        setParameter('syncofs', value, false, false, function () {
                                            chartGraph.annotation.elements['a-line-0'].options.value = knobValue_syncofs;
                                            chartGraph.annotation.elements['a-line-0'].options.label.content = 'syncofs=' + knobValue_syncofs;
                                            chartGraph.update();
                                        });
                                    } else {
                                        //console.log('!' + value + '>' + knobValue_syncofs);
                                        syncofsTuning_slow();
                                        setTimeout(function () {
                                            $('#syncofs').val(knobValue_syncofs).trigger('change');
                                        }, 100);
                                    }
                                }
                            });
                            $('#manualid').knob({
                                min: 0,
                                max: 100,
                                stopper: true,
                                value: 0,
                                release: function(value) {
                                    if (value <= knobValue_manualid + 10) { //Avoid hard jumps
                                        //console.log(value);
                                        knobValue_manualid = value;

                                        if(value != 0) {
                                            setParameter('syncofs', value, false, false, function () {
                                                getJSONFloatValue('speed', function (v) {
                                                    var t = knobValue_syncofs/10;
                                                    if(v < 100) {
                                                        for (var i = t; i <= (t+50); i++) {
                                                            chartGraph.data.datasets[0].data[i] = v;
                                                        }
                                                        chartGraph.update();
                                                    }
                                                });
                                            });
                                        }
                                    } else {
                                        //console.log('!' + value + '>' + knobValue_manualid);
                                        syncofsTuning_slow();
                                        setTimeout(function () {
                                            $('#manualid').val(0).trigger('change'); //Zero immediately!
                                        }, 100);
                                    }
                                }
                            });
                        });
                    });
                });
            }else{
                alertifyModal([], ['text_opmode','Start Inverter in Manual Mode?',''], function() {
                    document.getElementById('alertify-ok').onclick = function() {
                        setParameter('opmode', '2', false, false, function() {
                            syncofsTuning();
                        });
                    }
                });
            }
        });
    //}
};

function gen_syncofs_angle(syncofs) {

    var angle = (syncofs * 360 / 65536);
    //angle = (360/Math.floor(360 / angle)); //degree round
    //angle = Math.round(angle * 10) / 10; //digit round
    //angle = Math.ceil(angle * 20) / 20; //nearest 0.5

    return angle;
};

function gen_stator_data(poles) {
    var d = [];
    for (var i = 0; i < poles; i++) {
        d.push(360/poles);
    }
    return d;
};

function gen_stator_data_color(poles) {
    var red = 'rgb(255, 99, 132)';
    var blue = 'rgb(54, 162, 235)';
    var c = [blue];
    for (var i = 1; i < poles; i++) {
        if(c[i-1] == blue){
            c.push(red);
        }else{
            c.push(blue);
        }
    }
    return c;
};

function gen_syncofs_data(poles,angle) {
    var divide = 1;
    if(poles == 2) //2 poles need more segments to show angle
        divide = 2;
    var d = [];
    for (var i = 0; i < poles*divide; i++) {
        //console.log(angle + ' ' + 360/poles/divide);
        d.push(angle);
        d.push(360/poles/divide);
    }
    //console.log(d);
    return d;
};

function gen_stator_syncofs_color(poles) {
    var red = 'rgb(255, 99, 132)';
    var blue = 'rgb(54, 162, 235)';
    var yellow = 'rgb(255, 205, 86)';
    var c = [red];
    //for (var x = 0; x < poles/2; x++)
    //  c.push(blue);
    console.log('Poles:' + poles);

    var marker = 0;
    var divide = poles/2;
    if(poles == 2) { //2 poles need more segments to show angle
        poles = poles*2;
       //divide = 2;
    }
    if(poles == 8)
        marker = 1;

    for (var i = 0; i < poles*divide; i++) {
        //console.log(i + ' ' + c[c.length-1]);

        if(i > poles*divide-2) { //end: 2 = (1 start and 1 marker)
            for (var x = 0; x < poles/divide; x++)
                c.push(red);
        }else if(c[c.length-1] == blue){
            for (var x = 0; x < poles/divide-1; x++)
                c.push(red);
            if(i == marker) {
                c.push(yellow);
                //c.push(red);
            }else{
                c.push(red);
                //c.push(yellow);
            }
        }else if(c[c.length-1] == red){
            for (var x = 0; x < poles/divide-1; x++)
                c.push(blue);
            if(i == marker) {
                c.push(yellow);
            }else{
                c.push(blue);
            }
        }else{
            var alt_color = red;
            if(poles == 2 || poles == 8) {
                alt_color = blue;
            }
            for (var x = 0; x < poles/divide; x++)
                c.push(alt_color);
        }
    }
    //console.log(c);
    return c;
};

function alertifyModal(header, body, callback) {

    if(header.length > 0) {
        var h = document.createElement('span');
        h.id = header[0];
        h.textContent = header[1];
        document.getElementById('alertify-header').textContent = '';
        document.getElementById('alertify-header').appendChild(h);
    }
    if(body.length > 0) {
        var b = document.createElement('span');
        b.id = body[0];
        b.textContent = body[1];
        document.getElementById('alertify-body').textContent = '';
        document.getElementById('alertify-body').appendChild(b);
    }
    document.getElementById('alertify-cancel').textContent = inlineLanguage('cancel', 'Cancel');
    document.getElementById('alertify-ok').textContent = inlineLanguage('start', 'Start');

    var alertifyModal = document.getElementById('alertify');
    new bootstrap.Modal(alertifyModal, {}).show();
};

function syncofsTuning_slow() {

    var i = 10;

    var blink = setInterval(function() {
        i--;
        if(i < 1) {
            clearInterval(blink);
        }
        if (i%2 == 0){
            document.getElementById('text_slowdown').classList.add('d-none');
        }else{
            document.getElementById('text_slowdown').classList.remove('d-none');
        }
    }, 200);
};

function boostTuning_start() {

    alertify.confirm('Safety Check', 'Please be aware that the current you entered will actually be run through motor and power stage\nDo you understand the consequences of that [y/N]?\n', function () {
        
        setParameter('fweak',400);
        setParameter('boost',0);

        alertify.confirm('Safety Check', 'Now put the car into the highest gear and pull the handbrake, torque will be put on the motor!!\n', function () {
            var notify = $.notify({ message: 'Current: ' + current }, { type: 'danger' });

            setParameter('fslipspnt',1.5);
            setParameter('ampnom',100);

            var current = 0;
            var boost = 900;
            var i = 0;
            
            while (current < ampMax && i < 1000) {
                boost = boost + max((ampMax - current) * 10, 50);
                setParameter('boost',boost);
                sleep(500);
                current = getJSONAverageFloatValue('il1rms');
                notify.update({ message: 'Current: ' + current, type: 'success' });
                sleep(100);
                i++;
            }
            setParameter('ampnom','0');
            $.notify({ message: 'A boost value of ' + boost + ' results in your required current' }, { type: 'success' });

        }, function () {});

    }, function () {});
};

function boostTuning() {

    if(sanityCheck() === true)
    {
        modeCheck(1, function() {
            var ampMax = 0
            var ocurlim = getJSONFloatValue('ocurlim');

            if (ampMax === 0 || ampMax > (ocurlim * 0.6)){

                alertify.prompt('Current Limit: ' + ocurlim, 'What is your intended RMS motor current [A]?', '', function (event, ampRMS) {
                    ampMax = ampRMS;

                    if (ampMax > (ocurlim * 0.6)){
                        $.notify({ message: 'The value you entered is dangerously close to your power stage limit!! Please correct.'}, { type: 'danger' });
                    }else{
                        boostTuning_start();
                    }
                }, function () {});
            }else{
                boostTuning_start();
            }
        });
    }
};

function fweakTuning() {

    if(sanityCheck() === true)
    {
        modeCheck(1, function() {
            $.notify({ message: 'Very little torque is now put on the motor. The shaft should not spin. If it does, lock it' }, { type: 'success' });

            var fmax = getJSONFloatValue('fmax');
            var ampnom = getJSONFloatValue('ampnom');

            setParameter('fslipspnt',0);
            setParameter('fmax',1000);
            setParameter('ampnom',10);

            var fweak = 200;
            var notify = $.notify({ message: 'Starting fweak ' + fweak }, { type: 'success' });
            var i = 0;

            while (i < 100) {
                var i2 = fweak;
                var i1 = i2 / 2;

                setParameter('fweak',fweak);
                notify.update({ message: 'Trying fweak ' + fweak, type: 'warning'});
                setParameter('fslipspnt',i1);
                sleep(1000);
                var currentStart = getJSONAverageFloatValue('il2rms');
                sleep(1000);
                setParameter('fslipspnt',i2);
                sleep(1000);
                var currentEnd = getJSONAverageFloatValue('il2rms');
                setParameter('fslipspnt','0');

                var ratio = currentEnd / currentStart;
                notify.update({ message: ratio + ' ' + currentStart + ' ' + currentEnd, type: 'success' });
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
            //set values to original
            setParameter('fmax',fmax);
            setParameter('ampnom',ampnom);
        });
    }
};

function polePairTest() {

    if(sanityCheck() === true)
    {
        modeCheck(1, function() {
            alertify.confirm('Safety Check', 'Mark your motor shaft with something to observe when it finishes a rotation\nWill now slowly spin the shaft', function () {

                setParameter('ampnom',50);
                setParameter('fslipspnt',2);

                setTimeout(function() {

                    setParameter('fslipspnt',0);
                    alertify.prompt('Input', 'How many turns did the shaft complete in 10s? (Round up)', '', function (event, turns) {
                        var polepairs = Math.floor(20 / turns);
                        $.notify({ message: 'The motor has ' + polepairs + ' pole pairs' }, { type: 'success' });
                        setParameter('polepairs',polepairs);
                        return polepairs;
                    }, function () {});
                }, 10000);

            }, function () {});
        });
    }
};

function numimpTest() {

    if(sanityCheck() === true)
    {
        modeCheck(1, function() {
            alertify.confirm('Safety Check', 'We will now spin the motor shaft @60Hz and try to determine how many pulses per rotation we get\n', function () {
 
                setParameter('numimp',8);
                setParameter('ampnom',70);

                var polepairs = getJSONFloatValue('polepairs');
                var expectedSpeed = 59.9 * 60 / polepairs;
                rampFrequency(0, 60);

                setTimeout(function() {
                    var speed = getJSONAverageFloatValue('speed');
                    setParameter('ampnom',0);
                    var numimp = round(speed / expectedSpeed * 8);
                    $.notify({ message: 'Your encoder seems to have ' + numimp + ' pulses per rotation' }, { type: 'success' });
                    setParameter('numimp',numimp);
                }, 2000);
            }, function () {});
        });
    }
};

function tempTuningRun() {

    var t = document.getElementById('temp-current').value;
    var detect_tmphs = false;
    var detect_tmpm = false;

    for (var i = 0; i < _snshs.length; i++) {

        setParameter('snshs',_snshs[i]);

        var tmphs = getJSONAverageFloatValue('tmphs'); //Heatsink
        console.log(tmphs + '>' + t);

        if (tmphs < (t - 2) || tmphs > (t + 2)) { //+-2 degree
            continue;
        }else{
            $.notify({ message: 'Heatsink Sensor: ' + snshs[i]}, { type: 'success' });
            detect_tmphs = true;
            break;
        }
    }

    for (var i = 0; i < _snsm.length; i++) {

        setParameter('snsm',_snsm[i]);

        var tmpm = getJSONAverageFloatValue('tmpm'); //Motor
        console.log(tmpm + '>' + t);

        if (tmpm < (t - 2) || tmpm > (t + 2)) { //+-2 degree
            continue;
        }else{
            $.notify({ message: 'Motor Sensor: ' + snsm[i]}, { type: 'success' });
            detect_tmpm = true;
            break;
        }
    }

    if(detect_tmpm === false)
        $.notify({ message: 'Heatsink Sensor: Not Detected'}, { type: 'danger' });

    if(detect_tmpm === false)
        $.notify({ message: 'Motor Sensor: Not Detected'}, { type: 'danger' });
};

function tempTuning() {

    var tempTuningModal = new bootstrap.Modal(document.getElementById('tempTuning'), {})

    document.getElementById('temp-current').setAttribute('placeholder',  inlineLanguage('temperature', 'Current Air Temperature (°C)'));

    var select = document.getElementsByTagName('select');
    for (var i = 0; i < _snshs.length; i++) {
        var option = document.createElement('option');
        option.value = _snshs[i];
        option.textContent = snshs[i];
        select[0].appendChild(option);
    }
    for (var i = 0; i < _snsm.length; i++) {
        var option = document.createElement('option');
        option.value = _snsm[i];
        option.textContent = snsm[i];
        select[1].appendChild(option);
    }
    document.getElementById('temp-cancel').textContent = inlineLanguage('cancel', 'Cancel');
    document.getElementById('temp-ok').textContent = inlineLanguage('start', 'Callibrate');
    document.getElementById('temp-ok').onclick = function() {
        var v = document.getElementById('temp-current').value;
        if(v == '') {
            $.notify({ message: 'Cannot Callibrate Sensors'}, { type: 'danger' });
            $.notify({ message: 'Current Temperature Required'}, { type: 'warning' });
        }else{
            tempTuningRun();
        }
        tempTuningModal.hide();
    };

    tempTuningModal.show();
};

function tempTuningChangeSensor(id,value) {
    setParameter(id, value);
};

function rampFrequency(_from, to) {
    
    for (var framp = _from; framp < to; framp++) {
        setParameter('fslipspnt',framp);
    }
};

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
};