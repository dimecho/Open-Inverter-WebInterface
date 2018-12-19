var jtag_interface = [
	"interface/ftdi/olimex-arm-usb-ocd-h.cfg",
	"interface/ftdi/olimex-arm-usb-tiny-h.cfg",
	"interface/parport.cfg",
	"interface/stlink-v2.cfg",
	"interface/ftdi/jtag-lock-pick_tiny_2.cfg"
];

var jtag_name = [
	"Olimex OCD-H",
	"Olimex Tiny-H",
	"JTAG Wiggler",
	"STlink v2.0",
	"Lock-Pick Tiny v2.0"
];

$(document).on('click', '.browse', function(){
	var file = $('.file');
	file.trigger('click');
});

function setInterfaceImage() {

    var v = $("#firmware-interface").val();

	if(v.indexOf("interface") != -1)
    {
		if(v.indexOf("stlink-v2") != -1)
		{
			$("#jtag-image").attr("src", "firmware/img/stlinkv2.png");
			checkSoftware("stlink");
		}else{
            var img = v.split("/").pop().slice(0, -4);
			$("#jtag-image").attr("src", "firmware/img/" + img + ".jpg");
		}
		$("#jtag-name").html(jtag_name[$("#firmware-interface option:selected").index()]);
        $("#jtag-txt").html("");
	}else{
		if(os == "esp8266") {
			$("#jtag-txt").html("Solder <b>GPIO-0</b> to <b>1</b> and boot ESP8266 from flash. Inverter firmware will flash using ESP8266 UART0.");
			$("#jtag-image").attr("src","firmware/img/esp8266.png");
		}else{
			$("#jtag-txt").html("Caution: Main board Olimex is powered with 3.3V - Double check your TTL-USB adapter.");
			$("#jtag-image").attr("src","firmware/img/usb_ttl.jpg");
		}
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