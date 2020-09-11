/*
E6    20% tolerance
E12   10% tolerance
E24   5% tolerance
E48   2% tolerance
E96   1% tolerance
E192  0.5, 0.25, 0.1% tolerances
*/

function loadList() {

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.response);
			//giveCredit(pcb + '/design.txt');

            for(var key in xhr.response)
            {
                var title = $('#' + xhr.response[key].id + ' div h5');
                var img = $('#' + xhr.response[key].id + ' img');
                var a = $('#' + xhr.response[key].id + ' a');

                a[0].href = '?hardware=' + xhr.response[key].id;
                img.attr('src', xhr.response[key].path + xhr.response[key].thumb);
                title.append(xhr.response[key].title);

                $('#pcbList').removeClass('d-none'); //.show();
            }
        }
    };
    xhr.open('GET', 'js/pcb.json', true);
    xhr.send();
};

function loadComponents(v) {

	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.response);
			for(var key in xhr.response)
            {
                if(xhr.response[key].id == v)
                {
                    giveCredit(xhr.response[key].path + '/design.txt');

                    for(var a in xhr.response[key].boards)
                    {
                        for(var b in xhr.response[key].boards[a])
                        {
                            //console.log(xhr.response[key].id + ':' + b);
                            buildTable(b, xhr.response[key].path + '/bom/' + b + '.csv', xhr.response[key].boards[a][b]);
                        }  
                    }
                }
            }
            $('#pcbComponents').removeClass('d-none'); //.show();
        }
    };
    xhr.open('GET', 'js/pcb.json', true);
    xhr.send();
};

function buildTable(title, csv, notes) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status == 200) {
            //console.log(xhr.responseText);
            var div = $('#pcbComponentsTable');
            
            var label = $('<span>', { class: 'badge badge-lg bg-warning', style: 'margin-bottom:10px;'}).append('* ' + notes);
            var table = $('<table>', { class: 'table table-active bg-light table-bordered table-striped table-hover' });
            var thead = $('<thead>', { class: 'thead-inverse' }).append($('<tr>').append($('<th>').append('Part')).append($('<th>').append('Value')).append($('<th>').append('Package')).append($('<th>').append('Manual')));
            var tbody = $('<tbody>');

            var header = $('<div>', { class: 'container bg-light', style: 'padding:10px;' });
            var divrow = $('<div>', { class: 'row'});
            var divcol = $('<div>', { class: 'col'});
            var csvexport = $('<button>', { id: csv, class: 'btn btn-success', style: 'padding-left:10px;' }).append($('<i>', {class: 'glyphicon glyphicon-th-list'})).append(' Export CSV');
            csvexport.on('click', function (event) {
                window.open(event.target.id);
            });
            divrow.append(divcol.clone().addClass('col-md-3').append(csvexport));
            divrow.append(divcol.clone().addClass('col-md-9').append($('<h4>').append(title)));
            header.append(divrow);

            var bom = csv.substring(0, csv.lastIndexOf('/'));
            var row = xhr.responseText.split('\n');

            for (var i = 1; i < row.length; ++i) {
                var split = row[i].split(',');

                if (split[0].length > 1) {
                 
                    var a = $('<button>', { class: 'btn' }).append('PDF');
                    var pdf = split[3];

                    if (pdf.length > 1) {
                        //a = $('<button>', { id:split[4], class:'btn btn-primary', 'data-toggle':'modal', 'data-target':'#myModal' }).append('PDF');
                        a = $('<button>', { id: pdf, class: 'btn btn-primary' }).append('PDF');
                        a.on('click', function (event) {
                            //console.log(event.target.id);
                            //$('#componentPDF').attr('src', event.target.id);
                            window.open(event.target.id, '_blank');
                        });
                    }

                    var tr = $('<tr>');
                    var td1 = $('<td>');
                    var td2 = $('<td>');
                    var td3 = $('<td>');
                    var td4 = $('<td>');

                    var value = split[1].replace('**', '').replace('*', '').replace('"', '');

                    if (value.length > 1) {
                        var img = value;
                        if (img.indexOf('/') != -1) {
                            var s = img.split('/');
                            img = s[s.length-1];
                        }
                        if (img.indexOf(' ') != -1) {
                            var s = img.split(' ');
                            img = s[0];
                        }
                        if (split[0].indexOf('RN') != -1) img = 'RN_' + img;
                        if (split[0].indexOf('LED') != -1) img = 'LED_' + img;

                        var smd = 0;
                        if(split[2].indexOf('0805') != -1 || split[2].indexOf('0603') != -1) smd = 1;

                        var v = img;
                        img = bom + '/img/' + img + '.jpg';
                        td2 = $('<td>',{ 'smd': smd, 'img': img, 'value': v, 'data-toggle': 'tooltip', 'title': '<img src="' + img + '">' });
                    }

                    value = value.replace('uF', '&#181;F');
                    value = value.replace('uH', '&#181;H');

                    var span = $('<span>');
                    span.append(value);

                    tr.append(td1.append(split[0]));
                    tr.append(td2.append(span));
                    tr.append(td3.append(split[2].replace('"', '')));
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

            setTheme();
            
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                //Test tooltip image for 404
                tooltipTriggerEl.addEventListener('show.bs.tooltip', function () {
                    //console.log($(this).attr('img'));
                    var e = $(this);
                    var xhr = new XMLHttpRequest();
                    xhr.cache = true;
                    xhr.onload = function() {
                        if (xhr.status == 404) {
                            var finder = new XMLHttpRequest();
                            finder.cache = true;
                            finder.onload = function() {
                                if (finder.status == 200) {
                                    console.log('>' + finder.responseText);
                                    //console.log($('#' + e.getAttribute('aria-describedby')));
                                    e.attr('img', finder.responseText);
                                    e.attr('data-original-title', '<img src="' + finder.responseText + '">');
                                    tooltip.update();
                                }
                            };
                            finder.open('GET', 'pcb.php?find=' + e.attr('value')+ '&smd=' + e.attr('smd'), false);
                            finder.send();
                        }
                    };
                    xhr.open('GET', e.attr('img'), false);
                    xhr.send();
                });
              return new bootstrap.Tooltip(tooltipTriggerEl,{html:true})
            });
        }
    };
    xhr.open('GET', csv, true);
    xhr.send();
};