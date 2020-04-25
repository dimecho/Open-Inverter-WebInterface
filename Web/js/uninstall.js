$(document).ready(function () {
    buildMenu();
});

function UninstallEverything() {

    checked = false;
    if ($('input.everything').is(':checked')) {
        checked = true;
    }
    $('table').find(':input').each(function(){
        if(!$(this).attr("disabled")) {
            $(this).prop('checked', checked);
            //console.log(this);
        }
    });
};

function Uninstall() {

    $('table').find(':input').each(function(){
        if($(this).attr('id') && $(this).is(':checked')) {
            //console.log(this);
            $("#" + $(this).attr('id') + "_progress").show();
            $.ajax("/install.php?remove=" + $(this).attr('id'), {
                async: false,
                success: function success(data) {
                    console.log(data);
                    $("#" + data + "_progress").addClass("d-none"); //.hide();
                    $("#" + data).parent().css("text-decoration", "line-through");
                },
                error: function error(xhr, textStatus, errorThrown) {},
                timeout: 8000 //8 seconds
            });
        }
    });
};