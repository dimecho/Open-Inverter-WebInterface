$(document).ready(function () {
    loadMotorDB();
});

function setMotorImage(motorDB)
{
    var i = $("#motor-select").val();
    $("#motor-image").attr("src", "db/" + motorDB.motors[i].image);

    var motorinfo = $("#motor-info").empty();
    motorinfo.append("<li>Manufacturer: " + motorDB.motors[i].manufacturer + "</li>");
    motorinfo.append("<li>Model: " + motorDB.motors[i].model + "</li>");
    motorinfo.append("<li>Voltage: " + motorDB.motors[i].voltage + "</li>");
    motorinfo.append("<li>Amperage: " + motorDB.motors[i].amperage + "</li>");

    var motortune = $("#motor-tune").empty();
    var table =  $("<table>");

    for(var t in motorDB.motors[i].tune)
    {
        $.ajax("db/" + motorDB.motors[i].tune[t].file,{
            async: false,
            dataType: 'text',
            success: function(data)
            {
                //console.log(data);
                var json = JSON.parse(data);
                var btn = $("<button>", {class:"btn btn-success", id:motorDB.motors[i].tune[t].file});
                var icon = $("<i>", {class:"icons icon-motor"}).append(" Set Motor for " + TryParseInt(json.udc, "(?)") + " V");
                var tr = $("<tr>");
                var td = $("<td>").append(btn.append(icon));
                tr.append(td);
                table.append(tr);

                btn.click(function(){

                    //console.log(this.id);

                    $(this).attr("disabled", true);

                    $.ajax("snapshot.php?db=" + $("#motor").val(),{
                        async: false,
                        success: function(data){
                            console.log(data);
                            window.location.href = "index.php";
                        }
                    });

                    $(this).removeAttr("disabled");
                });

                if(os === "mobile")
                    btn.attr("style","font-size: 140%;");
            }
        });
    }

    motortune.append(table);
};

function buildMotorDB(motorDB)
{
    if(motorDB)
    {
        //console.log(motorDB);

        var list = $("#motor-select");

        for(var i in motorDB.motors)
        {
            //console.log(motorDB.motors[i]);
            list.append($("<option>",{value:i}).append(motorDB.motors[i].manufacturer + " - " + motorDB.motors[i].model));
        }

        list.change(function() {
            setMotorImage(motorDB);
        });

        list.prop('selectedIndex', 0);
        setMotorImage(motorDB);
    }
};

function loadMotorDB() {

    $.ajax("db/database.json", {
        dataType: 'json',
        success: function success(data) {
            buildMotorDB(data);
            displayHWVersion();
        },
        error: function error(xhr, textStatus, errorThrown) {}
    });
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
}