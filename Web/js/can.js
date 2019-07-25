var json = {};

var can_interface = [
	"firmware/img/canable.jpg",
    "firmware/img/uccb.jpg",
    "firmware/img/usb2can.png",
	"firmware/img/can-mcp2515.jpg"
];

var can_order = [
    "https://store.protofusion.org/product/canable",
    "https://www.tindie.com/products/lll7/can-usb-converter-uccb",
    "https://github.com/roboterclubaachen/usb2can",
    "#",
];

var can_name = [
	"CANable",
    "uCCB",
    "USB2CAN",
	"MCP2515"
];

$(document).ready(function () {

    if(os == "esp8266") {
		$("#can-interface").append($("<option>",{value:can_interface.length}).append("CAN over ESP8266 with MCP2515"));
    }else{
    	for (var i = 0; i < can_interface.length-1; i++) {
    		$("#can-interface").append($("<option>",{value:i}).append(can_name[i]));
    	}
        setCANImage();
    }

	$.ajax("serial.php?get=canspeed,canperiod", {
        async: false,
        success: function success(data)
        {
            data = data.replace("\n\n", "\n");
            data = data.split(/\n/);
			console.log(data);
			
			$("#can-speed").prop('selectedIndex', data[0]);
			$("#can-period").prop('selectedIndex', data[1]);

            buildCANParameters();
		}
    });
    
    buildStatus(false);
});

function setCANImage() {

    var img = $("#can-image img");
    var v = $("#can-interface").val();

	img.attr("src", can_interface[v]);
    img.attr("data-toggle", "popover");
    img.attr("data-placement", "left");
    img.attr("data-content", "<a href='" + can_order[v] + "' target=_blank>Order Here</a>");

    $(".pop").popover({ trigger: "manual" , html: true, animation:false})
        .on("mouseenter", function () {
            var _this = this;
            $(this).popover("show");
            $(".popover").on("mouseleave", function () {
                $(_this).popover('hide');
            });
        }).on("mouseleave", function () {
            var _this = this;
            setTimeout(function () {
                if (!$(".popover:hover").length) {
                    $(_this).popover("hide");
                }
        }, 300);
    });

    if(os != "esp8266") {
        var can_app = "Cantact";
	    var can_app_button = $("<button>", {class:"btn btn-primary"}).append($("<i>", {class:"icons icon-list"}));
        var can_firmware_button = $("<button>", {class:"btn btn-warning"}).append($("<i>", {class:"icons icon-chip"}));

	    if(can_name[v] == "USB2CAN") {
            can_app = "Cangaroo";
	    }

        can_app_button.attr("onClick", "eval(checkSoftware('" + can_app.toLowerCase() + "'))");
        can_app_button.append(" Open " + can_app + " App");

		$("#can-app").empty().append(can_app_button);

        if(os != "mobile") {
            can_firmware_button.append(" Update Firmware");
            $("#can-firmware").empty().append(can_firmware_button);

            can_firmware_button.click(function()
            {
                callback = eval(checkSoftware('dfu',can_name[v].toLowerCase()));
                console.log(callback);

                if(os == "mac" && callback.indexOf("User canceled") != -1) {
                    $.notify({ message: "macOS requires privilege escalation" }, { type: "danger" });
                }else if(callback.indexOf("No DFU") != -1 || callback.indexOf("0 Device(s) found") != -1) {
                    $.notify({ message: "No DFU capable USB device available" }, { type: "danger" });
                    $.notify({ message: "Set BOOT jumper and plug-in USB device" }, { type: "warning" });
                }else if (callback != "Download done") {
                    $.notify({ message: "DFU Firmware Updated"}, { type: "success" });
                }
            });
        }
	}
};

function setCANSpeed() {
	var v = $("#can-speed").val();
	$.notify({ message: "canspeed=" + v },{ type: 'warning' });
	setParameter("canspeed",v,true,true);
};

function setCANPeriod() {
	var v = $("#can-period").val();
	$.notify({ message: "canperiod=" + v },{ type: 'warning' });
	setParameter("canperiod",v,true,true);
};

function canbitLimit(value) {
    if(parseInt(value) >= 256) {
        $.notify({ message: "Max 16-bit = 03 E7, will split into byte-wise" }, { type: "warning" });
    }
};

function buildCANParameters() {
    
    $(".loader").show();

    json = sendCommand("json");
    
    if(json)
    {
        var menu = $("#parameters").empty();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("TX/RX")).append($("<th>").append("CAN ID")).append($("<th>").append("Offset Bits")).append($("<th>").append("Length Bits")).append($("<th>").append("Priority (Gain 10mV)")));
        var tbody = $("<tbody>");
        menu.append(thead);
        menu.append(tbody);

        for(var key in json)
        {
            var db_canrx = "btn-secondary";
            var canid = "";
            var canoffset = 0;
            var canlength = 2;
            var cangain = 1;
			var canrxid = 0;

            if(json[key].canid)
                canid = json[key].canid;
            if(json[key].canoffset)
                canoffset = json[key].canoffset;
            if(json[key].canlength)
                cangain = json[key].canlength;
            if(json[key].cangain)
                cangain = json[key].cangain;
            
            var bitsmax = parseInt(json[key].maximum);
            if (bitsmax == 0) //Try current value
				bitsmax = json[key].value;

			if (bitsmax >= 65536) { //over 16 bit (1111111111111111)
				canlength = 24;
            }else if (bitsmax >= 256) { //over 8 bit (11111111)
                canlength = 16;
            }else if (bitsmax >= 16) { //over 4 bit (1111)
                canlength = 8;
            }else if (bitsmax >= 4) { //over 2 bit (11)
                canlength = 4;
            }

			//console.log(key);
			var div_txrx = $("<div>").css({width:90});
			var cantx = $("<button>", { class:"btn btn-sm mx-1", id:key + "-cantx" }).append("TX");
			var canrx = $("<button>", { class:"btn btn-sm mx-1", id:key + "-canrx" }).append("RX");
			
			var form_canid = $("<form>", { class:"form-inline" });
            var input_canid = $("<input>", { type:"text", class:"form-control form-control-sm text-center", value:canid, id:key + "-canid" }).css({width:"50%"});
			var input_canid_hex = $("<input>", { type:"text", class:"form-control form-control-sm text-center", value:"0x" + toHex(canid), id:key + "-canidhex" }).css({width:"50%"});
            
            var div_canoffset = $("<div>", { class:"form-group" });
            var input_canoffset = $("<input>", { type:"text", class:"form-control form-control-sm text-center", value:canoffset, id:key });
            
            var div_canlength = $("<div>", { class:"form-group" });
            var input_canlength = $("<input>", { type:"text", class:"form-control form-control-sm text-center", value:canlength, id:key + "-canlength" });
            
            var form_cangain = $("<form>", { class:"form-inline" });
			var input_cangain = $("<input>", { type:"text", class:"form-control form-control-sm text-center", value:cangain, id:key + "-cangain" }).css({width:"50%"});
			var input_cangain_hex = $("<input>", { type:"text", class:"form-control form-control-sm text-center", value:"0x" + toHex(cangain), id:key + "-cangainhex" }).css({width:"50%"});
			
            if(json[key].isrx == true) { //RX
                canrx.addClass("btn-primary");
                cantx.addClass("btn-secondary");
            }else{
                if(canid != "") { //TX
                    cantx.addClass("btn-primary");
                }else{
                    cantx.addClass("btn-secondary");
                }
                canrx.addClass("btn-secondary");
            }

			if(json[key].isparam == false) { //read only
				if (key.indexOf("din_") != -1) {
                	canrx.prop('disabled', true);
        		}
            }

            form_canid.append(input_canid);
            form_cangain.append(input_cangain);
            
            div_canoffset.append(input_canoffset);
            div_canlength.append(input_canlength);

            if(os === "mobile") {
                input_canid.attr("type","number");
                input_canoffset.attr("type","number");
                input_canlength.attr("type","number");
                input_cangain.attr("type","number");
			}else{
				form_canid.append(input_canid_hex);
				form_cangain.append(input_cangain_hex);
			}

			input_canid.on('input',function(e) {
                var value = parseInt($(this).val());
                var hex = toHex($(this).val());
                //console.log("0x" + hex);
                $(this).parent().find("input").filter(':visible:last').val("0x" + hex);
			});

            input_canid_hex.focusout(function() {
           		var value = $(this).val();
            	if(value.substring(0, 2) != "0x")
                	value = "0x" + value.toUpperCase();
                $(this).val(value);
            });

            input_cangain.on('input',function(e) {
                var value = parseInt($(this).val());
                var hex = toHex($(this).val());
                //console.log("0x" + hex);
                $(this).parent().find("input").filter(':visible:last').val("0x" + hex);
                canbitLimit(value);
			});

			input_cangain_hex.on('input',function(e) {
                var value = parseInt(("0x" + $(this).val()).replace("0x0x","0x"));
                $(this).parent().find("input").filter(':visible:first').val(value);
                canbitLimit(value);
			});

            input_cangain_hex.focusout(function() {
            	var value = $(this).val();
            	if(value.substring(0, 2) != "0x")
                	value = "0x" + value.toUpperCase();
                $(this).val(value);
            });

            div_txrx.append(cantx).append(canrx);

			var tr = $("<tr>");
			var td1 = $("<td>").append(key);
			var td2 = $("<td>").append(div_txrx);
			var td4 = $("<td>").append(form_canid);
			var td5 = $("<td>").append(div_canoffset);
            var td6 = $("<td>").append(div_canlength);
			var td7 = $("<td>").append(form_cangain);
			tbody.append(tr.append(td1).append(td2).append(td4).append(td5).append(td6).append(td7));

			cantx.click(function() {
				//console.log(this.id);
				if ($(this).hasClass("btn-secondary"))
                {
					$(this).removeClass("btn-secondary");
                    $(this).addClass("btn-primary");
                    $("#" + this.id.replace("-cantx","-canrx")).removeClass("btn-primary");
                    $("#" + this.id.replace("-cantx","-canrx")).addClass("btn-secondary");
                    $("#" + this.id.replace("-cantx","-cangain")).val(1);
				}else{
					$(this).removeClass("btn-primary");
					$(this).addClass("btn-secondary");
				}
			});

			canrx.click(function() {
				//console.log(this.id);
				if ($(this).hasClass("btn-secondary"))
                {
					$(this).removeClass("btn-secondary");
					$(this).addClass("btn-primary");
                    $("#" + this.id.replace("-canrx","-cantx")).removeClass("btn-primary");
                    $("#" + this.id.replace("-canrx","-cantx")).addClass("btn-secondary");
                    $("#" + this.id.replace("-canrx","-cangain")).val(32);
				}else{
					$(this).removeClass("btn-primary");
					$(this).addClass("btn-secondary");
				}
			});
        };
        menu.show();

        if(os === "mobile") {
            $("table").attr("style","font-size: 140%;");
            $("input").attr("style","font-size: 110%; width: 100%; height: 1.5em");
            $(".btn").attr("style","font-size: 120%;");
        }

        $('[data-toggle="tooltip"]').tooltip();
    }

    $(".loader").hide();
};

function toHex(d) {
    var n = Number(d).toString(16);
    if(n.length & 1) //Odd
        n = "0" + n;
    return n.toUpperCase();
};

function saveCANMapping() {

    if(json)
    {
        var i = 0;
        var n = 0;

        for(var key in json)
        {
            if ($("#"+key+"-cantx").hasClass("btn-primary"))
                n++;

            if ($("#"+key+"-canrx").hasClass("btn-primary"))
                n++;
        }

        if(n <= 8)
        {
            var canjson = [];
            var data;

            //TODO: use individiual deletes "can del param"
            sendCommand("can clear");

            for(var key in json)
            {
                if($("#" + key + "-cantx").hasClass("btn-primary") || $("#" + key + "-canrx").hasClass("btn-primary"))
                {
                    var canoffset = parseInt($("#"+ key).val());
                    var canlength = parseInt($("#"+ key + "-canlength").val());
                    var canid = parseInt($("#"+ key + "-canid").val());
                    var cangain = $("#" + key + "-cangain").val();

                    if (isInt(canid) == false) {
                        $.notify({ message: "[" + key + "] CAN ID must be a number" }, { type: "danger" });
                        return;
                    }

                    if (isInt(canoffset) == false) {
                        $.notify({ message: "[" + key + "] CAN offset bit must be a number" }, { type: "danger" });
                        return;
                    }

                    cangain = parseInt(cangain);

                    if(cangain == 0) {
                        cangain = 1;
                    }else{
                        if (isInt(cangain) == false) {
                            $.notify({ message: "[" + key + "] CAN gain must be a number" }, { type: "danger" });
                            return;
                        }
                    }

                    var cancommand = [];
                    var canjsonkey = {};
                    var canjsonitem = {};

                    if(canid == "") {
                        $.notify({ message: "[" + key + "] missing CAN ID" }, { type: "danger" });
                        return;
                    }

                    canjsonkey[key] = [];

                    if ($("#"+key+"-cantx").hasClass("btn-primary")) {

                        if (key == "pot") {
							setParameter("potmode",0,true,true);
                    	}else if (key == "pot2") {
                    		setParameter("potmode",1,true,true);
                    	}

                        var can_split = 1;

                        if (cangain > 255) {
                            can_split = canlength / 4;
                            console.log("CAN Split: " + can_split);
                        }

                        //console.log(bitsmax + ">" + bits);

                        for(var i = 0; i < can_split; i++) {
                            cancommand.push("can tx " + key + " " + canid + " " + (i * (canlength/can_split)) + " " + (canlength/can_split) + " " + cangain);
                        }

                        canjsonitem = {};
                        canjsonitem["com"] = "tx";
                        canjsonitem["canid"] = canid;
                        canjsonitem["offset"] = canoffset;
                        canjsonitem["length"] = canlength;
                        canjsonitem["gain"] = cangain;
                        canjsonkey[key].push(canjsonitem);
                    }

                    if ($("#"+key+"-canrx").hasClass("btn-primary")) {

                    	if (key == "pot" || key == "pot2") {
							setParameter("potmode",2,true,true);
                    	}

                        cancommand.push("can rx " + key + " " + canid + " " + canoffset + " " + canlength + " " + cangain);

                        canjsonitem = {};
                        canjsonitem["com"] = "rx";
                        canjsonitem["canid"] = i;
                        canjsonitem["offset"] = canoffset;
                        canjsonitem["length"] = canlength;
                        canjsonitem["gain"] = cangain;
                        canjsonkey[key].push(canjsonitem);
                    }

                    canjson.push(canjsonkey);

                    for (var x = 0; x < cancommand.length; x++) {

                        $.notify({ message: cancommand[x] }, { type: "warning" });

                        data = sendCommand(cancommand[x]);

                        if (data.indexOf("successful") != -1) {
                            $.notify({ message: data }, { type: "success" });
                        } else {
                            $.notify({ icon: "icons icon-alert", title: "Error", message: data },{ type: "danger" });
                        }
                    }
                }
                i++;
            }

            sendCommand("save");

        }else{
            $.notify({ message: "A maximum of 8 messages can be defined" }, { type: "danger" });
        }
    }
};

function setCANDefaults() {

    alertify.confirm('', 'Reset CAN settings back to default.', function () {

        var data = sendCommand("can clear");
        //console.log(data);

        if (data.indexOf("clear") != -1) {
            $.notify({ message: "CAN reset to Default" }, { type: "success" });
        } else {
            $.notify({ icon: "icons icon-alert", title: "Error", message: data }, { type: "danger" });
        }

        setTimeout(function () {
            window.location.href = "can.php";
        }, 2000);

    }, function () {});
};