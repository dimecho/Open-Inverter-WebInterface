$(document).ready(function()
{
    $('#parameters').editable({
        selector: 'a',
        url: '/serial.php',
        mode: 'popup',
        pk: '1',
        showbuttons: true,
        ajaxOptions: {
            type: 'get',
            async: false,
            //type: 'put',
            //dataType: 'json'
        },
        validate: function(value) {

			if(getJSONFloatValue('opmode') > 0 && this.id != 'fslipspnt'){
				stopInverter();
				return 'Inverter must not be in operating mode.';
			}

            if (isInt(parseInt(value)) == false && isFloat(parseFloat(value)) == false){
                return 'Value must be a number';
            }

            if(this.id == 'fmin'){
                if(parseFloat(value) > parseFloat($('#fslipmin').text()))
                {
                    return 'Should be set below fslipmin';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray(parseInt(value), [ 1, 2, 3, 4, 5]) == -1)
                {
                    return 'Pole pairs = half # of motor poles';
                }
            }else  if(this.id == 'udcmin'){
                if(parseInt(value) > parseInt($("#udcmax").text()))
                {
                    return 'Should be below maximum voltage (udcmax)';
                }
            }else  if(this.id == 'udcmax'){
                if(parseInt(value) > parseInt($("#udclim").text())){
                    return 'Should be lower than cut-off voltage (udclim)';
                }
            }else  if(this.id == 'udclim'){
                if(parseInt(value) <= parseInt($("#udcmax").text())){
                    return 'Should be above maximum voltage (udcmax)';
                }
            }else if(this.id == 'udcsw'){
                if(parseInt(value) > parseInt($("#udcmax").text())){
                    return 'Should be below maximum voltage (udcmax)';
                }
			}else if(this.id == 'udcsw'){
                if(parseInt(value) > parseInt($("#udcmin").text())){
                    return 'Should be below minimum voltage (udcmin)';
                }
			}else if(this.id == 'fslipmin'){
				if(parseFloat(value) <= parseFloat($('#fmin').text())){
					return 'Should be above starting frequency (fmin)';
				}
            /*}else  if(this.id == 'fslipmax'){
                if(value / 5 > $("#fslipmin").text())
                {
                    return 'If too high from fslipmin the motor will start to rock violently on startup.';
                }
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
                
                $.ajax("/serial.php?command=save",{
                    //async: false,
                    success: function(data)
                    {
                        //console.log(data);

                        if(data.indexOf("Parameters stored") != -1)
                        {
                            //TODO: CRC32 check on entire params list

                            $.notify({ message: data },{ type: 'success' });
                        }else{
                            $.notify({ icon: 'glyphicon glyphicon-warning-sign', title: 'Error', message: data },{ type: 'danger' });
                        }
                    }
                });
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

function isInt(n){
    return Number(n) === n && n % 1 === 0;
};

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
};

function basicChecks(json)
{
	var fweak = json["fweak"].value;
	var fslipmax = json["fslipmax"].value;
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
	if (deadtime < 28) {

		$.notify({ message: 'IGBT "deadtime" is dangerously fast' }, { type: 'danger' });
	}
};

function buildParameters()
{
	var parameters = [];
	var description = [];
	
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
		var menu = $("#parameters").empty();
		var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("Type")));
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

            if(tooltip != "")
            {
                tr.attr("data-toggle", "tooltip");
                tr.attr("data-html", true);
                tr.attr("title", "<h6>" + tooltip + "</h6>");
            }
			var td1 = $("<td>").append(key);
			var td2 = $("<td>").append(a);
			var td3 = $("<td>").append(json[key].unit.replace("","°"));
   
			tbody.append(tr.append(td1).append(td2).append(td3));
		};
		menu.show();
		
        $('[data-toggle="tooltip"]').tooltip();

		basicChecks(json);
    }
    
    checkUpdates();
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