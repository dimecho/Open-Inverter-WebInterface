$(document).ready(function () {
    
    buildMenu(function () {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status == 200) {
                for(var key in xhr.response)
                {
                    var title = $('#' + xhr.response[key].id + ' div h5');
                    var desc = $('#' + xhr.response[key].id + ' div p');
                    var img = $('#' + xhr.response[key].id + ' img');
                    var a = $('#' + xhr.response[key].id + ' div a');

                    a[0].href = xhr.response[key].path + xhr.response[key].pinout;
                    a[1].href = xhr.response[key].path + xhr.response[key].wiring;
                    
                    img.attr('src', xhr.response[key].path + xhr.response[key].thumb);
                    title.append(xhr.response[key].title);
                    desc.append(xhr.response[key].description);
                }
            }
        };
        xhr.open('GET', 'js/pcb.json', true);
        xhr.send();
    });
});

function buildWiringTable(csv)
{
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.responseText);
            var tbody = $('#pinout tbody').empty();
            var row = xhr.responseText.split('\n');
            for (var i = 0; i < row.length; i++) {
                var split = row[i].split(',');
                var tr = $('<tr>');
                tr.append($('<td>').append(split[0]));
                tr.append($('<td>').append(split[1]));
                tr.append($('<td>').append(split[2]));
                tbody.append(tr);
            }
        }
    };
    xhr.open('GET', csv, true);
    xhr.send();
};

function printWiring(wiring)
{
    window.jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF('l', 'mm', [279, 215]);
    doc.setDisplayMode(1);
    doc.setFontSize(28);
    doc.text(110, 20, 'Wiring Diagram');
    var img = new Image();
    img.onload = function() {
        doc.addImage(this, 'PNG' , 25, 40, 225, 150, 'wiring', 'none');
        doc.save('wiring.pdf');
    };
    img.src = wiring;
}