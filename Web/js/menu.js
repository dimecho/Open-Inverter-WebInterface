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
              className: alertify.defaults.theme.cancel,
            }],
            focus: {
              //element: 0,
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
    checkGCC_ARM();
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

function getJSONFloatValue(value) {
    var float = 0;

    $.ajax("serial.php?i=" + value,{
    //$.ajax("test/" + value + ".data",{
        async: false,
        beforeSend: function (req) {
          req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function(data)
        {
            float = parseFloat(data.replace("get " + value + "\n",""));
        }
    });
    return float;
}

function getErrors()
{
   var value = "";

    $.ajax("serial.php?errors=1",{
    //$.ajax("test/errors.data",{
        async: false,
        beforeSend: function (req) {
          req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function(data)
        {
            console.log(data);
            value = data.replace("errors\n","");
        }
    });
    return value;
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
    if(getJSONFloatValue("potnom") > 20)
    {
        alertify.alert("High RPM Warning","Adjust your Potentiometer down to zero before starting Inverter.", function(){
            alertify.message('OK');
        });
    }else{
        alertify.startInverterMode("Which mode will it be?",
          function() {
            startInverter(2);
          },
          function() {
            startInverter(1);
          }
        );
    }
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
            
            setTimeout( function ()
            {
                span.hide();
                location.reload(); 
                //buildParameters(loadJSON(0));
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

            setTimeout( function ()
            {
                span.hide();
                location.reload();
                //buildParameters(loadJSON(0));
            },1200);
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

                setTimeout( function ()
                {
                    span.hide();
                    location.reload();
                    //buildParameters(loadJSON(0));
                },1200);
            }
        });
    }, function(){});
}

function buildHeader(json)
{
    var opStatus = $("#opStatus").empty();
    var div = $("<div>").height(32);
    var span = $("<span>");
    var img = $("<img>");

    //========================
    $("#titleVersion").empty().append("Inverter Console v" + json.version.value);
    //========================
    span = $("<span>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true"});
    img = $("<img>", {class:"svg-inject", src:"img/key.svg"});
    if(json.opmode.value === 0)
    {
        span.attr("data-title","<h6>OFF</h6>");
        img.addClass("svg-red");
    }
    else if(json.opmode.value === 1 && json.din_emcystop.value === 1)
    {
        if(json.din_start.value === 1)
        {
            img.addClass("svg-yellow");
            span.attr("data-title","<h6>Pulse Only - Do not leave ON</h6>");
        }else{
            span.attr("data-title","<h6>Running</h6>");
            img.addClass("svg-green");
        }
    }
    else if(json.opmode.value === 2)
    {
        span.attr("data-title","<h6>Manual Mode</h6>");
        img.addClass("svg-green");
    }
    span.append(img);
    div.append(span);
    //========================
    /*
    if(json.ocurlim.value > 0){
        div.append($("<img>", {src:"img/amperage.svg"}));
    }
    opStatus.append(div);
    */
    //========================
    span = $("<span>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h6>" + json.udc.value+ "</h6>"});
    img = $("<img>", {class:"svg-inject", src:"img/battery.svg"});
    if(json.udc.value > json.udcmin.value){
        img.addClass("svg-green");
    }else{
        img.addClass("svg-red");
    }
    span.append(img);
    div.append(span);
    //========================
    span = $("<span>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h6>" + json.tmpm.value + "</h6>"});
    img = $("<img>", {class:"svg-inject", src:"img/temperature.svg"})
    if(json.tmpm.value > 150 || json.tmphs.value > 150){
        img.addClass("svg-red");
        span.append(img);
        div.append(span);
    }else if(json.tmpm.value > 100 || json.tmphs.value > 100){
        img.addClass("svg-yellow");
        span.append(img);
        div.append(span);
    }
    //========================
    /*
    if(json.deadtime.value < 30){
        div.append($("<img>", {class:"svg-inject svg-red", src:"img/magnet.svg", title:"deadtime"}));
    }else if(this.value < 60){
        div.append($("<img>", {class:"svg-inject svg-yellow", src:"img/magnet.svg"}));
    }
    opStatus.append(div);
    */
    //========================
    span = $("<span>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h6>" + json.speed.value + "</h6>"});
    img = $("<img>", {class:"svg-inject", src:"img/speedometer.svg"});
    if(json.speed.value > 6000){
        img.addClass("svg-red");
        span.append(img);
        div.append(span);
    }else if(json.speed.value > 3000){
        img.addClass("svg-yellow");
        span.append(img);
        div.append(span);
    }
    //========================
    if(json.din_mprot.value != 1)
    {
        span = $("<span>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h6>Probably forgot PIN 11 to 12V</h6>"});
        span.append($("<img>", {class:"svg-inject", src:"img/alert.svg"}));
        div.append(span);
    }
    //========================
    var errors = getErrors();
    if(errors.indexOf("Unknown command") == -1 && errors.indexOf("No Errors") == -1)
    {
        span = $("<span>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h6>" + errors + "</h6>"});
        span.append($("<img>", {class:"svg-inject", src:"img/alert.svg"}));
        div.append(span);
    }
    
    opStatus.append(div);

    var SVGInject = document.querySelectorAll('img.svg-inject');
    SVGInjector(SVGInject);
}

function buildParameters(json)
{
    //var length = 0;
    //for(var k in json) if(json.hasOwnProperty(k))    length++;

    if(json) //if(Object.keys(json).length > 0)
    {
        var i = 0;
        var name = [];
        for(var k in json)
            name.push(k);

        buildHeader(json);

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
                //console.log(this)

                var tooltip = "";
                var x = parameters.indexOf(name[i]);
                if(x !=-1)
                    tooltip = description[x];
                
                var a = $("<a>", { href:"#", id:name[i], "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":this.unit + " ("+ this.default + ")"}).append(this.value);
                var tr = $("<tr>");
                var td1 = $("<td>", { rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<h5>" + tooltip + "</h5>"}).append(name[i]);
                var td2 = $("<td>").append(a);
                var td3 = $("<td>").append(this.unit.replace("","°"));
       
                tbody.append(tr.append(td1).append(td2).append(td3));
                
                i++;
            });
            menu.append(tbody);
        }
    }
}