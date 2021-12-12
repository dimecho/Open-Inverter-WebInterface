var boot = getCookie('boot');
var ctxFont = 16;
var ctxFontColor = '#808080';
var ctxDashColor = 'black';

$(document).ready(function () {

    var safety = getCookie('safety');
    if (safety === undefined) {
        var safetyModal = new bootstrap.Modal(document.getElementById('safety'), {});
        safetyModal.show();
    }else{
        buildMenu(function() {

            var token = document.getElementById('parameters-token');
            var share = document.getElementById('parameters-share');

            initializeSerial(115200,0);

            if(os == 'esp8266') {

                var nvram = new XMLHttpRequest();
                nvram.responseType = 'json';
                nvram.onload = function() {
                    if (nvram.status == 200 && nvram.response != null) {
                        share.action = nvram.response['nvram'][12] + '/api.php';
                        token.value = nvram.response['nvram'][14];
                        if(token.value != '')
                            checkSubscriptionToken(token.value, nvram.response['nvram'][15], share.action, false);
                    }
                };
                nvram.open('GET', '/nvram', true);
                nvram.send();
            }else{

                //share.action = 'http://localhost/parameters/api.php'; //DEBUG
				token.value = (getCookie('token') || '');
                var timestamp = (getCookie('timestamp') || '');

                if(token.value != '')
                    checkSubscriptionToken(token.value, timestamp, share.action, false);
            }

            token.onchange = function()
            {
                var expr = /^[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}$/i;
    
                if (expr.test(this.value))
                {
                    $.notify({ message: 'Subscribed to ' + this.value }, { type: 'success' });
                }else{
                    this.value = '';
                    $.notify({ message: 'Invalid Token. GUID Format' }, { type: 'warning' });
                }
                if(os == 'esp8266') {
                    setNVRAM('15', this.value);
                }else{
                    setCookie('token', this.value, 120);
                }
            }
        });
    }

    if(theme == '.slate') {
        ctxFontColor = '#aaa';
        ctxDashColor = 'white';
    }
    
    if(saveReminder != undefined)
    {
        document.getElementById('save-parameters').classList.remove('btn-secondary');
        document.getElementById('save-parameters').classList.add('btn-success');
        
        saveReminderTimer = setInterval(saveReminderCounter, 60000);
        saveReminderCounter();
    }
});

function checkSubscriptionToken(token, stamp, url, forceUpdate)
{
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            var params = xhr.response;
            
            if(Object.keys(params).length > 0)
            {
                var timestamp = params.timestamp;
                delete params['timestamp'];

                if(stamp == timestamp && !forceUpdate) {
                    $.notify({ message: 'Subscription up to date' }, { type: 'success' });
                }
                else if(forceUpdate || confirm('Subscription is updated, Apply?'))
                {
                    $.notify({ message: 'Applying new Subscription from ' + timestamp }, { type: 'warning' });

                    for(var key in params) {
                        setParameter(key, params[key], false, false);
                    }
                    if(os == 'esp8266') {
                        setNVRAM('16', timestamp);
                    }else{
                        setCookie('timestamp', timestamp, 120);
                    }
                    $.notify({ message: 'Subscription re-newed'}, { type: 'success' });

                    buildParameters(115200, 0);
                }
            }else{
                $.notify({ message: 'Subscription Not Found'}, { type: 'warning' });
            }
        }else{
            $.notify({ message: 'Subscription Error'}, { type: 'danger' });
        }
    };
    xhr.open('GET', url + '?token=' + token, true);
    xhr.send();
};

function shareParameter() {
    document.getElementById('parameters-share').submit();
};

function saveReminderCounter() {
    $.notify({ message: 'Don\'t forget to Save Settings!' }, { type: 'warning' });
};

function initializeSerial(speed,loop) {

    var e_com = document.getElementById('com');
    var e_loader = document.getElementById('loader-parameters');
    e_loader.classList.remove('d-none');

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            var data = xhr.responseText;
            console.log(data);

            deleteCookie('serial.block');

            if(data == '') {
                if(loop == 0) {
                    var xhrRestart = new XMLHttpRequest();
                    xhrRestart .onload = function() {
                        $.notify({ message: 'No Communication' }, { type: 'danger' });
                        $.notify({ message: 'Attempting to Restart Inverter ...' }, { type: 'warning' });
                        setTimeout(function () {
                            //location.reload();
                            initializeSerial(115200,1);
                        }, 2000);
                    };
                    xhrRestart.open('GET', '/restart', true);
                    xhrRestart.send();
                }else if(loop == 2) {
                    $.notify({ message: 'Power Cycle Inverter' }, { type: 'warning' });
                }else{
                    deleteCookie('boot');
                    e_loader.classList.add('d-none');
                    e_com.classList.remove('d-none');
                }
            }else if(data.toUpperCase().indexOf('ERROR') != -1) {
                e_loader.classList.add('d-none');
                e_com.classList.remove('d-none');
                var cxhr = new XMLHttpRequest();
                cxhr.onload = function() {
                    if (cxhr.status == 200) {
                        var s = cxhr.responseText.split('\n');
                        if(s.length == 2) {
                            $.notify({ message: 'Try swapping TX <-> RX' }, { type: 'warning' });
                        }else if(s.length > 1) {
                            for (var i = 0; i < s.length; i++) {
                                if(s[i] != '')
                                    $('#serial-interface').append($('<option>',{value:s[i]}).append(s[i]));
                            }
                            var serialModal = new bootstrap.Modal(document.getElementById('serial'), {});
                            serialModal.show();
                        }else if (isMacintosh()) {
                            var driversModal = new bootstrap.Modal(document.getElementById('usb-ttl-drivers'), {});
                            if(os == 'mac') {
                                document.getElementById('usb-ttl-mac').style.display = 'block';
                            }
                            driversModal.show();
                        }else{
                            $.notify({ message: 'Serial not found' }, { type: 'danger' });
                        }
                    }
                };
                cxhr.open('GET', 'serial.php?com=list', false);
                cxhr.send();
            }else if(data.indexOf('2D') != -1) {
                if (boot == undefined) { // Two try - prevents false-positive ESP8266
                    setCookie('boot', 1, 1);
                    location.reload();
                }else{
                    deleteCookie('boot');
                    $.notify({ message: 'Firmware corrupt or not found' }, { type: 'danger' });
                    //$('#com').removeClass('d-none'); //.show();
                    setTimeout(function () {
                        window.location.href = 'firmware.php';
                    }, 2600);
                }
            }else if(data.indexOf('9600') != -1) {
                $.notify({ message: 'Serial speed is 9600 baud, Power cycle' }, { type: 'danger' });
                e_com.classList.remove('d-none');
            }else if(data.indexOf('w}') != -1) {
                $.notify({ message: 'Serial speed incorrect, Refresh' }, { type: 'danger' });
                e_com.classList.remove('d-none');
            }else if(data.indexOf('test pin') != -1) {
                $.notify({ message: 'STM32 Test firmware detected' }, { type: 'danger' });
                setTimeout(function () {
                    window.location.href = 'test.php';
                }, 2600);
            }else{
                buildParameters(speed,loop);
            }
        }else{
            console.log(xhr.status);
            console.log(xhr.responseText);

            if (os === 'windows'){
                $.notify({ message: 'Serial blocked ...Un-plug it!' }, { type: 'danger' });
            }
            $.notify({ message: 'Try swapping TX <-> RX' }, { type: 'warning' });
            e_com.classList.remove('d-none');
            setCookie('serial.block', 1, 1);

            e_loader.classList.add('d-none');
        }
    };
    xhr.open('GET', 'serial.php?init=' + speed, true);
    xhr.send();
};

function basicChecks(json)
{
	var deadtime = setDefaultValue(json.deadtime, 0);
	var udc = setDefaultValue(json.udc, 0);
	var udcsw = setDefaultValue(json.udcsw, 0);
    
	if(udc > udcsw) //Get real operating voltage
	{
		if((udc < 32 && fweak > 20) ||
		   (udc < 58 && fweak > 30) ||
		   (udc < 200 && fweak > 100 ) ||
		   (udc < 300 && fweak > 120 ) ||
		   (udc < 400 && fweak > 140 ))
		{
			$.notify({ message: 'Field weakening "fweak" might be too high' }, { type: 'warning' });
		}
	}
    var v = json.version.unit || '';
    if(v.toString().indexOf('foc') == -1)
    {
        var fweak = setDefaultValue(json.fweak, 0);
        var fslipmax = setDefaultValue(json.fslipmax, 0);
        var fslipmin = setDefaultValue(json.fslipmin, 0);
        var udcnom = setDefaultValue(json.udcnom, 0);

        if (udcnom > udc) {
            $.notify({ message: '"udcnom" is higher than detected voltage "udc"' }, { type: 'warning' });
        }
        if(fweak === 0) {
            $.notify({ message: 'Field weakening "fweak" is dangerously low. Motor may jump on startup' }, { type: 'danger' });
        }
        if (fslipmax > 10) {
            $.notify({ message: 'Slip "fslipmax" is high, might be running open loop. Check your encoder connections' }, { type: 'warning' });
        }
        if(fslipmax / 5 > fslipmin) {
            $.notify({ message: 'Slip "fslipmax" too high from "fslipmin". Motor may start to rock violently on startup' }, { type: 'warning' });
        }
    }
	if (deadtime < 28) {
		$.notify({ message: 'IGBT "deadtime" is dangerously fast' }, { type: 'danger' });
	}
    if(json.version != undefined) {
        var v = json.version.value
        if(json.version.unit != undefined)
        {
            var split = json.version.unit.split('=');
            v = split[1];
        }
        displayFWVersion(v);
        checkFirmwareUpdates(v);
    }
    if(json.hwver != undefined) {
        hardware = parseInt(json.hwver.value);
        setCookie('hardware', hardware, 1);
        displayHWVersion();
    }
};

function _boostSlipCalculator(fslipconstmax,fslipmax,fconst,boost,fweak,udcnom,udc)
{
    var udc_diff = (udc-udcnom);
    var adj_factor_calc = 1+(udc_diff/udcnom);
    var boost_calc = (boost/adj_factor_calc);
    var fweak_calc = (fweak*adj_factor_calc);
    var fslip_change_calc = (fweak-fweak_calc)*((fslipconstmax-fslipmax)/(fconst-fweak));
    /*
    console.log('udc ' + udc);
    console.log('udc_diff ' + udc_diff);
    console.log('adj_factor_calc ' + adj_factor_calc);
    console.log('boost_calc ' + boost_calc);
    console.log('fweak_calc ' + fweak_calc);
    console.log('fslip_change_calc ' + fslip_change_calc);
    */
    return [Math.round(boost_calc), Math.round(fweak_calc)];
};

function boostSlipCalculator()
{
    var fslipconstmax = parseInt($('#fslipconstmax').val());
    var fslipmax = parseInt($('#fslipmax').val());
    var fconst = parseInt($('#fconst').val());
    var boost = parseInt($('#boost').val());
    var fweak = parseInt($('#fweak').val());
    var udcnom = parseInt($('#udcnom').val());
    var udc = parseInt($('#udc').val());

    //_boostSlipCalculator(fslipconstmax,fslipmax,fconst,boost,fweak,udcnom,udc);
    //_boostSlipCalculator(5.5,3.6,350,2000,100,500,480);

    var boost_n = Math.round(boost/1000)*1000;

    if(udcnom == 0) {
        $.notify({ message: 'Set udcnom higher than zero.' }, { type: 'danger' });
        return;
    }

    var div = $('<div>',{class:'container'});
    var row = $('<div>',{class:'row'});
    var col = $('<div>',{class:'col', align:'center'});
    var loader = $('<div>',{ class:'spinner-border text-dark'});
    var canvas = $('<canvas>');

    col.append(loader);
    col.append(canvas);
    row.append(col);
    div.append(row);

    $('#calculator').find('.modal-body').empty().append(div);
    var calculatorModal = new bootstrap.Modal(document.getElementById('calculator'), {});
    calculatorModal.show();

    getScript('js/chart.js', function () {
        getScript('js/chartjs-plugin-annotation.js', function () {

            var chart_boost_datasets = {
                type: 'line',
                label: 'boost',
                fill: false,
                backgroundColor: 'rgba(255,99,132, 0.5)',
                borderColor: 'rgba(255,99,132)',
                borderWidth: 2,
                tooltipHidden: false,
                data: [],
                yAxisID: 'y-axis-0',
            };

            var chart_fweak_datasets = {
                type: 'line',
                label: 'fweak',
                fill: false,
                backgroundColor: 'rgba(51, 153, 255, 0.5)',
                borderColor: 'rgba(51, 153, 255)',
                borderWidth: 2,
                tooltipHidden: false,
                data: [],
                yAxisID: 'y-axis-1',
            };

            var chart_udc_datasets = {
                type: 'line',
                label: 'udc',
                lineTension: 0,
                backgroundColor: 'rgba(102, 255, 51, 0.4)',
                borderColor: 'rgba(102, 255, 51)',
                borderWidth: 2,
                tooltipHidden: true,
                data: [], //udc representation
                xAxisID: 'x-axis-0'
            };

            var udc_segment = 8;
            var boost_segment = 500;
            var fweak_segment = 10;
            var udc_drop = Math.round((udc-udcnom)/(udc_segment/1.8));
            var udc_variable = []; //udc actual
            var udc_n = Math.round(udc/100)*100;

            var udcnom_line = false;
            for (var i = 0; i < udc_segment; i++) {
                var u = udc-(i*udc_drop);
                if(u < udcnom && udcnom_line == false) //insert udcnom as part of X-Axis
                {
                    udcnom_line = true;
                    udc_variable.pop();
                    udc_variable.push(udcnom);
                }else{
                    udc_variable.push(u);
                }
            }

            //representation of udc using boost axis
            var udc_graph = []; //show always positive
            for (var i = 1; i <= udc_variable.length; i++) {
                udc_graph.push(i*boost_segment/2); //graph somewhere in the middle
            }
            chart_udc_datasets.data = udc_graph.reverse();

            for (var i = 0; i < udc_variable.length; i++) {
                var calc = _boostSlipCalculator(fslipconstmax,fslipmax,fconst,boost,fweak,udcnom,udc_variable[i]);
                chart_boost_datasets.data.push(calc[0]);
                chart_fweak_datasets.data.push(calc[1]);
            }

            data = {
                labels: udc_variable,
                datasets: [chart_boost_datasets,chart_fweak_datasets,chart_udc_datasets]
            };

            options = {
                //responsive: true,
                scales: {
                    'x-axis-0': {
                        position: 'bottom',
                        title: {
                            fontColor: ctxFontColor,
                            fontSize: ctxFont,
                            labelString: 'udc (Volt)'
                        },
                        ticks: {
                            fontColor: ctxFontColor,
                            fontSize: ctxFont
                        },
                        grid: {
                            color: ctxFontColor
                        }
                    },
                    'y-axis-0': {
                        position: 'right',
                        title: {
                            labelString: 'boost',
                            fontSize: ctxFont,
                            fontColor: chart_boost_datasets.borderColor
                        },
                        ticks: {
                            precision: 0,
                            fontColor: ctxFontColor,
                            fontSize: ctxFont,
                            stepSize: boost_segment,
                            suggestedMin: 0,
                            suggestedMax: boost_n + (boost_segment*2)
                        },
                        grid: {
                            drawOnChartArea: true,
                            color: ctxFontColor
                        }
                    },
                    'y-axis-1':{
                        position: 'left',
                        title: {
                            labelString: 'fweak (Hz)',
                            fontSize: ctxFont,
                            fontColor: chart_fweak_datasets.borderColor
                        },
                        ticks: {
                            precision: 0,
                            stepSize: 1,
                            fontColor: ctxFontColor,
                            fontSize: ctxFont,
                            stepSize: fweak_segment,
                            suggestedMin: 0,
                            suggestedMax: fweak + (fweak_segment*2)
                        },
                        grid: {
                            drawOnChartArea: true,
                            color: ctxFontColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            fontColor: ctxFontColor,
                            fontSize: ctxFont
                        }
                    },
                    tooltip: {
                        //enabled: true,
                        filter: function(tooltipItem, data) {
                            return !data.datasets[tooltipItem.datasetIndex].tooltipHidden; // custom added prop to dataset
                        }
                    },
                    annotation: {
                        annotations: [{
                            type: 'line',
                            id: 'a-line-0',
                            mode: 'vertical',
                            scaleID: 'x-axis-0',
                            value: udcnom,
                            borderColor: ctxDashColor,
                            borderWidth: 1,
                            borderDash: [4, 4],
                            label: {
                              content: 'udcnom',
                              enabled: true,
                              position: 'top'
                            }
                        }]
                    }
                }
            };

            loader.hide();
            
            var chart = new Chart(canvas, {
                type: 'line',
                data: data,
                options: options
            });

            if(chart_fweak_datasets.data[chart_fweak_datasets.data.length-1] < 0){
                alert('udcnom is too low, adjust and re-calculate.');
            }
        });
    });
};

function MTPACalculator()
{
    var loader = $('<div>',{ class:'spinner-border text-dark', align:'center'});
    var canvas = $('<canvas>');

    $('#calculator').find('.modal-body').empty().append(loader).append(canvas);
    var calculatorModal = new bootstrap.Modal(document.getElementById('calculator'), {});
    calculatorModal.show();

    getScript('js/chart.js', function () {
		getScript('js/chartjs-plugin-annotation.js', function () {

	    	//TODO: This needs a proper formula!
	    	var fwkp = parseInt($('#fwkp').val());

	    	var beta_angle = 25; //MTPA Trajectory Angle at rated design point (syncofs?)
	    	var _iq_sin_beta = Math.sin(beta_angle);
	    	var _iq_cos_beta = Math.cos(beta_angle);
	    	var syncadv = 0;
	    	var radius = Math.abs(parseInt($('#ocurlim').val()));
	    	var radius_offset = 20;

	    	var optimum_mtpa = [];
	    	for (var i = 0; i < (beta_angle * 1.5); i++) {
				var angle  = (90  + syncadv) - (i * 2);
				var _x = radius * Math.sin(Math.PI * 2 * angle / 360);
				var _y = radius * Math.cos(Math.PI * 2 * angle / 360);
				_x = _x - radius; //invert trajectory
				optimum_mtpa.push({x:_x.toFixed(2),y:_y.toFixed(2)});
				//console.log(_x + ', ' + _y);
	    	}
	    	var optimum_torque = []
	    	for (var i = 0; i <= 45; i++) {
				var angle  = 90 + (i * 2);
				var _x = radius * Math.sin(Math.PI * 2 * angle / 360);
				var _y = radius * Math.cos(Math.PI * 2 * angle / 360);
				_y = _y + radius + radius_offset; //invert trajectory
				_x = _x - radius; //invert trajectory
				optimum_torque.push({x:_x.toFixed(2),y:_y.toFixed(2)});
				//console.log(_x + ', ' + _y);
	    	}
	    	var current_limit = [];
	    	for (var i = 0; i <= 45; i++) {
				var angle  = 270 + (i * 2);
				var _x = radius * Math.sin(Math.PI * 2 * angle / 360);
				var _y = radius * Math.cos(Math.PI * 2 * angle / 360);
				current_limit.push({x:_x.toFixed(2),y:_y.toFixed(2)});
				//console.log(_x + ', ' + _y);
	    	}

	        var chart_mtpa_datasets = {
	            type: 'line',
	            label: 'MTPA',
	            fill: false,
	            borderColor: 'rgba(255,99,132)',
	            borderWidth: 2,
	            //pointRadius: 0,
	            data: optimum_mtpa,
	            yAxisID: 'y-axis-0',
	        };

	        var chart_iq_datasets = {
	            type: 'line',
	            label: 'Current Limit',
	            fill: false,
	            borderColor: 'rgba(51, 153, 255)',
	            borderWidth: 2,
	            pointRadius: 0,
	            data: current_limit,
	            yAxisID: 'y-axis-0',
	        };

	        var chart_id_datasets = {
	            type: 'line',
	            label: 'Optimum Torque',
	            fill: false,
	            borderColor: 'rgba(102, 255, 51)',
	            borderWidth: 2,
	            pointRadius: 0,
	            data: optimum_torque,
	            xAxisID: 'x-axis-0'
	        };

	        data = {
	            labels: [],
	            datasets: [chart_iq_datasets,chart_id_datasets,chart_mtpa_datasets]
	        };

	        options = {
	        	responsive: true,
				maintainAspectRatio: true,
	            scales: {
	                'x-axis-0': {
	                    position: 'bottom',
	                    type: 'linear',
	                    title: {
	                        display: true,
	                        fontColor: ctxFontColor,
	                        fontSize: ctxFont,
	                        labelString: 'Direct Axis Current (A)'
	                    },
	                    ticks: {
	                    	precision: 2,
	                        fontColor: ctxFontColor,
	                        fontSize: ctxFont,
	                        suggestedMin: -6,
	                        suggestedMax: 0,
	                        userCallback: function(label, index, labels) {
			                    if (Math.floor(label) === label) {
			                        return label;
			                    }
			                }
	                    },
	                    grid: {
	                    	drawOnChartArea: false,
	                        color: ctxFontColor
	                    }
	                },
	                'y-axis-0': {
	                    position: 'left',
	                    title: {
	                        display: true,
	                        fontColor: ctxFontColor,
	                        fontSize: ctxFont,
	                        labelString: 'Quadrature Axis Current (A)'
	                    },
	                    ticks: {
	                        precision: 2,
	                        fontColor: ctxFontColor,
	                        fontSize: ctxFont
	                    },
	                    grid: {
	                        drawOnChartArea: true,
	                        color: ctxFontColor
	                    }
	                },
                    'y-axis-1': {
	                    position: 'right',
	                    title: {
	                        display: true,
	                        fontColor: ctxFontColor,
	                        fontSize: ctxFont,
	                        labelString: 'Frequency (Hz)'
	                    },
	                    ticks: {
	                        precision: 0,
	                        fontColor: ctxFontColor,
	                        fontSize: ctxFont,
	                        stepSize: 10,
                            suggestedMin: 0,
                            suggestedMax: 200
	                    },
	                    grid: {
	                        drawOnChartArea: false
	                    }
	                }
    			}, 
                plugins: {
                    legend: {
                        labels: {
                            fontColor: ctxFontColor,
                            fontSize: ctxFont
                        }
                    },
        			annotation: {
    		        	//drawTime: 'afterDatasetsDraw',
    					annotations: [{
    						type: 'line',
                            id: 'a-line-0',
                            mode: 'horizontal',
                            scaleID: 'y-axis-1',
                            value: fwkp,
                            borderColor: 'rgb(255, 205, 86)',
                            borderWidth: 2,
                            label: {
                              content: 'fwkp=' + fwkp,
                              enabled: true,
                              yAdjust: -12,
                              position: 'right'
                            }
    					}]
    				}
                }
	        };

	        loader.hide();
	        
	        var chart = new Chart(canvas, {
	            type: 'line',
	            data: data,
	            options: options
	        });
        });
    });
};

function syncofsCalculator()
{
    var polepairs = parseInt($('#polepairs').val());

    var loader = $('<div>',{ class:'spinner-border text-dark', align:'center'});
    var div = $('<div>',{class:'container'});
    var row = $('<div>',{class:'row'});
    var col1 = $('<div>',{class:'col'});
    var col2 = $('<div>',{class:'col'});

    var p = $('<p>').append('Nissan Leaf Resolver Offsets');
    var input1 = $('<input>',{ class:'form-control my-3', type:'text', placeholder:'Motor Label (Ex: 7F0036)'});
    var input2 = $('<input>',{ class:'form-control my-3', type:'text', disabled:true});
    var btn = $('<button>',{ class:'btn btn-primary', type:'button'});
    var img = $('<img>',{ class:'img-thumbnail rounded', src:'img/leaf-resolver-offsets.jpg'});

    if(os != 'esp8266' && os != 'mobile') {
        col1.append(img);
        row.append(col1);
        div.append(row.append(col1));
    }

    col2.append(p).append(input1).append(input2);
    col2.append(btn.append('Save'));
    div.append(row.append(col2));

    input1.on('input',function(e) {
    	var shift_oneeighty = 0.5;
        var value = $(this).val();

        if(value.length > 1)
        {
	        var hex = parseInt('0x' + value.substring(0, 2),16);

	        var syncofs = Math.abs(hex - 0x80) * 256;
	        
	        if(syncofs > 512) { //TODO: check for correctness
	        	shift_oneeighty = 2;
	        }
	        var syncofs_angle = (syncofs * 360 / 65536);

	        input2.val(syncofs + ' @ ' + syncofs_angle.toFixed(1) + '°, Shift 180° = ' + (syncofs/shift_oneeighty) + ' @ ' + (syncofs_angle/shift_oneeighty).toFixed(1) + '°');
        }
	});

    btn.click(function() {
        var split = input2.val().split(' ');
        var v = parseInt(split[6]);
        $('#syncofs').val(v);
        setParameter('syncofs',v,true,true);
    });

	/*
	82 00 DF 00 5D

	1000 means 1000*360/65536=5.5°.
	If we assume 360° is 256 in Nissans world then syncofs_256=1000*256/65536 = 0x4.
	If we further assume that they phase shift their calibration by 180° for some reason
	then 0x2 would be perfect since 0x2 + 0x80 = 0x82.
	*/
	//console.log(((0x82 + 0x80) % 256) * 256);
	/*
	syncofs=49152 (270 degree)
	syncofs=16384 (90 degree)
	*/

    $('#calculator-content').empty().append(div);

    var calculatorModal = new bootstrap.Modal(document.getElementById('calculator'), {});
    calculatorModal.show();
};

function pinSwapCalculator()
{
    var div = $('<div>',{class:'container'});
    var row = $('<div>',{class:'row'});
    var col = $('<div>',{class:'col'});
    var pre = $('<pre>').append(
        '\n \3-bit Binary Field\n \
        --------------------------\n \
        PWM----Resolver----Current\n\n \
        001 = 1 Swap Currents ony\n \
        010 = 2 Swap Resolver only\n \
        011 = 3 Swap Resolver and Currents\n \
        100 = 4 Swap PWM only\n \
        101 = 5 Swap PWM and Currents\n \
        110 = 6 Swap PWM and Resolver\n \
        111 = 7 Swap PWM and Resolver and Currents');

    col.append(pre);
    div.append(row.append(col));

    $('#calculator').find('.modal-body').empty().append(div);
    var calculatorModal = new bootstrap.Modal(document.getElementById('calculator'), {});
    calculatorModal.show();
};

function parseEnum(unit)
{
    var expr = /(\-{0,1}[0-9]+)=([a-zA-Z0-9_\-\.]+)[,\s]{0,2}|([a-zA-Z0-9_\-\.]+)[,\s]{1,2}/g;
    var enums = new Array();
    var res = expr.exec(unit);

    if (res)
    {
        do
        {
            enums[res[1]] = res[2];
        } while (res = expr.exec(unit))
        return enums;
    }
    return false;
};

function buildParameters(speed, loop)
{
    var xhr = new XMLHttpRequest();
    xhr.speed = speed;
    xhr.loop = loop;
    xhr.onload = function() {
        if (xhr.status == 200) {

            var parameters = [];
            var description = [];

            var row = xhr.responseText.split('\n');

            for (var i = 0; i < row.length; i++) {
                
                var split = row[i].split(',');
                
                //console.log(split[0]);
                //console.log(d.replace(/"/g, ''));

                parameters.push(split[0]);
                description.push(row[i].substring(split[0].length + 1).replace(/"/g, ''));
            }

	       sendCommand('json', 0, function(json) {

	            var inputDisabled = false;

	            if(Object.keys(json).length == 0)
	            {
                    if(xhr.loop == 0) {
                        initializeSerial(115200, (xhr.loop + 1)); //try lower speed
                        return;
                    }
	            }else{
	                buildStatus();
	                basicChecks(json);
	            }
                document.getElementById('parameters-json').value = JSON.stringify(json); //json;

	            var legend = $('#legend').empty();
	            var menu = $('#parameters').empty();
	            var thead = $('<thead>', {class:'thead-inverse'}).append($('<tr>').append($('<th>')).append($('<th>').append('Name')).append($('<th>').append('Value')).append($('<th>').append('Type')));
	            var tbody = $('<tbody>');
	            menu.append(thead);
	            menu.append(tbody);

	            for(var key in json)
	            {
	                //console.log(key);

	                var tooltip = '';
	                var x = parameters.indexOf(key);
	                if(x !=-1)
	                    tooltip = description[x];

	                var a = $('<a>');
	                var tr = $('<tr>');
	                
	                var a = $('<input>', { type:'number', min:json[key].minimum, max:json[key].maximum, 'id':key, class:'form-control', value:json[key].value, disabled: inputDisabled });
                    var df = json[key].default || '';
                    if(df.toString().indexOf('.') != -1) {
                        a.attr('step', 0.05);
                    }else{
                        a.attr('step', 1);
                    }
	                if(os === 'mobile') {
	                    a.attr('type','number');
	                }
	                a.on('input', function() {
	                    var element = $(this);
	                    if(element.val() != '') {
	                        validateInput(json,element.attr('id'), element.val(), function(r) {
	                            if(r === true) {
                                    clearTimeout(parameterTimer);
                                    parameterTimer = setTimeout(function () {
                                        document.getElementById('save-parameters').classList.remove('btn-secondary');
                                        document.getElementById('save-parameters').classList.add('btn-success');
                                        setParameter(element.attr('id'),element.val(),false,true);
                                        clearTimeout(saveReminderTimer);
                                        saveReminderTimer = setInterval(saveReminderCounter, 60000);
                                        setCookie('serial.save', true, 1);
                                    }, 500);
	                            }
	                        });
	                    }
	                });

	                var category_icon = $('<i>', { class:'icons text-muted' });

	                if(json[key].category)
	                {
	                    var category = json[key].category;
	                    
	                    category_icon.attr('data-bs-toggle', 'tooltip');
	                    category_icon.attr('data-html', true);
	                    category_icon.attr('title', '<h6>' + category + '</h6>');

	                    if(category == 'Motor')
	                    {
	                        category_icon.addClass('icon-motor');
	                    }
	                    else if(category == 'Inverter')
	                    {
	                        category_icon.addClass('icon-inverter');
	                    }
	                    else if(category == 'Charger')
	                    {
	                        category_icon.addClass('icon-plug');
	                    }
	                    else if(category == 'Throttle')
	                    {
	                        category_icon.addClass('icon-throttle');
	                    }
	                    else if(category == 'Regen')
	                    {
	                        category_icon.addClass('icon-power');
	                    }
	                    else if(category == 'Automation')
	                    {
	                        category_icon.addClass('icon-gear');
	                    }
	                    else if(category == 'Derating')
	                    {
	                        category_icon.addClass('icon-magnet');
	                    }
	                    else if(category == 'Contactor Control')
	                    {
	                        category_icon.addClass('icon-download');
	                    }
	                    else if(category == 'Aux PWM')
	                    {
	                        category_icon.addClass('icon-pwm');
	                    }
	                    else if(category == 'Testing')
	                    {
	                        category_icon.addClass('icon-test');
	                    }
	                    else if(category == 'Communication')
	                    {
	                        category_icon.addClass('icon-transfer');
	                    }else{
	                        category_icon.addClass('icon-info');
	                    }
	                }
	                
	                var td1 = $('<td>').append(category_icon);
	                var td2 = $('<td>').append(key);
	                var td3 = $('<td>').append(a);
	                var td4 = $('<td>');

	                if(key == 'fwkp') {
	                    var fwkp_btn = $('<button>', {type:'button', class:'btn btn-primary', onclick:'MTPACalculator()'});
	                    var fwkp_calc = $('<i>', {class:'icons icon-magic'});
	                    td4.append(fwkp_btn.append(fwkp_calc).append(' MTPA'));
	                }else if(key == 'syncofs') {
	                    var syncofs_btn = $('<button>', {type:'button', class:'btn btn-primary', onclick:'syncofsCalculator()'});
	                    var syncofs_calc = $('<i>', {class:'icons icon-magic'});
	                    td4.append(syncofs_btn.append(syncofs_calc).append(' Calculate'));
	                }else if(key == 'pinswap') {
	                    var pinswap_btn = $('<button>', {type:'button', class:'btn btn-primary', onclick:'pinSwapCalculator()'});
	                    var pinswap_calc = $('<i>', {class:'icons icon-magic'});
	                    td4.append(pinswap_btn.append(pinswap_calc).append(' Calculate'));
	                } else if(key == 'udcnom') {
	                    var fweak_btn = $('<button>', {type:'button', class:'btn btn-primary', onclick:'boostSlipCalculator()'});
	                    var fweak_calc = $('<i>', {class:'icons icon-magic'});
	                    td4.append(fweak_btn.append(fweak_calc).append(' Calculate'));
	                }else{
	                    td4.append(json[key].unit.replace('','°'));
	                }

	                if(tooltip != '')
	                {
	                    td2.attr('data-bs-toggle', 'tooltip');
	                    td2.attr('data-html', true);
	                    td2.attr('title', '<h6>' + tooltip + '</h6>');
	                }

	                tr.append(td1).append(td2).append(td3).append(td4);
	                tbody.append(tr);
	            };
	            menu.removeClass('d-none'); //.show();

	            $('#saveload').removeClass('d-none');//.show();

	            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	              return new bootstrap.Tooltip(tooltipTriggerEl,{ template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large"></div></div>',
	                container: 'body', placement: 'right', html: true})
	            });

                document.getElementById('loader-parameters').classList.add('d-none'); //.hide();
            });
        }
    };
    xhr.open('GET', 'description.csv', true);
    xhr.send();

    checkWebUpdates();
};

function installDrivers()
{
    document.getElementById('usb-ttl-select').style.display = 'none';

    var drivers = document.querySelectorAll("input[type='checkbox']");

    var args = '';
    for(var i = 0; i < drivers.length; i++) {
        if(drivers[i].checked == true) {
            args += ',' + drivers[i].name;
        }
    }
    if(args == '') {
        document.getElementById('usb-ttl-select').style.display = 'block';
    }else{
        openExternalApp('driver',args.substring(1));
        
        var timerProgressCounter = 0;
        var timerProgress = setInterval(function() {
            timerProgressCounter++;
            if(timerProgressCounter == 100) {
                clearInterval(timerProgress);
            }
            document.getElementById('usb-ttl-progress').style.width = timerProgressCounter + '%';
        }, 100);
    }
};

function setNVRAM(offset, value)
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/nvram?offset=' + offset + '&value=' + value, true);
    xhr.send();
};

function checkFirmwareUpdates(v)
{
    var split = v.split('.');
    var _version = parseFloat(split[0]);
    var _build = parseFloat(split[1]);

    var check = Math.random() >= 0.5;
    if (check === true)
    {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status == 200) {
                try {
                    var release = xhr.response.tag_name.replace('v','').replace('.R','');
                    var split = release.split('.');
                    var version = parseFloat(split[0]);
                    var build = parseFloat(split[1]);

                    //console.log('Old Firmware:' + _version + ' Build:' + _build);
                    //console.log('New Firmware:' + version + ' Build:' + build);

                    if(version > _version || build > _build)
                    {
                        $.notify({
                            icon: 'icons icon-download',
                            title: 'New Firmware',
                            message: 'Available <a href="https://github.com/jsphuebner/stm32-sine/releases" target="_blank">Download</a>'
                        }, {
                            type: 'success'
                        });
                    }
                } catch(e) {}
            }
        };
        xhr.open('GET', 'https://api.github.com/repos/jsphuebner/stm32-sine/releases/latest', true);
        xhr.send();
    }
};

function checkWebUpdates()
{
    var check = Math.random() >= 0.5;
    if (check === true)
    {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
                try {
                    var split = xhr.responseText.split('\n');
                    var version = parseFloat(split[0]);
                    var build = parseFloat(split[1]);

	                _split = getCookie('version').split('.');
                    var _version = parseFloat(_split[0]);
                    var _build = parseFloat(_split[2]);

                    //console.log('Old Web Interface:' + _version + ' Build:' + _build);
                    //console.log('New Web Interface:' + version + ' Build:' + build);

                    if(version > _version || build > _build)
                    {
                        var url = 'https://github.com/dimecho/Open-Inverter-WebInterface/releases/download/';
                        if(os === 'mac'){
                            url += version + 'Huebner.Inverter.dmg';
                        }else if(os === 'windows'){
                            url += version + 'Huebner.Inverter.Windows.zip';
                        }else if(os === 'linux'){
                            url += version + 'Huebner.Inverter.Linux.tgz';
                        }else if(os === 'esp8266'){
                            url += version + 'Huebner.Inverter.ESP8266.zip';
                        }
                        $.notify({
                            icon: 'icons icon-download',
                            title: 'New Web Interface',
                            message: "Available <a href='" + url + "' target='_blank'>Download</a>"
                        }, {
                            type: 'success'
                        });
                    }
                } catch(e) {}
            }
        };
        xhr.open('GET', 'https://raw.githubusercontent.com/dimecho/Open-Inverter-WebInterface/master/Web/version.txt', true);
        xhr.send();
    }
};
