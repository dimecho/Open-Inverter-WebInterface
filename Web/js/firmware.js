$(document).ready(function() {

    //ESP8266 Detected
    $.ajax({
        url: "/config.inc.php",
        success: function() {
            $("#f_c_txt").append("Caution: Main board Olimex is powered with 3.3V - Double check your TTL-USB adapter.");
            $("#f_c_img").attr("src","/firmware/img/usb_ttl.jpg");
        },
        error: function () {
            $("#f_c_txt").append("Solder <b>GPIO-0</b> to <b>1</b> and boot ESP8266 from flash. Inverter firmware will flash using ESP8266 UART internally.");
            $("#f_c_img").attr("src","/firmware/img/esp8266.jpg");
        }
    });

    $.ajax({
        url: "/serial.php?com=list",
        timeout: 4000,
        success: function(data) {
            //console.log(data);
            var s = data.split(',');
            for (var i = 0; i < s.length; i++) {
                $("#serialList").append($("<option>",{value:s[i]}).append(s[i]));
            }
            $(".loader").hide();
            $(".input-group-addon").show();
        },
        error: function() {
            $(".loader").hide();
            $(".input-group-addon").show();
        }
    });
    
    $("#firmwareFile").change(function() {
        $("#firmwareForm").submit();
    });

    $("#browseFirmware").click(function(){
        $('#firmwareFile').trigger("click");
    });
});

function firmwareFlash() {
    var progressBar = $("#progressBar");
    for (var i = 0; i < 100; i++) {
        setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
    }
    $.ajax({
        type: "GET",
        url: "/firmware.php?ajax=1",
        success: function(data){
            deleteCookie("version");
            //console.log(data);
            progressBar.css("width","100%");
            $("#output").append($("<pre>").append(data));
            setTimeout( function (){
                window.location.href = "/index.php";
            },6400);
        }
    });
};