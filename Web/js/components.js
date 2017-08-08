function buildTable(title, csv, notes) {

    $.ajax(csv, {
        //async: false,
        beforeSend: function beforeSend(req) {
            req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function success(data) {
            var div = $("#components");
            var header = $("<table>", { class: "table table-bordered", style: "padding-left:10px;" }).append($("<h4>").append(title));
            var label = $("<span>", { class: "label label-lg label-warning" }).append(notes);
            var table = $("<table>", { class: "table table-bordered table-striped table-hover" });
            var thead = $("<thead>", { class: "thead-inverse" }).append($("<tr>").append($("<th>").append("Part")).append($("<th>").append("Value")).append($("<th>").append("Manual")));
            var tbody = $("<tbody>");
            $(".tooltip1").tooltipster();

            var row = data.split("\n");

            for (var i = 1; i < row.length; ++i) {
                var split = row[i].split(",");

                if (split.length > 4) {
                    if (split[0].length > 1) {
                        if (split[3].indexOf("PINHD") == -1 || split[0].indexOf("JP1") != -1 || split[0].indexOf("JP2") != -1) {
                            var a = $("<button>", { class: "btn" }).append("PDF");
                            if (split[4].length > 4) {
                                //a = $("<button>", { id:split[4], class:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal" }).append("PDF");
                                a = $("<button>", { id: split[4], class: "btn btn-primary" }).append("PDF");
                                a.on('click', function (event) {
                                    //console.log(event.target.id);
                                    //$("#componentPDF").attr('src', event.target.id);
                                    window.open(event.target.id, '_blank');
                                });
                            }

                            var value = split[2].replace("", "u").replace("**", "").replace("*", "").replace("\"", "");

                            var tr = $("<tr>");
                            var td1 = $("<td>");
                            var td2 = $("<td>", { class: "tooltip1" });
                            var td3 = $("<td>");

                            if (value.length < 1) {
                                value = split[3].replace("u", "&#181;");
                            }

                            var img = value.replace(" ", "").replace("1%", "");
                            if (img.indexOf("/") != -1) {
                                var s = img.split("/");
                                img = s[0];
                            }
                            if (split[0].indexOf("RN") != -1) img = "RN_" + img;

                            td2.attr("data-tooltip-content", "<img src='/img/bom/" + img + ".jpg' />");
                            td2.append(value);
                            tbody.append(tr.append(td1.append(split[0])).append(td2).append(td3.append(a)));
                        }
                    }
                }
            }
            table.append(thead);
            table.append(tbody);
            div.append(header);
            if (notes) div.append(label);
            div.append(table);
        },
        error: function error(xhr, textStatus, errorThrown) {}
    });
};