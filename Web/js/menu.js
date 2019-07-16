var serialTimeout = 12000;
/*
var serialPort = getCookie("serial");
var serialWeb = getCookie("serial_web");
var serialTimeout = getCookie("serial_timeout");
var serialWDomain = "http://" + window.location.hostname;
*/
var statusRefreshTimer;
var os = getCookie("os");
var hardware = getCookie("hardware");
var hardware_name = [
    "Hardware v1.0",
    "Hardware v2.0",
    "Hardware v3.0",
    "Hardware Tesla"
];

$(document).ready(function () {

    if (os == undefined) {
        $.ajax("serial.php?os=1", {
            async: false,
            success: function(data) {
                os = data;
                setCookie("os", data, 1); 
            }
        });
    }

    /*
    if (serialPort === undefined) {
        $.ajax("js/serial.json", {
            dataType: "json",
            success: function(data) {
                serialPort = data.serial.port;
                serialWeb = data.serial.web;
                serialTimeout = data.serial.timeout * 1000;
                setCookie("serial", serialPort, 1);
                setCookie("serial_web", serialWeb, 1);
                setCookie("serial_timeout", serialTimeout, 1);
            }
        });
    }
    */

    var version = getCookie("version");
    if (version == undefined) {
        $.ajax("version.txt", {
            success: function(version) {
				version = version.replace("\n", ".");
                setCookie("version", version, 1);
                titleVersion(version);
            }
        });
    }
    titleVersion(version);
    /*
    if (hardware == undefined) {
        $.ajax("serial.php?get=hwver", {
            success: function success(hwver) {
                hwver = parseFloat(hwrev);
                hardware = hwver;
                setCookie("hardware ", hwrev, 1);
            }
        });
    }
    */

    //DEBUG
    //os = "mobile";

    buildMenu();
    
    alertify.defaults.transition = "slide";
    alertify.defaults.theme.ok = "btn btn-primary";
    alertify.defaults.theme.cancel = "btn btn-danger";
    alertify.defaults.theme.input = "form-control";

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
                    },{
                        text: '(5) Sine Wave',
                        className: alertify.defaults.theme.ok
                    },{
                        text: '(3) Boost',
                        className: alertify.defaults.theme.cancel
                    },{
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
                getJSONFloatValue('potnom', function(potnom) {
                    if (potnom > 20) {
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
                            setParameter("chargemode", 3, false, true);
                        }else if(closeEvent.index === 4) {
                            $.notify({ message: "Experimental Area" }, { type: 'danger' });
                            startInverter(4);
                            setParameter("chargemode", 4, false, true);
                        }

                        if(closeEvent.index === 2 || closeEvent.index === 3) {
                            if(getJSONFloatValue("chargecur") === 0) {
                                alertify.prompt("Current Limit", "Enter Charge Current Limit (A)", "", function (event, input) {
                                    setParameter("chargecur", input, true, true);
                                }, function () {});
                            }
                        }
                    }
                });
            },
            hooks: {
                onshow: function() {
                    //console.log(this);
                    this.elements.dialog.style.maxWidth = 'none';
                    this.elements.dialog.style.width = '640px';
                }
            }
        };
    }, false, 'confirm');

	/*
    TipRefreshTimer=setTimeout(function () {
		clearTimeout(TipRefreshTimer);
        buildTips();
    }, 1000);
	*/
});

function titleVersion(version)
{
    document.title = "Inverter Console (" + version + ")"
    if(os == "esp8266")
        document.title += " ESP8266";
};

function displayFWVersion(fwrev)
{
    $("#fwVersion").empty().append("Firmware v" + fwrev);
    $("#fwVersion").removeClass("invisible");
    if(fwrev < 3.59)
    {
        $.notify({ message: 'Firmware Update Recommended!' }, { type: 'danger' });
    }
};

function displayHWVersion()
{
    if (hardware != undefined) {
        console.log(hardware + ":" + hardware_name[hardware]);
        $("#hwVersion").empty().append(hardware_name[hardware]);
        $("#hwVersion").removeClass("invisible");
    }
};

function selectSerial()
{
    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?serial=" + $("#serial-interface").val(), {
    $.ajax("serial.php?serial=" + $("#serial-interface").val(), {
        async: false,
        success: function(data) {
            console.log(data);
            location.reload();
        }
    });
};

function selectHardware()
{
    hardware = $("#hwver").val();
    setCookie("hardware", hardware, 1);
    displayHWVersion();
};

function isInt(n){
    return Number(n) === n && n % 1 === 0;
};

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
};

function checkSoftware(app){

    var result;
    $.ajax("install.php?check=" + app, {
        async: false,
        success: function success(data) {
            console.log(data);
            //eval(data);
            result = data;
        }
    });
    return result;
};

function openConsole(){

    $.ajax("open.php?console=1", {
        success: function success(data) {
            console.log(data);
        }
    });
};

function validateInput(id, value, callback)
{
    getJSONFloatValue('opmode', function(opmode) {
        if(opmode > 0 && id != 'fslipspnt') {
            stopInverter();
            $.notify({ message: 'Inverter must not be in operating mode.' }, { type: 'danger' });
			if(callback)
				callback(false);
            return;
        }else{
            if (isInt(parseInt(value)) == false && isFloat(parseFloat(value)) == false){
                $.notify({ message: id + ' Value must be a number' }, { type: 'danger' });
				if(callback)
					callback(false);
                return;
            }else if(id == 'fmin'){
                if(parseFloat(value) > parseFloat(inputText('#fslipmin')))
                {
                    $.notify({ message: 'Should be set below fslipmin' }, { type: 'danger' });
					if(callback)
						callback(false);
                    return;
                }
            }else if(id == 'fmax'){
                if (parseFloat(value) < 21) {
                    $.notify({ message: 'fmax minimum is limited to 21 Hz ' }, { type: 'danger' });
                }
            }else  if(id == 'polepairs'){
                if ($.inArray(parseInt(value), [ 1, 2, 3, 4, 5]) == -1)
                {
                    $.notify({ message: 'Pole pairs = half # of motor poles' }, { type: 'danger' });
					if(callback)
						callback(false);
                    return;
                }
            }else  if(id == 'udcmin'){
                if(parseInt(value) > parseInt(inputText("#udcmax")))
                {
                    $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
					if(callback)
						callback(false);
                    return;
                }
            }else  if(id == 'udcmax'){
                if(parseInt(value) > parseInt(inputText("#udclim")))
                {
                    $.notify({ message: 'Should be lower than cut-off voltage (udclim)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else  if(id == 'udclim'){
                if(parseInt(value) <= parseInt(inputText("#udcmax")))
                {
                    $.notify({ message: 'Should be above maximum voltage (udcmax)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else if(id == 'udcsw'){
                if(parseInt(value) > parseInt(inputText("#udcmax")))
                {
                    $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else if(id == 'udcsw'){
                if(parseInt(value) > parseInt(inputText("#udcmin")))
                {
                    $.notify({ message: 'Should be below minimum voltage (udcmin)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else if(id == 'fslipmin'){
                if(parseFloat(value) <= parseFloat(inputText('#fmin')))
                {
                    $.notify({ message: 'Should be above starting frequency (fmin)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
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
			if(callback)
				callback(true);
        }
    });
};

function inputText(id)
{
    var getVariable = $(id).text();
    if(getVariable === "")
        getVariable = $(id).val();

    return getVariable;
};

function setParameter(cmd, value, save, notify) {

    var e = "";

    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?pk=1&name=" + cmd + "&value=" + value, {
    $.ajax("serial.php?pk=1&name=" + cmd + "&value=" + value, {
        async: true,
		timeout: serialTimeout,
        success: function success(data) {
            e = data;

            if(save) {

                var data = sendCommand("save");
            
                if(notify) {

                    if(data.indexOf("stored") != -1)
                    {
                        //TODO: CRC32 check on entire params list

                        $.notify({ message: data },{ type: 'success' });
                    }else{
                        $.notify({ icon: 'icons icon-alert', title: 'Error', message: data },{ type: 'danger' });
                    }
                }
            }
        }
    });

    //console.log(e);
    return e;
};

function sendCommand(cmd) {

    var e = ""
  
    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?command=" + cmd, {
    $.ajax("serial.php?command=" + cmd, {
        async: false,
        cache: false,
        timeout: serialTimeout,
        success: function success(data) {
            //console.log(cmd);
            //console.log(data);
            if(cmd == "json") {
                try {
                    e = JSON.parse(data);
                } catch(ex) {
                    e = {};
                    $.notify({ message: ex + ":" + data }, { type: 'danger' });
                }
            }else{
                e = data;
            }
        },
        error: function error(xhr, textStatus, errorThrown) {}
    });
    return e;
};

function downloadSnapshot() {
    window.location.href = "snapshot.php";
};

function uploadSnapshot() {
    $('.fileUpload').trigger('click');
};

function openExternalApp(app) {

    //console.log(app);
    
    if (app === "openscad") {
        $('.fileSVG').trigger('click');
    } else if (app === "source") {
        window.location.href = "sourcecode.php";
    } else if (app === "avr") {
        window.location.href = "attiny.php";
    } else {
        $.ajax("open.php?app=" + app);
    }
};

function getJSONFloatValue(value, callback) {

    var f = 0;
    var sync = false;

    if(callback)
        sync = true;

    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?get=" + value, {
    $.ajax("serial.php?get=" + value, {
        async: sync,
        timeout: serialTimeout,
        success: function success(data) {
            //console.log(data);
            f = parseFloat(data);
            if(isNaN(f))
                f = 0;
            if(callback)
                callback(f);
        }
    });
    //console.log(f);
    return f;
};

function getJSONAverageFloatValue(value,c) {
    if(!c)
        c = "average"; //median
    var f = 0;
    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?" + c + "=" + value, {
    $.ajax("serial.php?" + c + "=" + value, {
        async: false,
		timeout: serialTimeout,
        success: function success(data) {
            f = parseFloat(data);
        }
    });
    //console.log(f);
    return f;
};

function startInverter(mode) {

    var data = sendCommand("start " + mode);
    //console.log(data);

    if (data.indexOf("started") != -1) {
        $.notify({ message: "Inverter started" }, { type: "success" });
        /*
        if (mode === 2 || mode === 5) {
            $("#potentiometer").show();
            $(".collapse").collapse('show');
        }
        */
    } else {
        $.notify({
            icon: "icons icon-warning", title: "Error", message: data
        }, {
            type: "danger"
        });
    }
};

function stopInverter() {

    var data = sendCommand("stop");
    //console.log(data);

    if (data.indexOf("halted") != -1) {
        $.notify({ message: "Inverter Stopped"}, { type: "danger" });
        setParameter("chargemode", "0", false, false);
    } else {
        $.notify({
            icon: "icons icon-warning", title: "Error", message: data
        }, {
            type: "danger"
        });
    }
    $(".collapse").collapse();

    /*
    setTimeout(function () {
        $("#potentiometer").hide();
        //location.reload();
    }, 1000);
    */
};

function setDefaults() {

    alertify.confirm('', 'Reset all settings back to default.', function () {

        sendCommand("can clear");
        $.ajax("can.php?clear=1");

        var data = sendCommand("defaults");
        //console.log(data);

        if (data.indexOf("Defaults loaded") != -1) {
            sendCommand("save");
            $.notify({ message: "Inverter reset to Default" }, { type: "success" });
        } else {
            $.notify({
                icon: "icons icon-warning", title: "Error", message: data
            }, {
                type: "danger"
            });
        }

        setTimeout(function () {
            window.location.href = "index.php";
        }, 2000);

    }, function () {});
};

function giveCredit(csv) {
    $.ajax(csv, {
        success: function success(data) {

            var name = "";
            var url = "";

            if (data.indexOf(",") != -1) {
                var s = data.split(",");
                name = s[0];
                url = "<br><a href='" + s[1] + "' target=_blank>Project Website</a>";
            }else{
                name = data;
            }
            $.notify({ message: "Designed By: " + name + url }, { type: 'success' });
        }
    });
};

function buildTips() {
    
    if(os === "mobile")
        return;

    var show = Math.random() >= 0.5;

    if (show === true) {

        var opStatus = $("#opStatus");

        $.ajax("tips.csv", {
            //async: false,
            success: function success(data) {
                var row = data.split("\n");
                var n = Math.floor(Math.random() * row.length);

                for (var i = 0; i < row.length; i++) {
                    if (i === n) {
                        img = $("<img>", { class: "icons icon-light", "data-toggle": "tooltip", "data-html": "true", "title": "<h8>Tip: " + row[i] + "</h8>" });
                        opStatus.append(img);
                        break;
                    }
                }

                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function error(xhr, textStatus, errorThrown) {}
        });
    }
};

function buildMenu() {

    var file = "js/menu.json";

    if (os === "mobile") {
        file = "js/menu-mobile.json";
    }

    $.ajax(file, {
        dataType: 'json',
        success: function success(json) {

            //console.log(json);

            var nav = $("#buildNav").empty();
            var div = $("<div>", { class: "collapse navbar-collapse", id:"navbarsDefault" });
			
            for(var key in json.menu)
            {
                //console.log(json.menu[key].id);

                var ul = $("<ul>", { class: "navbar-nav" });
                var li = $("<li>", { class: "nav-item" });
                var a = $("<a>", { class: "nav-link bg-inverse", href: "#" });
                var _i = $("<i>", { class: "icons " +  json.menu[key].icon });
                
                a.append(_i);
                a.append($("<b>").append(" " + json.menu[key].id));
                li.append(a);
                
                if(json.menu[key].dropdown)
                {
                    li.addClass("dropdown");
                    a.addClass("dropdown-toggle");
                    a.attr("data-toggle","dropdown");
                    a.attr("aria-haspopup",true);
                    a.attr("aria-expanded",false);

                    var dropdown_menu = $("<div>", { class: "dropdown-menu" });

                    for(var d in json.menu[key].dropdown)
                    {
                        //console.log(json.menu[key].dropdown[d].id);
                        var dropdown_id = json.menu[key].dropdown[d].id;

                        var onclick = json.menu[key].dropdown[d].onClick;
                        if(onclick == undefined) {

                            var d = $("<div>", { class: "dropdown-divider" });
                            dropdown_menu.append(d);
                        }else{
                            
                            var dropdown_item = $("<a>", { class: "dropdown-item", href: "#" });

                            var icon = $("<i>", { class: "icons " + json.menu[key].dropdown[d].icon });
                            var item = $("<span>");

                            if (onclick.indexOf("/") != -1 && onclick.indexOf("alertify") == -1)
                            {
                                dropdown_item.attr("href", onclick);
                            }else{
                                dropdown_item.attr("onClick", onclick);
                            }

                            dropdown_item.append(icon);
                            dropdown_item.append(item.append(" " + dropdown_id));
                            dropdown_menu.append(dropdown_item);
                        }

                        if (os === "mobile") {
                            icon.addClass("display-3");
                            item.addClass("display-3");
                        }
                    }

                    li.append(dropdown_menu);
                }else{
                    a.attr("href", json.menu[key].onClick);
                }

                if (os === "mobile") {
                    a.addClass("display-4 text-white");
                }

                ul.append(li);
                div.append(ul);
            }
			
			nav.append(div);

            var col = $("<div>", { class: "col-auto mr-auto mb-auto mt-auto", id: "opStatus"});
			nav.parent().parent().append(col);

            var fwver = $("<span>", { class: "d-none d-md-block d-lg-block badge bg-info border invisible", id: "fwVersion" });
            var hwver = $("<span>", { class: "d-none d-md-block d-lg-block badge bg-success border invisible", id: "hwVersion" });
            var col = $("<div>", { class: "col-auto mb-auto mt-auto" });
            col.append(fwver).append(hwver);
			nav.parent().parent().append(col);
			
			var button = $("<button>", { class: "navbar-toggler navbar-toggler-right", type: "button", "data-toggle":"collapse", "data-target": "#navbarsDefault", "aria-controls": "navbarsDefault", "aria-expanded": false, "aria-label": "Menu" });
            var span = $("<span>", { class: "navbar-toggler-icon icons icon-menu" }); //text-white display-3
            button.append(span);
			nav.append(button);
			
			if (os === "mobile") {
                //nav.addClass("navbar-toggleable-md navbar-inverse bg-inverse");
                //nav.attr("style","background-color: #000;");
				span.attr("style","font-size: 125%;");
            }else{
                nav.addClass("navbar-expand-md navbar-light bg-light");
            }
        }
    });
};

function buildStatus() {

    clearTimeout(statusRefreshTimer);

    //$.ajax(serialWDomain + ":" + serialWeb + "/serial.php?get=opmode,udc,udcmin,tmpm,tmphs,deadtime,din_start,din_mprot,chargemode", {
    $.ajax("serial.php?get=opmode,udc,udcmin,tmpm,tmphs,deadtime,din_start,din_mprot,chargemode", {
        //async: sync,
        success: function success(data)
        {
            data = data.replace("\n\n", "\n");
            data = data.split("\n");

            var errors = "No Errors"; //sendCommand("errors");

            //console.log(data);

            $('.tooltip').remove();

            var opStatus = $("<div>");
            var img = $("<i>", { class: "icon-status icons icon-key", "data-toggle": "tooltip", "data-html": "true" });

            if(data[0] !== "") {

                //$("#potentiometer").hide();

                if (parseFloat(data[15]) === 3) {
                    img.attr("title", "<h6>Boost Mode</h6>");
                    img.addClass("icon-yellow");
                } else if (parseFloat(data[15]) === 4) {
                    img.attr("title", "<h6>Buck Mode</h6>");
                    img.addClass("icon-yellow");
                }else if (parseFloat(data[0]) === 0) {
                    img.attr("title", "<h6>Off</h6>");
                    img.addClass("icon-red");
                } else if (parseFloat(data[0]) === 1) {
                    if (parseFloat(data[6]) === 1) {
                        img.attr("title", "<h6>Pulse Only - Do not leave ON</h6>");
                        img.addClass("icon-yellow");
                    } else {
                        img.attr("title", "<h6>Running</h6>");
                        img.addClass("icon-green");
                    }
                } else if (parseFloat(data[0]) === 2) {
                    img.attr("title", "<h6>Manual Mode</h6>");
                    img.addClass("icon-green");
                    $("#potentiometer").show();
                }
                opStatus.append(img);
                //========================
                /*
                if(json.ocurlim.value > 0){
                    div.append($("<i>", {"data-src":"img/amperage.svg"}));
                }
                opStatus.append(div);
                */
                //========================
                img = $("<i>", { class: "icon-status icons icon-battery", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[1] + "V</h6>" });
                if (parseFloat(data[1]) > parseFloat(data[2]) && parseFloat(data[1]) > 10 && parseFloat(data[1]) < 520) { // && parseFloat(data[15]) !== 0) {
                    img.addClass("icon-green");
                } else {
                    img.addClass("icon-red");
                }
                opStatus.append(img);
                //========================
                img = $("<i>", { class: "icon-status icons icon-temp", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[3] + "&#8451;</h6>"});
                if (parseFloat(data[3]) > 150 || parseFloat(data[4]) > 150) {
                    img.addClass("icon-red");
                    opStatus.append(img);
                } else if (parseFloat(data[3]) < 0 || parseFloat(data[4]) < 0 || parseFloat(data[3]) > 100 || parseFloat(data[4]) > 100) {
                    img.addClass("icon-yellow");
                    opStatus.append(img);
                }
                //========================
                img = $("<i>", { class: "icon-status icons icon-magnet", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[5] + "ms</h6>" });
                if(parseFloat(data[5]) < 22){
                    img.addClass("icon-red");
                    opStatus.append(img);
                }
                //========================
                /*
                img = $("<i>", { class: "icon-status icons icon-speedometer", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + speed + "RPM</h6>" });
                if (speed > 6000) {
                    img.addClass("icon-red");
                    opStatus.append(img);
                } else if (speed > 3000) {
                    img.addClass("icon-yellow");
                    opStatus.append(img);
                }
                */
                //========================
                if (parseFloat(data[7]) != 1 && parseFloat(data[15]) === 0) {
                    img = $("<i>", { class: "icon-status icons icon-alert", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>Probably forgot PIN 11 to 12V</h6>" });
                    opStatus.append(img);
                }
                //========================
                if (errors.indexOf("No Errors") === -1) {
                    img = $("<i>", { class: "icon-status icons icon-alert", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + errors + "</h6>" });
                    opStatus.append(img);
                }
            }else{
                img = $("<i>", { class: "icon-status icons icon-alert", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>Inverter Disconnected</h6>" });
                opStatus.append(img);
            }
            
            $("#opStatus").empty().append(opStatus);

            //buildTips();

            if(os === "mobile")
            {
                $(".icons").attr("style","width:80px; height:80px;");
            }
            
            $('[data-toggle="tooltip"]').tooltip();
            
            statusRefreshTimer = setTimeout(function () {
                buildStatus();
            }, 12000);
        }
    });
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
