var canDB = [{}];
var json = {};

$(document).ready(function () {

    canDB = loadCANDB();

    buildCANParameters();
    buildStatus(false);
});

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

        var i = 0;

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
          
            //console.log(key);
            var cantx = $("<button>", { class:"btn " + db_cantx + " btn-sm mx-1", id:key + "-cantx" }).append("TX");
            var canrx = $("<button>", { class:"btn " + db_canrx + " btn-sm mx-1", id:key + "-canrx" }).append("RX");
            var canid = $("<input>", { type:"number", class:"text-center", value:db_canid, id:key + "-cantxid" }).css({width:120});
            if(db_cantx == "btn-secondary")
                canid.prop('disabled', true);
            var canpos = $("<input>", { type:"number", class:"text-center", value:db_canpos, id:key }).css({width:120});

            var div = $("<div>", { class:"input-group" });
            var cangain = $("<input>", { type:"number", class:"form-control text-center", value:db_cangain, id:key + "-cangain" }).css({width:40});
            
            if(os === "mobile") {
                div.append(cangain);
            }else{
                var cangain_sub = $("<button>", { class:"input-group-addon btn btn-secondary btn-sm" }).append("-");
                var cangain_add = $("<button>", { class:"input-group-addon btn btn-secondary btn-sm" }).append("+");
                div.append(cangain_sub).append(cangain).append(cangain_add);

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
            }
           
            var tr = $("<tr>");
            var td1 = $("<td>").append(key);
            var td2 = $("<td>").append(cantx).append(canrx);
            var td3 = $("<td>").append(i);
            var td4 = $("<td>").append(canid);
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

            i++;
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

function loadCANDB() {

    var json = [{}];

    $.ajax("db/database.can", {
        async: false,
        dataType: 'json',
        success: function success(data) {
            //console.log(data);
            json = data;
        }
    });

    return json;
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

            for(var key in json)
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
                    var canbits = json[key].value.toString().length;

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
                    var canjsonkey = {};
                    var canjsonitem = {};

                    if ($("#"+key+"-cantx").hasClass("btn-secondary") && $("#"+key+"-canrx").hasClass("btn-secondary")) {
                        $.notify({ message: "[" + key + "] CAN needs TX/RX" }, { type: "danger" });
                        return;
                    }

                    canjsonkey[key] = [];

                    if ($("#"+key+"-cantx").hasClass("btn-primary")) {

                        if(canid == ""){
                            $.notify({ message: "[" + key + "] CAN needs Transmit ID" }, { type: "danger" });
                            return;
                        }
                        cancommand.push("can tx " + key + " " + canid + " " + canpos + " " + canbits + " " + cangain);

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
                            $.notify({ icon: "glyphicon glyphicon-warning-sign", title: "Error", message: data },{ type: "danger" });
                        }
                    }
                }
                i++;
            }

            //console.log(JSON.stringify(canjson));

            data = sendCommand("save");

            if(data.indexOf("Parameters stored") != -1)
            {
               $.ajax("can.php", {
                    type: "POST",
                    async: false,
                    dataType: "json",
                    data: {"data": JSON.stringify(canjson)},
                    failure: function(errMsg) {
                        $.notify({ icon: "glyphicon glyphicon-warning-sign", title: "Error", message: errMsg },{ type: "danger" });
                    }
                });
            }else{
                $.notify({ icon: 'glyphicon glyphicon-warning-sign', title: 'Error', message: data },{ type: 'danger' });
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
            $.notify({ icon: "glyphicon glyphicon-warning-sign", title: "Error", message: data }, { type: "danger" });
        }

        setTimeout(function () {
            window.location.href = "can.php";
        }, 2000);

    }, function () {});
};