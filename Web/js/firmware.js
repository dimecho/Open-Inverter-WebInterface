var jtag_interface = [
	"interface/ftdi/olimex-arm-usb-ocd-h.cfg",
	"interface/ftdi/olimex-arm-usb-tiny-h.cfg",
	"interface/parport.cfg",
	"interface/stlink-v2.cfg",
	"interface/ftdi/jtag-lock-pick_tiny_2.cfg",
	"interface/jlink.cfg",
	"interface/cmsis-dap.cfg"
];

var jtag_name = [
	"Olimex OCD-H",
	"Olimex Tiny-H",
	"JTAG Wiggler",
	"STlink v2.0",
	"Lock-Pick Tiny v2.0",
	"J-Link",
	"CoLinkEx v1.2"
];

$(document).on('click', '.browse', function(){
		var file = $('.file');
		file.trigger('click');
});

function setInterfaceImage() {
	try{
		var img = $("#firmware-interface").val().split("/").pop().slice(0, -4);
		if(img == "stlink-v2")
		{
			window.location.href = "st-link.php";
		}else{
			$("#jtag-image").attr("src", "firmware/img/" + img + ".jpg");
			$("#jtag-name").html(jtag_name[$("#firmware-interface option:selected").index()]);
		}
	}catch{
		//ESP8266 Detected
		$.ajax({
			url: "serial.php",
			success: function() {
				$("#jtag-txt").append("Caution: Main board Olimex is powered with 3.3V - Double check your TTL-USB adapter.");
				$("#jtag-image").attr("src","firmware/img/usb_ttl.jpg");
			},
			error: function () {
				$("#jtag-txt").append("Solder <b>GPIO-0</b> to <b>1</b> and boot ESP8266 from flash. Inverter firmware will flash using ESP8266 UART internally.");
				$("#jtag-image").attr("src","firmware/img/esp8266.jpg");
			}
		});
	}
};

function firmwareUpload() {
	var file = $('.file').get(0).files[0].name;

	if (file.toUpperCase().indexOf(".BIN") !=-1 || file.toUpperCase().indexOf(".HEX") !=-1) {
		$('#firmwareForm').submit();
	}else{
		$.notify({ message: "File must be .bin or .hex format" }, { type: "danger" });
	}
};

function firmwareFlash() {
    var progressBar = $("#progressBar");
    for (var i = 0; i < 100; i++) {
        setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
    }
    $.ajax({
        type: "GET",
        url: "firmware.php?ajax=1",
        success: function(data){
            deleteCookie("version");
            //console.log(data);
            progressBar.css("width","100%");
            $("#output").append($("<pre>").append(data));
            setTimeout( function (){
                window.location.href = "index.php";
            },6400);
        }
    });
};