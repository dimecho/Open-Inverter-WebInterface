var chart_motor_datasets = [{
	type: "line",
	id: "speed",
	label: "Motor RPM",
	backgroundColor: "rgba(255,99,132,0.2)",
	borderColor: "rgba(255,99,132,1)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(255,99,132,0.4)",
	hoverBorderColor: "rgba(255,99,132,1)",
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	id: "potnom",
	label: "Throttle",
	backgroundColor: "rgba(102, 255, 51, 0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(102, 255, 51, 0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	datalabels: {
		display: false
	}
}];
var chart_temp_datasets = [{
	type: "line",
	id: "tmpm",
	label: "Motor",
	backgroundColor: "rgba(51, 153, 255,0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	id: "tmphs",
	label: "Inverter",
	backgroundColor: "rgba(102, 255, 51,0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	datalabels: {
		display: false
	}
}];
var chart_voltage_datasets = [{
	type: "line",
	id: "udc",
	label: "Battery",
	backgroundColor: "rgba(102, 255, 51,0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	id: "uac",
	label: "Inverter",
	backgroundColor: "rgba(255,99,132,0.2)",
	borderColor: "rgba(255,99,132,1)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(255,99,132,0.4)",
	hoverBorderColor: "rgba(255,99,132,1)",
	data: [0],
	datalabels: {
		display: false
	}
}];
var chart_amperage_datasets = [{
	type: "line",
	id: "il1rms",
	label: "AC Current",
	backgroundColor: "rgba(51, 153, 255, 0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(51, 153, 255, 0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	id: "idc",
	label: "DC Current",
	backgroundColor: "rgba(102, 255, 51, 0.2)",
	borderColor: "rgba(0,0,0,0.2)",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(102, 255, 51, 0.4)",
	hoverBorderColor: "rgba(0,0,0,0.5)",
	data: [0],
	datalabels: {
		display: false
	}
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
	}
}, {
	type: "line",
	id: "fstat",
	label: "Stator Frequency",
	backgroundColor: "#90caf9",
	borderColor: "#33b5e5",
	borderWidth: 2,
	hoverBackgroundColor: "#90caf9",
	hoverBorderColor: "#33b5e5",
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	id: "ampnom",
	label: "Amplitude Max",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#bdbdbd",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(0, 0, 0, 0)",
	hoverBorderColor: "#bdbdbd",
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	label: "Amplitude Nominal",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#FF8800",
	borderWidth: 2,
	hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
	hoverBorderColor: "#FF8800",
	data: [0],
	datalabels: {
		display: false
	}
}];

var chart_pwm_datasets = [{
	type: "line",
	label: "L1 Delta", //red
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#ff3300",
	borderWidth: 1,
	data: [0],
	datalabels: {
		display: false
	}
}, {
	hidden: true,
	type: "line",
	label: "L2 Delta", //green
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#39e600",
	borderWidth: 1,
	data: [0],
	datalabels: {
		display: false
	}
}, {
	hidden: true,
	type: "line",
	label: "L3 Delta", //blue
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#0066ff",
	borderWidth: 1,
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	label: "L1 Analog", //red
	borderColor: "#ff3300",
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderWidth: 1,
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	label: "L2 Analog", //green
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#39e600",
	borderWidth: 1,
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	label: "L3 Analog", //blue
	backgroundColor: "rgba(0, 0, 0, 0)",
	borderColor: "#0066ff",
	borderWidth: 1,
	data: [0],
	datalabels: {
		display: false
	}
}, {
	type: "line",
	label: "Angle",
	backgroundColor: "rgba(0, 0, 0, 0)",
	//borderColor: "#39e600",
	borderWidth: 1,
	data: Array(1000).fill(0),
	//borderDash: [10,5],
	datalabels: {
		//display: false,
		/*
		align: function(context) {
			return context.active ? 'end' : 'center';
		}
		*/
	}
}, {
	type: "line",
	label: "Slip",
	backgroundColor: "rgba(0, 0, 0, 0)",
	//borderColor: "#39e600",
	borderWidth: 1,
	data: Array(1000).fill(0),
	//borderDash: [10,5],
	datalabels: {
		//display: false,
		/*
		align: function(context) {
			return context.active ? 'end' : 'center';
		}
		*/
	}
}];

var chart_can_datasets = [];

var activeTab = "";
var activeTabText = "";
var syncronizedDelay = 600;
var syncronizedDelayRatio = 15;
var syncronizedAccuracy = 0;
var graphDivision = 60;
var streamTimer;
var data;
var options;
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

    var canvas = document.getElementById("canvas");
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

    $('#devmode a').click(function () {
		devModeNotify();
    	devmode = true;
    });
	
	$(".graphPoints").fancybox({
		afterClose: function(){
			var n = $("input:checked");
			//console.log(n);
			if (n.length > 10){
				$.notify({ message: 'Too many points selected, 10 max' }, { type: 'warning' });
			}else{
				n.each(function(){
					var cl = $("#" + this.id + "-jscolor");
					console.log(this.id + " > #" + cl.val());
					
					var c = cl[0].style["background-color"];
					console.log(c);
					
					var arrayHas = false;

					for (var i = 0, l = chart_motor_datasets.length; i < l; i++) {
						//console.log(chart_motor_datasets[i].id);
						if(chart_motor_datasets[i].id == this.id){
							arrayHas = true;
							break;
						}
					}
					if(!arrayHas) {
						var d = new Array(chart_motor_datasets[0].data.length).fill(0);
						var dataset = {
							type: "line",
							id: this.id,
							label: this.id,
							backgroundColor: c.replace(")",", 0.2)"),
							borderColor: c.replace(")",", 1)"),
							borderWidth: 2,
							//hoverBackgroundColor: "rgba(255,99,132,0.4)",
							//hoverBorderColor: "rgba(255,99,132,1)",
							data: d,
							datalabels: {
								display: false
							}
						};
						//console.log(dataset);
						if (activeTab === "#graph0") {
							chart_motor_datasets.push(dataset);
						} else if (activeTab === "#graph1") {
							chart_temp_datasets.push(dataset);
						} else if (activeTab === "#graph2") {
							chart_voltage_datasets.push(dataset);
						} else if (activeTab === "#graph3") {
							chart_amperage_datasets.push(dataset);
						} else if (activeTab === "#graph4") {
							chart_frequency_datasets.push(dataset);
                        } else if (activeTab === "#graph5") {
                            chart_can_datasets.push(dataset);
						}
						chart.update();
					}
				});
			}
		}
	});
});

function devModeNotify() {
    $.notify({ message: 'Developer Mode Enabled' }, { type: 'success' });
    $.notify({ message: 'Graph will generate random points' }, { type: 'warning' });
};

function buildPointsMenu() {
	var menu = $("#buildPointsMenu"); //.empty();
	if (isEmpty(menu))
	{
		var json = {}; //sendCommand("json");
		if(Object.keys(json).length == 0)
		{
			$.ajax("js/parameters.json", {
			  async: false,
			  dataType: "json",
			  success: function(data) {
				json = data;
			  }
			});
		}
		
		var div = $("<div>", { class: "container" });
		for(var key in json)
		{
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

			div.append(row);
		}

		menu.append(div);
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

function buildGraphMenu() {
    //os = "mobile";

    var tabs = ["Motor", "Temperature", "Voltage", "Amperage", "Frequencies", "CAN", "PWM"];

    var menu = $("#buildGraphMenu").empty();
    var menu_buttons = $("#buildGraphButtons").empty();
    var export_buttons = $("#buildGraphExport").empty();

	var btn_points_i = $("<i>", { class: "icons icon-ok" });
	var btn_points = $("<button>", { class: "btn btn-primary btn-space", onClick: "buildPointsMenu();$('.graphPoints').trigger('click');" }).append(btn_points_i).append(" Select Points");
    var btn_start = $("<button>", { class: "btn btn-success btn-space", onClick: "startChart()" }).append("Start Graph");
    var btn_stop = $("<button>", { class: "btn btn-danger btn-space", onClick: "stopChart()" }).append("Stop Graph");
    var e_pdf = $("<i>", { class: "icon-status icons icon-pdf p-2", onClick: "exportPDF(true)", "data-toggle": "tooltip", "title": "Export PDF" });
    var e_img = $("<i>", { class: "icon-status icons icon-png p-2", onClick: "exportPDF()", "data-toggle": "tooltip", "title": "Export Image" });
    var e_csv = $("<i>", { class: "icon-status icons icon-csv p-2", onClick: "exportCSV()", "data-toggle": "tooltip", "title": "Export CSV" });

    var z = $("#buildGraphZoom").empty();
    var input = $("<input>", { id: "zoom", type: "text", "data-provide": "slider"} );
    z.append(input);
    input.ionRangeSlider({
        skin: "big",
        grid: true,
        step: 1,
        min: 100,
        max: 200,
        from: 100,
        postfix: " %",
        onFinish: function (e) {
            console.log(e.from);
        }
    });

    var s = $("#buildGraphSlider").empty();
    var slow_img = "Slow  ";
    var input = $("<input>", { id: "speed", type: "text", "data-provide": "slider"} );
    var fast_img = "  Fast";
    
    //s.append(slow_img);
    s.append(input);
    //s.append(fast_img);

    function speed_prettify (n) {
        if (n == 100) {
            return "Slow";
        }else if (n == 1) {
            return "Fast";
        }
        return n;
    };
    
    input.ionRangeSlider({
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

            syncronizedDelay = e.from * syncronizedDelayRatio;
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

    $.getScript("js/jspdf.js").done(function(script, textStatus) {
        export_buttons.append(e_pdf);
    });
    export_buttons.append(e_img);
    export_buttons.append(e_csv);

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

    $('[data-toggle="tooltip"]').tooltip();
};

function exportCSV() {

    var datasets;

    if (activeTab === "#graph0") {
        datasets = chart_motor_datasets;
    } else if (activeTab === "#graph1") {
        datasets = chart_temp_datasets;
    } else if (activeTab === "#graph2") {
        datasets = chart_voltage_datasets;
    } else if (activeTab === "#graph3") {
        datasets = chart_amperage_datasets;
    } else if (activeTab === "#graph4") {
        datasets = chart_frequency_datasets;
    } else {
        return;
    }

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
    
    chart = new Chart(ctx, {
        //type: 'line',
        type: 'bar',
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
            updateChart(url, ["pwmfrq", "deadtime"]);
        }else{
            $.notify({ message: 'Inverter is OFF - PWM cannot be generated' }, { type: 'danger' });
        }
		*/
	}

	var url = "serial.php?stream=" + value.toString() + "&loop=1&delay=" + syncronizedDelay;
	if(devmode == true) {
		devModeNotify();
		url = "graph.php?debug=1&stream=" + value.toString() + "&loop=1&delay=" + syncronizedDelay;
	}

	updateChart(url,value,autosize,accuracy);
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

function initTimeAxis(seconds, labels) {

    var xaxis = [];

    if(labels)
        xaxis = labels;

    for (var i = 0; i < seconds; i++) {
        xaxis.push("");
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
        labels: initTimeAxis(750),
        backgroundColor: "#ffffff",
        datasets: chart_pwm_datasets
    };

    var waveGraphRatio = 0.01;

    data.datasets[0].data = sinePWM(2,-2.25,waveGraphRatio); //red
    data.datasets[1].data = sinePWM(3.5,2.25,waveGraphRatio); //green
    data.datasets[2].data = sinePWM(2.5,0,waveGraphRatio); //blue

    data.datasets[3].data = sineWave(2,1,-2.25,waveGraphRatio); //red
    data.datasets[4].data = sineWave(3.5,1,2.25,waveGraphRatio); //green
    data.datasets[5].data = sineWave(2.5,1,0,waveGraphRatio); //blue

    //Angle
    var p = (data.datasets[6].data.length - 368) / 4;
    for (i = 1; i <= 4; i++) {
        var x = p * i;
        data.datasets[6].data[x] = 1.2;
        data.datasets[6].data[x + 1] = -1.2;
        //console.log(x);
    }

    //Rotor
    /*
    var p = (data.datasets[7].data.length - 380) / 4;
    for (i = 1; i <= 4; i++) {
        var x = p * i;
        data.datasets[7].data[x] = 1.2;
        data.datasets[7].data[x + 1] = -1.2;
        //console.log(x);
    }
    */

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
                    labelString: 'Time (Millisecond)'
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
                display: true,
                position: 'left',
                //stacked: true,
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Pulse'
                },
                ticks: {
                    fontSize: ctxFont,
                    beginAtZero:true,
                    reverse: false,
                    stepSize: 0.5,
                    suggestedMin: -1.5, //important
                    suggestedMax: 1.5 //important
                }
            }]
        },
        plugins: {
            datalabels: {
                //color: "#39e600",
                display: function(context) {
                    return context.dataset.data[context.dataIndex] != 0; //hide zeros
                },
                formatter: function(value, context) {
                    var p = (context.dataset.data.length - 368) / 4;
                    /*
                    console.log(p);
                    console.log(p*2);
                    console.log(p*3);
                    console.log(p*4);
                    */

                    if(context.dataIndex === p || context.dataIndex === p + 1) {
                        return "90°";
                    }else if(context.dataIndex === (p * 2) || context.dataIndex === (p * 2) + 1) {
                        return "180°";
                    }else if(context.dataIndex === (p * 3) || context.dataIndex === (p * 3) + 1) {
                        return "270°";
                    }else if(context.dataIndex === (p * 4) || context.dataIndex === (p * 4) + 1) {
                        return "360°";
                    }
                },
                //offset: 8,
                textAlign: 'center'
                /*
                font: {
                    weight: 'bold'
                },
                borderWidth: 1,
                borderRadius: 4,
                backgroundColor: function(context) {
                    return context.dataset.backgroundColor;
                },
                formatter: Math.round

                */
            }
        },
        zoom: {
            enabled: true,
            mode: 'y'
        },
        animation: {
            duration: duration
        }
    };
};

function initCANChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_can_datasets
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
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Gain (mV)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    stepSize: 10,
                    suggestedMin: 0, //important
                    suggestedMax: 260 //important
                }
            }]
        },
        zoom: {
            enabled: true,
            mode: 'y'
        },
        animation: {
            duration: duration
        }
    };
};

function initFrequenciesChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_frequency_datasets
    };

    var fweak = getJSONFloatValue("fweak");
    var fmax = getJSONFloatValue("fmax");
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
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Frequency (Hz)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    stepSize: step,
                    suggestedMin: 0, //important
                    suggestedMax: fmax + step //important
                }
            }]
        },
        zoom: {
            enabled: true,
            mode: 'y'
        },
        animation: {
            duration: duration
        }
    };
};

function initAmperageChart(duration) {

    //RMS = LOCKED-ROTOR CURRENT
    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_amperage_datasets
    };

    var ocurlim = getJSONFloatValue("ocurlim");
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
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Current (A)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    stepSize: step,
                    suggestedMin: 0, //important
                    suggestedMax: ocurlim + step //important
                }
            }]
        },
        zoom: {
            enabled: true,
            mode: 'y'
        },
        animation: {
            duration: duration
        }
    };
};

function initMotorChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_motor_datasets
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
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Speed (RPM)'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    stepSize: 500,
                    suggestedMin: 0, //important
                    suggestedMax: 5000 //important
                }
            }]
        },
        /*
        pan: {
            enabled: true,
            mode: 'y'
        },
        */
        zoom: {
            enabled: true,
            mode: 'y',
            //limits: {
            //    max: 100,
            //    min: 0.5
            //}
        },
        animation: {
            duration: duration,
			/*
			onComplete: function(animation) {
			}
			*/
        }
    };
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
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Degree °C'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    stepSize: 10,
                    suggestedMin: 0, //important
                    suggestedMax: 110 //important
                }
            }]
        },
        zoom: {
            enabled: true,
            mode: 'y'
        },
        animation: {
            duration: duration
        }
    };
};

function initVoltageChart(duration) {

    data = {
        labels: initTimeAxis(graphDivision),
        datasets: chart_voltage_datasets
    };

    var udclim = getJSONFloatValue("udclim");
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
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    fontSize: ctxFont,
                    display: true,
                    labelString: 'Voltage'
                },
                ticks: {
                    fontSize: ctxFont,
                    reverse: false,
                    stepSize: step,
                    suggestedMin: 0, //important
                    suggestedMax: udclim //important
                }
            }]
        },
        zoom: {
            enabled: true,
            mode: 'y'
        },
        animation: {
            duration: 0 //duration
        }
    };
};

function updateChart(url, value, autosize, accuracy) {

    //clearTimeout(streamTimer);
    
    //Ajax Streaming
    //============================================================
    var last_response_len = false;
    var last = (value.length - 1);
    var i = 0;

	xhr = $.ajax(url, {
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

                var split = this_response.slice(0, -1).split("\n");
				
                for (var d = 0; d < split.length; d++)
                {
					var v = value[i];
					//console.log(i + "-" + last);
					
                    if (v === "pwmfrq")
                    {
                        var pwmfrq = parseFloat(split[d]);
                        var deadtime = parseFloat(split[d+1]);
                        var waveGraphRatio = 0.01;

                        data.datasets[0].data = sinePWM(4,-2.25,waveGraphRatio); //red
                        //data.datasets[1].data = sinePWM(4,2.0,waveGraphRatio); //green
                        //data.datasets[2].data = sinePWM(4,0,waveGraphRatio); //blue

                        data.datasets[3].data = sineWave(4,1,-2.25,waveGraphRatio); //red
                        //data.datasets[4].data = sineWave(4,1,2.0,waveGraphRatio); //green
                        //data.datasets[5].data = sineWave(4,1,0,waveGraphRatio); //blue
                        
                        break;
                    }else if (v !== "fweak") {
                        var point = parseFloat(split[d]);
                        //console.log(v + ":" + point);

                        if (v === "ampnom") {
                            var max = Math.max.apply(Math, data.datasets[i].data);
                            data.datasets[i + 1].data = sineWave(2,(max * point / 100),0,0.1);
                        } else {

							l = data.datasets[i].data.length;
							
                            if (accuracy) {
                                var p = data.datasets[i].data[l - 1];
                                var c = p * accuracy;
                                //console.log("Last point:" + p + ">" +c);

                                if (syncronizedAccuracy < 3 && point < c) {
									console.log("Correct: " + v + " " + point + " > " + p);
                                    point = p;
                                    //if (p != c)
										syncronizedAccuracy++;
                                } else {
                                    syncronizedAccuracy = 0;
                                }
                            }

                            if(i == 0)
                            {
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

                                }else if (l > (graphDivision * 5)){
									//console.log("Max scroll pages ...reset");
                                    data.datasets[i].data = []; //empty
                                    data.labels = initTimeAxis(graphDivision);
                                    $('.chartAreaWrapper2').width($('.chartAreaWrapper').width());
                                }
								
                                //Time-stamp
                                if (l / 10 % 1 == 0)
                                {
                                    var d = new Date();
                                    var hr = d.getHours();
                                    /*
                                    var ampm = "am";
                                    if( hr > 12 ) {
                                        hr -= 12;
                                        ampm = "pm";
                                    }
                                    */
                                    //console.log(l);
                                    data.labels[l] = hr + ":" + d.getMinutes() + ":" + d.getSeconds();
                                }
                            }

                            data.datasets[i].data.push(point);
                            //console.log(data.datasets[i].data);
                        }
                    }
                    
                    if (i == last)
                    {
                        i = 0;
                    }
                    else
                    {
                        i++;
                    }
                }
                
                if (autosize) { //&& l == 1) //do it at start

                    var largest = Math.max.apply(Math, data.datasets[0].data);
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
            updateChart(url, value, autosize, accuracy);
        //}, syncronizedDelay);
    }).fail(function(jqXHR, textStatus) {
        if(textStatus === "timeout")
        {
            streamTimer = setTimeout(function() {
                updateChart(url, value, autosize, accuracy);
            }, 1000);
            //this.timeoutCount++;
        }
    })
};

function isEmpty( el ){
    return !$.trim(el.html())
};