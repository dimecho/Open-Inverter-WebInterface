var i = 1;
var timer;
var formName;

$(document).ready(function() {
    
    buildMenu();

    if(os != "esp8266") {

        unblockSerial();

        $.ajax("serial.php?com=list", {
            async: false,
            success: function(data) {
                //console.log(data);
                var s = data.split('\n');
                for (var i = 0; i < s.length; i++) {
                    if(s[i] != "")
                        $("#firmware-interface").append($("<option>",{value:s[i]}).append(s[i]));
                }
            }
        });
    }
    
    $("#firmware-interface").prop('selectedIndex', 0);
    $(".spinner-border").addClass("d-none"); //.hide();
    $(".input-group-addon").removeClass("d-none"); //.show();
});

function progressTimer() {
    var progressBar = $('.progress-bar');
    progressBar.css('width', i + '%');
    i++;
    if(i == 100) {
        clearInterval(timer);
        $(formName).submit();
    }
};

function formValidate() {
    WiFiPasswordConfirm.setCustomValidity(WiFiPasswordConfirm.value != WiFiPassword.value ? 'Passwords do not match.' : '');
};

function HiddenCheck(id,element) {
    if(element.checked) {
        $('#' + id).val('1');
    }else{
        $('#' + id).val('0');
    }
    if(id == 'WiFiDHCP'){
        var b = false;

        if(element.checked){
            console.log($('#WiFiModeAP').value);
            if($('#WiFiModeAP').value == 1) {
                $.notify({ message: 'WARNING: DHCP works only in WiFi Client mode' }, { type: 'warning' });
            }
            b = true;
        }
        $('#WiFiIP').prop('disabled',  b);
        $('#WiFiSubnet').prop('disabled', b);
        $('#WiFiGateway').prop('disabled', b);
        $('#WiFiDNS').prop('disabled', b);
    }
};

$(document).ready(function() {
    if(os == 'esp8266') {
        $('#esp8266-nvram').removeClass('d-none'); //.show();
        $('#esp8266-flash-select').removeClass('d-none'); //.show();
        
        $.ajax('/nvram', {
            dataType: 'json',
            success: function success(data) {
                console.log(data);
                if(data['nvram0'] == '0') {
                    $('#WiFiModeAP').prop('checked', true);
                }else{
                    $('#WiFiModeClient').prop('checked', true);
                }
                var bool_value = data['nvram1'] == '1' ? true : false;
                $('#WiFiHidden').val(data['nvram1']);
                $('#WiFiHiddenCheckbox').prop('checked', bool_value);
                $('#WiFiChannel').val(data['nvram2']);
                $('#WiFiSSID').val(data['nvram3']);
                bool_value = data['nvram5'] == '1' ? true : false;
                $('#EnableLOG').val(data['nvram5']);
                $('#EnableLOGCheckbox').prop('checked', bool_value);
                $('#EnableLOGInterval').val(data['nvram6']);
                bool_value = data['nvram7'] == '1' ? true : false;
                $('#WiFiDHCP').val(data['nvram7']);
                $('#WiFiDHCPCheckbox').prop('checked', bool_value);
                if(bool_value == true){
                    $('#WiFiIP').prop('disabled', false);
                    $('#WiFiSubnet').prop('disabled', false);
                    $('#WiFiGateway').prop('disabled', false);
                    $('#WiFiDNS').prop('disabled', false);
                }
                $('#WiFiIP').val(data['nvram8']);
                $('#WiFiSubnet').val(data['nvram9']);
                $('#WiFiGateway').val(data['nvram10']);
                $('#WiFiDNS').val(data['nvram11']);
                $('.spinner-border').addClass('d-none'); //.hide();
                $('#parameters').removeClass('d-none'); //.show();
            }
        });
    }else{
        $('#formSPIFFS').attr('action', 'esp8266.php');
        $('#formSketch').attr('action', 'esp8266.php');
        $('#esp8266-flash-firmware img').attr('src','img/esp8266-flash.png');
        $('#esp8266-download-firmware').removeClass('d-none'); //.show();
        $('#esp8266-flash-firmware').removeClass('d-none'); //.show();
        $('#esp8266-flash-select').removeClass('d-none'); //.show();
        $('.spinner-border').addClass('d-none'); //.hide();
    }

    $('#fileSPIFFS').change(function() {
        i = 1;
        formName = '#formSPIFFS';

        if(os != 'esp8266') {
            $(formName + ' input[name=interface]').val($('#firmware-interface').val());
            $(formName).submit();
        }else{
            timer = setInterval(progressTimer, 280);
            //Format SPIFFS
            $.ajax('/format', {
                async: false,
                success: function success(data) {
                    $.notify({ message: data }, { type: 'success' });

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
            });
            deleteCookie('version');
        }
    });

    $('#fileSketch').change(function() {
        i = 1;
        formName = '#formSketch';

        if(os != 'esp8266') {
            $(formName + ' input[name=interface]').val($('#firmware-interface').val());
            $(formName).submit();
        }else{
            timer = setInterval(progressTimer, 40);
        }
    });

    $('#browseSPIFFS').click(function(){
        $('#fileSPIFFS').trigger('click');
    });

    $('#browseSketch').click(function(){
        $('#fileSketch').trigger('click');
    });
});