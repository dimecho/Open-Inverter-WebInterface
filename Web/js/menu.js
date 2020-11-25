var theme = detectTheme(); loadTheme();
var serialTimeout = 12000;
var serialBlock = getCookie('serial.block');
var os = getCookie('os');
var sn = getCookie('sn');
var hardware = getCookie('hardware');
var hardware_name = [
    'Hardware v1.0',
    'Hardware v2.0',
    'Hardware v3.0',
    'Hardware Tesla',
    'Hardware Tesla M3',
    'Hardware Blue-Pill',
    'Hardware Prius',
    'Hardware Prius MG1'
];
var statusParam = [
    'opmode',
    'udc',
    'udcmin',
    'tmpm',
    'tmphs',
    'deadtime',
    'din_start',
    'din_mprot',
    'chargemode'
];
var statusParamDynamic = [
    'opmode',
    'udc',
    'udcmin',
    'tmpm',
    'tmphs'
];
var statusRefreshTimer;
var saveReminderTimer;
var saveReminder = false;
var synchronousPause = false;

$(document).ready(function () {

    var xhr = new XMLHttpRequest();
    
    if (os == undefined) {
        xhr.onload = function() {
            if (xhr.status == 200) {
                os = xhr.responseText;
                setCookie('os', xhr.responseText, 1);
            }
        };
        xhr.open('GET', 'serial.php?os=1', true);
        xhr.send();
    }
    
    //DEBUG
    //os = 'mobile';

    var version = getCookie('version') || 0;
    if (version == 0) {
        xhr.onload = function() {
            if (xhr.status == 200) {
                version = xhr.responseText.replace('\n', '.');
                setCookie('version', version, 1);
            }
            titleVersion(version);
        };
        xhr.open('GET', 'version.txt', true);
        xhr.send();
    }else{
        titleVersion(version);
    }
    /*
    if (hardware == undefined) {
        $.ajax('serial.php?get=hwver', {
            success: function success(hwver) {
                hwver = parseFloat(hwrev);
                hardware = hwver;
                setCookie('hardware', hwrev, 1);
            }
        });
    }
    */
    //buildMenu();
	/*
    TipRefreshTimer=setTimeout(function () {
		clearTimeout(TipRefreshTimer);
        buildTips();
    }, 1000);
	*/
});

function startInverterMode(mode)
{
    //0=Off, 1=Run, 2=ManualRun, 3=Boost, 4=Buck, 5=Sine, 6=AcHeat
    getJSONFloatValue('potnom', function(potnom) {
        if (potnom > 20) {
            $.notify({ title: 'High RPM Warning', message: 'Adjust your Potentiometer down to zero before starting Inverter.' }, { type: 'danger' });
        } else {

            if(mode === 3) {
                setParameter('chargemode', 3, false, true);
            }else if(mode === 4) {
                setParameter('chargemode', 4, false, true);
            }

            var data = sendCommand('start ' + mode, 0);
            //console.log(data);

            if (data.indexOf('started') != -1) {
                $.notify({ message: 'Inverter started' }, { type: 'success' });
                /*
                if (mode === 2 || mode === 5) {
                    $('#potentiometer').removeClass('d-none'); //.show();
                    $('.collapse').collapse('show');
                }
                */
            } else {
                $.notify({ icon: 'icons icon-warning', title: 'Error', message: data }, { type: 'danger' });
            }

            /*
            if(closeEvent.index === 3 || closeEvent.index === 4) {
                if(getJSONFloatValue('chargecur') === 0) {
                    alertify.prompt('Current Limit', 'Enter Charge Current Limit (A)', '', function (event, input) {
                        setParameter('chargecur', input, true, true);
                    }, function () {});
                }
            }
            */
        }
    });
};

function titleVersion(version)
{
    document.title = 'Web Interface (' + version + ')';
    if(os === 'esp8266') {
        document.title += ' ESP8266';
    }
};

function displayFWVersion(fwrev)
{
    document.getElementById('fwVersion').textContent = 'Firmware v' + fwrev;
    document.getElementById('fwVersion').classList.remove('invisible');
    if(fwrev < 3.59)
    {
        $.notify({ message: 'Firmware Update Recommended!' }, { type: 'danger' });
    }
};

function displayHWVersion()
{
    var hwOptions = document.getElementById('hardware-select');
    hwOptions.innerHTML = '';
    for (var i = 0; i < hardware_name.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', i);
        option.textContent = hardware_name[i];
        hwOptions.appendChild(option);
    }

    if (hardware != undefined) {
        console.log(hardware + ':' + hardware_name[hardware]);

        document.getElementById('hwVersion').textContent = hardware_name[hardware];
        document.getElementById('hwVersion').classList.remove('invisible');
        document.getElementById('hwVersion').onclick = function() {
            var hardwareModal = new bootstrap.Modal(document.getElementById('hardware'), {});
            hardwareModal.show();
        }
    }

    if (sn == undefined) {
        sn = sendCommand('serial', 0);
        setCookie('sn', sn, 1);
        console.log('Serial:' + sn);
    }
};

function setDefaultValue(value, defaultValue){
   return (value === undefined) ? defaultValue : value.value;
};

function unblockSerial()
{
	if (os === 'windows' && serialBlock != undefined) {
        $.notify({ message: 'Detected blocked Serial' }, { type: 'warning' });
        $.notify({ message: '#Plug-it-Back and Refresh this page' }, { type: 'success' });
        deleteCookie('serial.block');
    }
};

function selectSerial()
{
    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
            location.reload();
        }
        synchronousPause = false;
    };
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'serial.php?serial=' + $('#serial-interface').val(), true);
    xhr.send();
};

function selectHardware()
{
    hardware = $('#hardware-select').val();
    setCookie('hardware', hardware, 1);
    displayHWVersion();
    //location.reload(); 
};

function isInt(n){
    return Number(n) === n && n % 1 === 0;
};

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
};

function checkSoftware(app, args, callback) {

    if (callback == undefined)
        callback = function(){};

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
            eval(xhr.responseText);

            synchronousPause = false;
            callback(xhr.responseText);
        }
    };
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'install.php?check=' + app + '&args=' + args, true);
    xhr.send();
};

function openConsole(){

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
        }
        synchronousPause = false;
    };
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'open.php?console=1', true);
    xhr.send();
};

function validateInput(json, id, value, callback)
{
    if(value > json[id].maximum) {
        $.notify({ message: id + ' maximum ' + json[id].maximum}, { type: 'danger' });
        if(callback)
                callback(false);
            return;
    }else if(value < json[id].minimum) {
        $.notify({ message: id + ' minimum ' + json[id].minimum}, { type: 'danger' });
        if(callback)
                callback(false);
            return;
    }
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
                if(parseInt(value) > parseInt(inputText('#udcmax')))
                {
                    $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
					if(callback)
						callback(false);
                    return;
                }
            }else  if(id == 'udcmax'){
                if(parseInt(value) > parseInt(inputText('#udclim')))
                {
                    $.notify({ message: 'Should be lower than cut-off voltage (udclim)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else  if(id == 'udclim'){
                if(parseInt(value) <= parseInt(inputText('#udcmax')))
                {
                    $.notify({ message: 'Should be above maximum voltage (udcmax)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else if(id == 'udcsw'){
                if(parseInt(value) > parseInt(inputText('#udcmax')))
                {
                    $.notify({ message: 'Should be below maximum voltage (udcmax)' }, { type: 'danger' });
                    if(callback)
						callback(false);
                    return;
                }
            }else if(id == 'udcsw'){
                if(parseInt(value) > parseInt(inputText('#udcmin')))
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
            }else  if(id == 'ocurlim'){
                if(value == 0)
                {
                    $.notify({ message: 'AC current limit code disabled' }, { type: 'warning' });
                    if(callback)
                        callback(true);
                    return;
                }
            }

            var notify = $.notify({ message: id + ' = ' + value.trim() },{ type: 'warning' });
			if(callback)
				callback(true);
        }
    });
};

function inputText(id)
{
    var getVariable = $(id).text();
    if(getVariable === '')
        getVariable = $(id).val();

    return getVariable;
};

function saveParameter(notify) {

    clearTimeout(saveReminderTimer);
    saveReminder = false;

    sendCommand('save', 0, function(data){
        if(notify) {
            if(data.indexOf('stored') != -1)
            {
                //TODO: CRC32 check on entire params list

                $('#save-parameters').removeClass('btn-success');
                $('#save-parameters').addClass('btn-secondary');

                $.notify({ message: data },{ type: 'success' });
            }else{
                $.notify({ icon: 'icons icon-alert', title: 'Error', message: data },{ type: 'danger' });
            }
        }
    });
};

function setParameter(cmd, value, save, notify, callback) {

    if (callback == undefined) {
        callback = function(){};
    }

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            if(save) {
                saveParameter(notify);
            }
        }
        synchronousPause = false;
        callback(xhr.responseText);
    };
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'serial.php?set=1&name=' + cmd + '&value=' + value, true);
    xhr.send();

    //console.log(e);
};

function sendCommand(cmd, loop, callback) {
    var e = '';
    var async = true;
    if (callback == undefined) {
        async = false;
        callback = function(){};
    }
  
    if(loop < 3) {
        synchronousPause = true;
        var xhr = new XMLHttpRequest();
        xhr.cache = false;
        xhr.onload = function() {
            if (xhr.status == 200) {
                //console.log(cmd);
                //console.log(xhr.responseText);
                if(cmd == 'json') {
                    try {
                        e = JSON.parse(xhr.responseText);
                    } catch(ex) {
                        console.log(xhr.responseText);
                        e = {};
                        if(loop == 1)
                            $.notify({ message: ex + ':' + xhr.responseText }, { type: 'danger' });
                        loop++;
                        e = sendCommand(cmd, loop);
                    }
                }else{
                    e = xhr.responseText;
                }
            }
            synchronousPause = false;
            callback(e);
        };
        xhr.onerror = function() {
            synchronousPause = false;
        }
        xhr.open('GET', 'serial.php?command=' + cmd, async);
        xhr.send();
    }else{
        $.notify({ message: 'Power Cycle Inverter' }, { type: 'warning' });     
    }
    return e;
};

function downloadSnapshot() {
    synchronousPause = true;

    window.location.href = 'snapshot.php';
    
    synchronousPause = false;
};

function uploadSnapshot() {
    $('.fileUpload').trigger('click');
};

function openExternalApp(app,args, callback) {

    //console.log(app);
    
    if (app === 'openscad') {
        $('.fileSVG').trigger('click');
    } else if (app === 'source') {
        window.location.href = 'sourcecode.php';
    } else if (app === 'avr') {
        window.location.href = 'attiny.php';
    } else if (app === 'esptool') {
        window.location.href = 'esp8266.php';
    } else {
        data = '';
    
        synchronousPause = true;
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
                //console.log(xhr.responseText);
                data = xhr.responseText;
            }
            synchronousPause = false;
        };
        xhr.onerror = function() {
            synchronousPause = false;
        }
        xhr.open('GET', 'open.php?app=' + app + '&args=' + args, false);
        xhr.send();

        return data;
    }
};

function getJSONFloatValue(value, callback) {

    var f = 0;
    var sync = false;

    if(callback)
        sync = true;

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        synchronousPause = false;
        if (xhr.status == 200) {
            //console.log(xhr.responseText);
            f = parseFloat(xhr.responseText);
            if(isNaN(f))
                f = 0;
            if(callback)
                callback(f);
        }
    };
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'serial.php?get=' + value, sync);
    xhr.send();

    //console.log(f);
    return f;
};

function getJSONAverageFloatValue(value, c) {
    if(!c)
        c = 'average'; //median
    var f = 0;

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.responseText);
            f = parseFloat(xhr.responseText);
        }
        synchronousPause = false;
    };
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'serial.php?' + c + '=' + value, false);
    xhr.send();

    //console.log(f);
    return f;
};

function stopInverter() {

    var data = sendCommand('stop', 0);
    //console.log(data);

    if (data.indexOf('halted') != -1) {
        $.notify({ message: 'Inverter Stopped'}, { type: 'danger' });
        setParameter('chargemode', '0', false, false);
    } else {
        $.notify({ icon: 'icons icon-warning', title: 'Error', message: data }, { type: 'danger' });
    }
    $('.collapse').collapse();

    /*
    setTimeout(function () {
        $('#potentiometer').addClass('d-none'); //.hide();
        //location.reload();
    }, 1000);
    */
};

function setDefaults() {
    
    var loader = document.getElementById('loader-parameters');
    if (typeof(loader) != undefined) {
        loader.classList.remove('d-none');
    }

    sendCommand('can clear', 0, function() {
        sendCommand('defaults', 0, function(data) {
            //console.log(data);
            if (data.indexOf('Defaults loaded') != -1) {
                sendCommand('save', 0, function() {
                    $.notify({ message: 'Inverter reset to Default' }, { type: 'success' });
                    setTimeout(function() {
                        window.location.href = 'index.php';
                    }, 2000);
                });
            } else {
                $.notify({ icon: 'icons icon-warning', title: 'Error', message: data }, { type: 'danger' });
            }
        });
    });
};

function giveCredit(csv) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.responseText);

            var name = '';
            var url = '';

            if (xhr.responseText.indexOf(',') != -1) {
                var s = xhr.responseText.split(',');
                name = s[0];
                url = '<br><a href="' + s[1] + '" target=_blank>Project Website</a>';
            }else{
                name = xhr.responseText;
            }
            $.notify({ message: 'Designed By: ' + name + url }, { type: 'success' });
        }
    };
    xhr.open('GET', csv, true);
    xhr.send();
};

function buildTips() {
    
    if(os === 'mobile')
        return;

    var show = Math.random() >= 0.5;

    if (show === true) {

        var opStatus = $('#opStatus');

        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
                //console.log(xhr.responseText);
                var row = xhr.responseText.split('\n');
                var n = Math.floor(Math.random() * row.length);

                for (var i = 0; i < row.length; i++) {
                    if (i === n) {
                        img = $('<img>', { class: 'icons icon-light', 'data-toggle': 'tooltip', 'data-html': 'true', 'title': '<h8>Tip: ' + row[i] + '</h8>' });
                        opStatus.append(img);
                        break;
                    }
                }
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                  return new bootstrap.Tooltip(tooltipTriggerEl)
                });
            }
        };
        xhr.open('GET', 'tips.csv', true);
        xhr.send();
    }
};

function buildMenu(callback) {

    var file = 'js/menu.json';

    if (os === 'mobile') {
        file = 'js/menu-mobile.json';
    }

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            var js = xhr.response;
            //console.log(js);

            var nav = $('#mainMenu');
            var wrap = $('<div>', { class: 'container' }); // { class: 'd-flex mx-auto' });
            
            var button = $('<button>', { class: 'navbar-toggler navbar-toggler-right', type: 'button', 'data-toggle': 'collapse', 'data-target': '#navbarResponsive', 'aria-controls': 'navbarResponsive', 'aria-expanded': false, 'aria-label': 'Menu' });
            var span = $('<span>', { class: 'icons icon-menu' }); //navbar-toggler-icon' });
            button.append(span);
            wrap.append(button);

            var div = $('<div>', { class: 'collapse navbar-collapse', id:'navbarResponsive' });

            for(var k in js.menu)
            {
                console.log(k);
                console.log(js.menu[k].id);

                if(js.menu[k].id == undefined)
                    continue;

                var ul = $('<ul>', { class: 'navbar-nav' });
                var li = $('<li>', { class: 'nav-item' });
                var a = $('<a>', { class: 'nav-link', href: '#' });
                var _i = $('<i>', { class: 'icons ' + js.menu[k].icon });
                
                a.append(_i);
                a.append($('<b>', { id: js.menu[k].id }).append(' ' + js.menu[k].text));
                li.append(a);
                
                if(js.menu[k].dropdown)
                {
                    li.addClass('dropdown');
                    a.addClass('dropdown-toggle');
                    a.attr('data-toggle','dropdown');
                    a.attr('aria-haspopup',true);
                    a.attr('aria-expanded',false);

                    var dropdown_menu = $('<div>', { class: 'dropdown-menu' });

                    for(var d in js.menu[k].dropdown)
                    {
                        //console.log(js.menu[k].dropdown[d].id);
                        var onclick = js.menu[k].dropdown[d].onClick;
                        if(onclick == undefined) {

                            var d = $('<div>', { class: 'dropdown-divider' });
                            dropdown_menu.append(d);
                        }else{
                            
                            var dropdown_item = $('<a>', { class: 'dropdown-item', href: '#' });

                            var icon = $('<i>', { class: 'icons ' + js.menu[k].dropdown[d].icon });
                            var item = $('<span>', { id: js.menu[k].dropdown[d].id });

                            if (onclick.indexOf('/') != -1 && onclick.indexOf('alertify') == -1)
                            {
                                dropdown_item.attr('href', onclick);
                            }else{
                                dropdown_item.attr('onClick', onclick);
                            }

                            dropdown_item.append(icon);
                            dropdown_item.append(item.append(' ' + js.menu[k].dropdown[d].text));
                            dropdown_menu.append(dropdown_item);
                        }
                    }

                    li.append(dropdown_menu);
                }else{
                    a.attr('href', js.menu[k].onClick);
                }

                ul.append(li);
                div.append(ul);
            }
            wrap.append(div);

            var col = $('<div>', { class: 'spinner-grow spinner-grow-sm text-muted d-none', id: 'loader-status' }); //.hide();
            wrap.append(col);

            var col = $('<div>', { class: 'col-auto mr-auto mb-auto mt-auto', id: 'opStatus' });
            wrap.append(col);

            var col = $('<div>', { class: 'col-auto mb-auto mt-auto' });
            var fwver = $('<span>', { class: 'd-none d-md-block badge bg-info border text-white invisible', id: 'fwVersion' });
            var hwver = $('<span>', { class: 'd-none d-md-block badge bg-success border text-white invisible', id: 'hwVersion', 'data-toggle': 'tooltip', 'data-html': true, 'data-original-title': sn });
            col.append(fwver).append(hwver);
            wrap.append(col);

            var col = $('<div>', { class: 'col-auto mb-auto mt-auto' });
            var theme_icon = $('<i>', { class: 'd-none d-md-block icons icon-status icon-day-and-night text-dark', 'data-toggle': 'tooltip', 'data-html': true });
            theme_icon.click(function() {
                if(theme == '.slate') {
                    theme = '';
                }else{
                    theme = '.slate';
                }
                setCookie('theme', theme, 1);
                location.reload();
                //loadTheme();
                //setTheme();
            });
            col.append(theme_icon);
            wrap.append(col);
            nav.append(wrap);
            
            var path = window.location.pathname;
            var page = path.split('/').pop();

            setLanguage(page);
            setTheme();

            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
              return new bootstrap.Tooltip(tooltipTriggerEl)
            });

            callback();
        }
    };
    xhr.open('GET', file, true);
    xhr.send();
};

function isMacintosh() {
  return navigator.platform.indexOf('Mac') > -1
};

function isWindows() {
  return navigator.platform.indexOf('Win') > -1
};

function detectTheme()
{
    var t = getCookie('theme');
    if(t == undefined) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return '.slate';
        }else{
            return '';
        }
    }
    return t;
};

function switchTheme(element,dark,light) {
	 if(theme == '') {
		var e = $(element + '.' + dark);
	    e.removeClass(dark);
	    e.addClass(light);
	}else{
		var e = $(element + '.' + light);
    	e.removeClass(light);
    	e.addClass(dark);
	}
};

function setTheme() {
    //loadTheme();
    if(theme == '.slate') {
        $('.icon-day-and-night').attr('data-original-title', '<h6 class="text-white">Light Theme</h6>');
    }else{
        $('.icon-day-and-night').attr('data-original-title', '<h6 class="text-white">Dark Theme</h6>');
    }
    switchTheme('i.icon-status','text-white','text-dark');
    switchTheme('div','navbar-dark','navbar-light');
    switchTheme('div','bg-primary','bg-light');
    switchTheme('div','text-white','text-dark');
	switchTheme('table','bg-primary','bg-light');
};

function loadTheme() {
	if(theme == '.slate') {
        $('link[title="main"]').attr('href', 'css/bootstrap.slate.css');
    }else{
    	$('link[title="main"]').attr('href', 'css/bootstrap.css');
    }
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        setCookie('os', 'mobile', 1);
        $('head link[rel="stylesheet"]').last().after('<link rel="stylesheet" href="css/mobile.css" type="text/css">');
    }
};

function buildStatus(parameters) {

    clearTimeout(statusRefreshTimer);

    if(synchronousPause == true) {
        statusRefreshTimer = setTimeout(function () {        
            buildStatus(parameters);
        }, 12000);
        return;
    }

    document.getElementById('loader-status').classList.remove('d-none');
    var opStatus = document.getElementById('opStatus');

    if(parameters == undefined) //reinitialize
    {
        parameters = statusParam;
        opStatus.innerHTML = '';
    }

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            var data = xhr.responseText.replace('\n\n', '\n');
            data = data.split('\n');
            //console.log(data);

            $('.tooltip').remove();

            var refresh = document.createElement('div');
            refresh.className = 'd-inline small';
            var checkbox = document.createElement('input');
            checkbox.className = 'form-check-input';
            checkbox.setAttribute('type', 'checkbox');
            if(getCookie('status-refresh') != undefined) {
                checkbox.checked = true;
            }
            checkbox.onclick = function()
            {
                if(this.checked) {
                    setCookie('status-refresh', this.checked, 360);
                    buildStatus();
                }else{
                    deleteCookie('status-refresh');
                    clearTimeout(statusRefreshTimer);
                }
            }
            refresh.textContent = 'Refresh';
            refresh.appendChild(checkbox);
            opStatus.appendChild(refresh);

            var img = statusIcon('icon-key', '');
            if(data[0] !== '') {

                //$('#potentiometer').addClass('d-none'); //.hide();

                if (parseFloat(data[9]) === 3) {
                    img.setAttribute('data-original-title', 'Boost Mode');
                    statusIconColor('icon-key', 'text-warning');
                } else if (parseFloat(data[15]) === 4) {
                    img.setAttribute('data-original-title', 'Buck Mode');
                    statusIconColor('icon-key', 'text-warning');
                }else if (parseFloat(data[0]) === 0) {
                    img.setAttribute('data-original-title', 'Off');
                    statusIconColor('icon-key', 'text-danger');
                } else if (parseFloat(data[0]) === 1) {
                    if (parseFloat(data[6]) === 1) {
                        img.setAttribute('data-original-title', 'Pulse Only - Do not leave ON');
                        statusIconColor('icon-key', 'text-warning');
                    } else {
                        img.setAttribute('data-original-title', 'Running');
                        statusIconColor('icon-key', 'text-success');
                    }
                } else if (parseFloat(data[0]) === 2) {
                    img.setAttribute('data-original-title', 'Manual Mode');
                    statusIconColor('icon-key', 'text-success');
                    //$('#potentiometer').removeClass('d-none'); //.show();
                }
                //========================
                /*
                if(json.ocurlim.value > 0){
                    div.append($('<i>', {'data-src':'img/amperage.svg'}));
                }
                opStatus.appendChild(div);
                */
                //========================
                img = statusIcon('icon-battery', data[1] + 'V');
                if (parseFloat(data[1]) > parseFloat(data[2]) && parseFloat(data[1]) > 10 && parseFloat(data[1]) < 520) { // && parseFloat(data[15]) !== 0) {
                	statusIconColor('icon-battery', 'text-success');
                } else {
                	statusIconColor('icon-battery', 'text-danger');
                }
                //========================
                if (parseFloat(data[3]) > 150 || parseFloat(data[4]) > 150) {
                    img = statusIcon('icon-temp', data[3] + '&#8451;', 'text-danger');
                } else if (parseFloat(data[3]) < 0 || parseFloat(data[4]) < 0 || parseFloat(data[3]) > 100 || parseFloat(data[4]) > 100) {
                    img = statusIcon('icon-temp', data[3] + '&#8451;', 'text-warning');
                }
                //========================
                if(parseFloat(data[5]) < 22) {
                    img = statusIcon('icon-magnet', data[5] + 'ms', 'text-danger');
                }
                //========================
                /*
                img = statusIcon('icon-speed', '<h6>' + speed + 'RPM</h6>');
                if (speed > 6000) {
                	statusIconColor('icon-speed', 'text-danger');
                } else if (speed > 3000) {
                	statusIconColor('icon-speed', 'text-warning');
                }
                */
                //========================
                if (parseFloat(data[7]) != 1 && parseFloat(data[9]) === 0) {
                    img = statusIcon('icon-alert', 'Probably forgot PIN 11 to 12V', 'text-warning');
                }
            }else{
                img = statusIcon('icon-alert', 'Inverter Disconnected', 'text-warning');
            }
            
            statusIconErrors(function() {
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                  return new bootstrap.Tooltip(tooltipTriggerEl)
                });
                if(getCookie('status-refresh') != undefined) {
                    statusRefreshTimer = setTimeout(function() {
                        buildStatus(statusParamDynamic);
                    }, 12000);
                }
                document.getElementById('loader-status').classList.add('d-none');
            });
        }
    }
    xhr.onerror = function() {
        synchronousPause = false;
    }
    xhr.open('GET', 'serial.php?get=' + parameters.join(','), true);
    xhr.send();
};

function statusIcon(icon, value, color) {

    var img = document.getElementById('status-' + icon);

    if(img === null)
    {
        var opStatus = document.getElementById('opStatus');

        img = document.createElement('i');
        img.className = 'icons icon-status ' + icon;
        img.setAttribute('id', 'status-' + icon);
        img.setAttribute('data-toggle', 'tooltip');
        img.setAttribute('data-html', true);

        opStatus.appendChild(img);
    }
    if(color != undefined)
    	img.classList.add(color);

    img.setAttribute('data-original-title', value);

    return img;
};

function statusIconColor(icon, value) {
    var img = document.getElementById('status-' + icon);
    img.className = 'icons icon-status ' + icon + ' ' + value;
};

function statusIconErrors(callback) {

    var errors_url = 'serial.php?command=errors';
    if(os == 'windows') {
        errors_url = 'serial.php?get=lasterr';
    }

    synchronousPause = true;
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            if (xhr.responseText.indexOf('No Errors') === -1) {
            	var img = statusIcon('icon-error', xhr.responseText.replace('\n','<br>'), 'icon-alert');
                statusIconColor('icon-error', 'icon-alert text-warning');
            }else{
            	var img = document.getElementById('status-icon-error');
            	if(img != null)
            		document.getElementById('opStatus').removeChild(img);
            }
            synchronousPause = false;
            callback();
        }
    }
    xhr.onerror = function() {
        synchronousPause = false;
        callback();
    }
    xhr.open('GET', errors_url, true);
    xhr.send();
};

function toHex(d) {
    var n = Number(d).toString(16);
    if(n.length & 1) //Odd
        n = '0' + n;
    return n.toUpperCase();
};

function getScript(scriptUrl, callback) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = callback;

    document.body.appendChild(script);
};

function deleteCookie(name, path, domain) {

  if(getCookie(name)) {
    document.cookie = name + '=' +
      ((path) ? ';path='+path:'')+
      ((domain)?';domain='+domain:'') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
};

function setCookie(name, value, exdays) {

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + (exdays == null ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = name + '=' + c_value + '; SameSite=Lax';
};

function getCookie(name) {
    
    var i,
        x,
        y,
        ARRcookies = document.cookie.split(';');

    for (var i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x == name) {
            return unescape(y);
        }
    }
};
