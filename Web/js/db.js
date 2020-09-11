$(document).ready(function () {
    buildMenu(function() {
        loadMotorDB();
    });
});

function setMotorImage(motorDB)
{
    var i = $('#motor-select').val();
    $('#motor-image').attr('src', 'db/' + motorDB.motors[i].image);

    var motorinfo = $('#motor-info').empty();
    motorinfo.append('<li>Manufacturer: ' + motorDB.motors[i].manufacturer + '</li>');
    motorinfo.append('<li>Model: ' + motorDB.motors[i].model + '</li>');
    motorinfo.append('<li>Voltage: ' + motorDB.motors[i].voltage + '</li>');
    motorinfo.append('<li>Amperage: ' + motorDB.motors[i].amperage + '</li>');

    var motortune = $('#motor-tune').empty();
   
    for(var t in motorDB.motors[i].tune)
    {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status == 200) {
                //console.log(xhr.response);
                var json = xhr.response;
                var udc = (json.udc === undefined) ? json.udcsw : json.udc;

                var div = $('<div>', {class:'row p-2'});
                var icon = $('<i>', {class:'icons icon-motor'});
                var btn = $('<button>', {class:'btn btn-success', id:motorDB.motors[i].tune[t].file}).append(icon);
                
                if(udc != 0) {
                    btn.append(' Set Motor for ' + Math.trunc(udc) + ' Volts');
                }else{
                    btn.append(' Set Motor for "Uknown" Volts');
                }
                div.append(btn);
                motortune.append(div);

                btn.click(function(){

                    //console.log(this.id);

                    $(this).attr('disabled', true);

                    var snapshot = new XMLHttpRequest();
                    snapshot.onload = function() {
                        if (snapshot.status == 200) {
                            console.log(snapshot.responseText);
                            window.location.href = 'index.php';
                        }
                    };
                    snapshot.open('GET', 'snapshot.php?db=' + $('#motor').val(), true);
                    snapshot.send();

                    $(this).removeAttr('disabled');
                });
            }
        };
        xhr.open('GET', 'db/' + motorDB.motors[i].tune[t].file, true);
        xhr.send();
    }
};

function buildMotorDB(motorDB)
{
    if(motorDB)
    {
        //console.log(motorDB);

        var list = $('#motor-select');

        for(var i in motorDB.motors)
        {
            //console.log(motorDB.motors[i]);
            list.append($('<option>',{value:i}).append(motorDB.motors[i].manufacturer + ' - ' + motorDB.motors[i].model));
        }

        list.change(function() {
            setMotorImage(motorDB);
        });

        list.prop('selectedIndex', 0);
        setMotorImage(motorDB);
    }
};

function loadMotorDB() {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function() {
        if (xhr.status == 200) {
            buildMotorDB(xhr.response);
            displayHWVersion();
        }
    };
    xhr.open('GET', 'db/database.json', true);
    xhr.send();
};

function TryParseInt(str,defaultValue) {

    var retValue = defaultValue;
    if(str !== undefined) {
        if(str.length > 0) {
            if (!isNaN(str)) {
                retValue = parseInt(str);
            }
        }
    }
    return retValue;
};