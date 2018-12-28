var pcb_info = 
{
   "hw1" : {
        "title" : "Hardware v1.0",
        "thumb" : "pcb/Hardware v1.0/bom/img/base_board4.jpg",
        "table" : "pcb/Hardware v1.0/wiring.csv",
        "pinout" : "pcb/Hardware v1.0/base_board4.png",
        "wiring" : "pcb/Hardware v1.0/wiring.png",
        "description": "Starter board. Simple to solder and understand. Unique design - Sensor uses ATTiny13 for voltage isolation."
    },
    "hw1d" : {
        "title" : "Hardware v1.0 (Damien Mod)",
        "thumb" : "pcb/Hardware v1.0 (Damien Mod)/bom/img/main_board_v2.jpg",
        "table" : "pcb/Hardware v1.0 (Damien Mod)/wiring.csv",
        "pinout" : "pcb/Hardware v1.0 (Damien Mod)/wiring.png",
        "wiring" : "#",
        "description": "Modified by Damien Maguire. All-in-one with driver over-saturation protection."
    },
    "hw2" : {
        "title" : "Hardware v2.0",
        "thumb" : "pcb/Hardware v2.0/bom/img/base_board6.jpg",
        "table" : "pcb/Hardware v2.0/wiring.csv",
        "pinout" : "pcb/Hardware v2.0/base_board6.png",
        "wiring" : "pcb/Hardware v1.0/wiring.png",
        "description": "CAN support, ABZ encoder and IGBT over-saturation protection. Improved voltage and current sensors.<br><br><a href='http://johanneshuebner.com/quickcms/index.html%3Fen_main-board,21.html' target='_blank'>Main Board</a><br><a href='http://johanneshuebner.com/quickcms/index.html%3Fen_sensor-board,22.html' target='_blank'>Sensor Board</a><br><a href='http://johanneshuebner.com/quickcms/index.html%3Fen_gate-drivers,23.html' target='_blank'>Gate Drivers</a>"
    },
    "hw3" : {
        "title" : "Hardware v3.0",
        "thumb" : "pcb/Hardware v3.0/bom/img/base_board7.jpg",
        "table" : "pcb/Hardware v3.0/wiring.csv",
        "pinout" : "pcb/Hardware v3.0/wiring.png",
        "wiring" : "#",
        "description": "Support for permanent magnet motors with resolver. ESP8266 module for wireless configuration."
    }
};

$(document).ready(function () {

    //$("#hw1").clone().attr('id', 'hw2').appendTo("#hw2");

    for(var key in pcb_info)
    {
        var title = $("#" + key + " div h5");
        var desc = $("#" + key + " div p");
        var img = $("#" + key + " img");
        var a = $("#" + key + " div a");
        console.log(a[0]);

        a[0].href = pcb_info[key].pinout;
        a[1].href = pcb_info[key].wiring;
        
        img.attr("src",pcb_info[key].thumb);
        title.append(pcb_info[key].title);
        desc.append(pcb_info[key].description);
    }
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