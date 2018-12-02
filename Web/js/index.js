var driverIssues = "";

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
            success: function(data) {
                console.log(data);
                if(data.indexOf("Error") != -1)
                {
                    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?com=list", {
                    $.ajax("serial.php?com=list", {
                        async: false,
                        success: function(d) {
                           //console.log(d);
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
                            var s = d.split(',');
                            for (var i = 0; i < s.length; i++) {
                                if(s[i] != "")
                                    $("#serial-interface").append($("<option>",{value:s[i]}).append(s[i]));
                            }
                            $(".serial").trigger('click');
                        }
                    });
                    
                }else{
                    driverIssues = data;
                    if(data.indexOf("9600") != -1) {
                        $.notify({ message: 'Serial speed is 9600 baud' }, { type: 'danger' });
                    }

                    buildParameters();
                }
            }
        });
    }
});

function inputText(id)
{
    var getVariable = $(id).text();
    if(getVariable === "")
        getVariable = $(id).val();

    return getVariable;
}

function basicChecks(json)
{
	var fweak = json["fweak"].value;
	var fslipmax = json["fslipmax"].value;
    var fslipmin = json["fslipmin"].value;
	var deadtime = json["deadtime"].value;
	var udc = json["udc"].value;
	var udcsw = json["udcsw"].value;
	
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

			for (var i = 1; i < row.length; i++) {
				
				var split = row[i].split(",");
				var d = "";

				if(split.length > 6) { //contains , in decription
					for (var c = 5; c < split.length; ++c) {
						d += split[c];
					}
				}else{
					d = split[5];
				}
                //console.log(split[0]);
                //console.log(d.replace(/"/g, ''));

				parameters.push(split[0]);
				description.push(d.replace(/"/g, ''));
			}

            var json = sendCommand("json");
            var inputDisabled = false;

            if(Object.keys(json).length == 0)
            {
                if (os === "mac") {
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
                }
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
                displayVersion();
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

                var category_icon = $("<i>", { class:"text-muted glyphicon" });

                if(json[key].category)
                {
                    var category = json[key].category;
                    
                    category_icon.attr("data-toggle", "tooltip");
                    category_icon.attr("data-html", true);
                    category_icon.attr("title", "<h6>" + category + "</h6>");

                    if(category == "Motor")
                    {
                        category_icon.addClass("glyphicon-cd");
                    }
                    else if(category == "Inverter")
                    {
                        category_icon.addClass("glyphicon-compressed");
                    }
                    else if(category == "Charger")
                    {
                        category_icon.addClass("glyphicon-flash");
                    }
                    else if(category == "Throttle")
                    {
                        category_icon.addClass("glyphicon-off");
                    }
                    else if(category == "Regen")
                    {
                        category_icon.addClass("glyphicon-retweet");
                    }
                    else if(category == "Automation")
                    {
                        category_icon.addClass("glyphicon-cog");
                    }
                    else if(category == "Derating")
                    {
                        category_icon.addClass("glyphicon-magnet");
                    }
                    else if(category == "Contactor Control")
                    {
                        category_icon.addClass("glyphicon-download-alt");
                    }
                    else if(category == "Aux PWM")
                    {
                        category_icon.addClass("glyphicon-barcode");
                    }
                    else if(category == "Testing")
                    {
                        category_icon.addClass("glyphicon-dashboard");
                    }else{
                        category_icon.addClass("glyphicon-info-sign");
                    }
                }
                
                var td1 = $("<td>").append(category_icon);
                var td2 = $("<td>").append(key);
                var td3 = $("<td>").append(a);
                var td4 = $("<td>").append(json[key].unit.replace("","°"));

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
            
            $('[data-toggle="tooltip"]').tooltip();

            $(".loader").hide();
		},
		error: function(xhr, textStatus, errorThrown){
		}
	});

    checkUpdates();
};

function checkUpdates() {

    var check = Math.random() >= 0.5;
    if (check === true)
    {
        var online = Base64.decode("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3Bvb2Zpay9IdWVibmVyLUludmVydGVyL21hc3Rlci9XZWIvdmVyc2lvbi50eHQ=");
        $.ajax(online, {
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

                            console.log("Version:" + _version + " Build:" + _build);

                            if(version > _version || build > _build)
                            {
                                var url = Base64.decode("aHR0cHM6Ly9naXRodWIuY29tL2RpbWVjaG8vSHVlYm5lci1JbnZlcnRlci9yZWxlYXNlcy9kb3dubG9hZC8=");
                                if(os === "mac"){
                                    url += version + "/Huebner.Inverter.dmg";
                                }else if(os === "windows"){
                                    url += version + "/Huebner.Inverter.Windows.zip";
                                }else if(os === "linux"){
                                    url += version + "/Huebner.Inverter.Linux.tgz";
                                }else if(os === "esp8266"){
                                    url += version + "/Huebner.Inverter.ESP8266.bin";
                                }
                                $.notify({
                                    icon: "glyphicon glyphicon-download-alt",
                                    title: "New Version",
                                    message: "Update available <a href='" + url + "'>Download</a>"
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

var Base64 = {

    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        return output;
    }
};
