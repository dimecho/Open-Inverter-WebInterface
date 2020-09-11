var i = 1;
var timer;
var formName;

$(document).ready(function() {

    buildMenu(function() {
        if(os == 'esp8266') {

            document.getElementById('esp8266-nvram').classList.remove('d-none');
            
            var nvram = new XMLHttpRequest();
            nvram.responseType = 'json';
            nvram.onload = function() {
                if (nvram.status == 200) {
                    console.log(nvram.response);
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
                }
            };
            nvram.open('GET', '/nvram', true);
            nvram.send();
        }else{
            document.getElementById('formSketch').action = 'esp8266.php';
            document.getElementById('formLittleFS').action = 'esp8266.php';

            document.getElementById('esp8266-flash-select').classList.remove('d-none');
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
                };
                xhr.open('GET', 'serial.php?com=list&esptool=chip_id', true);
                xhr.send();
            }
        }
    });

    document.getElementById('fileLittleFS').onchange = function () {
        i = 1;
        formName = 'formLittleFS';
        
        if(os != 'esp8266') {
        	document.getElementById('interfaceLittleFS').value = document.getElementById('firmware-interface').value;
			document.getElementById('formLittleFS').submit();
        }else{
        	document.getElementById('formLittleFS').action = 'http://' + window.location.hostname + '/update'; //force HTTP
            timer = setInterval(progressTimer, 280);

            //Format LittleFS
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.status == 200) {
                    $.notify({ message: xhr.responseText }, { type: 'success' });

                    clearInterval(timer);
                    timer = setInterval(progressTimer, 40);
                    /*
                        $.ajax('/reset', {
                        success: function success(data) {
                            clearInterval(timer);
                            timer = setInterval(progressTimer, 40);
                        }
                    });
                    */
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
            timer = setInterval(progressTimer, 40);
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
    var v = document.getElementById('firmware-interface')[i].id.toUpperCase();
    //console.log(v);

    if(v == '0X00132DFC') {
        document.getElementsByClassName('badge')[2].classList.add('d-none');
        document.getElementsByClassName('img-thumbnail')[0].src = 'img/esp8266-nodemcu.png';
    }else if(v == '0X008E26B5') {
        document.getElementsByClassName('badge')[2].classList.remove('d-none');
        document.getElementsByClassName('badge')[2].id = 'text_olimex-tip';
        document.getElementsByClassName('img-thumbnail')[0].src = 'img/esp8266-olimex.png';
    }else{
        document.getElementsByClassName('badge')[2].classList.add('d-none');
        document.getElementsByClassName('img-thumbnail')[0].src = 'img/esp8266-12S.png';
    }
};

function progressTimer() {
    i++;
    if(i == 100) {
        clearInterval(timer);
        if(formName != null)
            document.getElementById(formName).submit();
    }
    document.getElementsByClassName('progress-bar')[0].style.width = i + '%';
};

function formValidate() {
    WiFiPasswordConfirm.setCustomValidity(WiFiPasswordConfirm.value != WiFiPassword.value ? 'Passwords do not match.' : '');
};