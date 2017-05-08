$(document).ready(function()
{
    var safety = getCookie("safety");
    if (safety === undefined) {
        $(".safety").trigger('click');
    }

    $('#parameters').editable({
        selector: 'a',
        url: 'serial.php',
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

			if(getJSONFloatValue("opmode") != "0" && this.id != 'fslipspnt'){
				stopInverter();
				if(i == 0)
					return 'Inverter must not be in operating mode.';
			}

            if(this.id == 'fmin'){
                if(parseFloat($.trim(value)) > parseFloat($("#fslipmin").text()))
                {
                    return 'Should be set below fslipmin';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray($.trim(value), [ '1', '2', '3,', '4', '6']) == -1)
                {
                    return 'Pole pairs = half # of motor poles';
                }
            }else  if(this.id == 'udcmin'){
                if(parseInt($.trim(value)) > parseInt($("#udcmax").text()))
                {
                    return 'Should be below maximum voltage (udcmax)';
                }
            }else  if(this.id == 'udcmax'){
                if(parseInt($.trim(value)) > parseInt($("#udclim").text())){
                    return 'Should be lower than cut-off voltage (udclim)';
                }
            }else  if(this.id == 'udclim'){
                if(parseInt($.trim(value)) <= parseInt($("#udcmax").text())){
                    return 'Should be above maximum voltage (udcmax)';
                }
            }else if(this.id == 'udcsw'){
                if(parseInt($.trim(value)) > parseInt($("#udcmax").text())){
                    return 'Should be below maximum voltage (udcmax)';
                }
			}else if(this.id == 'udcsw'){
                if(parseInt($.trim(value)) > parseInt($("#udcmin").text())){
                    return 'Should be below minimum voltage (udcmin)';
                }
			}else if(this.id == 'fslipmin'){
				if(parseFloat($.trim(value)) <= parseFloat($("#fmin").text())){
					return 'Should be above starting frequency (fmin)';
				}
            /*}else  if(this.id == 'fslipmax'){
                if($.trim(value) / 5 > $("#fslipmin").text())
                {
                    return 'If too high from fslipmin the motor will start to rock violently on startup.';
                }
            }else  if(this.id == 'ocurlim'){
                if($.trim(value) > 0)
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
            console.log("'" + response + "'");

            //if(response === "Set OK\n"){
                //var id = this.id;
                //console.log(this.id);
                
                $.ajax("serial.php?command=save",{
                    //async: false,
                    success: function(data)
                    {
                        //console.log(data);

                        if(data.indexOf("Parameters stored") != -1)
                        {
                            crc32("set " + newValue);
                            $.notify({ message: data },{ type: 'success' });
                        }else{
                            $.notify({ icon: 'glyphicon glyphicon-warning-sign', title: 'Error', message: data },{ type: 'danger' });
                        }
                    }
                });
            //}
        }
    });

    buildParameters();

    crc32("test");
});

function basicChecks(json,name)
{
    var i = 0;
    $.each(json, function()
    {
        if(name[i] === "fweak")
        {
            var udc = getJSONValue(json,name,"udc");
            var udcsw = getJSONValue(json,name,"udcsw");
            if(udc > udcsw) //Get real operating voltage
            {
                if((udc < 30 && this.value > 20) ||
                   (udc < 55 && this.value > 30) ||
                   (udc < 200 && this.value > 100 ) ||
                   (udc < 300 && this.value > 120 ) ||
                   (udc < 400 && this.value > 140 ))
                {
                    $.notify({ message: 'Your "fweak" might be a little too high' }, { type: 'danger' });
                }
            }
        }else if (name[i] === "deadtime" && this.value < 28)
        {
            $.notify({ message: 'IGBT "deadtime" is dangerously fast' }, { type: 'danger' });
        }
        i++;
    });
};

function getJSONValue(json,name,n)
{
    //TODO: make this more efficient

    var i = 0;
    $.each(json, function()
    {
        if(name[i] == n) {
            //console.log(name[i] + ">" + this.value);
            return this.value;
        }
        i++;
    });
};

function buildParameters()
{
    //var length = 0;
    //for(var k in json) if(json.hasOwnProperty(k))    length++;
    
    var json = loadJSON(0);
    
    if(json) //if(Object.keys(json).length > 0)
    {
        var i = 0;
        var name = [];
        for(var k in json)
            name.push(k);

        var menu = $("#parameters").empty().show();
        if(menu)
        {
            //======================
            var parameters = [];
            var description = [];
         
            $.ajax("description.csv",{
                async: false,
                //contentType: "application/text",
                beforeSend: function (req) {
                  req.overrideMimeType('text/plain; charset=x-user-defined');
                },
                //dataType: 'text',
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
            //=================

            var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("Type")));
            var tbody = $("<tbody>");

            menu.append(thead);
            $.each(json, function()
            {
                //console.log(this)

                var tooltip = "";
                var x = parameters.indexOf(name[i]);
                if(x !=-1)
                    tooltip = description[x];
                
                var a = $("<a>", {href:"#", id:name[i], "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":this.unit + " ("+ this.default + ")"}).append(this.value);
                var tr = $("<tr>");
                var td1 = $("<td>", {class:"tooltip1", "data-tooltip-content":"<h5>" + tooltip + "</h5>"}).append(name[i]);
                var td2 = $("<td>").append(a);
                var td3 = $("<td>").append(this.unit.replace("","°"));
       
                tbody.append(tr.append(td1).append(td2).append(td3));

                i++;
            });
            menu.append(tbody);
			
			$(".tooltipstered").tooltipster("destroy");
            $(".tooltip1").tooltipster();

            basicChecks(json,name);
        }
    }
};

function ab2str(buf) {

  return String.fromCharCode.apply(null, new Uint32Array(buf));
};

function str2ab(str) {

  var buf = new ArrayBuffer(str.length*4); // 4 bytes for each char
  var bufView = new Uint32Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

function crc32(data) {

    var data = str2ab(data);

    console.log(data);
    console.log(ab2str(data));
    console.log(data.byteLength);

    var crc = 0xffffffff;
    for (var i = 0; i < data.byteLength; i++)
    {
        crc = crc32_word(crc, data[i]);
    }

    console.log(crc); //Integer value
    console.log(Math.abs(crc).toString(16).toUpperCase()); //HEX value

    return crc;
};

function crc32_word(crc, data) {

    crc = crc ^ data;
    for(var i = 0; i < 32; i++)
    {
        if (crc & 0x80000000)
        {
            crc = ((crc << 1) ^ 0x04C11DB7) & 0xffffffff; //Polynomial used in STM32
        }else{
            crc = (crc << 1) & 0xffffffff;
        }
    }
    return crc;
};