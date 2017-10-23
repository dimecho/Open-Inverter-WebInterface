var saveTimer;

$(document).ready(function () {

    buildCANParameters();

    $.notify({ message: 'Experimental Area' }, { type: 'danger' });
});

function buildCANParameters() {
    //TODO
    
};

function setCANDefaults() {

    alertify.confirm('', 'Reset CAN settings back to default.', function () {

        var data = sendCommand("can clear");
        //console.log(data);

        if (data.indexOf("clear") != -1) {
            $.notify({ message: "CAN reset to Default" }, { type: "success" });
        } else {
            $.notify({
                icon: "glyphicon glyphicon-warning-sign",
                title: "Error",
                message: data
            }, {
                type: "danger"
            });
        }

        setTimeout(function () {
            window.location.href = "/can.php";
        }, 2000);

    }, function () {});
};