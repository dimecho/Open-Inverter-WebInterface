$(document).ready(function()
{
    alertify.dialog('startInverterMode', function() {
      return {
        setup: function() {
          return {
            buttons: [{
              text: 'Wave Generator',
              key: 13 /*keys.ENTER*/ ,
              className: alertify.defaults.theme.ok,
            }, {
              text: 'Slip Control',
              key: 27 /*keys.ESC*/ ,
              invokeOnClose: false, // <== closing won't invoke this
              className: alertify.defaults.theme.ok,
            }],
            focus: {
              element: 0,
              select: false
            },
            options: {
              title: '',
              maximizable: false,
              resizable: false
            },
          };
        }
      }
    }, false, 'confirm');

    buildParameters(loadJSON(0));
    showErrors();
    checkGCC_ARM();

    $("[rel=tooltip]").tooltip();
});

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

function loadJSON(i)
{
    var json;

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
                    json = JSON.parse(data.slice(5)); //cut out command 'json....' from beginning
                } catch (e) {
                    i++;
                    json = loadJSON(i);
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
    
    return json;
}

function saveChanges(span)
{
    $.ajax("serial.php?save=1",{
        success: function(data)
        {
            //console.log(data);
            span.removeClass('label-warning');

            if(data.indexOf("Parameters stored") != -1)
            {
                span.addClass('label-success');
                span.text("saved");
            }else{
                span.addClass('label-important');
                span.text("error");
            }
        }
    });
}

function startInverterAlert()
{
    alertify.startInverterMode("Which mode will it be?",
      function() {
        startInverter(2);
      },
      function() {
        startInverter(1);
      }
    );
}

function startInverter(mode)
{
    $.ajax("serial.php?start=" + mode,{
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
            buildMenu(loadJSON(0));

            setTimeout( function ()
            {
                span.hide();
            },1200);
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
            buildMenu(loadJSON(0));

            setTimeout( function ()
            {
                span.hide();
            },1200);
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
    alertify.confirm('', 'This reset all settings back to default.', function()
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
                    setTimeout( function ()
                    {
                        window.location.href = "/index.php";
                    },1500);
                }else{
                    span.addClass('label-important');
                    span.text('error');
                }
            }
        });
    }, function(){});
}

function buildHeader(json, name)
{
    var i = 0;
    $.each(json, function()
    {
        if(name[i] == "version")
        {
            var version = $("#titleVersion").empty();
            version.append("Inverter Console v" + this.value);
        }
        else if(name[i] == "opmode")
        {
            var opmode = $("#titleOperation").empty();
            opmode.removeClass('label-success');
            opmode.removeClass('label-warning');
            opmode.removeClass('label-important');
            opmode.addClass('label');
            if(this.value == 0)
            {
                opmode.addClass('label-important');
                opmode.append("Off");
            }
            else if(this.value == 1)
            {
                opmode.addClass('label-warning');
                opmode.append("Debug");
            }
            else if(this.value == 2)
            {
                opmode.addClass('label-success');
                opmode.append("Running");
            }
        }
        i++;
    });
}

function buildParameters(json)
{
    //var length = 0;
    //for(var k in json) if(json.hasOwnProperty(k))    length++;

    if(Object.keys(json).length > 0)
    {
        var i = 0;
        var name = [];
        for(var k in json)
            name.push(k);

        buildHeader(json, name);

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

            var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("Type")));
            var tbody = $("<tbody>");

            menu.append(thead);
            $.each(json, function()
            {
                console.log(this)

                var tooltip = "";
                var x = parameters.indexOf(name[i]);
                if(x !=-1)
                    tooltip = description[x];
                
                var a = $("<a>", { href:"#", id:name[i], "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":this.unit + " ("+ this.default + ")"}).append(this.value);
                var tr = $("<tr>");
                var td1 = $("<td>", { rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h5>" + tooltip + "</h5>"}).append(name[i]);
                var td2 = $("<td>").append(a);
                var td3 = $("<td>").append(this.unit);
       
                tbody.append(tr.append(td1).append(td2).append(td3));
                
                i++;
            });
            menu.append(tbody);
        }
    }
}