var canDB = {};
var canMap = {};
var json = {};

var can_interface = [
	"firmware/img/canable.jpg",
	"firmware/img/usb2can.png",
	"firmware/img/can-mcp2515.jpg"
];

var can_name = [
	"CANable",
	"USB2CAN",
	"MCP2515"
];

$(document).ready(function () {

	$.ajax("js/can.json", {
		async: false,
        dataType: 'json',
        success: function success(data) {
            //console.log(data);
            canDB = data;
        }
    });
	
	$.ajax("js/canmap.json", {
		async: false,
        dataType: 'json',
        success: function success(data) {
            //console.log(data);
            canMap = data;
        }
    });

    if(os == "esp8266") {
        $("#open-cantact").remove();
		$("#can-interface").append($("<option>",{value:can_interface[2]}).append("CAN over ESP8266 with MCP2515"));
    }else{
    	for (var i = 0; i < can_interface.length; i++) {
    		$("#can-interface").append($("<option>",{value:can_interface[i]}).append(can_name[i]));
    	}
        setCANImage();
    }
	
	$.ajax("serial.php?get=canspeed,canperiod", {
        //async: sync,
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
	$("#can-image img").attr("src", $("#can-interface").val());
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

function buildCANParameters() {
    
    $(".loader").show();

    json = sendCommand("json");
    
    if(json)
    {
        var menu = $("#parameters").empty();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("TX/RX")).append($("<th>").append("RX ID")).append($("<th>").append("TX ID")).append($("<th>").append("Offset Bit")).append($("<th>").append("Priority (Gain 10mV)")));
        var tbody = $("<tbody>");
        menu.append(thead);
        menu.append(tbody);

        for(var key in json)
        {
            var db_cantx = "btn-secondary";
            var db_canrx = "btn-secondary";
            var db_canid = "";
            var db_canpos = 0;
            var db_cangain = 1;
			
            for (var k in canDB[0][key])
            {
                if(canDB[0][key][k].com == "tx"){
                    db_cantx = "btn-primary";
                    db_canid = canDB[0][key][k].canid;
                }else if (canDB[0][key][k].com == "rx"){
                    db_canrx = "btn-primary";
                }
                db_canpos = canDB[0][key][k].position;
                db_cangain = canDB[0][key][k].gain;
            }
			
			var canrxid = canMap[key];

			if(canrxid > 0)
			{
				//console.log(key);
				var cantx = $("<button>", { class:"btn " + db_cantx + " btn-sm mx-1", id:key + "-cantx" }).append("TX");
				var canrx = $("<button>", { class:"btn " + db_canrx + " btn-sm mx-1", id:key + "-canrx" }).append("RX");
				var cantxid = $("<input>", { type:"text", class:"text-center", value:db_canid, id:key + "-cantxid" }).css({width:120});
				if(db_cantx == "btn-secondary")
					cantxid.prop('disabled', true);
				var canpos = $("<input>", { type:"text", class:"text-center", value:db_canpos, id:key }).css({width:120});

				var div = $("<div>", { class:"input-group" });
				var cangain = $("<input>", { type:"text", class:"text-center", value:db_cangain, id:key + "-cangain" }).css({width:120});
				var cangain_hex = $("<input>", { type:"text", class:"text-center", value:"0x" + toHex(db_cangain), id:key + "-cangainhex" }).css({width:120});
				
				if(os === "mobile") {
                    cantxid.attr("type","number");
                    canpos.attr("type","number");
                    cangain.attr("type","number");
					div.append(cangain);
				}else{
					var cangain_sub = $("<button>", { class:"input-group-addon btn btn-secondary btn-sm" }).append("-");
					var cangain_add = $("<button>", { class:"input-group-addon btn btn-secondary btn-sm" }).append("+");
					
					//div.append(cangain_sub).append(cangain).append(cangain_add);
					div.append(cangain);
					div.append(cangain_hex);

					cangain_sub.click(function(){
						//console.log($(this).parent().find("input").val());
						var value = parseInt($(this).parent().find("input").val());
						if(value > 1){
							value--;
							$(this).parent().find("input").filter(':visible:first').val(value);
                            cangain.change();
						}
					});

					cangain_add.click(function(){
						//console.log($(this).parent().find("input").val());
						var value = parseInt($(this).parent().find("input").val());
						value++;
						$(this).parent().find("input").filter(':visible:first').val(value);
                        cangain.change();
					});

                    cangain.on('input',function(e){
                        var value = parseInt($(this).val());
                        var hex = toHex($(this).val());
                        console.log("0x" + hex);
                        cangainLimit(value);
                        $(this).parent().find("input").filter(':visible:last').val("0x" + hex);
					});

					cangain_hex.on('input',function(e){
                        var value = parseInt(("0x" + $(this).val()).replace("0x0x","0x"));
                        cangainLimit(value);
                        $(this).parent().find("input").filter(':visible:first').val(value);
					});
					function cangainLimit(value) {
						if(value > 255){
                            $.notify({ message: "CAN gain max 255 (16-bit), will split into byte-wise" }, { type: "warning" });
                        }
					}
				}
			   
				var tr = $("<tr>");
				var td1 = $("<td>").append(key);
				var td2 = $("<td>").append(cantx).append(canrx);
				var td3 = $("<td>").append(canrxid);
				var td4 = $("<td>").append(cantxid);
				var td5 = $("<td>").append(canpos);
				var td6 = $("<td>").append(div);
				tbody.append(tr.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6));

				cantx.click(function(){
					//console.log(this.id);
					if ($(this).hasClass("btn-secondary")) {
						$(this).removeClass("btn-secondary");
						$(this).addClass("btn-primary");
						$("#" + this.id + "id").prop('disabled', false);
					}else{
						$(this).removeClass("btn-primary");
						$(this).addClass("btn-secondary");
						$("#" + this.id + "id").prop('disabled', true);
					}
				});

				canrx.click(function(){
					//console.log(this.id);
					if ($(this).hasClass("btn-secondary")) {
						$(this).removeClass("btn-secondary");
						$(this).addClass("btn-primary");
					}else{
						$(this).removeClass("btn-primary");
						$(this).addClass("btn-secondary");
					}
				});
			}
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
}

function saveCANMapping() {

	var v = $("#can-speed").val();
	setParameter("canspeed", v, true, true);
	
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

            for(var key in json)
            {
                if($("#"+key+"-cantx").hasClass("btn-primary") || $("#"+key+"-canrx").hasClass("btn-primary"))
                {
                    var canpos = parseInt($("#"+ key).val());
                    var canid = parseInt($("#"+key+"-cantxid").val());
                    var cangain = $("#"+key+"-cangain").val();

                     if (isInt(canid) == false) {
                        $.notify({ message: "[" + key + "] CAN TX ID must be a number" }, { type: "danger" });
                        return;
                    }

                    if (isInt(canpos) == false) {
                        $.notify({ message: "[" + key + "] CAN bit offset must be a number" }, { type: "danger" });
                        return;
                    }

                    cangain = parseInt(cangain);
                    var canbits = toHex(cangain).toString().length * 2;

                    if(cangain == 0) {
                        cangain = 1;
                    }else{
                        if (isInt(cangain) == false){
                            $.notify({ message: "[" + key + "] CAN gain must be a number" }, { type: "danger" });
                            return;
                        }
                    }

                    var cancommand = [];
                    var canjsonkey = {};
                    var canjsonitem = {};

                    if ($("#"+key+"-cantx").hasClass("btn-secondary") && $("#"+key+"-canrx").hasClass("btn-secondary")) {
                        $.notify({ message: "[" + key + "] CAN needs TX/RX" }, { type: "danger" });
                        return;
                    }

                    canjsonkey[key] = [];

                    if ($("#"+key+"-cantx").hasClass("btn-primary")) {

                        if(canid == "") {
                            $.notify({ message: "[" + key + "] CAN needs Transmit ID" }, { type: "danger" });
                            return;
                        }

                        var can_split = 1;

                        if (cangain > 255) {
                        	can_split = (canbits/4);
                        	console.log("CAN Split: " + can_split);
						}

                        for(var i = 0; i < can_split; i++) {
                            cancommand.push("can tx " + key + " " + canid + " " + (i * 8) + " " + canbits + " " + cangain);
                        }

                        canjsonitem = {};
                        canjsonitem["com"] = "tx";
                        canjsonitem["canid"] = canid;
                        canjsonitem["position"] = canpos;
                        canjsonitem["length"] = canbits;
                        canjsonitem["gain"] = cangain;
                        canjsonkey[key].push(canjsonitem);
                    }

                    if ($("#"+key+"-canrx").hasClass("btn-primary")) {
                        cancommand.push("can rx " + key + " " + i + " " + canpos + " " + canbits + " " + cangain);

                        canjsonitem = {};
                        canjsonitem["com"] = "rx";
                        canjsonitem["canid"] = i;
                        canjsonitem["position"] = canpos;
                        canjsonitem["length"] = canbits;
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

            data = sendCommand("save");

            if(data.indexOf("stored") != -1)
            {
            	console.log(JSON.stringify(canjson));

               $.ajax("can.php", {
                    type: "POST",
                    async: false,
                    dataType: "json",
                    data: {"data": JSON.stringify(canjson)},
                    //success: function(data) { 
					//    console.log(data);
					//},
                    failure: function(errMsg) {
                        $.notify({ icon: "icons icon-alert", title: "Error", message: errMsg },{ type: "danger" });
                    }
                });
            }else{
                $.notify({ icon: 'icons icon-alert', title: 'Error', message: data },{ type: 'danger' });
            }
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
            $.ajax("can.php?clear=1");
            $.notify({ message: "CAN reset to Default" }, { type: "success" });
        } else {
            $.notify({ icon: "icons icon-alert", title: "Error", message: data }, { type: "danger" });
        }

        setTimeout(function () {
            window.location.href = "can.php";
        }, 2000);

    }, function () {});
};