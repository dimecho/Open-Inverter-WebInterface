// Internet Explorer Fix
function fill(size, content) {
    for (; size--; this.push(content));
    return this;
};
// ---------------------
var json = {};
var lineWidth = getCookie("graph.border") || 1;

var chart_motor_datasets = [{
	type: "line",
	id: "speed",
	label: "Motor RPM",
	backgroundColor: "rgba(255,99,132,0.2)",
	borderColor: "rgba(255,99,132,1)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(255,99,132,0.4)",
	hoverBorderColor: "rgba(255,99,132,1)",
	data: [0],
	yAxisID: "y-axis-0"
}, {
	type: "line",
	id: "potnom",
	label: "Throttle",
	backgroundColor: "rgba(102, 255, 51, 0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(102, 255, 51, 0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	yAxisID: "y-axis-1"
}];
var chart_temp_datasets = [{
	type: "line",
	id: "tmpm",
	label: "Motor",
	backgroundColor: "rgba(51, 153, 255,0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
    yAxisID: "y-axis-0"
}, {
	type: "line",
	id: "tmphs",
	label: "Inverter",
	backgroundColor: "rgba(102, 255, 51,0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
    yAxisID: "y-axis-1"
}];
var chart_voltage_datasets = [{
	type: "line",
	id: "udc",
	label: "Battery",
	backgroundColor: "rgba(102, 255, 51,0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
    yAxisID: "y-axis-0"
}, {
	type: "line",
	id: "uac",
	label: "Inverter",
	backgroundColor: "rgba(255,99,132,0.2)",
	borderColor: "rgba(255,99,132,1)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(255,99,132,0.4)",
	hoverBorderColor: "rgba(255,99,132,1)",
	data: [0],
    yAxisID: "y-axis-1"
}];
var chart_amperage_datasets = [{
	type: "line",
	id: "il1rms",
	label: "AC Current",
	backgroundColor: "rgba(51, 153, 255, 0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(51, 153, 255, 0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
    yAxisID: "y-axis-0"
}, {
	type: "line",
	id: "idc",
	label: "DC Current",
	backgroundColor: "rgba(102, 255, 51, 0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(102, 255, 51, 0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
    yAxisID: "y-axis-1"
}];

var chart_frequency_datasets = [{
	type: "line",
	id: "fweak",
	label: "Field Weakening",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#ff0000",
	borderWidth: 1,
	hoverBackgroundColor: "rgba(0, 0, 0, 0)",
	hoverBorderColor: "#ff0000",
	data: [0],
	datalabels: {
		display: false
	},
    yAxisID: "y-axis-0"
}, {
	type: "line",
	id: "fstat",
	label: "Stator Frequency",
	backgroundColor: "#90caf9",
	borderColor: "#33b5e5",
	borderWidth: lineWidth,
	hoverBackgroundColor: "#90caf9",
	hoverBorderColor: "#33b5e5",
	data: [0],
    yAxisID: "y-axis-1"
}, {
	type: "line",
	id: "ampnom",
	label: "Amplitude Max",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#bdbdbd",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(0, 0, 0, 0)",
	hoverBorderColor: "#bdbdbd",
	data: [0],
	datalabels: {
		display: false
	},
    yAxisID: "y-axis-2"
}, {
	type: "line",
	label: "Amplitude Nominal",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#FF8800",
	borderWidth: lineWidth,
	hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
	hoverBorderColor: "#FF8800",
	data: [0],
    yAxisID: "y-axis-3"
}];

var chart_pwm_datasets = [{
	type: "line",
	label: "L1 Delta", //red
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#ff3300",
	borderWidth: 1,
	data: [0]
}, {
	hidden: true,
	type: "line",
	label: "L2 Delta", //green
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#39e600",
	borderWidth: 1,
	data: [0]
}, {
	hidden: true,
	type: "line",
	label: "L3 Delta", //blue
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#0066ff",
	borderWidth: 1,
	data: [0]
}, {
	type: "line",
	label: "L1 Analog", //red
	borderColor: "#ff3300",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderWidth: 1,
	data: [0]
}, {
	type: "line",
	label: "L2 Analog", //green
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#39e600",
	borderWidth: 1,
	data: [0]
}, {
	type: "line",
	label: "L3 Analog", //blue
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#0066ff",
	borderWidth: 1,
	data: [0]
}, {
	type: "line",
	label: "Angle",
	backgroundColor: "rgba(0, 0, 0, 0)",
	//borderColor: "#39e600",
	borderWidth: 1,
	data: fill.call([],1000,0) //Array(1000).fill(0)
}, {
	type: "line",
	label: "Slip",
	backgroundColor: "rgba(0, 0, 0, 0)",
	//borderColor: "#39e600",
	borderWidth: 1,
	data: fill.call([],1000,0) //Array(1000).fill(0)
}];

var chart_can_datasets = [];
var paramReadable = [];
var can_bin_flipflop = false;
var updateURL = "";
var activeTab = "";
var activeTabText = "";
var syncronizedDelay = 600;
var syncronizedDelayRatio = 15;
var syncronizedAccuracy = 0;
var roundEdges = (getCookie("graph.roundedges") == 'true') || true;
var showDataLabels = (getCookie("graph.datalabels") == 'true') || true;
var showAnimation = (getCookie("graph.animation") == 'true') || false;
var graphDivision = getCookie("graph.division") || 60;
var streamLoop = getCookie("graph.stream") || 1;
var pageLimit = getCookie("graph.pages") || 4;
var zoomFactor = 1;
var streamTimer;
var data = {};
var options = {};
var chart;
var ctxAxis;
var ctx;
var ctxFont = 12;
var xhr;
var devmode = false;

$(document).ready(function () {

	/*
    $.ajax("serial.php?init=921600", {
		success: function(data) {
			console.log(data);
			if (data.indexOf("921600") != -1) {
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

    json = sendCommand("json");
    if(Object.keys(json).length == 0)
    {
        $.ajax("js/parameters.json", {
          async: false,
          dataType: "json",
          success: function(data) {
            json = data;
            devModeFlip();
          }
        });
    }

    graphSettings();

    paramReadable = {"speed":"Speed", "potnom":"Throttle", "tmpm":"Degree", "tmphs":"Degree", "udc":"Voltage", "uac":"Voltage", "idc":"DC Current"};

    var canvas = document.getElementById("chartCanvas");
    ctx = canvas.getContext("2d");
	
	ctxAxis = document.getElementById("chartAxis").getContext("2d");

    if(os === "mobile") {

        Chart.defaults.global.animationSteps = 0;
        canvas.height = 800;
        ctxFont = 40;

    }else{

        Chart.defaults.global.animationSteps = 12;
        canvas.height = 640;
    }

    //ctx.fillStyle = "white";
    /*
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    */
    buildGraphMenu();

    initChart();

    $("#devmode a").click(function () {
    	devModeFlip();
    });
	
	$(".graphPoints").fancybox({
		afterClose: function(){
			var n = $("input:checked");
			//console.log(n);
			if (n.length > 10){
				$.notify({ message: 'Too many points selected, 10 max' }, { type: 'warning' });
			}else{
				n.each(function(){
                    if(this.id != "") {
    					var cl = $("#" + this.id + "-jscolor");
    					console.log(this.id + " > #" + cl.val());
    					
    					var c = cl[0].style["background-color"];
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
    							type: "line",
    							id: this.id,
    							label: this.id,
    							backgroundColor: c.replace(")",", 0.2)"),
    							borderColor: c.replace(")",", 1)"),
    							borderWidth: lineWidth,
    							//hoverBackgroundColor: "rgba(255,99,132,0.4)",
    							//hoverBorderColor: "rgba(255,99,132,1)",
    							data: d,
                                yAxisID: "y-axis-" + (datasets.length-1)
    						};
    						//console.log(dataset);
                            datasets.push(dataset);
                            newYAxis(this.id,dataset.yAxisID,chart.options,"left",true);
                            //newYAxis(this.id,dataset.yAxisID,chart.options,"left",false);

    						chart.update();
    					}
                    }
				});
			}
		}
	});
});

function graphSettings(save) {

	if(save){
		roundEdges = $("input[name*='roundEdges']").is(":checked");
		showDataLabels = $("input[name*='showDataLabels']").is(":checked");
		showAnimation = $("input[name*='showAnimation']").is(":checked");
		graphDivision = $("input[name*='graphDivision']").val();
		lineWidth = $("input[name*='lineWidth']").val();
		streamLoop = $("input[name*='streamLoop']").val();
		pageLimit = $("input[name*='pageLimit']").val();
		
		setCookie("graph.roundedges", roundEdges, 1);
		setCookie("graph.datalabels", showDataLabels, 1);
		setCookie("graph.animation", showAnimation, 1);
		setCookie("graph.division", graphDivision, 1);
		setCookie("graph.border", lineWidth, 1);
		setCookie("graph.stream", streamLoop, 1);
		setCookie("graph.pages", pageLimit, 1);
	}else{
		$("input[name*='roundEdges']").prop('checked', roundEdges);
		$("input[name*='showDataLabels']").prop('checked', showDataLabels);
		$("input[name*='showAnimation']").prop('checked', showAnimation);
		$("input[name*='graphDivision']").val(graphDivision);
		$("input[name*='lineWidth']").val(lineWidth);
		$("input[name*='streamLoop']").prop('checked', streamLoop);
		$("input[name*='pageLimit']").prop('checked', pageLimit);
	}
	if(showDataLabels == true) {
		showDataLabels = "auto";
	}
};

function activeDatasets() {

    if (activeTab === "#graph0") {
        return chart_motor_datasets;
    } else if (activeTab === "#graph1") {
        return chart_temp_datasets;
    } else if (activeTab === "#graph2") {
        return chart_voltage_datasets;
    } else if (activeTab === "#graph3") {
        return chart_amperage_datasets;
    } else if (activeTab === "#graph4") {
        return chart_frequency_datasets;
    } else if (activeTab === "#graph5") {
        return chart_can_datasets
    } else {
        return;
    }
};

function addYAxis(datasets,options) {

    for (var i = 0, l = datasets.length; i < l; i++) {
        if(i == 0) {
            newYAxis(datasets[i].id,datasets[i].yAxisID,options,"left",true);
        }else if (i == 1) {
            newYAxis(datasets[i].id,datasets[i].yAxisID,options,"right",true);
        }else{
        	//newYAxis(datasets[i].id,datasets[i].yAxisID,options,"left",true); //DEBUG
            newYAxis(datasets[i].id,datasets[i].yAxisID,options,"left",false);
        }
    }
};

function newYAxis(key,id,options,side,visible) {

    var min = -1;
	var max = 1;
	var step = 0.1;

    if(key != undefined) {
        var label = paramReadable[key] || key;
        if(json[key].unit != "" && json[key].unit != "dig") {
            label += " (" + json[key].unit.toUpperCase() + ")";
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
        //console.log(key + " (min:" + min + " max:" + max + " step:" + step + ")");
    }

    var y_axis = {
        display: visible,
        id: id,
        position: side,
        scaleLabel: {
            fontSize: ctxFont,
            display: true,
            labelString: label //datasets[1].label
        },
        ticks: {
            fontSize: ctxFont,
            stepSize: step,
            suggestedMin: min, //auto scale
            suggestedMax: max //auto scale
        },
        gridLines: {
            drawOnChartArea: visible
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
    	$("#devmode a").empty().append("Developer Mode is ON");
    	devModeNotify();
    }else{
    	devmode = false;
    	$("#devmode a").empty().append("Developer Mode is OFF");
    }
};

function buildPointsMenu() {
	var menu = $("#buildPointsMenu");
	if (isEmpty(menu))
	{
		for(var key in json) {
            
			//console.log(key);
			var row = $("<div>", { class: "row" });
			var col = $("<div>", { class: "col" });
			
			var c = $("<input>", { class: "form-control", type:"checkbox", "id":key });
			col.append(c);
			row.append(col);
			
			var l = $("<label>", { for: key }).append(key);
			col = $("<div>", { class: "col" });
			col.append(l);
			row.append(col);

			var cl = $("<input>", {class: "jscolor form-control", "id":key+"-jscolor", value:getRandomColor() });
			col = $("<div>", { class: "col" });
			col.append(cl);
			row.append(col);

            menu.append(row);
		}
		jscolor.installByClassName("jscolor");
	}
};

function getRandomColor() {
  var color = "";
  var letters = "0123456789ABCDEF";
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
    //os = "mobile";

    var tabs = ["Motor", "Temperature", "Voltage", "Amperage", "Frequencies", "CAN", "PWM"];

    var menu = $("#buildGraphMenu").empty();
    var menu_buttons = $("#buildGraphButtons").empty();
    var export_buttons = $("#buildGraphExport").empty();

	var btn_points_i = $("<i>", { class: "icons icon-ok" });
	var btn_points = $("<button>", { class: "btn btn-primary btn-space", onClick: "buildPointsMenu();$(\".graphPoints\").trigger(\"click\");" }).append(btn_points_i).append(" Select Points");
    var btn_start = $("<button>", { class: "btn btn-success btn-space", onClick: "startChart()" }).append("Start Graph");
    var btn_stop = $("<button>", { class: "btn btn-danger btn-space", onClick: "stopChart()" }).append("Stop Graph");
    var e_settings = $("<i>", { class: "icon-status icons icon-settings p-2", onClick: "$(\".graphSettings\").trigger(\"click\");", "data-toggle": "tooltip", "title": "Settings" });
    var e_pdf = $("<i>", { class: "icon-status icons icon-pdf p-2", onClick: "exportPDF(true)", "data-toggle": "tooltip", "title": "Export PDF" });
    var e_img = $("<i>", { class: "icon-status icons icon-png p-2", onClick: "exportPDF()", "data-toggle": "tooltip", "title": "Export Image" });
    var e_csv = $("<i>", { class: "icon-status icons icon-csv p-2", onClick: "exportCSV()", "data-toggle": "tooltip", "title": "Export CSV" });

    var z = $("#buildGraphZoom").empty();
    var input_zoom = $("<input>", { id: "zoom", type: "text", "data-provide": "slider"} );
    z.append(input_zoom);

    input_zoom.ionRangeSlider({
        skin: "big",
        grid: true,
        step: 1,
        min: 100,
        max: 200,
        from: 100,
        postfix: " %",
        onFinish: function (e) {

            zoomFactor = e.from/100;

            console.log("Before " + chart.width + ":" + chart.height);
            ctx.save();
            ctx.scale(zoomFactor,zoomFactor);
            //ctx.translate(0,0);
            chart.update();
            ctx.restore();
            console.log("After " + (chart.width * zoomFactor) + ":" + (chart.height * zoomFactor));
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

    var s = $("#buildGraphSlider").empty();

    var input_speed = $("<input>", { id: "speed", type: "text", "data-provide": "slider"} );
    s.append(input_speed);

    function speed_prettify (n) {
        if (n == 100) {
            return "Slow";
        }else if (n == 1) {
            return "Fast";
        }
        return n;
    };
    
    input_speed.ionRangeSlider({
        skin: "big",
        grid: true,
        step: 1,
        min: 1,
        max: 100,
        from: (syncronizedDelay / syncronizedDelayRatio),
        prettify: speed_prettify,
        //postfix: " %",
        onFinish: function (e) {
            //console.log(e.from);
            var sync_delay = e.from * syncronizedDelayRatio;
            updateURL = updateURL.replace("&delay=" + syncronizedDelay,"&delay=" + sync_delay);

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

    activeTab = "#graph0";
    activeTabText = tabs[0];
	
	menu_buttons.append(btn_points);
    menu_buttons.append(btn_start);
    menu_buttons.append(btn_stop);

    export_buttons.append(e_settings);
    export_buttons.append(e_img);

    if (os === "mobile") {

        graphDivision = 40;

        var nav = $("<nav>", { class: "navbar navbar-toggleable-md navbar-light bg-faded" });
        var div = $("<div>", { class: "collapse navbar-collapse", id: "navbarsGraph" });
        var button = $("<button>", { class: "navbar-toggler navbar-toggler-right", type: "button", "data-toggle":"collapse", "data-target": "#navbarsGraph", "aria-controls": "navbarsGraph", "aria-expanded": false, "aria-label": "Navigation" });
        var span = $("<span>", { class: "text-dark display-3 icons icon-menu" });
        var text = $("<a>", { class: "text-dark display-4", href:"#"}).append($("<b>").append(activeTabText));

        button.append(span);
        nav.append(button);
        nav.append(text);

        for (var i = 0; i < tabs.length; i++)
        {
            var ul = $("<ul>", { class: "navbar-nav" });
            var li = $("<li>", { class: "nav-item" });
            var a = $("<a>", { class: "nav-link display-4", id: i});
            
            a.append($("<b>").append(tabs[i]));
            li.append(a);
            ul.append(li);
            div.append(ul);
        }

        nav.append(div);
        menu.append(nav);

        $('.nav-item a').click(function () {

            button.click();

            activeTab = "#graph" + this.id;
            activeTabText = this.text;
            text.empty();
            text.append($("<b>").append(activeTabText));

            stopChart();
            initChart();
        });

        //slow_img.attr("style","width:80px; height:80px;");
        $(".slider").attr("style","width:80%;");
        $(".slider-track").attr("style","height:40px;");
        $(".slider-handle").attr("style","width:70px;height:70px;");
        //fast_img.attr("style","width:80px; height:80px;");
        $(".btn").attr("style","font-size: 150%;");
        $(".icons").attr("style","width:80px; height:80px;");

    }else{
    	if(os != "esp8266") {
	        $.getScript("js/jspdf.js").done(function(script, textStatus) {
	            export_buttons.append(e_pdf);
	        });
    	}
        export_buttons.append(e_csv);

        var ul = $("<ul>", { class: "nav nav-tabs", role: "tablist"});
        var tabcontent = $("<div>", { class: "tab-content" });

        for (var i = 0; i < tabs.length; i++)
        {
            var li = $("<li>", { class: "nav-item"});
            var a = $("<a>", { class: "nav-link", href: "#graph" + i }).append(tabs[i]);
            li.append(a);
            ul.append(li);

            var tabpanel = $("<div>", { class: "tab-pane fade", id: "graph" + i , role: "tabpanel" });
            if (i ===0){
                tabpanel.addClass("in active");
            }

            tabcontent.append(tabpanel);
        }

        menu.append(ul);
        menu.append(tabcontent);

        $('.nav-tabs a').click(function () {
            $(this).tab('show');
            //console.log(this);
        });

        $('.nav-tabs a').on('shown.bs.tab', function (event) {
            //var x = $(event.target).text();         // active tab
            //var y = $(event.relatedTarget).text();  // previous tab

            activeTab = event.target.hash;
            activeTabText = event.target.text;

            stopChart();
            initChart();
        });
    }

    pageLimit = graphDivision * pageLimit;

    $('[data-toggle="tooltip"]').tooltip();
};

function exportCSV() {

    var datasets = activeDatasets();
    var points = idDatasets(datasets);
    var value = csvDatasets(datasets);

    //console.log(value);

    let csvContent = "data:text/csv;charset=utf-8,";

    let row = value[0].length;
    let col = points.length;

    for (var r = 0; r < row; r++) {
        if(r == 0) { //first row
            csvContent += points.join(",") + "\r\n";
        }
        for (var c = 0; c < col; c++) {
            //TODO: get timestamp
            csvContent += value[c][r] + ",";
        }
        csvContent += "\r\n";
    }

    //var encodedUri = encodeURI(csvContent);
    //window.open(encodedUri);

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
};

function exportPDF(pdf) {

    //ctx.save();
    //ctx.scale(4,4);
    //var render = ctx.canvas.toDataURL('image/jpeg',1.0);
    //ctx.restore();

    var render = ctx.canvas.toDataURL("image/png", 1.0);
    var d = new Date();
    //d.setHours(10, 30, 53, 400);

    if (pdf) {
        //console.log($('.tab-pane.active').find('p:hidden').text());
        var doc = new jsPDF('l', 'mm', [279, 215]);
        doc.setProperties({
            title: "",
            subject: "",
            author: '',
            creator: '© 2016'
        });
        doc.setDisplayMode(1);
        doc.setFontSize(28);
        doc.text(110, 20, activeTabText);
        doc.addImage(render, 'JPEG', 18, 40, 250, 120, "graph", "none");
        doc.save("graph " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + (d.getHours() % 12 || 12) + "-" + d.getMinutes() + " " + (d.getHours() >= 12 ? 'pm' : 'am') + ".pdf");

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
            "background": '#000',
            //"width": margins.width,
            //"height": margins.height,
            //"elementHandlers": specialElementHandlers
        };
        var date = new Date();
        //var d = date.Now().format("MM-DD-YYYY h:mma");
        //console.log(d);
         document.getElementById("canvas").style.backgroundColor = 'rgba(255, 255, 255, 1)';
        //doc.addHTML($("#render"), 0.5, 2, options,function() {
        doc.addHTML(ctx.canvas, margins.left, margins.top, options,function() {
            document.getElementById("canvas").style.backgroundColor = 'rgba(255, 255, 255, 0)';
            doc.save("graph.pdf");
        }, margins);
        */
    } else {

        var data = atob(render.substring("data:image/png;base64,".length)),
            asArray = new Uint8Array(data.length);

        for (var i = 0, len = data.length; i < len; ++i) {
            asArray[i] = data.charCodeAt(i);
        }
        var blob = new Blob([asArray.buffer], { type: "image/png" });

        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "graph " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + (d.getHours() % 12 || 12) + "-" + d.getMinutes() + " " + (d.getHours() >= 12 ? 'pm' : 'am') + ".png";
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

    if(os !== "mobile")
        duration = syncronizedDelay/2;

    if (activeTab === "#graph0") {
        initMotorChart(duration);
    } else if (activeTab === "#graph1") {
        initTemperatureChart(duration);
    } else if (activeTab === "#graph2") {
        initVoltageChart(duration);
    } else if (activeTab === "#graph3") {
        initAmperageChart(duration);
    } else if (activeTab === "#graph4") {
        initFrequenciesChart(duration);
    } else if (activeTab === "#graph5") {
        initCANChart(duration);
    } else if (activeTab === "#graph6") {
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
    
	$("#buildPointsMenu").empty();

    $('.chartAreaWrapper2').width($('.chartAreaWrapper').width());
};

function startChart() {

    console.log(activeTab);

    syncronizedAccuracy = 0;

    //clearTimeout(statusRefreshTimer);
    stopChart();

    //$.ajax("graph.php?stream=start");

    var mode = getJSONFloatValue('opmode');
    if (mode === 2 || mode === 5) {
        $("#potentiometer").show();
    }

	var value = [];
	var autosize = false;
	var accuracy = 0;

    if (activeTab === "#graph0") {
        //accuracy = 0.8;
		autosize = true;
		value = idDatasets(chart_motor_datasets);
    } else if (activeTab === "#graph1") {
        value = idDatasets(chart_temp_datasets);
    } else if (activeTab === "#graph2") {
		autosize = true;
		value = idDatasets(chart_voltage_datasets);
    } else if (activeTab === "#graph3") {
        value = idDatasets(chart_amperage_datasets);
    } else if (activeTab === "#graph4") {
		value = idDatasets(chart_frequency_datasets);
    } else if (activeTab === "#graph5") {
        value = idDatasets(chart_can_datasets);
    //} else if (activeTab === "#graph6") {
		/*
        if(getJSONFloatValue('opmode') > 0) {
            updateChart(["pwmfrq", "deadtime"]);
        }else{
            $.notify({ message: 'Inverter is OFF - PWM cannot be generated' }, { type: 'danger' });
        }
		*/
	}

	updateURL = "serial.php?stream=" + value.toString() + "&loop=1&delay=" + syncronizedDelay;
	if(devmode == true) {
		devModeNotify();
		updateURL = "graph.php?debug=1&stream=" + value.toString() + "&loop=1&delay=" + syncronizedDelay;
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
    //$.ajax("graph.php?stream=stop");

    if (xhr) xhr.abort();

    clearTimeout(streamTimer);

    $("#potentiometer").hide();
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
		    			xaxis.push(i + " " + stamp);
		    		}
	    		}
    		}
    	}else{
    		xaxis.push("");
    	}
        /*
        if (i / 10 % 1 != 0) {
            xaxis.push("");
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

            //console.log(abs + ":" + s);

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
        //backgroundColor: "#ffffff",
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
                fontSize: ctxFont,
                fontColor: "#000000",
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
                    fontSize: ctxFont,
                    display: true,
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
                    fontSize: ctxFont,
                    labelString: 'Pulse'
                },
                ticks: {
                    fontSize: ctxFont,
                    //beginAtZero:true,
                    //reverse: false,
                    stepSize: 0.5,
                    suggestedMin: -1.5, //important
                    suggestedMax: 1.5 //important
                }
            }]
        },
        annotation: {
    		drawTime: 'afterDraw',
			annotations: [{
                type: "line",
                id: "a-line-0",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 160,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "90°",
                  enabled: true,
                  position: "top"
                }
            },{
                type: "line",
                id: "a-line-1",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 320,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "180°",
                  enabled: true,
                  position: "top"
                }
            },{
                type: "line",
                id: "a-line-2",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 480,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "270°",
                  enabled: true,
                  position: "top"
                }
            },{
                type: "line",
                id: "a-line-3",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 640,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "360°",
                  enabled: true,
                  position: "top"
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

function genCANpulse(value,speed,gain)
{
	var data = [2.50,2.50];
	gain = (gain / 100);

	var byte = (Math.abs(value)).toString(2);

	//if(value < 0) {
	//	byte = flipbits(byte);
	//}
	console.log(byte);
	
	for (var i = 1; i <= byte.length; i++)
    {
    	var bit = byte.substring(i,i-1);
    	//var bit_n = byte.substring(i+1,i);

    	var b = bit * gain;
    	if(value > 0)
		{
			b = 2.501 + b; //H
		}else{
			b = 2.499 - b; //L
		}
    	data.push(b);
    	data.push(b);
    	/*
    	if(bit != bit_n){
    		data.push(b);
    	}
    	*/
    	//console.log("[" + i + "] " + bit + ">" + bit_n + "=" + b);
    }
    //data.push(2.50);
    //data.push(2.50);
	//console.log(data);
	return data;
}

function addCANdataset(key,gain,value) {

	var color_h = ["CCE5FF", "99CCFF", "66B2FF", "3399FF","0080FF","0066CC"];
	var color_l = ["FFCCCC", "FF9999", "FF6666", "FF3333","FF0000","CC0000"];
	var can_frame_control = []; //Control
	var can_frame_data = []; //Data
	var can_frame_crc = []; //CRC
	var can_frame_eof = []; //End Of Frame
	var color = [];

	color = hexToRgb(color_h[2]);
	var color_h_rgb = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	color = hexToRgb(color_l[2]);
	var color_l_rgb = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
	//console.log(color_h_rgb + " " + color_l_rgb);

	can_frame_control = genCANpulse(10,1,gain);
	can_frame_data = genCANpulse(value,1,gain);
	can_frame_crc = genCANpulse(2,1,gain);
	can_frame_eof = fill.call([],10,2.501);
    var can_h = {
        type: "line",
        label: key + " (CAN H)",
        gain: gain,
        fill: false,
		backgroundColor: color_h_rgb.replace(")",", 0.4)"),
		borderColor: color_h_rgb.replace(")",", 1)"),
        borderWidth: 2,
        data: can_frame_control.concat(can_frame_data).concat(can_frame_crc).concat(can_frame_eof),
        datalabels: {
        	align: 'top',
			//anchor: 'end',
            //display: 'auto',
        }
    };

    can_frame_control = genCANpulse(-10,1,gain);
	can_frame_data = genCANpulse((0-value),1,gain);
	can_frame_crc = genCANpulse(-2,1,gain);
	can_frame_eof = fill.call([],10,2.499);
    var can_l = {
        type: "line",
        label: key + " (CAN L)",
        gain: gain,
        fill: false,
		backgroundColor: color_l_rgb.replace(")",", 0.4)"),
		borderColor: color_l_rgb.replace(")",", 1)"),
        borderWidth: 2,
        data: can_frame_control.concat(can_frame_data).concat(can_frame_crc).concat(can_frame_eof),
        datalabels: {
            align: 'bottom',
            //display: 'auto',
        }
    };
    chart_can_datasets.push(can_h);
    chart_can_datasets.push(can_l);
};

function initCANChart(duration) {

	chart_can_datasets = [];

    $.notify({ message: "CAN graph is \"simulated\" how the signals look." }, { type: "success" });

    for(var key in json)
    {
        if(json[key].canid != "")
        {
            if(json[key].isrx == false) //TX
            {
            	addCANdataset(key,json[key].cangain,json[key].value);
            	break;
            }
        }
    }

    if(chart_can_datasets.length == 0){
        $.notify({ message: "<a href='can.php'>CAN Mapping</a> (TX) signal not configured." }, { type: "warning" });
        if(devmode == true)
        {
        	addCANdataset("test",10,200);
        }
    }

    data = {
        labels: initTimeAxis(graphDivision,[],0),
        datasets: chart_can_datasets
    };

    options = {
        legend: {
            display: true,
            labels: {
                fontSize: ctxFont,
                fontColor: 'rgb(0, 0, 0)'
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
                    var value  = tooltipItem.yLabel;
                    if(value == 2.50) {
                		return "";
                	}else if(value == 2.499 || value == 2.501) {
                		return "0";
                	}else{
                		return "1";
                	}
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
            	display: false,
                id: "x-axis-0",
                position: 'bottom',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Time (μs)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90,
                    stepSize: 50
                }
            }],
            yAxes: [{
     			id: "y-axis-0",
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Volts'
                },
                ticks: {
                    fontSize: ctxFont,
                    stepSize: 0.1,
                    suggestedMin: 2.4, //important
                    suggestedMax: 2.7 //important
                }
            }, {
                id: "y-axis-1",
                position: 'right',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Gain (mV)'
                },
                ticks: {
                    fontSize: ctxFont,
                    stepSize: 10,
                    suggestedMin: -200, //important
                    suggestedMax: 200 //important
                },
                gridLines: {
                    drawOnChartArea: true
                }
            }]
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
                type: "line",
                id: "a-line-0",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 10,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "Control:", //8
                  enabled: true,
                  position: "top"
                }
            },{
                type: "line",
                id: "a-line-1",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 28,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "Data: 200", //8
                  enabled: true,
                  position: "top"
                }
            },{
                type: "line",
                id: "a-line-2",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 33,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "CRC:", //15
                  enabled: true,
                  position: "top"
                }
            },{
                type: "line",
                id: "a-line-3",
                mode: "vertical",
                scaleID: "x-axis-0",
                value: 44,
                borderColor: "black",
                borderWidth: 1,
                borderDash: [4, 4],
                label: {
                  content: "End of Frame:", //10
                  enabled: true,
                  position: "top"
                }
            }]
		},
        plugins: {
            datalabels: {
		        /*
				align: function(context) {
					return context.active ? 'end' : 'center';
				}
				*/
            	backgroundColor: function(context) {
					return context.dataset.backgroundColor;
				},
            	display: function(context) {
            		var display = false;
            		var point = context.dataset.data[context.dataIndex];
            		if(point != 2.5) {
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
                	if(value == 2.5) {
                		return "";
                	}else if(value == 2.499 || value == 2.501) {
                		return 0;
                	}else{
                		return 1;
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
            display: true,
            labels: {
                fontSize: ctxFont,
                fontColor: 'rgb(0, 0, 0)'
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
                display: true,
                position: 'bottom',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90,
                    stepSize: 50
                }
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
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
            display: true,
            labels: {
                fontSize: ctxFont,
                fontColor: 'rgb(0, 0, 0)'
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
        tooltipTemplate: "<%= label %> - <%= value %>",
        */
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                position: 'bottom',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    maxRotation: 90,
                    stepSize: 50
                }
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
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
        responsive: false,
        legend: {
            display: true,
            labels: {
                fontSize: ctxFont,
                fontColor: 'rgb(0, 0, 0)'
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
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                    fontSize: ctxFont,
                    maxRotation: 90,
                    reverse: false
                }
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
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
            display: true,
            labels: {
                fontSize: ctxFont,
                fontColor: 'rgb(0, 0, 0)'
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
                display: true,
                position: 'bottom',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                    fontSize: ctxFont,
                    maxRotation: 90,
                    reverse: false
                }
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
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
            display: true,
            labels: {
                fontSize: ctxFont,
                fontColor: 'rgb(0, 0, 0)'
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
                display: true,
                position: 'bottom',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Time (hh:mm:ss)'
                },
                ticks: {
                    fontSize: ctxFont,
                    maxRotation: 90,
                    reverse: false
                }
            }],
            yAxes: [] //Dynamically added
        },
        plugins: {
            datalabels: {
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
        type: "GET",
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
                var split = this_response.trim().split("\n");
                //console.log(split);
				
                for (var d = 0; d < split.length; d++) //stream is unpredictable - can get all-at-once or partial array
                {
					var v = value[i];
                    var point = parseFloat(split[d]);

                    //console.log(v + ":" + point);
					//console.log(i + "-" + last);
					
                    if (v === "pwmfrq")
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
                    }else if (v === "ampnom") {
                        var max = Math.max.apply(null, data.datasets[i].data);
                        data.datasets[i + 1].data = sineWave(2,(max * point / 100),0,0.1);
                    } else {

                        if (accuracy) {
                            var p = data.datasets[i].data[l - 1];
                            var c = p * accuracy;
                            console.log("Last point:" + p + ">" +c);

                            if (syncronizedAccuracy < 3 && point < c) {
								console.log("Correct: " + v + " " + point + " > " + p);
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
                    //console.log("Max scroll pages ...reset");
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
                    data.labels[l] = hr + ":" + d.getMinutes() + ":" + d.getSeconds();
                }
                
                if (autosize) { //&& l == 1) //do it at start

                    var largest = Math.max.apply(null, data.datasets[0].data);
                    //console.log("yAxes Sale:" + largest);

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
        if(textStatus === "timeout")
        {
            streamTimer = setTimeout(function() {
                updateChart(value, autosize, accuracy);
            }, 1000);
            //this.timeoutCount++;
        }
    })
};

function isEmpty( el ){
    return !$.trim(el.html())
};