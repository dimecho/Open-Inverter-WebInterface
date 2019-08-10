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
                    $("#com").show();
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
	var fweak = json.fweak.value;
	var fslipmax = json.fslipmax.value;
    var fslipmin = json.fslipmin.value;
	var deadtime = json.deadtime.value;
	var udc = json.udc.value;
	var udcsw = json.udcsw.value;

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

function syncofsCalculator()
{
    var div = $("<div>",{class:"container"});
    var row = $("<div>",{class:"row"});
    var col2 = $("<div>",{class:"col"});

    var p = $("<p>").append("Nissan Leaf Resolver Offsets");
    var input1 = $("<input>",{ class:"form-control my-3", type:"text"});
    var input2 = $("<input>",{ class:"form-control my-3", type:"text"});
    var input3 = $("<input>",{ class:"form-control my-3", type:"text", disabled:true});
    var btn = $("<button>",{ class:"btn btn-primary", type:"button"});

    if(os != "esp8266" && os != "mobile")
    {
        var img = $("<img>",{ class:"img-thumbnail rounded", src:"img/leaf-resolver-offsets.jpg"});
        var col1 = $("<div>",{class:"col", align:"center"});
        col1.append(img);
        row.append(col1);
    }

    col2.append(p).append(input1).append(input2).append(input3);
    col2.append(btn.append("Save"));
    div.append(row.append(col2));

    input1.on("input",function(e) {
        var value = $(this).val();
        var hex = parseInt("0x" + value.substring(0, 2));

        var a = ((hex + 0x80) * 2 % 256) * 256; //((hex - 0x80) * 2) / 256 * 65536;
        a = Math.round(a / 1000) * 1000;
        
        var b = a * 360 / 65536;
        b = 360/Math.floor(360 / b); //degree round
        b = Math.round(b * 10) / 10; //digit round
        b = Math.ceil(b * 20) / 20; //nearest 0.5
        
        input3.val(a + " @ " + b + "°");
	});

    btn.click(function() {
        $.fancybox.close();
        var split = input3.val().split(" ");
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

    $("#syncofs_calculator").empty();
    $("#syncofs_calculator").append(div);
    $(".syncofs_calculator").trigger("click");
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
                    var syncofs_btn = $("<button>", {type:"button", class:"btn btn-primary", onclick:" syncofsCalculator()"});
                    var syncofs_calc = $("<i>", {class:"icons icon-magic"}).append(" Calculate");
                    td4.append(syncofs_btn.append(syncofs_calc));
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
