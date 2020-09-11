$(document).ready(function () {
    buildMenu(function(){});
});

function UninstallEverything()
{
    checked = false;
    if ($('input.everything').is(':checked')) {
        checked = true;
    }
    $('table').find(':input').each(function(){
        if(!$(this).attr('disabled')) {
            $(this).prop('checked', checked);
            //console.log(this);
        }
    });
};

function Uninstall()
{
    $('table').find(':input').each(function() {
        if($(this).attr('id') && $(this).is(':checked')) {
            //console.log(this);
            $('#' + $(this).attr('id') + '_progress').show();

            var xhr = new XMLHttpRequest();
	        xhr.onload = function() {
	            if (xhr.status == 200) {
	                console.log(xhr.responseText);
                    $('#' + xhr.responseText + '_progress').addClass('d-none'); //.hide();
                    $('#' + xhr.responseText).parent().css('text-decoration', 'line-through');
	            }else{
	            	timeout: 8000 //8 seconds
	            }
	        };
	        xhr.open('GET', '/install.php?remove=' + $(this).attr('id'), false);
	        xhr.send();
        }
    });
};