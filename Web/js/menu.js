var knobValue = 0;
var knobTimer;

$(document).ready(function()
{
    alertify.dialog('startInverterMode', function() {
      return {
        setup: function() {
          return {
            buttons: [{
              text: 'Wave Generator',
              className: alertify.defaults.theme.ok,
            }, {
              text: 'Slip Control',
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

    alertify.dialog('buildEncoder', function() {
      return {
        setup: function() {
          return {
            buttons: [{
              text: '2D SVG Blueprint',
              className: alertify.defaults.theme.ok,
            }, {
              text: '3D Print from SVG',
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


    $(".knob").knob({
        //"displayPrevious":true,
        "value":0,
        change : function (value) {
            if(value <= knobValue+5) //Avoid hard jumps
            {
                //console.log(value);
                clearTimeout(knobTimer);
                knobTimer = setTimeout(function () {
                    $.ajax("serial.php?pk=1&name=fslipspnt&value=" + value,{async: false});
                },80);
                knobValue = value;
            }else{
                console.log("!" + value + ">" + knobValue);
                $(".knob").val(knobValue).trigger('change');
            }
        },
        /*
        release : function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);

            $.ajax("serial.php?pk=1&name=fslipspnt&value=" + value);
        },
        cancel : function () {
            console.log("cancel : ", this);
        },
        */
        /*
        format : function (value) {
            return value + '%';
        },*/
    });
    $(".knob").val(0).trigger('change');

    buildParameters(loadJSON(0));
    
    $(".tooltip1").tooltipster();
    //var instances = $.tooltipster.instancesLatest();
    //console.log(instances);
});

function downloadSnapshot()
{
    window.location.href = "/snapshot.php";
}

function uploadSnapshot()
{
    $('.fileUpload').trigger('click');
}

function openExternalApp(app)
{
    //console.log(app);
    if(app === "inkscape"){
        buildEncoderAlert();
    }else if(app === "openscad"){
        $('.fileSVG').trigger('click');
    }else if(app === "openocd"){
        window.location.href = "/bootloader.php";
    }else if(app === "source"){
        window.location.href = "/compile.php";
    }else if(app === "attiny"){
        window.location.href = "/attiny.php";
    }else{
        $("#progressBar").css("width","100%");
        $.ajax("open.php?app=" + app);
    }
}

function confirmGCCRemove(e)
{
    alertify.confirm("Remove Compiler?", "This will clean up over 500MB of space!\n" + e, function()
    {
        var notify = $.notify({
            message: "Removing Compiler ...",
        },{
            type: 'danger'
        });
        
        $.ajax("install.php?remove=arm",{
            success: function(data)
            {
                notify.update({'type': 'success', 'message': 'Compiler Removed'});
            }
        });
        $.ajax("install.php?remove=avr");
    }, function(){});
}

function loadJSON(i)
{
    var json;

    $.ajax("serial.php?command=json",{
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
                    json = JSON.parse(data);
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
        },
        timeout: 8000 // sets timeout to 8 seconds
    });
    
    return json;
}

function getJSONFloatValue(value) {
    var float = 0;

    $.ajax("serial.php?get=" + value,{
    //$.ajax("test/" + value + ".data",{
        async: false,
        success: function(data)
        {
			//console.log(data);
            float = parseFloat(data);
        }
    });
    return float;
}

function getErrors()
{
   var value = "";

    $.ajax("serial.php?command=errors",{
    //$.ajax("test/errors.data",{
        async: false,
        beforeSend: function (req) {
          req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function(data)
        {
            //console.log(data);
            value = data;
        }
    });
    return value;
}

function startInverterAlert()
{
    if(getJSONFloatValue("potnom") > 20)
    {
        alertify.alert("High RPM Warning","Adjust your Potentiometer down to zero before starting Inverter.", function(){
            alertify.message('OK');
        });
    }else{
        alertify.startInverterMode("Which mode will it be?", function(){
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
    $.ajax("serial.php?command=start " + mode,{
        async: false,
        success: function(data)
        {
            //console.log(data);

            if(data.indexOf("Inverter started") != -1)
            {
                $.notify({
                    message: 'Inverter started',
                },{
                    type: 'success'
                });

                if(mode === 2)
                {
                    $("#potentiometer").show();
                    $(".collapse").collapse('show');
                }
            }else{
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: 'Error',
                    message: data,
                },{
                    type: 'danger'
                });
            }
        }
    });
}

function stopInverter()
{
    $.ajax("serial.php?command=stop",{
        async: false,
        success: function(data)
        {
            //console.log(data);
           
            if(data.indexOf("Inverter halted") != -1)
            {
                $.notify({
                    message: 'Inverter Stopped',
                },{
                    type: 'danger'
                });
            }else{
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: 'Error',
                    message: data,
                },{
                    type: 'danger'
                });
            }

            $(".collapse").collapse();

            setTimeout( function ()
            {
                $("#potentiometer").hide();
                //location.reload();
                //buildParameters(loadJSON(0));
            },1000);
        }
    });
}

function setDefaults()
{
    alertify.confirm('', 'This reset all settings back to default.', function()
    {
        $.ajax("serial.php?command=defaults",{
            async: false,
            success: function(data)
            {
                console.log(data);

                if(data.indexOf("Defaults loaded") != -1)
                {
                    $.notify({
                        message: 'Inverter reset to Default',
                    },{
                        type: 'success'
                    });
                }else{
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: 'Error',
                        message: data,
                    },{
                        type: 'danger'
                    });
                }

                setTimeout( function (){
                        window.location.href = "/index.php";
                },2000);
            }
        });
    }, function(){});
}

function buildHeader(json)
{
    var opStatus = $("#opStatus");
    //var div = $("<div>").height(32);
    var span = $("<span>");
    var img = $("<img>");

    //========================
    $("#titleVersion").empty().append("Firmware v" + json.version.value);
    //========================
    span = $("<span>", {class:"tooltip1"});
    img = $("<img>", {class:"svg-inject", src:"img/key.svg"});
    if(json.opmode.value === 0)
    {
        span.attr("data-tooltip-content","<h6>Off</h6>");
        img.addClass("svg-red");
        $("#potentiometer").hide();
    }
    else if(json.opmode.value === 1 && json.din_emcystop.value === 1)
    {
        if(json.din_start.value === 1)
        {
            img.addClass("svg-yellow");
            span.attr("data-tooltip-content","<h6>Pulse Only - Do not leave ON</h6>");
        }else{
            span.attr("data-tooltip-content","<h6>Running</h6>");
            img.addClass("svg-green");
        }
        $("#potentiometer").hide();
    }
    else if(json.opmode.value === 2)
    {
        span.attr("data-tooltip-content","<h6>Manual Mode</h6>");
        img.addClass("svg-green");
        $("#potentiometer").show();
    }
    span.append(img);
    opStatus.append(span);
    //========================
    /*
    if(json.ocurlim.value > 0){
        div.append($("<img>", {src:"img/amperage.svg"}));
    }
    opStatus.append(div);
    */
    //========================
    span = $("<span>", {class:"tooltip1", "data-tooltip-content":"<h6>" + json.udc.value+ "V</h6>"});
    img = $("<img>", {class:"svg-inject", src:"img/battery.svg"});
    if(json.udc.value > json.udcmin.value){
        img.addClass("svg-green");
    }else{
        img.addClass("svg-red");
    }
    span.append(img);
    opStatus.append(span);
    //========================
    span = $("<span>", {class:"tooltip1", "data-tooltip-content":"<h6>" + json.tmpm.value + "°C</h6>"});
    img = $("<img>", {class:"svg-inject", src:"img/temperature.svg"})
    if(json.tmpm.value > 150 || json.tmphs.value > 150){
        img.addClass("svg-red");
        span.append(img);
        opStatus.append(span);
    }else if(json.tmpm.value > 100 || json.tmphs.value > 100){
        img.addClass("svg-yellow");
        span.append(img);
        opStatus.append(span);
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
    span = $("<span>", {class:"tooltip1", "data-tooltip-content":"<h6>" + json.speed.value + "RPM</h6>"});
    img = $("<img>", {class:"svg-inject", src:"img/speedometer.svg"});
    if(json.speed.value > 6000){
        img.addClass("svg-red");
        span.append(img);
        opStatus.append(span);
    }else if(json.speed.value > 3000){
        img.addClass("svg-yellow");
        span.append(img);
        opStatus.append(span);
    }
    //========================
    if(json.din_mprot.value != 1)
    {
        span = $("<span>", {class:"tooltip1", "data-tooltip-content":"<h6>Probably forgot PIN 11 to 12V</h6>"});
        span.append($("<img>", {class:"svg-inject", src:"img/alert.svg"}));
        opStatus.append(span);
    }
    //========================
    var errors = getErrors();
    if(errors.indexOf("Unknown command") == -1 && errors.indexOf("No Errors") == -1)
    {
        span = $("<span>", {class:"tooltip1", "data-tooltip-content":"<h6>" + errors + "</h6>"});
        span.append($("<img>", {class:"svg-inject", src:"img/alert.svg"}));
        opStatus.append(span);
    }

    var SVGInject = document.querySelectorAll('img.svg-inject');
    SVGInjector(SVGInject);
}

function buildTips()
{
    var show = Math.random() >= 0.5;

    var opStatus = $("#opStatus");
    var span = $("<span>");

    if(show == true)
    {
        $.ajax("tips.csv",{
            async: false,
            //contentType: "application/text",
            beforeSend: function (req) {
              req.overrideMimeType('text/plain; charset=x-user-defined');
            },
            //dataType: 'text',
            success: function(data)
            {
                var row = data.split("\n");
                var n = Math.floor(Math.random() * (row.length));

                for (var i = 0; i < row.length; ++i)
                {
                    if(i == n)
                    {
                        span = $("<span>", {class:"tooltip1", "data-tooltip-content":"<h6>Tip: " + row[i] + "</h6>"});
                        span.append($("<img>", {class:"svg-inject", src:"img/idea.svg"}));
                        opStatus.append(span);
                        break;
                    }
                }
            },
            error: function(xhr, textStatus, errorThrown){
            }
        });
    }

    span = $("<a>", {href:"#", onClick:"window.location.reload()"});
    span.append($("<img>", {class:"svg-inject", src:"img/refresh.svg"}));
    opStatus.append(span);
}

function buildParameters(json)
{
    //var length = 0;
    //for(var k in json) if(json.hasOwnProperty(k))    length++;
    
    $("#opStatus").empty();
    
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
                
                var a = $("<a>", {href:"#", id:name[i], "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":this.unit + " ("+ this.default + ")"}).append(this.value);
                var tr = $("<tr>");
                var td1 = $("<td>", {class:"tooltip1", "data-tooltip-content":"<h5>" + tooltip + "</h5>"}).append(name[i]);
                var td2 = $("<td>").append(a);
                var td3 = $("<td>").append(this.unit.replace("","°"));
       
                tbody.append(tr.append(td1).append(td2).append(td3));
                
                i++;
            });
            menu.append(tbody);
        }
    }

    buildTips();
}