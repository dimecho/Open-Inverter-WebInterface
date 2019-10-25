var i = 1;
var timer;
var formName;

function progressTimer() {
    var progressBar = $("#progressBar");
    progressBar.css("width", i + "%");
    i++;
    if(i == 100) {
        clearInterval(timer);
        $(formName).submit();
    }
};

function HiddenCheck(id,element) {
    if(element.checked) {
        $("#" + id).val("1");
    }else{
        $("#" + id).val("0");
    }
};

$(document).ready(function() {
    if(os == "esp8266") {
        $("#esp8266-nvram").show();
        $("#esp8266-flash-select").show();
        
        $.ajax("/nvram", {
            dataType: 'json',
            success: function success(data) {
                console.log(data);
                if(data["nvram0"] == "0") {
                    $("#WiFiModeAP").prop("checked", true);
                }else{
                    $("#WiFiModeClient").prop("checked", true);
                }
                var bool_value = data["nvram1"] == "1" ? true : false;
                $("#WiFiHidden").val(data["nvram1"]);
                $("#WiFiHiddenCheckbox").prop("checked", bool_value);
                $("#WiFiChannel").val(data["nvram2"]);
                $("#WiFiSSID").val(data["nvram3"]);
                bool_value = data["nvram5"] == "1" ? true : false;
                $("#EnableSWD").val(data["nvram5"]);
                $("#EnableSWDCheckbox").prop("checked", bool_value);
                bool_value = data["nvram6"] == "1" ? true : false;
                $("#EnableCAN").val(data["nvram6"]);
                $("#EnableCANCheckbox").prop("checked", bool_value);
                $(".loader").hide();
                $("#parameters").show();
            }
        });
    }else{
        $("#formSPIFFS").attr("action", "esp8266.php");
        $("#formSketch").attr("action", "esp8266.php");
        $("#esp8266-flash-firmware img").attr("src","img/esp8266-flash.png");
        $("#esp8266-download-firmware").show();
        $("#esp8266-flash-firmware").show();
        $("#esp8266-flash-select").show();
        $(".loader").hide();
    }

    $("#fileSPIFFS").change(function() {
        i = 1;
        formName = "#formSPIFFS";
        
        if(os != "esp8266") {
            $(formName + " input[name=interface]").val($("#firmware-interface").val());
            $(formName).submit();
        }else{
            timer = setInterval(progressTimer, 250);
            //Format SPIFFS
            $.ajax("/format", {
                success: function success(data) {
                    deleteCookie("version");
                    $.notify({ message: data }, { type: "success" });
                    $.ajax("/reset", {
                        success: function success(data) {
                            clearInterval(timer);
                            timer = setInterval(progressTimer, 50);
                        }
                    });
                }
            });
        }
    });

    $("#fileSketch").change(function() {
        i = 1;
        formName = "#formSketch";

        if(os != "esp8266") {
            $(formName + " input[name=interface]").val($("#firmware-interface").val());
            $(formName).submit();
        }else{
            timer = setInterval(progressTimer, 40);
        }
    });

    $("#browseSPIFFS").click(function(){
        $("#fileSPIFFS").trigger("click");
    });

    $("#browseSketch").click(function(){
        $("#fileSketch").trigger("click");
    });
});