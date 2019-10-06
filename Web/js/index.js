$(document).ready(function () {

    $(".safety").fancybox({
        maxWidth    : 800,
        maxHeight   : 640,
        fitToView   : false,
        width       : '80%',
        height      : '80%',
        autoSize    : false,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none'
    });

    var safety = getCookie("safety");
    
    if (safety === undefined) {
        $(".safety").trigger('click');
    }else{
        var path = window.location.pathname;
        var page = path.split("/").pop();

        //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?init=115200", {
        $.ajax("serial.php?init=115200", {
            async: false,
			timeout: 2400,
            success: function(data) {
                console.log(data);
                if(data.toUpperCase().indexOf("ERROR") != -1)
                {
                    $("#com").show();
                    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?com=list", {
                    $.ajax("serial.php?com=list", {
                        async: false,
						timeout:2000,
                        success: function(data) {
                           //console.log(data);
                           $(".serial").fancybox({
                                maxWidth    : 800,
                                maxHeight   : 640,
                                fitToView   : false,
                                width       : '80%',
                                height      : '80%',
                                autoSize    : false,
                                closeClick  : false,
                                openEffect  : 'none',
                                closeEffect : 'none'
                            });
                            var s = data.split('\n');
                            if(s.length == 2) {
                                $.notify({ message: "Try swapping TX <-> RX" }, { type: "warning" });
                            }else if(s.length > 1) {
                                for (var i = 0; i < s.length; i++) {
                                    if(s[i] != "")
                                        $("#serial-interface").append($("<option>",{value:s[i]}).append(s[i]));
                                }
                                $(".serial").trigger('click');
                            }else if (os === "mac") {
                                $("#macdrivers img").attr("src","img/mojave-logo.png");
                                $(".macdrivers").fancybox({
                                    maxWidth    : 800,
                                    maxHeight   : 640,
                                    fitToView   : false,
                                    width       : '80%',
                                    height      : '80%',
                                    autoSize    : false,
                                    closeClick  : false,
                                    openEffect  : 'none',
                                    closeEffect : 'none'
                                });
                                $(".macdrivers").trigger('click');
                            }else{
                                $.notify({ message: "Serial not found" }, { type: "danger" });
                            }
                        }
                    });
                }else if(data.indexOf("2D") != -1) {
                    $.notify({ message: 'Firmware corrupt or not found' }, { type: 'danger' });
                    //$("#com").show();
                    setTimeout(function () {
                        window.location.href = "firmware.php";
                    }, 2600);
                }else if(data.indexOf("9600") != -1) {
                    $.notify({ message: 'Serial speed is 9600 baud, Power cycle' }, { type: 'danger' });
                    $("#com").show();
                }else if(data.indexOf("w}") != -1) {
                    $.notify({ message: 'Serial speed incorrect, Refresh' }, { type: 'danger' });
                    $("#com").show();
				}else if(data.indexOf("test pin") != -1) {
                    $.notify({ message: 'STM32 Test firmware detected' }, { type: 'danger' });
					setTimeout(function () {
						window.location.href = "test.php";
					}, 2600);
                }else{
                    buildParameters();
                }
            }
        });
    }
});

function basicChecks(json)
{
	var fweak = setDefaultValue(json.fweak, 0);
	var fslipmax = setDefaultValue(json.fslipmax, 0);
    var fslipmin = setDefaultValue(json.fslipmin, 0);
	var deadtime = setDefaultValue(json.deadtime, 0);
	var udc = setDefaultValue(json.udc, 0);
	var udcsw = setDefaultValue(json.udcsw, 0);
    var udcnom = setDefaultValue(json.udcnom, 0);

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
	if (deadtime < 28) {
		$.notify({ message: 'IGBT "deadtime" is dangerously fast' }, { type: 'danger' });
	}
    if(json.version != undefined) {
        var v = json.version.value
        if(json.version.unit != undefined)
        {
            var split = json.version.unit.split("=");
            v = split[1];
        }
        displayFWVersion(v);
        checkFirmwareUpdates(v);
    }
    if(json.hwver != undefined) {
        hardware = parseInt(json.hwver.value);
        setCookie("hardware", hardware, 1);
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
    console.log("udc " + udc);
    console.log("udc_diff " + udc_diff);
    console.log("adj_factor_calc " + adj_factor_calc);
    console.log("boost_calc " + boost_calc);
    console.log("fweak_calc " + fweak_calc);
    console.log("fslip_change_calc " + fslip_change_calc);
    */
    return [Math.round(boost_calc), Math.round(fweak_calc)];
};

function boostSlipCalculator()
{
    var fslipconstmax = parseInt($("#fslipconstmax").val());
    var fslipmax = parseInt($("#fslipmax").val());
    var fconst = parseInt($("#fconst").val());
    var boost = parseInt($("#boost").val());
    var fweak = parseInt($("#fweak").val());
    var udcnom = parseInt($("#udcnom").val());
    var udc = parseInt($("#udc").val());

    //_boostSlipCalculator(fslipconstmax,fslipmax,fconst,boost,fweak,udcnom,udc);
    //_boostSlipCalculator(5.5,3.6,350,2000,100,500,480);

    var boost_n = Math.round(boost/1000)*1000;

    if(udcnom == 0) {
        $.notify({ message: 'Set udcnom higher than zero.' }, { type: 'danger' });
        return;
    }

    var div = $("<div>",{class:"container"});
    var row = $("<div>",{class:"row"});
    var col = $("<div>",{class:"col", align:"center"});
    var loader = $("<div>",{ class:"loader"});
    var canvas = $("<canvas>");

    col.append(loader);
    col.append(canvas);
    row.append(col);
    div.append(row);

    $("#calculator").empty();
    $("#calculator").append(div);
    $(".calculator").trigger("click");

    $.getScript("js/chart.js").done(function(script, textStatus) {
        $.getScript("js/chartjs-plugin-annotation.js").done(function(script, textStatus) {

            var ctxFont = 16;
            var chart_boost_datasets = {
                type: "line",
                label: "boost",
                fill: false,
                backgroundColor: "rgba(255,99,132, 0.5)",
                borderColor: "rgba(255,99,132)",
                borderWidth: 2,
                tooltipHidden: false,
                data: [],
                yAxisID: "y-axis-0",
            };

            var chart_fweak_datasets = {
                type: "line",
                label: "fweak",
                fill: false,
                backgroundColor: "rgba(51, 153, 255, 0.5)",
                borderColor: "rgba(51, 153, 255)",
                borderWidth: 2,
                tooltipHidden: false,
                data: [],
                yAxisID: "y-axis-1",
            };

            var chart_udc_datasets = {
                type: "line",
                label: "udc",
                lineTension: 0,
                backgroundColor: "rgba(102, 255, 51, 0.4)",
                borderColor: "rgba(102, 255, 51)",
                borderWidth: 2,
                tooltipHidden: true,
                data: [], //udc representation
                xAxisID: "x-axis-0"
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
                legend: {
                    display: true,
                    labels: {
                        fontSize: ctxFont,
                        fontColor: 'rgb(0, 0, 0)'
                    }
                },
                tooltips: {
                    //enabled: true,
                    filter: function(tooltipItem, data) {
                        return !data.datasets[tooltipItem.datasetIndex].tooltipHidden; // custom added prop to dataset
                    }
                },
                scales: {
                    xAxes: [{
                        position: 'bottom',
                        scaleLabel: {
                            fontSize: ctxFont,
                            display: true,
                            labelString: 'udc (Volt)'
                        },
                    }],
                    yAxes: [{
                        id: "y-axis-0",
                        position: 'right',
                        scaleLabel: {
                            fontSize: ctxFont,
                            display: true,
                            labelString: 'boost',
                            fontColor: chart_boost_datasets.borderColor
                        },
                        ticks: {
                            precision: 0,
                            fontSize: ctxFont,
                            stepSize: boost_segment,
                            suggestedMin: 0,
                            suggestedMax: boost_n + (boost_segment*2)
                        },
                        gridLines: {
                            drawOnChartArea: true
                        }
                    },{
                        id: "y-axis-1",
                        position: 'left',
                        scaleLabel: {
                            fontSize: ctxFont,
                            display: true,
                            labelString: 'fweak (Hz)',
                            fontColor: chart_fweak_datasets.borderColor
                        },
                        ticks: {
                            precision: 0,
                            fixedStepSize: 1,
                            fontSize: ctxFont,
                            stepSize: fweak_segment,
                            suggestedMin: 0,
                            suggestedMax: fweak + (fweak_segment*2)
                        },
                        gridLines: {
                            drawOnChartArea: true
                        }
                    }]
                },
                annotation: {
                    annotations: [{
                        type: "line",
                        id: "a-line-0",
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: udcnom,
                        borderColor: "black",
                        borderWidth: 1,
                        borderDash: [4, 4],
                        label: {
                          content: "udcnom",
                          enabled: true,
                          position: "top"
                        }
                    }
                ]}
            };

            loader.hide();
            
            var chart = new Chart(canvas, {
                type: 'line',
                data: data,
                options: options
            });

            if(chart_fweak_datasets.data[chart_fweak_datasets.data.length-1] < 0){
                alert("udcnom is too low, adjust and re-calculate.");
            }
        });
    });
};

function syncofsCalculator()
{
    var div = $("<div>",{class:"container"});
    var row = $("<div>",{class:"row"});
    var col2 = $("<div>",{class:"col"});

    var p = $("<p>").append("Nissan Leaf Resolver Offsets");
    var input1 = $("<input>",{ class:"form-control my-3", type:"text"});
    var input2 = $("<input>",{ class:"form-control my-3", type:"text", disabled:true});
    var btn = $("<button>",{ class:"btn btn-primary", type:"button"});

    if(os != "esp8266" && os != "mobile")
    {
        var img = $("<img>",{ class:"img-thumbnail rounded", src:"img/leaf-resolver-offsets.jpg"});
        var col1 = $("<div>",{class:"col", align:"center"});
        col1.append(img);
        row.append(col1);
    }

    col2.append(p).append(input1).append(input2);
    col2.append(btn.append("Save"));
    div.append(row.append(col2));

    input1.on("input",function(e) {
        var value = $(this).val();
        var hex = parseInt("0x" + value.substring(0, 2));

        var a = ((hex - 0x80) * 256);
        var b = (a * 360 / 65536) * 2;
        b = 360/Math.floor(360 / b); //degree round
        b = Math.round(b * 10) / 10; //digit round
        b = Math.ceil(b * 20) / 20; //nearest 0.5

        input2.val((a/2) + " @ " + b + "°");
	});

    btn.click(function() {
        $.fancybox.close();
        var split = input2.val().split(" ");
        $("#syncofs").val(split[0]);
        setParameter("syncofs",split[0],true,true);
    });

	/*
	82 00 DF 00 5D

	1000 means 1000*360/65536=5.5°.
	If we assume 360° is 256 in Nissans world then syncofs_256=1000*256/65536 = 0x4.
	If we further assume that they phase shift their calibration by 180° for some reason
	then 0x2 would be perfect since 0x2 + 0x80 = 0x82.
	*/
	//console.log(((0x82 + 0x80) % 256) * 256);

    $("#calculator").empty();
    $("#calculator").append(div);
    $(".calculator").trigger("click");
};

function buildParameters()
{
    $(".loader").show();
	
	$.ajax("description.csv",{
		//async: false,
        dataType : 'text',
		success: function(data)
		{
            var parameters = [];
            var description = [];

			var row = data.split("\n");

			for (var i = 0; i < row.length; i++) {
				
				var split = row[i].split(",");
                
                //console.log(split[0]);
                //console.log(d.replace(/"/g, ''));

				parameters.push(split[0]);
				description.push(row[i].substring(split[0].length + 1).replace(/"/g, ''));
			}

            var json = sendCommand("json");
            var inputDisabled = false;

            if(Object.keys(json).length == 0)
            {
                $.ajax("js/parameters.json", {
                  async: false,
                  dataType: "json",
                  success: function(data) {
                    console.log(data);
                    json = data;
                    inputDisabled = true;
                  }
                });
            }else{
                buildStatus();
                basicChecks(json);
            }

            var legend = $("#legend").empty();
            var menu = $("#parameters").empty();
            var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>")).append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("Type")));
            var tbody = $("<tbody>");
            menu.append(thead);
            menu.append(tbody);

            for(var key in json)
            {
                //console.log(key);

                var tooltip = "";
                var x = parameters.indexOf(key);
                if(x !=-1)
                    tooltip = description[x];

                var a = $("<a>");
                var tr = $("<tr>");

                //if(os === "mobile" || esp8266 === true) {
                    var a = $("<input>", { type:"text", "id":key, class:"form-control", value:json[key].value, disabled: inputDisabled });
                    a.on('change paste', function() {
                        var element = $(this);
                        if(element.val() != "") {
                            validateInput(element.attr("id"), element.val(), function(r) {
                                if(r === true) 
                                    setParameter(element.attr("id"),element.val(),true,true);
                            });
                        }
                    });
                    if(os === "mobile") {
                        tr.attr("style","font-size: 140%;");
                        a.attr("style","font-size: 110%; width: 100%; height: 1.5em");
                        a.attr("type","number");
                    }
                //}else{
                //    var a = $("<a>", { href:"#", "id":key, "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":json[key].unit + " ("+ json[key].default + ")"});
                //    a.append(json[key].value);
                //}

                var category_icon = $("<i>", { class:"text-muted icons" });

                if(json[key].category)
                {
                    var category = json[key].category;
                    
                    category_icon.attr("data-toggle", "tooltip");
                    category_icon.attr("data-html", true);
                    category_icon.attr("title", "<h6>" + category + "</h6>");

                    if(category == "Motor")
                    {
                        category_icon.addClass("icon-motor");
                    }
                    else if(category == "Inverter")
                    {
                        category_icon.addClass("icon-inverter");
                    }
                    else if(category == "Charger")
                    {
                        category_icon.addClass("icon-plug");
                    }
                    else if(category == "Throttle")
                    {
                        category_icon.addClass("icon-throttle");
                    }
                    else if(category == "Regen")
                    {
                        category_icon.addClass("icon-power");
                    }
                    else if(category == "Automation")
                    {
                        category_icon.addClass("icon-gear");
                    }
                    else if(category == "Derating")
                    {
                        category_icon.addClass("icon-magnet");
                    }
                    else if(category == "Contactor Control")
                    {
                        category_icon.addClass("icon-download");
                    }
                    else if(category == "Aux PWM")
                    {
                        category_icon.addClass("icon-pwm");
                    }
                    else if(category == "Testing")
                    {
                        category_icon.addClass("icon-test");
					}
                    else if(category == "Communication")
                    {
                        category_icon.addClass("icon-transfer");
                    }else{
                        category_icon.addClass("icon-info");
                    }
                }
                
                var td1 = $("<td>").append(category_icon);
                var td2 = $("<td>").append(key);
                var td3 = $("<td>").append(a);
                var td4 = $("<td>");

                if(key == "syncofs")
                {
                    var syncofs_btn = $("<button>", {type:"button", class:"btn btn-primary", onclick:"syncofsCalculator()"});
                    var syncofs_calc = $("<i>", {class:"icons icon-magic"}).append(" Calculate");
                    td4.append(syncofs_btn.append(syncofs_calc));
                } else if(key == "udcnom") {
                    var fweak_btn = $("<button>", {type:"button", class:"btn btn-primary", onclick:"boostSlipCalculator()"});
                    var fweak_calc = $("<i>", {class:"icons icon-magic"}).append(" Calculate");
                    td4.append(fweak_btn.append(fweak_calc));
                }else{
                    td4.append(json[key].unit.replace("","°"));
                }

                if(tooltip != "")
                {
                    td2.attr("data-toggle", "tooltip");
                    td2.attr("data-html", true);
                    td2.attr("title", "<h6>" + tooltip + "</h6>");
                }

                tr.append(td1).append(td2).append(td3).append(td4);
                tbody.append(tr);
            };
            menu.show();

            $("#saveload").show();
            
            $('[data-toggle="tooltip"]').tooltip();

            $(".loader").hide();
		},
		error: function(xhr, textStatus, errorThrown){
		}
	});

    checkWebUpdates();
};

function checkFirmwareUpdates(v)
{
    var split = v.split(".");
    var _version = parseFloat(split[0]);
    var _build = parseFloat(split[1]);

    var check = Math.random() >= 0.5;
    if (check === true)
    {
        $.ajax("https://api.github.com/repos/jsphuebner/stm32-sine/releases/latest", {
            async: false,
            dataType: 'json',
            success: function success(data) {
                try{
                    var release = data.tag_name.replace("v","").replace(".R","");
                    var split = release.split(".");
                    var version = parseFloat(split[0]);
                    var build = parseFloat(split[1]);

                    //console.log("Old Firmware:" + _version + " Build:" + _build);
                    //console.log("New Firmware:" + version + " Build:" + build);

                    if(version > _version || build > _build)
                    {
                        $.notify({
                            icon: "icon icon-download",
                            title: "New Firmware",
                            message: "Available <a href='https://github.com/jsphuebner/stm32-sine/releases' target='_blank'>Download</a>"
                        }, {
                            type: 'success'
                        });
                    }
                } catch(e) {}
            }
        });
    }
};

function checkWebUpdates()
{
    var check = Math.random() >= 0.5;
    if (check === true)
    {
        $.ajax("https://raw.githubusercontent.com/dimecho/Huebner-Inverter/master/Web/version.txt", {
            async: true,
            success: function success(data) {
                try {
                    var split = data.split("\n");
                    var version = parseFloat(split[0]);
                    var build = parseFloat(split[1]);

                    $.ajax("version.txt", {
                        async: true,
                        success: function success(data) {

                            var _split = data.split("\n");
                            var _version = parseFloat(_split[0]);
                            var _build = parseFloat(_split[1]);

                            //console.log("Old Web Interface:" + _version + " Build:" + _build);
                            //console.log("New Web Interface:" + version + " Build:" + build);

                            if(version > _version || build > _build)
                            {
                                var url = "https://github.com/dimecho/Huebner-Inverter/releases/download/";
                                if(os === "mac"){
                                    url += version + "Huebner.Inverter.dmg";
                                }else if(os === "windows"){
                                    url += version + "Huebner.Inverter.Windows.zip";
                                }else if(os === "linux"){
                                    url += version + "Huebner.Inverter.Linux.tgz";
                                }else if(os === "esp8266"){
                                    url += version + "Huebner.Inverter.ESP8266.zip";
                                }
                                $.notify({
                                    icon: "icon icon-download",
                                    title: "New Web Interface",
                                    message: "Available <a href='" + url + "' target='_blank'>Download</a>"
                                }, {
                                    type: 'success'
                                });
                            }
                        }
                    });
                } catch(e) {}
            }
        });
    }
};
