var motorDB;

$(document).ready(function () {

    motorDB = loadMotorDB();

    buildMotorDB();
});

function setMotorImage()
{
    var i = $("#motor").val();
    $("#motorimage").attr("src", "/db/" + motorDB.motors[i].image);

    var motorinfo = $("#motorinfo").empty();
    motorinfo.append("<li>Manufacturer: " + motorDB.motors[i].manufacturer + "</li>");
    motorinfo.append("<li>Model: " + motorDB.motors[i].model + "</li>");
    motorinfo.append("<li>Voltage: " + motorDB.motors[i].voltage + "</li>");
    motorinfo.append("<li>Amperage: " + motorDB.motors[i].amperage + "</li>");

    var motortune = $("#motortune").empty();
    var table =  $("<table>");
    var tbody = $("<tbody>");

    for(var t in motorDB.motors[i].tune)
    {
        $.ajax("/db/" + motorDB.motors[i].tune[t].file,{
            async: false,
            dataType: 'text',
            success: function(data)
            {
                //console.log(data);

                var json = JSON.parse(data);
                var btn = $("<button>", {class:"btn btn-success", id:motorDB.motors[i].tune[t].file});
                var tr = $("<tr>");
                var td = $("<td>").append(btn.append("[" + t + "] Set Motor for " + parseInt(json.udc) + " V"));
                tr.append(td);
                tbody.append(tr);

                btn.click(function(){

                    //console.log(this.id);

                    $(this).attr("disabled", true);

                    $.ajax("/snapshot.php?db=" + $("#motor").val(),{
                        async: false,
                        success: function(data){
                            console.log(data);
                            window.location.href = "/index.php";
                        }
                    });

                    $(this).removeAttr("disabled");
                });
            }
        });
    }
    table.append(tbody);
    motortune.append(table);
};

function buildMotorDB()
{
    if(motorDB)
    {
        //console.log(motorDB);

        for(var i in motorDB.motors)
        {
            //console.log(motorDB.motors[i]);
            $("#motor").append($("<option>",{value:i,selected:'selected'}).append(motorDB.motors[i].manufacturer + " - " + motorDB.motors[i].model));
        }

        $("#motor").prop('selectedIndex', 0);

        setMotorImage();
    }
};

function loadMotorDB() {

    var json;

    $.ajax("/db/database.json", {
        async: false,
        dataType: 'json',
        success: function success(data) {
            //console.log(data);
            json = data;
        },
        error: function error(xhr, textStatus, errorThrown) {}
    });

    return json;
};