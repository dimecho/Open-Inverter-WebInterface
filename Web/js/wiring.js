$(document).ready(function () {
    buildMenu();
    $.ajax("js/pcb.json", {
        dataType: "json",
        success: function(data) {
            for(var key in data)
            {
                var title = $("#" + data[key].id + " div h5");
                var desc = $("#" + data[key].id + " div p");
                var img = $("#" + data[key].id + " img");
                var a = $("#" + data[key].id + " div a");

                a[0].href = data[key].path + data[key].pinout;
                a[1].href = data[key].path + data[key].wiring;
                
                img.attr("src",data[key].path + data[key].thumb);
                title.append(data[key].title);
                desc.append(data[key].description);
            }
        }
    });
});

function buildWiringTable(csv)
{
    $.ajax(csv,{
        //async: false,
        success: function(data)
        {
            //console.log(data);
            var tbody = $("#pinout tbody").empty();
            var row = data.split("\n");
            for (var i = 0; i < row.length; i++) {
                var split = row[i].split(",");
                var tr = $("<tr>");
                tr.append($("<td>").append(split[0]));
                tr.append($("<td>").append(split[1]));
                tr.append($("<td>").append(split[2]));
                tbody.append(tr);
            }
            $("#pinout").show();
        },
        error: function(xhr, textStatus, errorThrown){
        }
    });
};

function printWiring(wiring)
{
    var doc = new jsPDF('l', 'mm', [279, 215]);
    doc.setDisplayMode(1);
    doc.setFontSize(28);
    doc.text(110, 20, "Wiring Diagram");
    var img = new Image();
    img.onload = function() {
        doc.addImage(this, 'PNG' , 25, 40, 225, 150, "wiring", "none");
        doc.save("wiring.pdf");
    };
    img.src = wiring;
}