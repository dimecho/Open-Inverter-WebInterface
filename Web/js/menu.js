var knobValue = 0;
var knobTimer;
var headerRefreshTimer;

$(document).ready(function () {
    alertify.dialog('startInverterMode', function () {
        return {
            setup: function setup() {
                return {
                    buttons: [{
                        text: 'Sine Wave',
                        className: alertify.defaults.theme.ok
                    }, {
                        text: 'Slip Control',
                        className: alertify.defaults.theme.ok
                    }, {
                        text: 'Boost Charger',
                        className: alertify.defaults.theme.cancel
                    }],
                    focus: {
                        //element: 0,
                        select: false
                    },
                    options: {
                        title: '',
                        maximizable: false,
                        resizable: false
                    }
                };
            }
        };
    }, false, 'confirm');

    alertify.dialog('buildEncoder', function () {
        return {
            setup: function setup() {
                return {
                    buttons: [{
                        text: '2D SVG Blueprint',
                        className: alertify.defaults.theme.ok
                    }, {
                        text: '3D Print from SVG',
                        className: alertify.defaults.theme.cancel
                    }],
                    focus: {
                        //element: 0,
                        select: false
                    },
                    options: {
                        title: '',
                        maximizable: false,
                        resizable: false
                    }
                };
            }
        };
    }, false, 'confirm');

    $(".knob").knob({
        //"displayPrevious":true,
        "value": 0,
        change: function change(value) {
            if (value <= knobValue + 5) //Avoid hard jumps
                {
                    //console.log(value);
                    clearTimeout(knobTimer);
                    knobTimer = setTimeout(function () {
                        $.ajax("serial.php?pk=1&name=fslipspnt&value=" + value, { async: false });
                    }, 80);
                    knobValue = value;
                } else {
                console.log("!" + value + ">" + knobValue);
                $(".knob").val(knobValue).trigger('change');
            }
        }
    });
    $(".knob").val(0).trigger('change');

    buildHeader();

    buildTips();

    //buildParameters();

    $(".tooltip1").tooltipster();
    //var instances = $.tooltipster.instancesLatest();
    //console.log(instances);
});

function downloadSnapshot() {
    window.location.href = "/snapshot.php";
};

function uploadSnapshot() {
    $('.fileUpload').trigger('click');
};

function openExternalApp(app) {
    //console.log(app);
    if (app === "inkscape") {
        buildEncoderAlert();
    } else if (app === "openscad") {
        $('.fileSVG').trigger('click');
    } else if (app === "openocd") {
        window.location.href = "/bootloader.php";
    } else if (app === "source") {
        window.location.href = "/compile.php";
    } else if (app === "attiny") {
        window.location.href = "/attiny.php";
    } else {
        $("#progressBar").css("width", "100%");
        $.ajax("open.php?app=" + app);
    }
};

function confirmGCCRemove(e) {
    alertify.confirm("Remove Compiler?", "This will clean up over 500MB of space!\n" + e, function () {
        var notify = $.notify({
            message: "Removing Compiler ..."
        }, {
            type: 'danger'
        });

        $.ajax("install.php?remove=arm", {
            success: function success(data) {
                notify.update({ 'type': 'success', 'message': 'Compiler Removed' });
            }
        });
        $.ajax("install.php?remove=avr");
    }, function () {});
};

function loadJSON(i) {
    var json;

    $.ajax("serial.php?command=json", {
        //$.ajax("test/json.data",{
        async: false,
        //contentType: "application/text",
        beforeSend: function beforeSend(req) {
            req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function success(data) {
            //console.log(data);
            if (i < 4) {
                try {
                    json = JSON.parse(data);
                } catch (e) {
                    i++;
                    json = loadJSON(i);
                }
            } else {
                var title = $("#title h3").empty();
                title.append("Check Serial Connection");
                var connection = $("#connection").show();
            }
        },
        error: function error(xhr, textStatus, errorThrown) {},
        timeout: 8000 // sets timeout to 8 seconds
    });

    return json;
};

function getJSONFloatValue(value) {
    var float = 0;

    $.ajax("serial.php?get=" + value, {
        //$.ajax("test/" + value + ".data",{
        async: false,
        success: function success(data) {
            //console.log(data);
            float = parseFloat(data);
        }
    });
    return float;
};

function getJSONAverageFloatValue(value) {
    var float = 0;

    $.ajax("serial.php?average=" + value, {
        //$.ajax("test/" + value + ".data",{
        async: false,
        success: function success(data) {
            //console.log(data);
            float = parseFloat(data);
        }
    });
    return float;
};

function getErrors() {
    var value = "";

    $.ajax("serial.php?command=errors", {
        //$.ajax("test/errors.data",{
        async: false,
        beforeSend: function beforeSend(req) {
            req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function success(data) {
            //console.log(data);
            value = data;
        }
    });
    return value;
};

function startInverterAlert() {
    if (getJSONFloatValue("potnom") > 20) {
        alertify.alert("High RPM Warning", "Adjust your Potentiometer down to zero before starting Inverter.", function () {
            alertify.message('OK');
        });
    } else {
        alertify.startInverterMode("Inverter Mode", function () {
            startInverter(2);
        }, function () {
            startInverter(1);
        }, function () {
            $.notify({ message:"Not Available"}, {type:'danger'});
        });
    }
};

function startInverter(mode) {

    $.ajax("serial.php?command=start " + mode, {
        //async: false,
        success: function success(data) {
            //console.log(data);

            if (data.indexOf("Inverter started") != -1) {
                $.notify({
                    message: 'Inverter started'
                }, {
                    type: 'success'
                });

                if (mode === 2) {
                    $("#potentiometer").show();
                    $(".collapse").collapse('show');
                }
            } else {
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: 'Error',
                    message: data
                }, {
                    type: 'danger'
                });
            }
        }
    });
};

function stopInverter() {
    $.ajax("serial.php?command=stop", {
        //async: false,
        success: function success(data) {
            //console.log(data);

            if (data.indexOf("Inverter halted") != -1) {
                $.notify({
                    message: 'Inverter Stopped'
                }, {
                    type: 'danger'
                });
            } else {
                $.notify({
                    icon: 'glyphicon glyphicon-warning-sign',
                    title: 'Error',
                    message: data
                }, {
                    type: 'danger'
                });
            }

            $(".collapse").collapse();

            setTimeout(function () {
                $("#potentiometer").hide();
                //location.reload();
                //buildParameters(loadJSON(0));
            }, 1000);
        }
    });
};

function setDefaults() {
    alertify.confirm('', 'This reset all settings back to default.', function () {
        $.ajax("serial.php?command=defaults", {
            //async: false,
            success: function success(data) {
                console.log(data);

                if (data.indexOf("Defaults loaded") != -1) {
                    $.notify({
                        message: 'Inverter reset to Default'
                    }, {
                        type: 'success'
                    });
                } else {
                    $.notify({
                        icon: 'glyphicon glyphicon-warning-sign',
                        title: 'Error',
                        message: data
                    }, {
                        type: 'danger'
                    });
                }

                setTimeout(function () {
                    window.location.href = "/index.php";
                }, 2000);
            }
        });
    }, function () {});
};

function buildHeader() {
    var version = getCookie("version");
    //========================
    if (version === undefined) {
        version = getJSONFloatValue("version");
        setCookie("version", version, 1);
    }
    $("#titleVersion").empty().append("Firmware v" + version);
    //========================
    var opStatus = $("<span>");
    var opmode = getJSONFloatValue("opmode");
    var udc = getJSONFloatValue("udc");
    var udcmin = getJSONFloatValue("udcmin");
    var tmpm = getJSONFloatValue("tmpm");
    var tmphs = getJSONFloatValue("tmphs");
    var speed = getJSONFloatValue("speed");

    var span = $("<span>", { class: "tooltip1" });
    var img = $("<img>", { class: "svg-inject", src: "img/key.svg" });

    if (opmode === 0) {
        span.attr("data-tooltip-content", "<h6>Off</h6>");
        img.addClass("svg-red");
        $("#potentiometer").hide();
    } else if (opmode === 1) {
        if (getJSONFloatValue("din_emcystop") === 1) {
            if (getJSONFloatValue("din_start") === 1) {
                img.addClass("svg-yellow");
                span.attr("data-tooltip-content", "<h6>Pulse Only - Do not leave ON</h6>");
            } else {
                span.attr("data-tooltip-content", "<h6>Running</h6>");
                img.addClass("svg-green");
            }
            $("#potentiometer").hide();
        }
    } else if (opmode === 2) {
        span.attr("data-tooltip-content", "<h6>Manual Mode</h6>");
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
    span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + udc + "V</h6>" });
    img = $("<img>", { class: "svg-inject", src: "img/battery.svg" });
    if (udc > udcmin) {
        img.addClass("svg-green");
    } else {
        img.addClass("svg-red");
    }
    span.append(img);
    opStatus.append(span);
    //========================
    span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + tmpm + "°C</h6>" });
    img = $("<img>", { class: "svg-inject", src: "img/temperature.svg" });
    if (tmpm > 150 || tmphs > 150) {
        img.addClass("svg-red");
        span.append(img);
        opStatus.append(span);
    } else if (tmpm > 100 || tmphs > 100) {
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
    span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + speed + "RPM</h6>" });
    img = $("<img>", { class: "svg-inject", src: "img/speedometer.svg" });
    if (speed > 6000) {
        img.addClass("svg-red");
        span.append(img);
        opStatus.append(span);
    } else if (speed > 3000) {
        img.addClass("svg-yellow");
        span.append(img);
        opStatus.append(span);
    }
    //========================
    if (getJSONFloatValue("din_mprot") != 1) {
        span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>Probably forgot PIN 11 to 12V</h6>" });
        span.append($("<img>", { class: "svg-inject", src: "img/alert.svg" }));
        opStatus.append(span);
    }
    //========================
    var errors = getErrors();
    if (errors.indexOf("Unknown command") == -1 && errors.indexOf("No Errors") == -1) {
        span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + errors + "</h6>" });
        span.append($("<img>", { class: "svg-inject", src: "img/alert.svg" }));
        opStatus.append(span);
    }

    $("#opStatus").empty().append(opStatus);

    var SVGInject = document.querySelectorAll('img.svg-inject');
    SVGInjector(SVGInject);

    headerRefreshTimer = setTimeout(function () {
        buildHeader();
        buildTips();
        $(".tooltip1").tooltipster();
    }, 12000);
};

function buildTips() {
    var show = Math.random() >= 0.5;

    if (show === true) {
        var opStatus = $("#opStatus");
        var span = $("<span>");

        $.ajax("tips.csv", {
            async: false,
            //contentType: "application/text",
            beforeSend: function beforeSend(req) {
                req.overrideMimeType('text/plain; charset=x-user-defined');
            },
            //dataType: 'text',
            success: function success(data) {
                var row = data.split("\n");
                var n = Math.floor(Math.random() * row.length);

                for (var i = 0; i < row.length; i++) {
                    if (i === n) {
                        span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>Tip: " + row[i] + "</h6>" });
                        span.append($("<img>", { class: "svg-inject", src: "img/idea.svg" }));
                        opStatus.append(span);
                        break;
                    }
                }
            },
            error: function error(xhr, textStatus, errorThrown) {}
        });

        opStatus.append(span);
    }
};

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
};

function getCookie(c_name) {
    var i,
        x,
        y,
        ARRcookies = document.cookie.split(";");

    for (var i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
};