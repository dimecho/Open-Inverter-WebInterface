var saveTimer;

$(document).ready(function () {

    buildCANParameters();
});

function buildCANParameters() {
    
    var json = loadJSON();
    
    if(json)
    {
        var menu = $("#parameters").empty();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("CAN ID")));
        var tbody = $("<tbody>");
        menu.append(thead);
        menu.append(tbody);

        for(var key in json)
        {
            //console.log(key);

            var a = $("<span>").append(json[key].value);
            var canid = $("<input>", { type:"text", value:"" });
            var tr = $("<tr>");

            tr.attr("data-toggle", "tooltip");
            tr.attr("data-html", true);
            tr.attr("title", "<h6>" + json[key].unit.replace("","°") + "</h6>");

            var td1 = $("<td>").append(key);
            var td2 = $("<td>").append(a);
            var td3 = $("<td>").append(canid);
   
            tbody.append(tr.append(td1).append(td2).append(td3));
        };
        menu.show();

        $('[data-toggle="tooltip"]').tooltip();
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