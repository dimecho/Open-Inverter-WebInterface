$(document).ready(function()
{
    checkGCC_ARM()
});

function checkGCC_ARM()
{
    $.ajax("gcc_arm.php",{
        async: false,
        success: function(data)
        {
            if(data == "1")
            {
                var menu = $("#gcc").show();
            }
        }
    });
}

function saveChanges(span)
{
    $.ajax("serial.php?save=1",{
        success: function(data)
        {
            //console.log(data);
            span.removeClass('label-warning');

            if(data.indexOf("Parameters stored") != -1)
            {
                span.addClass('label-success');
                span.text("saved");
            }else{
                span.addClass('label-important');
                span.text("error");
            }
        }
    });
}

function startInverter()
{
    $.ajax("serial.php?start=2",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            span.removeClass('label-success');
            span.removeClass('label-warning');
            span.removeClass('label-important');
            span.addClass('label');

            if(data.indexOf("Inverter started") != -1)
            {
                span.addClass('label-success');
                span.text('started');
            }else{
                span.addClass('label-important');
                span.text('error');
            }
        }
    });
}

function stopInverter()
{
    $.ajax("serial.php?stop=1",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            span.removeClass('label-success');
            span.removeClass('label-warning');
            span.removeClass('label-important');
            span.addClass('label');
           
            if(data.indexOf("Inverter halted") != -1)
            {
                span.addClass('label-warning');
                span.text('stopped');
            }else{
                span.addClass('label-important');
                span.text('error');
            }
        }
    });
}

function showErrors()
{
    $.ajax("serial.php?errors=1",{
        success: function(data)
        {
            //console.log(data);

            var span = $("#titleStatus").empty();
            if(data.indexOf("error") != -1)
            {
                var icon = $("<span>", { class:"tooltip-custom glyphicon glyphicon-qrcode", title:data});
                span.append(icon);
            }
        }
    });
}

function setDefaults()
{
    alertify.confirm('', 'This reset all settings back to default.', function()
    {
        $.ajax("serial.php?default=1",{
            success: function(data)
            {
                //console.log(data);

                var span = $("#titleStatus").empty();
                span.removeClass('label-success');
                span.removeClass('label-warning');
                span.removeClass('label-important');
                span.addClass('label');

                if(data.indexOf("default") != -1)
                {
                    span.addClass('label-success');
                    span.text('everything reset to default');
                    setTimeout( function ()
                    {
                        window.location.href = "/index.php";
                    },1500);
                }else{
                    span.addClass('label-important');
                    span.text('error');
                }
            }
        });
    }, function(){});
}