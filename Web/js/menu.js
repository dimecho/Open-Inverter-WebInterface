var knobValue = 0;
var knobTimer;
//var TipRefreshTimer;

$(document).ready(function () {

    //Unknown command sequence
    getJSONFloatValue("hello");

    alertify.dialog('startInverterMode', function () {
        return {
            setup: function setup() {
                return {
                    buttons: [{
                        text: '(1) Start Auto',
                        className: alertify.defaults.theme.ok
                    },{
                        text: '(2) Manual Run',
                        className: alertify.defaults.theme.ok
                    }, {
                        text: '(5) Sine Wave',
                        className: alertify.defaults.theme.ok
                    }, {
                        text: '(3) Boost',
                        className: alertify.defaults.theme.cancel
                    }, {
                        text: '(4) Buck',
                        className: alertify.defaults.theme.cancel
                    }],
                    focus: {
                        //element: 0,
                        select: false
                    },
                    options: {
                        title: 'Inverter Mode',
                        maximizable: false,
                        resizable: false,
                        autoReset: true
                    }
                };
            },
            callback:function(closeEvent){

                //0=Off, 1=Run, 2=ManualRun, 3=Boost, 4=Buck, 5=Sine, 6=AcHeat
                if (getJSONFloatValue("potnom") > 20) {
                    alertify.alert("High RPM Warning", "Adjust your Potentiometer down to zero before starting Inverter.", function () {
                        alertify.message('OK');
                    });
                } else {
                    if(closeEvent.index === 0) {
                        startInverter(1);
                    }else if(closeEvent.index === 1) {
                        startInverter(2);
                    }else if(closeEvent.index === 2) {
                        startInverter(5);
                    }else if(closeEvent.index === 3) {
                        $.notify({ message: "Experimental Area" }, { type: 'danger' });
                        startInverter(3);
                        sendCommand("chargemode", 3, false, true);
                    }else if(closeEvent.index === 4) {
                        $.notify({ message: "Experimental Area" }, { type: 'danger' });
                        startInverter(4);
                        sendCommand("chargemode", 4, false, true);
                    }

                    if(closeEvent.index === 2 || closeEvent.index === 3) {
                        if(getJSONFloatValue("chargecur") === 0) {
                            alertify.prompt("Current Limit", "Enter Charge Current Limit (A)", "", function (event, input) {
                                sendCommand("chargecur", input, true, true);
                            }, function () {});
                        }
                    }
                }
            },
            hooks: {
                onshow: function() {
                    //console.log(this);
                    this.elements.dialog.style.maxWidth = 'none';
                    this.elements.dialog.style.width = '620px';
                }
            }
        };
    }, false, 'confirm');

    $(".knob").knob({
        "displayPrevious":true,
        "value": 0,
        change: function change(value) {
            if (value <= knobValue + 5) { //Avoid hard jumps
                //console.log(value);
                clearTimeout(knobTimer);
                knobTimer = setTimeout(function () {
                    sendCommand("fslipspnt", value);
                }, 80);
                knobValue = value;
            } else {
                console.log("!" + value + ">" + knobValue);
                $(".knob").val(knobValue).trigger('change');
            }
        }
    });
    
    $(".knob").val(0).trigger('change');
	
	/*
    TipRefreshTimer=setTimeout(function () {
		clearTimeout(TipRefreshTimer);
        buildTips();
    }, 1000);
	*/
    
    checkUpdates();
});

function checkSoftware(app){

    $.ajax("/install.php?check=" + app, {
        success: function success(data) {
            console.log(data);
            eval(data);
        }
    });
};

function sendCommand(cmd, value, save, notify) {

    $.ajax("/serial.php?pk=1&name=" + cmd + "&value=" + value, { async: false });
    if(save)
        $.ajax("/serial.php?command=save"); //don't forget to save
    if(notify)
        $.notify({ message: cmd + "=" + value}, { type: "success" });
};

function downloadSnapshot() {
    window.location.href = "/snapshot.php";
};

function uploadSnapshot() {
    $('.fileUpload').trigger('click');
};

function openExternalApp(app) {

    //console.log(app);
    
    if (app === "openscad") {
        $('.fileSVG').trigger('click');
    } else if (app === "openocd") {
        window.location.href = "/bootloader.php";
    } else if (app === "source") {
        window.location.href = "/compile.php";
    } else if (app === "attiny") {
        window.location.href = "/attiny.php";
    } else {
        $.ajax("open.php?app=" + app);
    }
};

function loadJSON() {

    var json;

    $.ajax("/serial.php?command=json", {
        async: false,
        cache: false,
        timeout: 8000, // timeout 8 seconds
        type: 'GET',
        //contentType: "application/text",
        success: function success(data) {
            //console.log(data);
            if(data === "") {
                var title = $("#title h3").empty();
                title.append("Check Serial Connection");
                var connection = $("#connection").show();
            }else{
                json = JSON.parse(data);
            }
        },
        error: function error(xhr, textStatus, errorThrown) {}
    });

    return json;
};

function checkUpdates() {

    var check = Math.random() >= 0.5;
    if (check === true) {
        $.ajax("/update.php", {
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

function getJSONFloatValue(value) {
    var f = 0;
    $.ajax("/serial.php?get=" + value, {
        async: false,
        success: function success(data) {
            f = parseFloat(data);
            if(isNaN(f))
                f = 0;
        }
    });
    //console.log(f);
    return f;
};

function getJSONAverageFloatValue(value,c) {
    if(!c)
        c = "average"; //median
    var f = 0;
    $.ajax("/serial.php?" + c + "=" + value, {
        async: false,
        success: function success(data) {
            f = parseFloat(data);
        }
    });
    //console.log(f);
    return f;
};

function startInverter(mode) {

    $.ajax("/serial.php?command=start " + mode, {
        async: false,
        success: function success(data) {
            //console.log(data);
            if (data.indexOf("started") != -1) {
                $.notify({ message: "Inverter started" }, { type: "success" });
                if (mode === 2 || mode === 5) {
                    $("#potentiometer").show();
                    $(".collapse").collapse('show');
                }
            } else {
                $.notify({
                    icon: "glyphicon glyphicon-warning-sign",
                    title: "Error",
                    message: data
                }, {
                    type: "danger"
                });
            }
        }
    });
};

function stopInverter() {

    $.ajax("/serial.php?command=stop", {
        async: false,
        success: function success(data) {
            //console.log(data);
            if (data.indexOf("halted") != -1) {
                $.notify({ message: "Inverter Stopped"}, { type: "danger" });
                sendCommand("chargemode", "0", false, false);
            } else {
                $.notify({
                    icon: "glyphicon glyphicon-warning-sign",
                    title: "Error",
                    message: data
                }, {
                    type: "danger"
                });
            }
            $(".collapse").collapse();

            setTimeout(function () {
                $("#potentiometer").hide();
                //location.reload();
            }, 1000);
        }
    });
};

function setDefaults() {

    alertify.confirm('', 'This reset all settings back to default.', function () {
        $.ajax("/serial.php?command=defaults", {
            async: false,
            success: function success(data) {
                console.log(data);

                if (data.indexOf("Defaults loaded") != -1) {
                    $.notify({ message: "Inverter reset to Default" }, { type: "success" });
                } else {
                    $.notify({
                        icon: "glyphicon glyphicon-warning-sign",
                        title: "Error",
                        message: data
                    }, {
                        type: "danger"
                    });
                }

                setTimeout(function () {
                    window.location.href = "/index.php";
                }, 2000);
            }
        });
    }, function () {});
};

function buildTips() {

    var show = Math.random() >= 0.5;

    if (show === true) {

        var opStatus = $("#opStatus");
        var span = $("<span>");

        $.ajax("tips.csv", {
            //async: false,
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
                $(".tooltipstered").tooltipster("destroy");
                $(".tooltip1").tooltipster();
            },
            error: function error(xhr, textStatus, errorThrown) {}
        });
    }
};

function deleteCookie(name, path, domain) {

  if(getCookie(name)) {
    document.cookie = name + "=" +
      ((path) ? ";path="+path:"")+
      ((domain)?";domain="+domain:"") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};

function setCookie(name, value, exdays) {

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + (exdays == null ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = name + "=" + c_value;
};

function getCookie(name) {
    
    var i,
        x,
        y,
        ARRcookies = document.cookie.split(";");

    for (var i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == name) {
            return unescape(y);
        }
    }
};