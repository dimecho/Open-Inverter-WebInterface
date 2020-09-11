// Internet Explorer Fix
function fill(size, content) {
    for (var i = 0; i < size; i++) {
    	this.push(content);
    }
    return this;
};
// ---------------------
var json = {};
var lineWidth = getCookie('graph.border') || 1;

var chart_motor_datasets = [{
	type: 'line',
	id: 'speed',
	label: 'Motor RPM',
	backgroundColor: 'rgba(255,99,132,0.2)',
	borderColor: 'rgba(255,99,132,1)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(255,99,132,0.4)',
	hoverBorderColor: 'rgba(255,99,132,1)',
	data: [0],
	yAxisID: 'y-axis-0'
}, {
	type: 'line',
	id: 'potnom',
	label: 'Throttle',
	backgroundColor: 'rgba(102, 255, 51, 0.2)',
	borderColor: 'rgba(0,0,0,0.2)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(102, 255, 51, 0.4)',
	hoverBorderColor: 'rgba(0,0,0,0.5)',
	data: [0],
	yAxisID: 'y-axis-1'
}];
var chart_temp_datasets = [{
	type: 'line',
	id: 'tmpm',
	label: 'Motor',
	backgroundColor: 'rgba(51, 153, 255,0.2)',
	borderColor: 'rgba(0,0,0,0.2)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(51, 153, 255,0.4)',
	hoverBorderColor: 'rgba(0,0,0,0.5)',
	data: [0],
    yAxisID: 'y-axis-0'
}, {
	type: 'line',
	id: 'tmphs',
	label: 'Inverter',
	backgroundColor: 'rgba(102, 255, 51,0.2)',
	borderColor: 'rgba(0,0,0,0.2)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(102, 255, 51,0.4)',
	hoverBorderColor: 'rgba(0,0,0,0.5)',
	data: [0],
    yAxisID: 'y-axis-1'
}];
var chart_voltage_datasets = [{
	type: 'line',
	id: 'udc',
	label: 'Battery',
	backgroundColor: 'rgba(102, 255, 51,0.2)',
	borderColor: 'rgba(0,0,0,0.2)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(102, 255, 51,0.4)',
	hoverBorderColor: 'rgba(0,0,0,0.5)',
	data: [0],
    yAxisID: 'y-axis-0'
}, {
	type: 'line',
	id: 'uac',
	label: 'Inverter',
	backgroundColor: 'rgba(255,99,132,0.2)',
	borderColor: 'rgba(255,99,132,1)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(255,99,132,0.4)',
	hoverBorderColor: 'rgba(255,99,132,1)',
	data: [0],
    yAxisID: 'y-axis-1'
}];
var chart_amperage_datasets = [{
	type: 'line',
	id: 'il1rms',
	label: 'AC Current',
	backgroundColor: 'rgba(51, 153, 255, 0.2)',
	borderColor: 'rgba(0,0,0,0.2)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(51, 153, 255, 0.4)',
	hoverBorderColor: 'rgba(0,0,0,0.5)',
	data: [0],
    yAxisID: 'y-axis-0'
}, {
	type: 'line',
	id: 'idc',
	label: 'DC Current',
	backgroundColor: 'rgba(102, 255, 51, 0.2)',
	borderColor: 'rgba(0,0,0,0.2)',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(102, 255, 51, 0.4)',
	hoverBorderColor: 'rgba(0,0,0,0.5)',
	data: [0],
    yAxisID: 'y-axis-1'
}];

var chart_frequency_datasets = [{
	type: 'line',
	id: 'fweak',
	label: 'Field Weakening',
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#ff0000',
	borderWidth: 1,
	hoverBackgroundColor: 'rgba(0, 0, 0, 0)',
	hoverBorderColor: '#ff0000',
	data: [0],
	datalabels: {
		display: false
	},
    yAxisID: 'y-axis-0'
}, {
	type: 'line',
	id: 'fstat',
	label: 'Stator Frequency',
	backgroundColor: '#90caf9',
	borderColor: '#33b5e5',
	borderWidth: lineWidth,
	hoverBackgroundColor: '#90caf9',
	hoverBorderColor: '#33b5e5',
	data: [0],
    yAxisID: 'y-axis-1'
}, {
	type: 'line',
	id: 'ampnom',
	label: 'Amplitude Max',
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#bdbdbd',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(0, 0, 0, 0)',
	hoverBorderColor: '#bdbdbd',
	data: [0],
	datalabels: {
		display: false
	},
    yAxisID: 'y-axis-2'
}, {
	type: 'line',
	label: 'Amplitude Nominal',
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#FF8800',
	borderWidth: lineWidth,
	hoverBackgroundColor: 'rgba(102, 255, 51,0.4)',
	hoverBorderColor: '#FF8800',
	data: [0],
    yAxisID: 'y-axis-3'
}];

var chart_pwm_datasets = [{
	type: 'line',
	label: 'L1 Delta', //red
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#ff3300',
	borderWidth: 1,
	data: [0]
}, {
	hidden: true,
	type: 'line',
	label: 'L2 Delta', //green
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#39e600',
	borderWidth: 1,
	data: [0]
}, {
	hidden: true,
	type: 'line',
	label: 'L3 Delta', //blue
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#0066ff',
	borderWidth: 1,
	data: [0]
}, {
	type: 'line',
	label: 'L1 Analog', //red
	borderColor: '#ff3300',
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderWidth: 1,
	data: [0]
}, {
	type: 'line',
	label: 'L2 Analog', //green
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#39e600',
	borderWidth: 1,
	data: [0]
}, {
	type: 'line',
	label: 'L3 Analog', //blue
	backgroundColor: 'rgba(0, 0, 0, 0)',
	borderColor: '#0066ff',
	borderWidth: 1,
	data: [0]
}, {
	type: 'line',
	label: 'Angle',
	backgroundColor: 'rgba(0, 0, 0, 0)',
	//borderColor: '#39e600',
	borderWidth: 1,
	data: fill.call([],1000,0) //Array(1000).fill(0)
}, {
	type: 'line',
	label: 'Slip',
	backgroundColor: 'rgba(0, 0, 0, 0)',
	//borderColor: '#39e600',
	borderWidth: 1,
	data: fill.call([],1000,0) //Array(1000).fill(0)
}];

var knobValue = 0;
var knobTimer;

var chart_can_datasets = [];
var chart_can_zeroLineH = 2.8;
var chart_can_zeroLineL = 2.2;
var chart_can_v = 0.640; //640mV
var chart_can_h = chart_can_zeroLineH + chart_can_v;
var chart_can_l = chart_can_zeroLineL - chart_can_v;
var paramReadable = [];
var can_bin_flipflop = false;
var updateURL = '';
var activeTab = '';
var activeTabText = '';
var syncronizedDelay = 600;
var syncronizedDelayRatio = 15;
var syncronizedAccuracy = 0;
var roundEdges = (getCookie('graph.roundedges') == 'true') || true;
var showDataLabels = (getCookie('graph.datalabels') == 'true') || true;
var showAnimation = (getCookie('graph.animation') == 'true') || false;
var graphDivision = getCookie('graph.division') || 60;
var streamLoop = getCookie('graph.stream') || 1;
var pageLimit = getCookie('graph.pages') || 4;
var zoomFactor = 1;
var streamTimer;
var data = {};
var options = {};
var chart;
var ctxAxis;
var ctx;
var ctxFont = 12;
var ctxFontColor = 'black';
var ctxGridColor = '#BEBEBE';
var xhr;
var devmode = false;

$(document).ready(function () {

	buildMenu(function() {

		/*
	    $.ajax('serial.php?init=921600', {
			success: function(data) {
				console.log(data);
				if (data.indexOf('921600') != -1) {
					$.notify({ message: 'UART set to 921600 (1Mbps)' }, { type: 'success' });
				}
			}
		});
	    */
		
	    /*
	    $(document).click(function (e) {
	        if(xhr)
	            xhr.abort();
	    });
	    */
		buildGraphMenu();

		graphTheme();

	    graphSettings();

	    sendCommand('json', 0, function(j) {
	    	json = j;
 			if(Object.keys(json).length > 0) {
	        	initChart();
	        }else{
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'json';
		        xhr.onload = function() {
		            if (xhr.status == 200) {
		            	//json = JSON.parse(pxhr.responseText);
		                json =  xhr.response;
		            	devModeFlip();
		            }
		            initChart();
		        };
		        xhr.open('GET', 'js/parameters.json', true);
		        xhr.send();
	        }
	    });

	    paramReadable = {'speed':'Speed', 'potnom':'Throttle', 'tmpm':'Degree', 'tmphs':'Degree', 'udc':'Voltage', 'uac':'Voltage', 'idc':'DC Current'};

	    var canvas = document.getElementById('chartCanvas');
	    ctx = canvas.getContext('2d');
		
		ctxAxis = document.getElementById('chartAxis').getContext('2d');

	    if(os === 'mobile') {

	        Chart.defaults.global.animationSteps = 0;
	        canvas.height = 800;
	        ctxFont = 40;

	    }else{

	        Chart.defaults.global.animationSteps = 12;
	        canvas.height = 640;
	    }

	    //ctx.fillStyle = 'white';
	    /*
	    ctx.webkitImageSmoothingEnabled = false;
	    ctx.mozImageSmoothingEnabled = false;
	    ctx.imageSmoothingEnabled = false;
	    */

	    $('#devmode a').click(function () {
	    	devModeFlip();
	    });

		$('.knob').knob({
	        'displayPrevious': true,
	        'value': 0,
	        change: function change(value) {
	            if (value <= knobValue + 5) { //Avoid hard jumps
	                //console.log(value);
	                clearTimeout(knobTimer);
	                knobTimer = setTimeout(function () {
	                    setParameter('fslipspnt', value);
	                }, 80);
	                knobValue = value;
	            } else {
	                console.log('!' + value + '>' + knobValue);
	                $('.knob').val(knobValue).trigger('change');
	            }
	        }
	    });
	    
	    $('.knob').val(0).trigger('change');
	});
});

function graphTheme() {

	if(theme == '.slate') {
        ctxFontColor = 'white';
        ctxGridColor = '#707070';           
    }
};

function graphSettings(save) {

	if(save){
		roundEdges = $('input[name*="roundEdges"]').is(':checked');
		showDataLabels = $('input[name*="showDataLabels"]').is(':checked');
		showAnimation = $('input[name*="showAnimation"]').is(':checked');
		graphDivision = $('input[name*="graphDivision"]').val();
		lineWidth = $('input[name*="lineWidth"]').val();
		streamLoop = $('input[name*="streamLoop"]').val();
		pageLimit = $('input[name*="pageLimit"]').val();
		
		setCookie('graph.roundedges', roundEdges, 1);
		setCookie('graph.datalabels', showDataLabels, 1);
		setCookie('graph.animation', showAnimation, 1);
		setCookie('graph.division', graphDivision, 1);
		setCookie('graph.border', lineWidth, 1);
		setCookie('graph.stream', streamLoop, 1);
		setCookie('graph.pages', pageLimit, 1);
	}else{
		$('input[name*="roundEdges"]').prop('checked', roundEdges);
		$('input[name*="showDataLabels"]').prop('checked', showDataLabels);
		$('input[name*="showAnimation"]').prop('checked', showAnimation);
		$('input[name*="graphDivision"]').val(graphDivision);
		$('input[name*="lineWidth"]').val(lineWidth);
		$('input[name*="streamLoop"]').prop('checked', streamLoop);
		$('input[name*="pageLimit"]').prop('checked', pageLimit);
	}
	if(showDataLabels == true) {
		showDataLabels = 'auto';
	}
};

function activeDatasets() {

    if (activeTab === '#graph0') {
        return chart_motor_datasets;
    } else if (activeTab === '#graph1') {
        return chart_temp_datasets;
    } else if (activeTab === '#graph2') {
        return chart_voltage_datasets;
    } else if (activeTab === '#graph3') {
        return chart_amperage_datasets;
    } else if (activeTab === '#graph4') {
        return chart_frequency_datasets;
    } else if (activeTab === '#graph5') {
        return chart_can_datasets
    } else {
        return;
    }
};

function addYAxis(datasets,options) {

    for (var i = 0, l = datasets.length; i < l; i++) {
        if(i == 0) {
            newYAxis(datasets[i].id, datasets[i].yAxisID, options, 'left', true);
        }else if (i == 1) {
            newYAxis(datasets[i].id, datasets[i].yAxisID, options, 'right', true);
        }else{
        	//newYAxis(datasets[i].id, datasets[i].yAxisID, options,'left', true); //DEBUG
            newYAxis(datasets[i].id, datasets[i].yAxisID, options, 'left', false);
        }
    }
};

function newYAxis(key,id,options,side,visible) {

    var min = -1;
	var max = 1;
	var step = 0.1;

    if(key != undefined) {
        var label = paramReadable[key] || key;
        if(json[key].unit != '' && json[key].unit != 'dig') {
            label += ' (' + json[key].unit.toUpperCase() + ')';
        }
        
    	min = json[key].minimum || 0;
        max = json[key].maximum || 100;
        if (max >= 1000) {
        	step = 100;
        }else if (max >= 500) {
        	step = 50;
        }else{
        	step = 10; //Math.round(max/step);
        }
        //console.log(key + ' (min:' + min + ' max:' + max + ' step:' + step + ')');
    }

    var y_axis = {
        display: visible,
        id: id,
        position: side,
        scaleLabel: {
        	display: true,
        	fontColor: ctxFontColor,
            fontSize: ctxFont,
            labelString: label //datasets[1].label
        },
        ticks: {
        	fontColor: ctxFontColor,
            fontSize: ctxFont,
            stepSize: step,
            suggestedMin: min, //auto scale
            suggestedMax: max //auto scale
        },
        gridLines: {
            drawOnChartArea: visible,
			color: ctxGridColor,
			zeroLineColor: ctxFontColor
            //zeroLineWidth: 2
        }
    };

    options.scales.yAxes.push(y_axis);
    //console.log(options);
};

function devModeNotify() {
    $.notify({ message: 'Developer Mode Enabled' }, { type: 'success' });
    $.notify({ message: 'Graph will generate random points' }, { type: 'warning' });
};

function devModeFlip() {

    if(devmode == false) {
    	devmode = true;
    	$('#devmode a').empty().append('Developer Mode is ON');
    	devModeNotify();
    }else{
    	devmode = false;
    	$('#devmode a').empty().append('Developer Mode is OFF');
    }
};

function buildPointsMenu() {
	var menu = $('#buildPointsMenu');

	for(var key in json) {
		//console.log(key);
		var row = $('<div>', { class: 'row' });
		var col = $('<div>', { class: 'col' });
		
		var c = $('<input>', { class: 'form-control', type: 'checkbox', 'id': key });
		col.append(c);
		row.append(col);
		
		var l = $('<label>', { for: key }).append(key);
		col = $('<div>', { class: 'col' });
		col.append(l);
		row.append(col);

		var cl = $('<input>', {class: 'jscolor form-control', 'id': key+'-jscolor', 'data-jscolor': '{required:true, format:"hex"}', value: getRandomColor(), });
		col = $('<div>', { class: 'col' });
		col.append(cl);
		row.append(col);

        menu.append(row);
	}
	jscolor.install();
};

function getRandomColor() {
  var color = '';
  var letters = '0123456789ABCDEF';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

function buildGraphMenu() {
    //os = 'mobile';

    var tabs = ['Motor', 'Temperature', 'Voltage', 'Amperage', 'Frequencies', 'CAN', 'PWM'];

    var menu = $('#buildGraphMenu'); //.empty();
    var menu_buttons = $('#buildGraphButtons'); //.empty();
    var export_buttons = $('#buildGraphExport'); //.empty();

	var btn_points_i = $('<i>', { class: 'icons icon-ok' });
	var btn_points = $('<button>', { class: 'btn btn-primary mr-4' }).append(btn_points_i).append(' Select Points');
    var btn_start = $('<button>', { class: 'btn btn-success mr-4', onClick: 'startChart()' }).append('Start Graph');
    var btn_stop = $('<button>', { class: 'btn btn-danger mr-4', onClick: 'stopChart()' }).append('Stop Graph');
    var e_settings = $('<i>', { class: 'icons icon-status icon-settings p-2', 'data-toggle': 'tooltip', 'title': 'Settings' });
    var e_pdf = $('<i>', { class: 'icons icon-status icon-pdf p-2', onClick: 'exportPDF(true)', 'data-toggle': 'tooltip', 'title': 'Export PDF' });
    var e_img = $('<i>', { class: 'icons icon-status icon-png p-2', onClick: 'exportPDF()', 'data-toggle': 'tooltip', 'title': 'Export Image' });
    var e_csv = $('<i>', { class: 'icons icon-status icon-csv p-2', onClick: 'exportCSV()', 'data-toggle': 'tooltip', 'title': 'Export CSV' });

    var z = $('#buildGraphZoom').empty();
    var input_zoom = $('<input>', { id: 'zoom', type: 'text', 'data-provide': 'slider'} );
    z.append(input_zoom);

    btn_points.click(function () {
    	buildPointsMenu();

    	var graphPointsModal = document.getElementById('graphPoints');
    	new bootstrap.Modal(graphPointsModal, {}).show();
    	
    	graphPointsModal.addEventListener('hidden.bs.modal', function(event){
			var n = $('input:checked');
			console.log(n);
			if (n.length > 10){
				$.notify({ message: 'Too many points selected, 10 max' }, { type: 'warning' });
			}else{
				n.each(function(){
                    if(this.id != '') {
    					var cl = $('#' + this.id + '-jscolor');
    					console.log(this.id + ' > #' + cl.val());
    					
    					var c = cl[0].style['background-color'];
    					console.log(c);
    					
    					var arrayHas = false;
                        var datasets = activeDatasets();

    					for (var i = 0, l = datasets.length; i < l; i++) { // Check if in graph list
    						//console.log(chart_motor_datasets[i].id);
    						if(datasets[i].id == this.id){
    							arrayHas = true;
    							break;
    						}
    					}
    					if(!arrayHas) { // Do not double graph
    						var d = fill.call([],datasets[0].data.length,0); //new Array(datasets[0].data.length).fill(0);
    						var dataset = {
    							type: 'line',
    							id: this.id,
    							label: this.id,
    							backgroundColor: c.replace(')',', 0.2)'),
    							borderColor: c.replace(')',', 1)'),
    							borderWidth: lineWidth,
    							//hoverBackgroundColor: 'rgba(255,99,132,0.4)',
    							//hoverBorderColor: 'rgba(255,99,132,1)',
    							data: d,
                                yAxisID: 'y-axis-' + (datasets.length-1)
    						};
    						//console.log(dataset);
                            datasets.push(dataset);
                            newYAxis(this.id,dataset.yAxisID,chart.options,'left', true);
                            //newYAxis(this.id,dataset.yAxisID,chart.options,'left', false);

    						chart.update();
    					}
                    }
				});
			}
		});
    });

    e_settings.click(function () {
    	var graphSettingsModal = new bootstrap.Modal(document.getElementById('graphSettings'), {});
        graphSettingsModal.show();
    });

    input_zoom.ionRangeSlider({
        skin: 'big',
        grid: true,
        step: 1,
        min: 100,
        max: 200,
        from: 100,
        postfix: ' %',
        onFinish: function (e) {

            zoomFactor = e.from/100;

            console.log('Before ' + chart.width + ':' + chart.height);
            ctx.save();
            ctx.scale(zoomFactor,zoomFactor);
            //ctx.translate(0,0);
            chart.update();
            ctx.restore();
            console.log('After ' + (chart.width * zoomFactor) + ':' + (chart.height * zoomFactor));
            //chart.chart.canvas

            var newwidth = $('.chartAreaWrapper').width() + chart.width * zoomFactor;
            //var newheight = $('.chartAreaWrapper').height() + chart.heighth;
            //$('.chartAreaWrapper2').width(newwidth);
            //$('.chartAreaWrapper2').height(newheight);

            //ctxAxis.canvas.height = ctxAxis.canvas.height * zoomFactor;
            //ctxAxis.canvas.width = ctxAxis.canvas.height * zoomFactor;
            console.log(zoomFactor);
        }
    });

    var s = $('#buildGraphSlider').empty();

    var input_speed = $('<input>', { id: 'speed', type: 'text', 'data-provide': 'slider'} );
    s.append(input_speed);

    function speed_prettify (n) {
        if (n == 100) {
            return 'Slow';
        }else if (n == 1) {
            return 'Fast';
        }
        return n;
    };
    
    input_speed.ionRangeSlider({
        skin: 'big',
        grid: true,
        step: 1,
        min: 1,
        max: 100,
        from: (syncronizedDelay / syncronizedDelayRatio),
        prettify: speed_prettify,
        //postfix: ' %',
        onFinish: function (e) {
            //console.log(e.from);
            var sync_delay = e.from * syncronizedDelayRatio;
            updateURL = updateURL.replace('&delay=' + syncronizedDelay, '&delay=' + sync_delay);

            syncronizedDelay = sync_delay;
            console.log(syncronizedDelay);

            //var t = Math.round(syncronizedDelay / 1000 * 60);
            //console.log(t);

            //chart.options.animation.duration = syncronizedDelay;
            //chart.config.data.labels = initTimeAxis(t);
            //chart.update();
            //startChart();
        }
    });

    activeTab = '#graph0';
    activeTabText = tabs[0];
	
	menu_buttons.append(btn_points);
    menu_buttons.append(btn_start);
    menu_buttons.append(btn_stop);

    export_buttons.append(e_settings);
    export_buttons.append(e_img);

    if (os === 'mobile') {

        graphDivision = 40;

        var nav = $('<nav>', { class: 'navbar navbar-toggleable-md navbar-light bg-faded' });
        var wrap = $('<div>', { class: 'container' });
        
        var button = $('<button>', { class: 'navbar-toggler navbar-toggler-right', type: 'button', 'data-toggle': 'collapse', 'data-target': '#navbarsGraph', 'aria-controls': 'navbarsGraph', 'aria-expanded': false, 'aria-label': 'Navigation' });
        var span = $('<span>', { class: 'navbar-toggler-icon display-3' });
        button.append(span);
		wrap.append(button);

        var div = $('<div>', { class: 'collapse navbar-collapse', id: 'navbarsGraph' });
        for (var i = 0; i < tabs.length; i++)
        {
            var ul = $('<ul>', { class: 'navbar-nav' });
            var li = $('<li>', { class: 'nav-item' });
            var a = $('<a>', { class: 'nav-link display-4', id: i});

            a.append($('<b>').append(tabs[i]));
            li.append(a);
            ul.append(li);
            div.append(ul);
        }

        wrap.append(div);
        nav.append(wrap);
        menu.append(nav);

        $('.nav-item a').click(function () {

            activeTab = '#graph' + this.id;
            activeTabText = this.text;
            stopChart();
            initChart();
        });

    }else{
    	if(os != 'esp8266') {
    		getScript('js/jspdf.js', function () {
    			export_buttons.append(e_pdf);
    		});
    	}
        export_buttons.append(e_csv);

        var tablist = $('<div>', { class: 'nav nav-tabs', role: 'tablist'});
        var tabcontent = $('<div>', { class: 'tab-content' });

        for (var i = 0; i < tabs.length; i++)
        {
            var a = $('<a>', { class: 'nav-link', id: 'graph' + i + '-tab', href: '#graph' + i, 'data-toggle': 'tab', role: 'tab' }).append(tabs[i]);
            if (i ===0) {
                a.addClass('active');
            }
            tablist.append(a);

            var tabpanel = $('<div>', { class: 'tab-pane', id: 'graph' + i, role: 'tabpanel' });
            if (i ===0) {
                tabpanel.addClass('show active');
            }
            tabcontent.append(tabpanel);
        }

        menu.append(tablist);
        menu.append(tabcontent);

        $('.nav-tabs a').click(function () {

            activeTab = this.hash;
            activeTabText = this.text;
            stopChart();
            initChart();
        });
    }

    pageLimit = graphDivision * pageLimit;

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
	var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
	  return new bootstrap.Tooltip(tooltipTriggerEl)
	});
};

function exportCSV() {

    var datasets = activeDatasets();
    var points = idDatasets(datasets);
    var value = csvDatasets(datasets);

    //console.log(value);

    let csvContent = 'data:text/csv;charset=utf-8,';

    let row = value[0].length;
    let col = points.length;

    for (var r = 0; r < row; r++) {
        if(r == 0) { //first row
            csvContent += points.join(',') + '\r\n';
        }
        for (var c = 0; c < col; c++) {
            //TODO: get timestamp
            csvContent += value[c][r] + ',';
        }
        csvContent += '\r\n';
    }

    //var encodedUri = encodeURI(csvContent);
    //window.open(encodedUri);

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'export.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
};

function exportPDF(pdf) {

    //ctx.save();
    //ctx.scale(4,4);
    //var render = ctx.canvas.toDataURL('image/jpeg',1.0);
    //ctx.restore();

    var render = ctx.canvas.toDataURL('image/png', 1.0);
    var d = new Date();
    //d.setHours(10, 30, 53, 400);

    if (pdf) {
    	window.jsPDF = window.jspdf.jsPDF;
        //console.log($('.tab-pane.active').find('p:hidden').text());
        var doc = new jsPDF('l', 'mm', [279, 215]);
        doc.setProperties({
            title: '',
            subject: '',
            author: '',
            creator: '© 2016'
        });
        doc.setDisplayMode(1);
        doc.setFontSize(28);
        doc.text(110, 20, activeTabText);
        doc.addImage(render, 'JPEG', 18, 40, 250, 120, 'graph', 'none');
        doc.save('graph ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + (d.getHours() % 12 || 12) + '-' + d.getMinutes() + ' ' + (d.getHours() >= 12 ? 'pm' : 'am') + '.pdf');

        /*
        var margins = {
            top: 32,
            //bottom: 20,
            left: 20,
            //right: 15,
            //width: 700,
            //height: 450
        };
        var options = {
            format: 'JPEG',
            //pagesplit: true,
            'background': '#000',
            //'width': margins.width,
            //'height': margins.height,
            //'elementHandlers': specialElementHandlers
        };
        var date = new Date();
        //var d = date.Now().format('MM-DD-YYYY h:mma');
        //console.log(d);
         document.getElementById('canvas').style.backgroundColor = 'rgba(255, 255, 255, 1)';
        //doc.addHTML($('#render'), 0.5, 2, options,function() {
        doc.addHTML(ctx.canvas, margins.left, margins.top, options,function() {
            document.getElementById('canvas').style.backgroundColor = 'rgba(255, 255, 255, 0)';
            doc.save('graph.pdf');
        }, margins);
        */
    } else {

        var data = atob(render.substring('data:image/png;base64,'.length)),
            asArray = new Uint8Array(data.length);

        for (var i = 0, len = data.length; i < len; ++i) {
            asArray[i] = data.charCodeAt(i);
        }
        var blob = new Blob([asArray.buffer], { type: 'image/png' });

        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'graph ' + d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear() + ' ' + (d.getHours() % 12 || 12) + '-' + d.getMinutes() + ' ' + (d.getHours() >= 12 ? 'pm' : 'am') + '.png';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};

function initChart() {

    data = {};
    options = {};

    var duration = 0;

    if(os !== 'mobile')
        duration = syncronizedDelay/2;

    if (activeTab === '#graph0') {
        initMotorChart(duration);
    } else if (activeTab === '#graph1') {
        initTemperatureChart(duration);
    } else if (activeTab === '#graph2') {
        initVoltageChart(duration);
    } else if (activeTab === '#graph3') {
        initAmperageChart(duration);
    } else if (activeTab === '#graph4') {
        initFrequenciesChart(duration);
    } else if (activeTab === '#graph5') {
        initCANChart(duration);
    } else if (activeTab === '#graph6') {
        initPWMChart(duration);
    }
    if (chart) chart.destroy();

    if(roundEdges == false) {
		Chart.defaults.global.elements.line.tension = 0;
	}
	if(showAnimation == true) {
		Chart.defaults.global.animation.duration = 800;
	}
   	
    chart = new Chart(ctx, {
        type: 'line',
        //type: 'bar',
        data: data,
        options: options
    });
    //chart.update();
    
	$('#buildPointsMenu').empty();

    $('.chartAreaWrapper2').width($('.chartAreaWrapper').width());
};

function startChart() {

    console.log(activeTab);

    syncronizedAccuracy = 0;

    //clearTimeout(statusRefreshTimer);
    stopChart();

    //$.ajax('graph.php?stream=start');

    var mode = getJSONFloatValue('opmode');
    if (mode === 2 || mode === 5) {
        $('#potentiometer').removeClass('d-none'); //.show();
    }

	var value = [];
	var autosize = false;
	var accuracy = 0;

    if (activeTab === '#graph0') {
        //accuracy = 0.8;
		autosize = true;
		value = idDatasets(chart_motor_datasets);
    } else if (activeTab === '#graph1') {
        value = idDatasets(chart_temp_datasets);
    } else if (activeTab === '#graph2') {
		autosize = true;
		value = idDatasets(chart_voltage_datasets);
    } else if (activeTab === '#graph3') {
        value = idDatasets(chart_amperage_datasets);
    } else if (activeTab === '#graph4') {
		value = idDatasets(chart_frequency_datasets);
    } else if (activeTab === '#graph5') {
        value = idDatasets(chart_can_datasets);
    //} else if (activeTab === '#graph6') {
		/*
        if(getJSONFloatValue('opmode') > 0) {
            updateChart(['pwmfrq', 'deadtime']);
        }else{
            $.notify({ message: 'Inverter is OFF - PWM cannot be generated' }, { type: 'danger' });
        }
		*/
	}

	updateURL = 'serial.php?stream=' + value.toString() + '&loop=1&delay=' + syncronizedDelay;
	if(devmode == true) {
		devModeNotify();
		updateURL = 'graph.php?debug=1&stream=' + value.toString() + '&loop=1&delay=' + syncronizedDelay;
	}

	updateChart(value,autosize,accuracy);
};

function idDatasets(dataset) {
	ids = [];
	for (var i = 0, l = dataset.length; i < l; i++) {
		if(dataset[i].id)
			ids.push(dataset[i].id);
	}
	console.log(ids);
	return ids;
};

function csvDatasets(dataset) {
    row = [];
    for (var i = 0, l = dataset.length; i < l; i++) {
        row.push(dataset[i].data);
    }
    console.log(row);
    return row;
};

function stopChart() {

    //clearTimeout(syncronizedTimer);
    //$.ajax('graph.php?stream=stop');

    if (xhr) xhr.abort();

    clearTimeout(streamTimer);

    $('#potentiometer').addClass('d-none'); //.hide();
};

function initTimeAxis(seconds, labels, stamp) {

    var xaxis = [];

    if(labels)
        xaxis = labels;

    for (var i = 0; i < seconds; i++) {
    	if (stamp != undefined) {
    		if (stamp == 0) {
	    		xaxis.push(i);
	    	}else{
	    		if (i % 10 == 0) {
		    		if (stamp == 1) {
		    			xaxis.push(i);
		    		}else{
		    			xaxis.push(i + ' ' + stamp);
		    		}
	    		}
    		}
    	}else{
    		xaxis.push('');
    	}
        /*
        if (i / 10 % 1 != 0) {
            xaxis.push('');
        } else {
            xaxis.push(i);
        }
        */
        //xaxis.push(i.toString());
    }
    return xaxis;
};

function sineWave(phase, amplitude, start, step) {

    var array = [];

    for (var j = start; j <= phase * Math.PI; j += step) {
        array.push(Math.sin(j) * amplitude); //[j, Math.sin(j)]
    }

    return array;
};

function sinePWM(phase, start, waveGraphRatio) {

    var step = waveGraphRatio / 0.07;
    var array = [];

    for (var j = start; j <= phase * Math.PI; j += step) {
        
        var upper = 10;
        var lower = 10;
        var sine = Math.sin(j);
        var abs = Math.abs(sine)

        for (var s = 0; s < 1.1; s+=0.1) { //sample the wave by 10

            //console.log(abs + ':' + s);

            if (sine < 0) //fall
            {
                lower = 10;
                upper-=s+0.4;
            }
            else if (sine > 0) //rise
            {
                upper = 10;
                lower-=s+0.4;
            }
			
            if (s >= abs)
                break;
        }
		
		if(sine.toFixed(1) == 0.0) //deadtime
		{
			for (var i = 0; i < (upper + lower); i++) {
				array.push(0);
			}
		}
		else if (sine < 0 ) //fall
		{
			for (var i = 0; i < upper; i++) {
				array.push(0);
			}
			for (var i = 0; i < lower; i++) {
				array.push(-1);
			}
		}
		else if (sine > 0) //rise
		{
			for (var i = 0; i < upper; i++) {
				array.push(1);
			}
			for (var i = 0; i < lower; i++) {
				array.push(0);
			}
		}
    }

    return array;
};

//Pulse Width Modulation
function initPWMChart(duration) {

    data = {
        labels: initTimeAxis(750,[],0),
        //backgroundColor: '#ffffff',
        datasets: chart_pwm_datasets
    };

    var waveGraphRatio = 0.01;

    data.datasets[0].data = sinePWM(2,-2.25,waveGraphRatio); //red
    data.datasets[1].data = sinePWM(3.5,2.25,waveGraphRatio); //green
    data.datasets[2].data = sinePWM(2.5,0,waveGraphRatio); //blue

    data.datasets[3].data = sineWave(2,1,-2.25,waveGraphRatio); //red
    data.datasets[4].data = sineWave(3.5,1,2.25,waveGraphRatio); //green
    data.datasets[5].data = sineWave(2.5,1,0,waveGraphRatio); //blue

    options = {
        //scaleUse2Y: true,
        legend: {
            display: true,
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont,
            }
        },
        elements: {
            point: {
                radius: 0
            },
            line: {
                tension: 0
            }
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
                position: 'bottom',
                //stacked: true,
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (ms)'
                },
                /*
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90
                }
                */
            }],
            yAxes: [{
                position: 'left',
                //stacked: true,
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Pulse'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    //beginAtZero:true,
                    //reverse: false,
                    stepSize: 0.5,
                    suggestedMin: -1.5, //important
                    suggestedMax: 1.5 //important
                },
                gridLines: {
				  color: ctxGridColor
				}
            }]
        },
        annotation: {
    		drawTime: 'afterDraw',
			annotations: [{
                type: 'line',
                id: 'a-line-0',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 160,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: '90°',
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-1',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 320,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: '180°',
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-2',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 480,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: '270°',
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-3',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 640,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: '360°',
                  enabled: true,
                  position: 'top'
                }
            }]
		},
        plugins: {
            datalabels: {
        		display: false
            }
        }
    };
};

var flipbits = function flipbits(str) {
  return str.split('').map(function (b) {
    return (1 - b).toString();
  }).join('');
};

function genCANpulse(value,speed,gain,length)
{
	var byte = '';
	var data = [];
	gain = (gain / 1000);

	if(length == undefined) {	
		byte = (Math.abs(value)).toString(2);
	}else{
		for (var i = 0; i < Math.abs(length); i++)
    	{
    		if(length > 0) {
    			byte += '1';
    		}else{
    			byte += '0';
    		}
    	}
	}

	//console.log(byte);
	byte = flipbits(byte);
	console.log(':' + byte);
	
	for (var i = 1; i <= byte.length; i++)
    {
    	var bit = byte.substring(i,i-1);
    	var b = 0;
   
    	if(value > 0) {
    		b = bit * (chart_can_v + gain);
			b = chart_can_zeroLineH + b; //2.5001 + b; //H
		}else{
			b = bit * (chart_can_v - gain);
			b = chart_can_zeroLineL - b; //2.4999 - b; //L
		}
    	data.push(b);
    	data.push(b);
    	/*
    	if(bit != bit_n){
    		data.push(b);
    	}
    	*/
    	//console.log('[' + i + '] ' + bit + '>' + bit_n + '=' + b);
    }
	//console.log(data);
	return data;
}

function addCANdataset(id,key,gain,value) {

	/*
	http://blog.qartis.com/can-bus
	*/
	//var can_frame_start = []; //Start of Frame (1)
	var can_frame_identifier = []; //Arbitration Field
	var can_frame_control = []; //Control (3) (RTR bit, IDE bit, and r0 reserved bit)
	var can_frame_data = []; //Data
	var can_frame_crc = []; //CRC - all bits from the Start of Frame until before the CRC sequence
	//var can_frame_ack = []; //ACK field (2)
	var can_frame_eof = []; //End of Frame (7)

	var color_h = ['CCE5FF', '99CCFF', '66B2FF', '3399FF','0080FF','0066CC'];
	var color_l = ['FFCCCC', 'FF9999', 'FF6666', 'FF3333','FF0000','CC0000'];
	var color_d = ['2ECC71'];
	var color = [];

	color = hexToRgb(color_h[2]);
	var color_h_rgb = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
	color = hexToRgb(color_l[2]);
	var color_l_rgb = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
	color = hexToRgb(color_d[0]);
	var color_d_rgb = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
	//console.log(color_h_rgb + ' ' + color_l_rgb);

    var crc = 0;
	var bits = ('0' + id + '000' + value).split(/(?=[\s\S])/u);
	for (var b = 0; b < bits.length; b++) {
		crc = can_crc_next(crc, bits[b]);
	}
	console.log(crc);
	/*
	var bits = v.toString(2).split(/(?=[\s\S])/u);
	var crc = CRC15(bits); //.reverse();
	var crc_int = parseInt(crc.join(''),2);
	console.log('CRC:' + crc.join('') + '('+ crc_int + ')');
	*/
	/*
	bits = bits.concat(crc);
	console.log(bits.toString());
	console.log(BitStuff(bits).toString());
	*/
	can_frame_identifier = [chart_can_zeroLineH + chart_can_v]; //Start of Frame
	can_frame_identifier = can_frame_identifier.concat(genCANpulse(id,1,gain));
	can_frame_control = genCANpulse(1,1,gain,-3);
	can_frame_data = genCANpulse(value,1,gain);
	can_frame_crc = genCANpulse(crc,1,gain);
	can_frame_eof = genCANpulse(255,1,gain);

    var can_h = {
        type: 'line',
        label: key + ' (CAN H)',
        gain: gain,
        fill: false,
		backgroundColor: color_h_rgb.replace(')',', 0.4)'),
		borderColor: color_h_rgb.replace(')',', 1)'),
        borderWidth: 2,
        segment: [],
        data: can_frame_identifier.concat(can_frame_control).concat(can_frame_data).concat(can_frame_crc).concat(can_frame_eof),
        datalabels: {
        	align: 'top',
			//anchor: 'end',
            //display: 'auto',
        }
    };

    var s = 0;
	s += can_frame_identifier.length;
	can_h.segment.push(s);
	s += can_frame_control.length;
	can_h.segment.push(s);
	s += can_frame_data.length;
	can_h.segment.push(s);
	s += can_frame_crc.length;
	can_h.segment.push(s);
	s += can_frame_eof.length;
	can_h.segment.push(s);

	can_frame_identifier = [chart_can_zeroLineL - chart_can_v]; //Start of Frame
    can_frame_identifier = can_frame_identifier.concat(genCANpulse(0-id,1,gain));
    can_frame_control = genCANpulse(-1,1,gain,-3);
	can_frame_data = genCANpulse((0-value),1,gain);
	can_frame_crc = genCANpulse(0-crc,1,gain);
	can_frame_eof = genCANpulse(-255,1,gain);
    var can_l = {
        type: 'line',
        label: key + ' (CAN L)',
        gain: gain,
        fill: false,
		backgroundColor: color_l_rgb.replace(')',', 0.4)'),
		borderColor: color_l_rgb.replace(')',', 1)'),
        borderWidth: 2,
        data: can_frame_identifier.concat(can_frame_control).concat(can_frame_data).concat(can_frame_crc).concat(can_frame_eof),
        datalabels: {
            align: 'bottom',
            //display: 'auto',
        }
    };

    var can_d = {
        type: 'line',
        label: key + ' (Differential)',
        gain: gain,
        fill: false,
		backgroundColor: color_d_rgb.replace(')',', 0.4)'),
		borderColor: color_d_rgb.replace(')',', 1)'),
        borderWidth: 2,
        data: [],
        datalabels: {
            align: 'bottom',
            //display: 'auto',
        }
    };

    for (var i = 0; i < can_h.data.length; i++) {
    	var diff = (can_l.data[i] - chart_can_l) - (can_h.data[i] - chart_can_h);
		can_d.data.push(diff);
	}

    chart_can_datasets.push(can_h);
    chart_can_datasets.push(can_l);
    chart_can_datasets.push(can_d);

    return crc;
};

function initCANChart(duration) {

	chart_can_datasets = [];

	var can_id = [];
	var can_gain = [];
    var can_value = [];
    var can_crc = [];

    $.notify({ message: 'CAN graph is "simulated" based on <a href="https://elearning.vector.com/mod/page/view.php?id=341" target=_blank>ISO 11898-2</a>' }, { type: 'success' });

    for(var key in json)
    {
        if(json[key].canid != '')
        {
            if(json[key].isrx == false) //TX
            {
            	var id = json[key].canid;
            	var g = json[key].cangain * 10;
            	var v = json[key].value;

            	can_id.push(id);
            	can_gain.push(g);
            	can_value.push(v);

            	var crc = addCANdataset(id,key,g,v);
				can_crc.push(crc);

            	break; //TODO: graph multiple CAN signals
            }
        }
    }

    if(chart_can_datasets.length == 0) {
        $.notify({ message: '<a href="can.php">CAN Mapping</a> (TX) signal not configured.' }, { type: 'warning' });
        if(devmode == true) {
        	can_id.push(100);
        	can_gain.push(10);
            can_value.push(200);
            
        	var crc = addCANdataset(100,'test',10,200);
        	can_crc.push(crc);
        }
    }

    data = {
        labels: initTimeAxis(graphDivision*1.5,[],0),
        datasets: chart_can_datasets
    };

    options = {
        legend: {
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont
                /*
                filter: function(item, chart) {
		          return !item.text.includes('CAN L');
		        }
		        */
            }
        },
        elements: {
            point: {
                radius: 0
            },
            line: {
      			tension: 0
        	}
        },
        tooltips: {
            enabled: false,
            callbacks: {
                label: function(tooltipItem, data) {
                    var value = tooltipItem.yLabel;
                    if(value == chart_can_zeroLineH) {
                		return '0';
                	//}else if(value == 2.4999 || value == 2.5001) {
                	//	return '0';
                	}else{
                		return '1';
                	}
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
            	display: false,
                id: 'x-axis-0',
                position: 'bottom',
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (μs)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90,
                    stepSize: 50
                },
                gridLines: {
				  	color: ctxGridColor
				}
            }],
            yAxes: [{
     			id: 'y-axis-0',
                position: 'left',
                scaleLabel: {
                	display: true,
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Volts'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    stepSize: 0.1,
                    suggestedMin: chart_can_zeroLineL - (chart_can_v + can_gain.max()*0.001 + 0.5),
                    suggestedMax: chart_can_zeroLineH + (chart_can_v + can_gain.max()*0.001 + 0.5)
                },
                gridLines: {
                    drawOnChartArea: true,
                    color: ctxGridColor,
                    zeroLineColor: ctxFontColor,
                    //zeroLineWidth: 2
                }
            } /*,{
                id: 'y-axis-1',
                position: 'right',
                scaleLabel: {
                	display: true,
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Gain (mV)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    stepSize: 10,
                    suggestedMin: 0 - (can_gain.max() * 100 + 200),
                    suggestedMax: can_gain.max() * 100 + 200
                },
                gridLines: {
                    drawOnChartArea: false,
                    color: ctxGridColor,
                    zeroLineColor: ctxFontColor,
                    //zeroLineWidth: 2
                }
            }*/]
        },
        annotation: {
    		drawTime: 'afterDraw',
			annotations: [/*{
				drawTime: 'beforeDatasetsDraw',
				type: 'box',
				id: 'a-box-0',
				xScaleID: 'x-axis-0',
				yScaleID: 'y-axis-0',
				xMin: 1,
				xMax: 16,
				yMin: 2.38,
				yMax: 2.62,
				backgroundColor: 'rgba(192,192,192,0.5)',
				borderColor: 'rgb(190,190,190)',
				borderWidth: 1,
				/
				label: {
					position: 'bottom',
					//yAdjust: -20,
					backgroundColor: 'red',
					content: 'label',
					enabled: true
				}
				/
			},*/{
                type: 'line',
                id: 'a-line-0',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: 1,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: 'Start', //1
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-1',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: chart_can_datasets[0].segment[0],
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: 'ID: ' + can_id[0], //8
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-2',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: chart_can_datasets[0].segment[1],
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: 'Control', //3
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-3',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: chart_can_datasets[0].segment[2],
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: 'Data: ' + can_value[0], //8+
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-4',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: chart_can_datasets[0].segment[3],
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: 'CRC: ' + can_crc[0], //15
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-5',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: chart_can_datasets[0].segment[4]-1,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: 'End of Frame', //2+7
                  enabled: true,
                  position: 'top'
                }
            },{
                type: 'line',
                id: 'a-line-6',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 2.5,
                borderColor: ctxFontColor,
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                	enabled: false
                }
            }]
		},
        plugins: {
            datalabels: {
            	padding: 2,
				align: function(context) {
					return context.active ? 'end' : 'center';
				},
				color: ctxFontColor,
                font: ctxFont,
            	backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				},
            	display: function(context) {
            		var display = false;
            		var point = context.dataset.data[context.dataIndex];
            		
            		if(context.dataset.label.indexOf('Differential') == -1) {
            			if(can_bin_flipflop == true){
            				can_bin_flipflop = false;
            			}else{
            				can_bin_flipflop = true;
            				display = true;
            			}
            		}
					return display;
		        },
                formatter: function(value, context) {
                	if(value == chart_can_zeroLineH || value == chart_can_zeroLineL || value == (chart_can_zeroLineL + chart_can_zeroLineH)) {
                		return 1;
                	//}else if(value == 2.4999 || value == 2.5001) {
                	//	return 0;
                	}else{
                		return 0;
                	}
                    //return context.chart.data.labels[context.dataIndex];
                }
            }
        }
    };
};

function initFrequenciesChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_frequency_datasets
    };

    var fweak = json.fweak.value || 0;
    var fmax = json.fmax.value || 0;
    var step = fmax / 10;

    for (var i = 0; i < 62; i++) {
        data.datasets[0].data.push(fweak);
    }

    data.datasets[2].data = sineWave(4,fmax,0,0.1);
    //data.datasets[3].data = sineWave(4,80,0,0.1);

    options = {
        //scaleUse2Y: true,
        legend: {
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                position: 'bottom',
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90,
                    stepSize: 50
                },
                gridLines: {
					color: ctxGridColor
				}
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
            	color: ctxFontColor,
                font: ctxFont,
	            align: 'top',
	            display: showDataLabels,
	            backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				}
            }
        }
    };
    addYAxis(chart_frequency_datasets,options);
};

function initAmperageChart(duration) {

    //RMS = LOCKED-ROTOR CURRENT
    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_amperage_datasets
    };

    var ocurlim = json.ocurlim.value;
    if (ocurlim === 0) ocurlim = 100;

    var step = ocurlim / 10;

    options = {
        legend: {
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        /*
        tooltipEvents: [],
        showTooltips: true,
        onAnimationComplete: function() {
            this.showTooltip(this.segments, true);
        },
        tooltipTemplate: '<%= label %> - <%= value %>',
        */
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                position: 'bottom',
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90,
                    stepSize: 50
                },
                gridLines: {
					color: ctxGridColor
				}
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
            	color: ctxFontColor,
                font: ctxFont,
	            align: 'top',
	            display: showDataLabels,
	            backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				}
            }
        }
    };
    addYAxis(chart_amperage_datasets,options);
};

function initMotorChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_motor_datasets
    };

    options = {
        legend: {
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                position: 'bottom',
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    maxRotation: 90,
                    reverse: false
                },
                gridLines: {
				  color: ctxGridColor
				}
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
            	color: ctxFontColor,
                font: ctxFont,
	            align: 'top',
	            display: showDataLabels,
	            backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				}
            }
        }
    };

    addYAxis(chart_motor_datasets,options);
};

function initTemperatureChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_temp_datasets
    };

    options = {
        legend: {
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                position: 'bottom',
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    maxRotation: 90,
                    reverse: false
                },
                gridLines: {
					color: ctxGridColor
				}
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
            	color: ctxFontColor,
                font: ctxFont,
	            align: 'top',
	            display: showDataLabels,
	            backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				}
            }
        }
    };

    addYAxis(chart_temp_datasets,options);
};

function initVoltageChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_voltage_datasets
    };

    var udclim = json.udclim.value;
    var step = 50;

    if (udclim === 0) udclim = 300;

    if (udclim < 100) step = udclim / 10;

    options = {
        legend: {
            labels: {
            	fontColor: ctxFontColor,
                fontSize: ctxFont
            }
        },
        elements: {
            point: {
                radius: 0
            }
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                position: 'bottom',
                scaleLabel: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                	fontColor: ctxFontColor,
                    fontSize: ctxFont,
                    maxRotation: 90,
                    reverse: false
                },
                gridLines: {
				  color: ctxGridColor
				}
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
            	color: ctxFontColor,
                font: ctxFont,
	            align: 'top',
	            display: showDataLabels,
	            backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				}
            }
        }
    };

    addYAxis(chart_voltage_datasets,options);
};

function updateChart(value, autosize, accuracy) {

    //clearTimeout(streamTimer);
    
    //Ajax Streaming
    //============================================================
    var last_response_len = false;
    var last = (value.length - 1);
    var i = 0;

	xhr = $.ajax(updateURL, {
        type: 'GET',
        async: true,
        timeout: 2000,
        //crossDomain: true,
        xhrFields: {
            onprogress: function onprogress(e)
            {
                var this_response,
                response = e.currentTarget.response;

                if (last_response_len === false) {
                    this_response = response;
                    last_response_len = response.length;
                } else {
                    this_response = response.substring(last_response_len);
                    last_response_len = response.length;
                }
                //console.log(this_response);
                var split = this_response.trim().split('\n');
                //console.log(split);
				
                for (var d = 0; d < split.length; d++) //stream is unpredictable - can get all-at-once or partial array
                {
					var v = value[i];
                    var point = parseFloat(split[d]);

                    //console.log(v + ':' + point);
					//console.log(i + '-' + last);
					
                    if (v === 'pwmfrq')
                    {
                        //var deadtime = parseFloat(split[d+1]);
                        var waveGraphRatio = 0.01;

                        data.datasets[0].data = sinePWM(4,-2.25,waveGraphRatio); //red
                        //data.datasets[1].data = sinePWM(4,2.0,waveGraphRatio); //green
                        //data.datasets[2].data = sinePWM(4,0,waveGraphRatio); //blue

                        data.datasets[3].data = sineWave(4,1,-2.25,waveGraphRatio); //red
                        //data.datasets[4].data = sineWave(4,1,2.0,waveGraphRatio); //green
                        //data.datasets[5].data = sineWave(4,1,0,waveGraphRatio); //blue
                        
                        continue; //break;
                    }else if (v === 'ampnom') {
                        var max = Math.max.apply(null, data.datasets[i].data);
                        data.datasets[i + 1].data = sineWave(2,(max * point / 100),0,0.1);
                    } else {

                        if (accuracy) {
                            var p = data.datasets[i].data[l - 1];
                            var c = p * accuracy;
                            console.log('Last point:' + p + '>' +c);

                            if (syncronizedAccuracy < 3 && point < c) {
								console.log('Correct: ' + v + ' ' + point + ' > ' + p);
                                point = p;
                                //if (p != c)
									syncronizedAccuracy++;
                            } else {
                                syncronizedAccuracy = 0;
                            }
                        }

                        data.datasets[i].data.push(point);
                        //console.log(data.datasets[i].data);
                    }
                    //To keep track of segmented stream
                    if (i == last) {
                        i = 0;
                    } else {
                        i++;
                    }
                }

                l = data.datasets[last].data.length;
                //Scroll
                if (l == data.labels.length) {
                    initTimeAxis(graphDivision, data.labels);
                    var newwidth = $('.chartAreaWrapper').width() + chart.width;
                    $('.chartAreaWrapper2').width(newwidth);
                    $('.chartAreaWrapper').animate({scrollLeft:newwidth}, 1000);
                    
                    var copyWidth = chart.scales['y-axis-0'].width - 10;
                    var copyHeight = chart.scales['y-axis-0'].height + chart.scales['y-axis-0'].top + 10;
                    ctxAxis.canvas.height = copyHeight;
                    ctxAxis.canvas.width = copyWidth;
                    ctxAxis.drawImage(chart.chart.canvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);

                }else if (l > pageLimit) {
                    //console.log('Max scroll pages ...reset');
                    for (var x = 0; x <= last; x++) {
                        data.datasets[x].data = []; //empty
                    }
                    data.labels = initTimeAxis(graphDivision);
                    $('.chartAreaWrapper2').width($('.chartAreaWrapper').width());
                    //$('.chartAreaWrapper2').height($('.chartAreaWrapper').height());
                }
                
                //Time-stamp
                if (l / 10 % 1 == 0)
                {
                    var d = new Date();
                    var hr = d.getHours();
                    //console.log(l);
                    data.labels[l] = hr + ':' + d.getMinutes() + ':' + d.getSeconds();
                }
                
                if (autosize) { //&& l == 1) //do it at start

                    var largest = Math.max.apply(null, data.datasets[0].data);
                    //console.log('yAxes Sale:' + largest);

                    var step = 50;

                    if (largest > 3000) {
                        step = 1000;
                    } else if (largest > 2000) {
                        step = 500;
                    } else if (largest > 1000) {
                        step = 500;
                    } else if (largest > 500) {
                        step = 100;
                    }

                    chart.options.scales.yAxes[0].ticks.suggestedMax = largest + step;
                    chart.options.scales.yAxes[0].ticks.stepSize = step;
                }
                
                chart.update();
            }
        }
    }).done(function()
    {
        //streamTimer = setTimeout(function() {
            updateChart(value, autosize, accuracy);
        //}, syncronizedDelay);
    }).fail(function(jqXHR, textStatus) {
        if(textStatus === 'timeout')
        {
            streamTimer = setTimeout(function() {
                updateChart(value, autosize, accuracy);
            }, 1000);
            //this.timeoutCount++;
        }
    })
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function can_crc_next(crc, data)
{
    var i, j;
 
    crc ^= data << 7;
 
    for (i = 0; i < 8; i++) {
        crc <<= 1;
        if (crc & 0x8000) {
            crc ^= 0xc599;
        }
    }
 
    return crc & 0x7fff;
};

/*
https://stackoverflow.com/questions/30922637/calculate-crc-15-for-can-bus
0000011110000 becomes 0000011111000001
*/
/*
function BitStuff(bits)
{
    var sb = null;
    var last = ' ';
    var count = 0;

    for (var i = 0; i < bits.length; i++)
    {
        var ch = bits[i];

        if (ch == last)
        {
            count++;

            if (count == 5)
            {
                if (sb == null)
                {
                    // The maximum length is equal to the length of bits
                    // plus 1 for length 5, 2 for length 9, 3 for length 13...
                    // This because the maximum expanion is for
                    // 00000111100001111... or 11111000011110000...
                    sb = [bits.length + (bits.length - 1) / 4];
                    for (var x = 0; x <= i; x++)
                    	sb += bits[x];
                }

                sb += ch;
                last = ch == '0' ? '1' : '0';
                sb += last;
                count = 1;

                continue;
            }
        }
        else
        {
            last = ch;
            count = 1;
        }

        if (sb != null)
        {
            sb += ch;
        }
    }
    return sb != null ? sb.ToString() : bits;
}

// http://www.ghsi.de/pages/subpages/Online%20CRC%20Calculation/index.php?Polynom=1100010110011001&Message=2AA80
function CRC15(bits)
{
    var res = [15]; //CRC Result
    var crc = [15];

    for (var i = 0; i < bits.length; i++)
    {
        var doInvert = (bits[i] == '1') ^ crc[14];         // XOR required?

        crc[14] = crc[13] ^ doInvert;
        crc[13] = crc[12];
        crc[12] = crc[11];
        crc[11] = crc[10];
        crc[10] = crc[9] ^ doInvert;
        crc[9] = crc[8];
        crc[8] = crc[7] ^ doInvert;
        crc[7] = crc[6] ^ doInvert;
        crc[6] = crc[5];
        crc[5] = crc[4];
        crc[4] = crc[3] ^ doInvert;
        crc[3] = crc[2] ^ doInvert;
        crc[2] = crc[1];
        crc[1] = crc[0];
        crc[0] = doInvert;
    }

    // Convert binary to ASCII
    for (var i = 0; i < 15; i++)
    {
        res[14 - i] = crc[i] ? '1' : '0';
    }
    return res;
}
*/