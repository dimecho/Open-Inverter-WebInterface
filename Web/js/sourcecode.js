$(document).ready(function() {
    buildSourceCode('all');
});

function buildSourceCode(HWCONFIG) {

    var xhr = new XMLHttpRequest();
    /*
    xhr.addEventListener('progress', function(e){
        console.log(e.target.responseText);
    }, false);
    */
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
            //notify.update({'type': 'success', 'allow_dismiss': true, 'message': 'Compiled'});
            $('.progress-bar').css('width', '100%');
            $('#output').append($('<pre>').append(data));
        }
    };
    xhr.open('GET', 'sourcecode.php?hw=' + HWCONFIG, true);
    xhr.send();
};