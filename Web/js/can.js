var canMap;

$(document).ready(function () {

    buildCANParameters();
});

function buildCANParameters() {
    
    canMap = loadJSON();
    
    if(canMap)
    {
        var menu = $("#parameters").empty();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("CAN COM")).append($("<th>").append("CAN Offset Bit")).append($("<th>").append("CAN Gain (10mV)")));
        var tbody = $("<tbody>");
        menu.append(thead);
        menu.append(tbody);

        for(var key in canMap)
        {
            //console.log(key);

            var a = $("<span>").append(canMap[key].value);
            var cantx = $("<button>", { class:"btn btn-secondary btn-sm mx-1", id:key + "-cantx" }).append("TX");
            var canrx = $("<button>", { class:"btn btn-secondary btn-sm mx-1", id:key + "-canrx" }).append("RX");
            var canpos = $("<input>", { type:"text", value:"", id:key });
            var cangain = $("<input>", { type:"text", value:"", id:key + "-cangain" });
            var tr = $("<tr>");

            a.attr("data-toggle", "tooltip");
            a.attr("data-html", true);
            a.attr("title", "<h6>" + canMap[key].unit.replace("","°") + "</h6>");

            var td1 = $("<td>").append(key);
            var td2 = $("<td>").append(a);
            var td3 = $("<td>").append(cantx).append(canrx);
            var td4 = $("<td>").append(canpos);
            var td5 = $("<td>").append(cangain);
            
            tbody.append(tr.append(td1).append(td2).append(td3).append(td4).append(td5));

            cantx.click(function(){
                //console.log(this.id);
                if ($(this).hasClass("btn-secondary")) {
                    $(this).removeClass("btn-secondary");
                    $(this).addClass("btn-primary");
                }else{
                    $(this).removeClass("btn-primary");
                    $(this).addClass("btn-secondary");
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
            if($("#"+key).val() != "")
                n++;
        }

        if(n <= 8)
        {
            for(var key in canMap)
            {
                var canpos = $("#"+key).val();
                var cangain = $("#"+key+"-cangain").val();

                if(canpos != "")
                {
                    canpos = parseInt(canpos);

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
                        cancommand.push("can tx " + key + " " + i + " " + canpos + " " + canbits + " " + cangain); 
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