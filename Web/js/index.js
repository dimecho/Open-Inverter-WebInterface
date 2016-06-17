$(document).ready(function()
{
    $('#parameters').editable({
        selector: 'a',
        url: 'serial.php',
        mode: 'popup',
        pk: 1,
        showbuttons: true,
        ajaxOptions: {
            type: 'get',
            //type: 'put',
            //dataType: 'json'
        },
        validate: function(value) {

            if(this.id == 'fmin'){
                if($.trim(value) > $("#fslipmin").text())
                {
                    return 'Should be set below fslipmin';
                }
            }else  if(this.id == 'polepairs'){
                if ($.inArray($.trim(value), [ '1', '2', '3,', '4']) == -1)
                {
                    return 'Motor poles = twice # of pole pairs';
                }
            }else  if(this.id == 'udcmin'){
                if($.trim(value) > $("#udcmax").text())
                {
                    return 'Should be below maximum voltage (udcmax)';
                }
            }else  if(this.id == 'udcmax'){
                if($.trim(value) > $("#udclim").text())
                {
                    return 'Should be lower than cut-off voltage (udclim)';
                }
            }else  if(this.id == 'udcsw'){
                if($.trim(value) > $("#udcmax").text())
                {
                    return 'Should be below maximum voltage (udcmax)';
                }
            }
        },
        success: function(response, newValue) {
            //console.log(response);
            if(response.indexOf("Set OK"))
            {
                var id = this.id;
                //console.log(this.id);
                
                var span = $("<span>", { class:"label label-warning offset1"}).append("changed");
                $("#" + id).parent().append(span);
                
                setTimeout(function(){
                    saveChanges(span);
                },2000);
                setTimeout(function(){
                    span.remove();
                },5000);
            }
        }
    });

    buildMenu(loadJSON(0));
    showErrors();

    $('.tooltip-custom').tooltipster();
});

function buildMenu(json)
{
    //var length = 0;
    //for(var k in json) if(json.hasOwnProperty(k))    length++;

    if(Object.keys(json).length > 0)
    {
        var i = 0;
        var name = [];
        for(var k in json)
            name.push(k);
        //======================
        
        var parameters = [];
        var description = [];
     
        $.ajax("description.csv",{
            async: false,
            //contentType: "application/text",
            beforeSend: function (req) {
              req.overrideMimeType('text/plain; charset=x-user-defined');
            },
            //dataType: 'text',
            success: function(data)
            {
                var row = data.split("\n");

                for (var i = 0; i < row.length; ++i)
                {
                    var split = row[i].split(",");
                    var d;

                    if(split.length > 6){
                        for (var c = 5; c < split.length; ++c)
                            d += split[c];
                    }else{
                        d = split[5];
                    }

                    parameters.push(split[0]);
                    description.push(d);
                }
            },
            error: function(xhr, textStatus, errorThrown){
            }
        });
        //=================
        var menu = $("#parameters").empty().show();
        var thead = $("<thead>", {class:"thead-inverse"}).append($("<tr>").append($("<th>").append("Name")).append($("<th>").append("Value")).append($("<th>").append("Type")))
        var tbody = $("<tbody>");
        menu.append(thead);

        $.each(json, function()
        {
            console.log(this)

            if(name[i] == "version")
            {
                var title = $("#title h3").empty();
                title.append("Inverter Console v" + this.value);
            }
            else
            {
                var tooltip = "";
                var x = parameters.indexOf(name[i]);
                if(x !=-1)
                    tooltip = description[x];

                var a = $("<a>", { href:"#", id:name[i], "data-type":"text", "data-pk":"1", "data-placement":"right", "data-placeholder":"Required", "data-title":this.unit + " ("+ this.default + ")"}).append(this.value);
                var tr = $("<tr>");
                var td1 = $("<td>", { class:"tooltip-custom", title:tooltip}).append(name[i]);
                var td2 = $("<td>").append(a);
                var td3 = $("<td>").append(this.unit);
       
                tbody.append(tr.append(td1).append(td2).append(td3));
            }
            i++;
        });
        menu.append(tbody);
    }
}