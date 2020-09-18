var timerProgress;
var timerProgressCounter = 0;

$(document).ready(function() {

    buildMenu(function() {

        var interface = document.getElementById('firmware-interface');

        if (typeof(interface) != 'undefined' && interface != null)
        {
            var nvram = new XMLHttpRequest();
            nvram.responseType = 'json';
            nvram.onload = function() {
                if (nvram.status == 200 && nvram.response != null) {
                    console.log(nvram.response);

                    document.getElementById('esp8266-nvram').classList.remove('d-none');
                    
                    if(nvram.response['nvram'][1] == '0') {
                        $('#WiFiModeAP').prop('checked', true);
                    }else{
                        $('#WiFiModeClient').prop('checked', true);
                    }
                    var bool_value = nvram.response['nvram'][2] == '1' ? true : false;
                    $('#WiFiHidden').val(nvram.response['nvram'][2]);
                    $('#WiFiHiddenCheckbox').prop('checked', bool_value);
                    //$('#WiFiPhyMode').val(nvram.response['nvram'][3]);
                    //$('#WiFiPower').val(nvram.response['nvram'][4]);
                    $('#WiFiChannel').val(nvram.response['nvram'][3]);
                    $('#WiFiSSID').val(nvram.response['nvram'][4]);
                    bool_value = nvram.response['nvram'][5] == '1' ? true : false;
                    $('#EnableLOG').val(nvram.response['nvram'][5]);
                    $('#EnableLOGCheckbox').prop('checked', bool_value);
                    $('#EnableLOGInterval').val(nvram.response['nvram'][6]);
                    bool_value = nvram.response['nvram'][7] == '1' ? true : false;
                    $('#WiFiDHCP').val(nvram.response['nvram'][7]);
                    $('#WiFiDHCPCheckbox').prop('checked', bool_value);
                    if(bool_value == true){
                        $('#WiFiIP').prop('disabled', false);
                        $('#WiFiSubnet').prop('disabled', false);
                        $('#WiFiGateway').prop('disabled', false);
                        $('#WiFiDNS').prop('disabled', false);
                    }
                    $('#WiFiIP').val(nvram.response['nvram'][8]);
                    $('#WiFiSubnet').val(nvram.response['nvram'][9]);
                    $('#WiFiGateway').val(nvram.response['nvram'][10]);
                    $('#WiFiDNS').val(nvram.response['nvram'][11]);
                    $('.spinner-border').addClass('d-none'); //.hide();
                    $('#parameters').removeClass('d-none'); //.show();

                    document.getElementById('browseLittleFS').disabled = false;
                    document.getElementById('browseSketch').disabled = false;
                }else{
                    document.getElementById('formSketch').action = 'esp8266.php';
                    document.getElementById('formLittleFS').action = 'esp8266.php';

                    document.getElementById('esp8266-download-firmware').classList.remove('d-none');
                    document.getElementById('esp8266-flash-firmware').classList.remove('d-none');

                    unblockSerial();

                    var element = document.getElementById('text_minute');
                    if (typeof(element) != undefined && element != null)
                    {
                        element.classList.remove('d-none');
                        document.getElementsByClassName('spinner-border')[0].classList.remove('d-none');
                      
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function() {
                            if (xhr.status == 200) {
                                //console.log(xhr.responseText);
                                if(xhr.responseText.length > 1) {
                                    var s = xhr.responseText.split('\n');
                                    for (var i = 0; i < s.length; i++) {
                                        if(s[i] != '') {
                                            var ss = s[i].split(' ');
                                            $('#firmware-interface').append($('<option>',{value:ss[0], id:ss[1]}).append(ss[0]));
                                        }
                                    }
                                    //$('#firmware-interface').prop('selectedIndex', 0);
                                }else{
                                    $('#firmware-interface').append($('<option>',{value:'', id:'0X008E26B5'}).append('MOD-WIFI-ESP8266 (Olimex)'));
                                    $('#firmware-interface').append($('<option>',{value:'', id:'0X00132DFC'}).append('ESP8266 NodeMCU'));
                                    $('#firmware-interface').append($('<option>',{value:'', id:'0X00000000'}).append('Generic ESP8266-12S'));
                                }
                                setInterfaceImage(0);
                            }
                            document.getElementById('text_minute').classList.add('d-none');
                            document.getElementsByClassName('spinner-border')[0].classList.add('d-none');
                            
                            setLanguage('esp8266.php');

                            document.getElementById('browseLittleFS').disabled = false;
                            document.getElementById('browseSketch').disabled = false;
                        };
                        xhr.open('GET', 'serial.php?com=list&esptool=chip_id', true);
                        xhr.send();
                    }
                }
                document.getElementById('esp8266-flash-select').classList.remove('d-none');
            };
            nvram.open('GET', '/nvram', true);
            nvram.send();
        }else{
            document.getElementById('esp8266-flash-firmware').classList.remove('d-none');
            firmwareUpdateRun();
        }
    });

    document.getElementById('fileLittleFS').onchange = function() {

        if(os != 'esp8266') {
        	document.getElementById('interfaceLittleFS').value = document.getElementById('firmware-interface').value;
			document.getElementById('formLittleFS').submit();
        }else{
        	document.getElementById('formLittleFS').action = 'http://' + window.location.hostname + '/update'; //force HTTP

            progressTimer(280, function() {
                document.getElementById('formLittleFS').submit();
            });

            //Format LittleFS
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.status == 200) {
                    $.notify({ message: xhr.responseText }, { type: 'success' });

                    progressTimer(40, function() {
                        document.getElementById('formLittleFS').submit();
                    });
                }
            };
            xhr.open('GET', '/format', false);
            xhr.send();

            deleteCookie('version');
        }
    };

    document.getElementById('fileSketch').onchange = function () {
        i = 1;
        formName = 'formSketch';

        if(os != 'esp8266') {
        	document.getElementById('interfaceSketch').value = document.getElementById('firmware-interface').value;
			document.getElementById('formSketch').submit();
        }else{
            document.getElementById('formSketch').action = 'http://' + window.location.hostname + '/update'; //force HTTP
            progressTimer(40, function(){
                document.getElementById('formSketch').submit();
            });
        }
    };

    document.getElementById('browseLittleFS').onclick = function () {
        document.getElementById('fileLittleFS').click()
    };

    document.getElementById('browseSketch').onclick = function () {
        document.getElementById('fileSketch').click()
    };
});

function setInterfaceImage(i) {
    var interface = document.getElementById('firmware-interface')[i].id.toUpperCase();
    //console.log(interface);

    if(interface == '0X00132DFC') {
        document.getElementsByClassName('badge')[2].classList.add('d-none');
        document.getElementsByClassName('img-thumbnail')[0].src = 'img/esp8266-nodemcu.png';
    }else if(interface == '0X008E26B5') {
        document.getElementsByClassName('badge')[2].classList.remove('d-none');
        document.getElementsByClassName('badge')[2].id = 'text_olimex-tip';
        document.getElementsByClassName('img-thumbnail')[0].src = 'img/esp8266-olimex.png';
    }else{
        document.getElementsByClassName('badge')[2].classList.add('d-none');
        document.getElementsByClassName('img-thumbnail')[0].src = 'img/esp8266-12S.png';
    }
};

function progressTimer(speed, callback) {
    clearInterval(timerProgress);

    timerProgress = setInterval(function() {
        timerProgressCounter++;
        if(timerProgressCounter == 100) {
            clearInterval(timerProgress);
            callback();
        }
        document.getElementsByClassName('progress-bar')[0].style.width = timerProgressCounter + '%';
    }, speed);
};

function formValidate() {
    WiFiPasswordConfirm.setCustomValidity(WiFiPasswordConfirm.value != WiFiPassword.value ? 'Passwords do not match.' : '');
};