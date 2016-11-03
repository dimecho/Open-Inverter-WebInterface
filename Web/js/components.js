$(document).ready(function()
{
    buildTable("Main Board v4","bom/base_board4.csv");
    buildTable("Gate Driver v2","bom/gate_driver2.csv","Note: DC-DC has changed. PCB \"gate_driver2b.brd\" contains different size component RH0515D or IH0515S");
    buildTable("Sensor Board v3","bom/sensor_board3.csv");
    
    $(".tooltip1").tooltipster();
});

function buildTable(title,csv,notes)
{
    var div = $("#components"); //.empty();
    var header = $("<table>", {class:"table table-bordered", style:"padding-left:10px;"}).append($("<h4>").append(title));
    var label = $("<span>", {class:"label label-lg label-danger"}).append(notes);
    var table = $("<table>", {class:"table table-bordered table-striped table-hover"});
    var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Part")).append($("<th>").append("Value")).append($("<th>").append("Manual")));
    var tbody = $("<tbody>");

    $.ajax(csv,{
        async: false,
        //contentType: "application/text",
        beforeSend: function (req) {
          req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        //dataType: 'text',
        success: function(data)
        {
            var row = data.split("\n");

            for (var i = 1; i < row.length; ++i)
            {
                var split = row[i].split(",");
              
                if(split.length > 4)
                {
                    if(split[0].length > 1 && split[3].indexOf("PINHD") == -1)
                    {
                        var a = $("<button>", { class:"btn"}).append("PDF");
                        if(split[4].length > 4)
                        {
                            //a = $("<button>", { id:split[4], class:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal" }).append("PDF");
                            a = $("<button>", { id:split[4], class:"btn btn-primary"}).append("PDF");
                            a.on('click', function(event) {
                                //console.log(event.target.id);
                                //$("#componentPDF").attr('src', event.target.id);
                                window.open(event.target.id, '_blank');
                            });
                        }

                        var value = split[2].replace("", "u").replace("**", "").replace("*", "");

                        var tr = $("<tr>");
                        var td1 = $("<td>");
                        var td2 = $("<td>", {class:"tooltip1"});
                        var td3 = $("<td>");

                        if(value.length > 1)
                        {
                            var img = value.replace(" ", "").replace("1%", "");
                            if(split[0].indexOf("RN") !=-1)
                                img = "RN_"+ value;

                            td2.attr("data-tooltip-content","<img src='bom/img/" + img + ".png' />");
                            td2.append(value.replace("u", "&#181;"))
                        }
                        else
                        {
                            td2.attr("data-tooltip-content","<img src='bom/img/" + split[3] + ".png' />");
                            td2.append(split[3]);
                        }

                        tbody.append(tr.append(td1.append(split[0])).append(td2).append(td3.append(a)));
                    }
                }
            }
            table.append(thead);
            table.append(tbody);
            div.append(header);
            if(notes)
                div.append(label);
            div.append(table);
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
}