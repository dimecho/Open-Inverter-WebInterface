/*
E6    20% tolerance
E12   10% tolerance
E24   5% tolerance
E48   2% tolerance
E96   1% tolerance
E192  0.5, 0.25, 0.1% tolerances
*/

function loadList() {

     $.ajax("js/pcb.json", {
        dataType: "json",
        success: function(data) {

            //giveCredit(pcb + "/design.txt");

            for(var key in data)
            {
                var title = $("#" + data[key].id + " div h5");
                var img = $("#" + data[key].id + " img");
                var a = $("#" + data[key].id + " a");

                a[0].href = "?hardware=" + data[key].id;
                img.attr("src",data[key].path + data[key].thumb);
                title.append(data[key].title);

                $("#pcbList").show();
            }
        }
    });
};

function loadComponents(v) {

    $.ajax("js/pcb.json", {
        dataType: "json",
        //async: false,
        success: function(data) {

            for(var key in data)
            {
                if(data[key].id == v)
                {
                    giveCredit(data[key].path + "/design.txt");

                    for(var a in data[key].boards)
                    {
                        for(var b in data[key].boards[a])
                        {
                            //console.log(data[key].id + ":" + b);
                            buildTable(b, data[key].path + "/bom/" + b + ".csv",data[key].boards[a][b]);
                        }  
                    }
                }
            }
            $("#pcbComponents").show();
        }
    });
};

function buildTable(title, csv, notes) {

    $.ajax(csv, {
        //async: false,
        beforeSend: function beforeSend(req) {
            req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function success(data) {
            var div = $("#pcbComponentsTable");
            
            var label = $("<span>", { class: "badge badge-lg bg-warning", style: "margin-bottom:10px;"}).append("* " + notes);
            var table = $("<table>", { class: "table table-active bg-light table-bordered table-striped table-hover" });
            var thead = $("<thead>", { class: "thead-inverse" }).append($("<tr>").append($("<th>").append("Part")).append($("<th>").append("Value")).append($("<th>").append("Package")).append($("<th>").append("Manual")));
            var tbody = $("<tbody>");

            var header = $("<div>", { class: "container bg-light", style: "padding:10px;" });
            var divrow = $("<div>", { class: "row"});
            var divcol = $("<div>", { class: "col"});
            var csvexport = $("<button>", { id: csv, class: "btn btn-success", style: "padding-left:10px;" }).append($("<i>", {class: "glyphicon glyphicon-th-list"})).append(" Export CSV");
            csvexport.on('click', function (event) {
                window.open(event.target.id);
            });
            divrow.append(divcol.clone().addClass("col-md-3").append(csvexport));
            divrow.append(divcol.clone().addClass("col-md-9").append($("<h4>").append(title)));
            header.append(divrow);

            var bom = csv.substring(0, csv.lastIndexOf("/"));
            var row = data.split("\n");

            for (var i = 1; i < row.length; ++i) {
                var split = row[i].split(",");

                if (split[0].length > 1) {
                 
                    var a = $("<button>", { class: "btn" }).append("PDF");
                    var pdf = split[3];

                    if (pdf.length > 1) {
                        //a = $("<button>", { id:split[4], class:"btn btn-primary", "data-toggle":"modal", "data-target":"#myModal" }).append("PDF");
                        a = $("<button>", { id: pdf, class: "btn btn-primary" }).append("PDF");
                        a.on('click', function (event) {
                            //console.log(event.target.id);
                            //$("#componentPDF").attr('src', event.target.id);
                            window.open(event.target.id, '_blank');
                        });
                    }

                    var tr = $("<tr>");
                    var td1 = $("<td>");
                    var td2 = $("<td>");
                    var td3 = $("<td>");
                    var td4 = $("<td>");

                    var value = split[1].replace("**", "").replace("*", "").replace("\"", "");

                    if (value.length > 1) {
                        var img = value;
                        if (img.indexOf("/") != -1) {
                            var s = img.split("/");
                            img = s[s.length-1];
                        }
                        if (img.indexOf(" ") != -1) {
                            var s = img.split(" ");
                            img = s[0];
                        }
                        if (split[0].indexOf("RN") != -1) img = "RN_" + img;
                        if (split[0].indexOf("LED") != -1) img = "LED_" + img;

                        var smd = 0;
                        if(split[2].indexOf("0805") != -1 || split[2].indexOf("0603") != -1) smd = 1;

                        var v = img;
                        img = bom + "/img/" + img + ".jpg";
                        td2 = $("<td>",{ "smd": smd, "img": img, "value": v, "data-toggle": "tooltip", "title": "<img src='" + img + "'>" });
                    }

                    value = value.replace("uF", "&#181;F");
                    value = value.replace("uH", "&#181;H");

                    var span = $("<span>");
                    span.append(value);

                    tr.append(td1.append(split[0]));
                    tr.append(td2.append(span));
                    tr.append(td3.append(split[2].replace("'", "")));
                    tr.append(td4.append(a));
                    tbody.append(tr);
                }
            }

            table.append(thead);
            table.append(tbody);
            div.append(header);
            if (notes.length > 1)
                div.append(label);
            div.append(table);
            
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body',
                //animated: 'fade',
                placement: 'right',
                html: true
            });

            //Test tooltip image for 404
            $('[data-toggle="tooltip"]').on('show.bs.tooltip', function () {
                
                var e = $(this);
                //console.log(e);
                 
                $.ajax({
                    url: e.attr("img"),
                    async: false,
                    cache: true,
                    error:function (thrownError)
                    {
                        //if(xhr.status==404)
                        //    console.log(thrownError);
                        $.ajax({
                            url: "pcb.php?find=" + e.attr("value")+ "&smd=" + e.attr("smd"),
                            async: false,
                            cache: true,
                            timeout: 1600,
                            success: function(data) {
                                //console.log(">" + data);
                                //console.log($("#" + e.getAttribute("aria-describedby")));
                                e.attr("img", data);
                                e.attr("data-original-title","<img src='" + data + "'>");
                            }
                        });
                    }
                });
            });
        },
        error: function error(xhr, textStatus, errorThrown) {}
    });
};