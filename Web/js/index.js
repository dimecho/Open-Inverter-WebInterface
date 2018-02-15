$(document).ready(function()
{
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

    if(os !== "mobile") {
        
        $("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/bootstrap-editable.css\" />"); 

        $.getScript("/js/bootstrap-editable.js", function() {

            $('#parameters').editable({
                selector: 'a',
                url: '/serial.php',
                mode: 'popup',
                pk: '1',
                showbuttons: true,
                savenochange: false,
                ajaxOptions: {
                    type: 'get',
                    async: false,
                    //type: 'put',
                    //dataType: 'json'
                },
                validate: function(value) {

                    if (!validateInput(this.id,value)) {
                        return '-';
                    }
                },
                success: function(response, newValue)
                {
                    //console.log("'" + response + "'");

                    //if(response === "Set OK\n"){
                        //var id = this.id;
                        //console.log(this.id);
                        
                        var data = sendCommand("save");

                        if(data.indexOf("Parameters stored") != -1)
                        {
                            //TODO: CRC32 check on entire params list

                            $.notify({ message: data },{ type: 'success' });
                        }else{
                            $.notify({ icon: 'glyphicon glyphicon-warning-sign', title: 'Error', message: data },{ type: 'danger' });
                        }
                    //}
                }
            });
        });
    }

    var safety = getCookie("safety");
    
    if (safety === undefined) {
        $(".safety").trigger('click');
    }else{
        buildParameters();
    }
});

function inputText(id)
{
    var getVariable = $(id).text();
    if(getVariable === "")
        getVariable = $(id).val();

    return getVariable;
}

function validateInput(id,value)
{
    if(getJSONFloatValue('opmode') > 0 && id != 'fslipspnt'){
        stopInverter();
        $.notify({ message: 'Inverter must not be in operating mode.' }, { type: 'danger' });
        return false;
    }

    if (isInt(parseInt(value)) == false && isFloat(parseFloat(value)) == false){
        $.notify({ message: 'Value must be a number' }, { type: 'danger' });
        return false;
    }

    if(id == 'fmin'){

        if(parseFloat(value) > parseFloat(inputText('#fslipmin')))
        {
            $.notify({ message: 'Should be set below fslipmin' }, { type: 'danger' });
            return false;
        }
    }else  if(id == 'polepairs'){
        if ($.inArray(parseInt(value), [ 1, 2, 3, 4, 5]) == -1)
        {
            $.notify({ message: 'Pole pairs = half # of motor poles' }, { type: 'danger' });
            return false;
        }
    }else  if(id == 'udcmin'){
        if(parseInt(value) > parseInt(inputText("#udcmax")))
        {
            $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
            return false;
        }
    }else  if(id == 'udcmax'){
        if(parseInt(value) > parseInt(inputText("#udclim")))
        {
            $.notify({ message: 'Should be lower than cut-off voltage (udclim)' }, { type: 'danger' });
            return false;
        }
    }else  if(id == 'udclim'){
        if(parseInt(value) <= parseInt(inputText("#udcmax")))
        {
            $.notify({ message: 'Should be above maximum voltage (udcmax)' }, { type: 'danger' });
            return false;
        }
    }else if(id == 'udcsw'){
        if(parseInt(value) > parseInt(inputText("#udcmax")))
        {
            $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
            return false;
        }
    }else if(id == 'udcsw'){
        if(parseInt(value) > parseInt(inputText("#udcmin")))
        {
            $.notify({ message: 'Should be below minimum voltage (udcmin)' }, { type: 'danger' });
            return false;
        }
    }else if(id == 'fslipmin'){
        if(parseFloat(value) <= parseFloat(inputText('#fmin')))
        {
            $.notify({ message: 'Should be above starting frequency (fmin)' }, { type: 'danger' });
            return false;
        }
    /*
    }else  if(id == 'ocurlim'){
        if(value > 0)
        {
            return 'Current limit should be set as negative';
        }*/
    }

    var notify = $.notify({ message: id + " = " + $.trim(value) },{
        //allow_dismiss: false,
        //showProgressbar: true,
        type: 'warning'
    });
    return true;
};

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
	var parameters = [];
	var description = [];

    $(".loader").show();
	
	$.ajax("/description.csv",{
		async: false,
		//dataType: 'text',
		//contentType: "application/text",
		beforeSend: function (req) {
		  req.overrideMimeType('text/plain; charset=x-user-defined');
		},
		success: function(data)
		{
			var row = data.split("\n");

			for (var i = 0; i < row.length; i++) {
				
				var split = row[i].split(",");
				var d = "";

				if(split.length > 6) { //contains , in decription
					for (var c = 5; c < split.length; ++c) {
						d += split[c];
					}
				}else{
					d = split[5];
				}

				parameters.push(split[0]);
				description.push(d.replace(/"/g, ''));
			}
		},
		error: function(xhr, textStatus, errorThrown){
		}
	});

    var json = sendCommand("json");

    if(Object.keys(json).length > 0)
    {
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

            if(os === "mobile") {
                var a = $("<input>", { type:"number", "id":key, class:"form-control", value:json[key].value });
                tr.attr("style","font-size: 140%;");
                a.attr("style","font-size: 110%; width: 100%; height: 1.5em");
                a.on('change paste', function() {
                    var element = $(this);
                    if(element.val() != "") {
                        if(validateInput(element.attr("id"),element.val()))
                            setParameter(element.attr("id"),element.val(),true,true);
                    }
                });

            }else{
                var a = $("<a>", { href:"#", "id":key, "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":json[key].unit + " ("+ json[key].default + ")"});
                a.append(json[key].value);
            }

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

		basicChecks(json);
    }

    $(".loader").hide();

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
                                var url = Base64.decode("aHR0cHM6Ly9naXRodWIuY29tL3Bvb2Zpay9IdWVibmVyLUludmVydGVyL3JlbGVhc2VzL2Rvd25sb2FkLw==");
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
