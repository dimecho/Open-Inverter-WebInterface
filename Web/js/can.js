var canMap;

$(document).ready(function () {

    buildCANParameters();
});

function buildCANParameters() {
    
    canMap = loadJSON();
    
    if(canMap)
    {
        var menu = $("#parameters").empty();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("CAN Start Bit")));
        var tbody = $("<tbody>");
        menu.append(thead);
        menu.append(tbody);

        for(var key in canMap)
        {
            //console.log(key);

            var a = $("<span>").append(canMap[key].value);
            var canbit = $("<input>", { type:"text", value:"", id:key });
            var tr = $("<tr>");

            tr.attr("data-toggle", "tooltip");
            tr.attr("data-html", true);
            tr.attr("title", "<h6>" + canMap[key].unit.replace("","°") + "</h6>");

            var td1 = $("<td>").append(key);
            var td2 = $("<td>").append(a);
            var td3 = $("<td>").append(canbit);
   
            tbody.append(tr.append(td1).append(td2).append(td3));
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

                if(canpos != "")
                {
                    canpos = parseInt(canpos);

                    if (isInt(canpos) == false){
                        $.notify({ message: "[" + key + "] CAN bit offset must be a number" }, { type: "danger" });
                        return;
                    }

                    //TODO check for conflict offset

                    var canbits = canMap[key].value.toString().length;
                    var cangain = canMap[key].value.toString().length;
                    $.notify({ message: "can txt " + key + " " + i + " " + canpos + " " + canbits + " " + cangain }, { type: "success" });
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
            $.notify({
                icon: "glyphicon glyphicon-warning-sign",
                title: "Error",
                message: data
            }, {
                type: "danger"
            });
        }

        setTimeout(function () {
            window.location.href = "/can.php";
        }, 2000);

    }, function () {});
};