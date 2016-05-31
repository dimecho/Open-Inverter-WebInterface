
function loadJSON(i)
{
    $.ajax("serial.php?json=1",{
    //$.ajax("test/json.data",{
        async: false,
        //contentType: "application/text",
        beforeSend: function (req) {
          req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function(data)
        {
            //console.log(data);
            if(i < 4)
            {
                try {
                    var json = JSON.parse(data.slice(5)); //cut out command 'json....' from beginning
                    buildMenu(json); 
                } catch (e) {
                    i++;
                    loadJSON(i);
                }
            }else{
                var title = $("#title h3").empty();
                title.append("Check Serial Connection");
                var connection = $("#connection").show();
            }
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
}

function checkGCC_ARM()
{
    $.ajax("gcc_arm.php",{
        async: false,
        success: function(data)
        {
            if(data == "1")
            {
                var menu = $("#gcc").show();
            }
        }
    });
}

function buildMenu(json)
{
    //var length = 0;
    //for(var k in json) if(json.hasOwnProperty(k))    length++;

    var i = 0;
    var name = [];
    for(var k in json)
        name.push(k);

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

            for (var i = 0; i < row.length; ++i)
            {
                var split = row[i].split(",");
                var d;

                if(split.length > 6){
                    for (var c = 5; c < split.length; ++c)
                        d += split[c];
                }else{
                    d = split[5];
                }

                parameters.push(split[0]);
                description.push(d);
            }
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
    //=================
    var menu = $("#parameters").empty().show();
    var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("Type")))
    var tbody = $("<tbody>");
    menu.append(thead);

    $.each(json, function()
    {
        console.log(this)

        if(name[i] == "version")
        {
            var title = $("#title h3").empty();
            title.append("Inverter Console v" + this.value);
        }
        else
        {
            var tooltip = "";
            var x = parameters.indexOf(name[i]);
            if(x !=-1)
                tooltip = description[x];

            var a = $("<a>", { href:"#", id:name[i], "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":this.unit + " ("+ this.default + ")"}).append(this.value);
            var tr = $("<tr>");
            var td1 = $("<td>", { class:"tooltip-custom", title:tooltip}).append(name[i]);
            var td2 = $("<td>").append(a);
            var td3 = $("<td>").append(this.unit);
   
            tbody.append(tr.append(td1).append(td2).append(td3));
        }
        i++;
    });
    menu.append(tbody);

    showErrors();
}

function startInverter()
{
    $.ajax("serial.php?start=2",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            span.removeClass('label-success');
            span.removeClass('label-warning');
            span.removeClass('label-important');
            span.addClass('label');

            if(data.indexOf("Inverter started") != -1)
            {
                span.addClass('label-success');
                span.text('started');
            }else{
                span.addClass('label-important');
                span.text('error');
            }
        }
    });
}

function stopInverter()
{
    $.ajax("serial.php?stop=1",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            span.removeClass('label-success');
            span.removeClass('label-warning');
            span.removeClass('label-important');
            span.addClass('label');
           
            if(data.indexOf("Inverter halted") != -1)
            {
                span.addClass('label-warning');
                span.text('stopped');
            }else{
                span.addClass('label-important');
                span.text('error');
            }
        }
    });
}

function showErrors()
{
    $.ajax("serial.php?errors=1",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            if(data.indexOf("error") != -1)
            {
                var icon = $("<span>", { class:"tooltip-custom glyphicon glyphicon-qrcode", title:data});
                span.append(icon);
            }
        }
    });
}

function setDefaults()
{
    $.ajax("serial.php?default=1",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            span.removeClass('label-success');
            span.removeClass('label-warning');
            span.removeClass('label-important');
            span.addClass('label');

            if(data.indexOf("default") != -1)
            {
                span.addClass('label-success');
                span.text('everything reset to default');
            }else{
                span.addClass('label-important');
                span.text('error');
            }
        }
    });
}