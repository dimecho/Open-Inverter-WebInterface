var canMap;

$(document).ready(function () {

    buildCANParameters();
});

function buildCANParameters() {
    
    canMap = loadJSON();
    
    if(canMap)
    {
        var menu = $("#parameters").empty();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("TX/RX")).append($("<th>").append("RX ID")).append($("<th>").append("TX ID")).append($("<th>").append("Offset Bit")).append($("<th>").append("Priority (Gain 10mV)")));
        var tbody = $("<tbody>");
        menu.append(thead);
        menu.append(tbody);

        var i = 0;

        for(var key in canMap)
        {
            //console.log(key);
            var cantx = $("<button>", { class:"btn btn-secondary btn-sm mx-1", id:key + "-cantx" }).append("TX");
            var canrx = $("<button>", { class:"btn btn-secondary btn-sm mx-1", id:key + "-canrx" }).append("RX");
            var canid = $("<input>", { class:"text-center", type:"text", value:"", id:key + "-cantxid", disabled:"disabled" }).css({width:120});
            var canpos = $("<input>", { class:"text-center", type:"text", value:"0", id:key }).css({width:120});

            var div = $("<div>", { class:"input-group" }); //.css({width:"100%"});
            var cangain_sub = $("<button>", { class:"input-group-addon btn btn-secondary btn-sm" }).append("-");
            var cangain = $("<input>", { class:"form-control text-center", type:"text", value:"1", id:key + "-cangain" }).css({width:40});
            var cangain_add = $("<button>", { class:"input-group-addon btn btn-secondary btn-sm" }).append("+");
            div.append(cangain_sub).append(cangain).append(cangain_add);
           
            var tr = $("<tr>");
            var td1 = $("<td>").append(key);
            var td2 = $("<td>").append(cantx).append(canrx);
            var td3 = $("<td>").append(i);
            var td4 = $("<td>").append(canid);
            var td5 = $("<td>").append(canpos);
            var td6 = $("<td>").append(div);
            tbody.append(tr.append(td1).append(td2).append(td3).append(td4).append(td5).append(td6));

            cangain_sub.click(function(){
                //console.log($(this).parent().find("input").val());
                var value = parseInt($(this).parent().find("input").val());
                if(value > 1){
                    value--;
                    $(this).parent().find("input").val(value);
                }
            });

            cangain_add.click(function(){
                //console.log($(this).parent().find("input").val());
                var value = parseInt($(this).parent().find("input").val());
                if(value < 10){
                    value++;
                    $(this).parent().find("input").val(value);
                }
            });

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

            i++;
        };
        menu.show();

        $('[data-toggle="tooltip"]').tooltip();
    }
};

function saveCANMapping() {

    if(canMap)
    {
        var i = 0;
        var n = 0;

        for(var key in canMap)
        {
            if ($("#"+key+"-cantx").hasClass("btn-primary"))
                n++;

            if ($("#"+key+"-canrx").hasClass("btn-primary"))
                n++;
        }

        if(n <= 8)
        {
            for(var key in canMap)
            {
                if($("#"+key+"-cantx").hasClass("btn-primary") || $("#"+key+"-canrx").hasClass("btn-primary"))
                {
                    var canpos = parseInt($("#"+key).val());
                    var canid = $("#"+key+"-cantxid").val();
                    var cangain = $("#"+key+"-cangain").val();

                    if (isInt(canpos) == false){
                        $.notify({ message: "[" + key + "] CAN bit offset must be a number" }, { type: "danger" });
                        return;
                    }

                    //TODO check for conflict offset
                    var canbits = canMap[key].value.toString().length;

                    if(cangain == ""){
                        cangain = 1;
                    }else{
                        cangain = parseInt(cangain);
                        if (isInt(cangain) == false){
                            $.notify({ message: "[" + key + "] CAN gain must be a number" }, { type: "danger" });
                            return;
                        }
                    }

                    var cancommand = [];

                    if ($("#"+key+"-cantx").hasClass("btn-secondary") && $("#"+key+"-canrx").hasClass("btn-secondary")) {
                        $.notify({ message: "[" + key + "] CAN needs TX/RX" }, { type: "danger" });
                        return;
                    }

                    if ($("#"+key+"-cantx").hasClass("btn-primary")) {

                        if(canid == ""){
                            $.notify({ message: "[" + key + "] CAN needs Transmit ID" }, { type: "danger" });
                            return;
                        }
                        cancommand.push("can tx " + key + " " + canid + " " + canpos + " " + canbits + " " + cangain); 
                    }

                    if ($("#"+key+"-canrx").hasClass("btn-primary")) {
                        cancommand.push("can rx " + key + " " + i + " " + canpos + " " + canbits + " " + cangain); 
                    }

                    for (var x = 0; x < cancommand.length; x++) {

                        $.notify({ message: cancommand[x] }, { type: "warning" });

                        var data = sendCommand(cancommand[x]);

                        if (data.indexOf("successful") != -1) {
                            $.notify({ message: data }, { type: "success" });
                        } else {
                            $.notify({ icon: "glyphicon glyphicon-warning-sign", title: "Error", message: data },{ type: "danger" });
                        }
                    }
                }
                i++;
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
            $.notify({ message: "CAN reset to Default" }, { type: "success" });
        } else {
            $.notify({ icon: "glyphicon glyphicon-warning-sign", title: "Error", message: data }, { type: "danger" });
        }

        setTimeout(function () {
            window.location.href = "/can.php";
        }, 2000);

    }, function () {});
};