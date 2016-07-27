$(document).ready(function()
{
    $('#myModal').modal('hide');
    
    buildTable("Main Board v4","bom/base_board4.csv");
    buildTable("Gate Driver v2","bom/gate_driver2.csv");
    buildTable("Sensor Board v3","bom/sensor_board3.csv");
    
});

function buildTable(title,csv)
{
    var div = $("#components"); //.empty();
    var header = $("<table>", {class:"table table-bordered", style:"padding-left:10px;background-color:#e6e6e6;"}).append($("<h2>").append(title));
    var table = $("<table>", {class:"table table-bordered table-striped table-hover", style:"background-color:#e6e6e6;"});
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
                            a = $("<button>", { id:split[4], class:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal" }).append("PDF");
                            a.on('click', function(event) {
                                //console.log(event.target.id);
                                $("#componentPDF").attr('src', event.target.id);
                            });
                        }

                        var value = split[2].replace("", "u").replace(" ", "").replace("**", "").replace("*", "").replace("1%", "");

                        var tr = $("<tr>");
                        var td1 = $("<td>");
                        var td2 = $("<td>");
                        var td3 = $("<td>");

                        if(value.length > 1)
                        {
                            td2 = $("<td>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<img src='bom/img/" + value + ".png' />"});
                            td2.append(value.replace("u", "&#181;"))
                        }
                        else
                        {
                            td2 = $("<td>", {rel:"tooltip", "data-toggle":"tooltip", "data-container":"body", "data-placement":"bottom", "data-html":"true", "data-title":"<img src='bom/img/" + split[3] + ".png' />"});
                            td2.append(split[3]);
                        }

                        tbody.append(tr.append(td1.append(split[0])).append(td2).append(td3.append(a)));
                    }
                }
            }
            table.append(thead);
            table.append(tbody);
            div.append(header);
            div.append(table);
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
}