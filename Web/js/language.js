var language = 'en-CA';
var language_menu = [
    'en-US',
    'en-CA',
    'en-UK',
    'de-DE',
    'ru-RU',
    'au-AU'
];

function setLanguage(page) {

    language = getCookie('language');
    
    if(language == undefined) {
       language = window.navigator.userLanguage || window.navigator.language;
    }

    language = language.split('-')[0];

    //DEBUG
    //language = "de";

    if(language != 'en') {

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status == 200) {
                console.log(xhr.response);
                document.title = document.title.replace('Web Interface', xhr.response.browser_title);

                for(var key in xhr.response.menu) {
                    $('#menu_' + key).empty().append(' ' + xhr.response.menu[key]);
                }
                for(var key in xhr.response[page]) {
                    $('#text_' + key).empty().append(' ' + xhr.response[page][key]);
                }
            }
        };
        xhr.open('GET', 'ln/' + language + '.json', true);
        xhr.send();
    }
}