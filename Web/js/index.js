$(document).ready(function()
{
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

			if(getJSONFloatValue('opmode') > 0 && this.id != 'fslipspnt'){
				stopInverter();
                $.notify({ message: 'Inverter must not be in operating mode.' }, { type: 'danger' });
				return '-';
			}

            if (isInt(parseInt(value)) == false && isFloat(parseFloat(value)) == false){
                $.notify({ message: 'Value must be a number' }, { type: 'danger' });
                return '-';
            }

            if(this.id == 'fmin'){
                if(parseFloat(value) > parseFloat($('#fslipmin').text()))
                {
                    $.notify({ message: 'Should be set below fslipmin' }, { type: 'danger' });
                    return '-';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray(parseInt(value), [ 1, 2, 3, 4, 5]) == -1)
                {
                    $.notify({ message: 'Pole pairs = half # of motor poles' }, { type: 'danger' });
                    return '-';
                }
            }else  if(this.id == 'udcmin'){
                if(parseInt(value) > parseInt($("#udcmax").text()))
                {
                    $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
                    return '-';
                }
            }else  if(this.id == 'udcmax'){
                if(parseInt(value) > parseInt($("#udclim").text())){
                    $.notify({ message: 'Should be lower than cut-off voltage (udclim)' }, { type: 'danger' });
                    return '-';
                }
            }else  if(this.id == 'udclim'){
                if(parseInt(value) <= parseInt($("#udcmax").text())){
                    $.notify({ message: 'Should be above maximum voltage (udcmax)' }, { type: 'danger' });
                    return '-';
                }
            }else if(this.id == 'udcsw'){
                if(parseInt(value) > parseInt($("#udcmax").text())){
                    $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
                    return '-';
                }
			}else if(this.id == 'udcsw'){
                if(parseInt(value) > parseInt($("#udcmin").text())){
                    $.notify({ message: 'Should be below minimum voltage (udcmin)' }, { type: 'danger' });
                    return '-';
                }
			}else if(this.id == 'fslipmin'){
				if(parseFloat(value) <= parseFloat($('#fmin').text())){
                    $.notify({ message: 'Should be above starting frequency (fmin)' }, { type: 'danger' });
					return '-';
				}
            /*
            }else  if(this.id == 'ocurlim'){
                if(value > 0)
                {
                    return 'Current limit should be set as negative';
                }*/
            }

            var notify = $.notify({ message: this.id + " = " + $.trim(value) },{
                //allow_dismiss: false,
                //showProgressbar: true,
                type: 'warning'
            });
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

    var safety = getCookie("safety");
    
    if (safety === undefined) {
        $(".safety").trigger('click');
    }else{
        buildParameters();
    }
});

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

    var json = loadJSON();
    
    if(json)
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
			
			var a = $("<a>", { href:"#", "id":key, "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":json[key].unit + " ("+ json[key].default + ")"}).append(json[key].value);
            var tr = $("<tr>");

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
    
    checkUpdates();

    $(".loader").hide();
};

function checkUpdates() {

    var check = Math.random() >= 0.5;
    if (check === true) {
        $.ajax("/update.php", {
            async: true,
            success: function success(data) {
                //console.log(data);
                if(data !== "") {
                    var url = "https://github.com/poofik/Huebner-Inverter/releases/download/1.0/";
                    if(os === "Mac"){
                        url += "Huebner.Inverter.dmg";
                    }else if(os === "Windows"){
                        url += "Huebner.Inverter.Windows.zip";
                    }else if(os === "Linux"){
                        url += "Huebner.Inverter.Linux.tgz";
                    }
                    $.notify({
                        icon: "glyphicon glyphicon-download-alt",
                        title: "New Version",
                        message: "Update available <a href='" + url + "'>Download</a> " + data
                    }, {
                        type: 'success'
                    });
                }
            }
        });
    }
};