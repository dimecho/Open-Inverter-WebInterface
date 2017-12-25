var statusRefreshTimer;

$(document).ready(function () {

    var version = getJSONFloatValue("version");
    if(version > 0) {
        $("#firmwareVersion").empty().append("Firmware v" + version);   
    }
    
    buildStatus(false);
});

function buildStatus(sync) {

    $.ajax("/serial.php?get=opmode,udc,udcmin,tmpm,tmphs,deadtime,din_start,din_mprot,chargemode", {
        async: sync,
        cache: false,
        timeout: 4000, // timeout 4 seconds
        type: 'GET',
        success: function success(data) {

            data = data.replace("\n\n", "\n");
            data = data.split("\n");
            //console.log(data);
            
            var opStatus = $("<span>");

            if(data[0] != "") {

                var img = $("<img>", { class: "svg-inject", src: "img/key.svg", "data-toggle": "tooltip", "data-html": "true" });
                //$("#potentiometer").hide();

                if (parseFloat(data[15]) === 3) {
                    img.attr("title", "<h6>Boost Mode</h6>");
                    img.addClass("svg-yellow");
                } else if (parseFloat(data[15]) === 4) {
                    img.attr("title", "<h6>Buck Mode</h6>");
                    img.addClass("svg-yellow");
                }else if (parseFloat(data[0]) === 0) {
                    img.attr("title", "<h6>Off</h6>");
                    img.addClass("svg-red");
                } else if (parseFloat(data[0]) === 1) {
                    if (parseFloat(data[6]) === 1) {
                        img.attr("title", "<h6>Pulse Only - Do not leave ON</h6>");
                        img.addClass("svg-yellow");
                    } else {
                        img.attr("title", "<h6>Running</h6>");
                        img.addClass("svg-green");
                    }
                } else if (parseFloat(data[0]) === 2) {
                    img.attr("title", "<h6>Manual Mode</h6>");
                    img.addClass("svg-green");
                    $("#potentiometer").show();
                }
                opStatus.append(img);
                //========================
                /*
                if(json.ocurlim.value > 0){
                    div.append($("<img>", {src:"img/amperage.svg"}));
                }
                opStatus.append(div);
                */
                //========================
                img = $("<img>", { class: "svg-inject", src: "img/battery.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[1] + "V</h6>" });
                if (parseFloat(data[1]) > parseFloat(data[2]) && parseFloat(data[1]) > 10 && parseFloat(data[1]) < 520) { // && parseFloat(data[15]) !== 0) {
                    img.addClass("svg-green");
                } else {
                    img.addClass("svg-red");
                }
                opStatus.append(img);
                //========================
                img = $("<img>", { class: "svg-inject", src: "img/temperature.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[3] + "°C</h6>"});
                if (parseFloat(data[3]) > 150 || parseFloat(data[4]) > 150) {
                    img.addClass("svg-red");
                    opStatus.append(img);
                } else if (parseFloat(data[3]) < 0 || parseFloat(data[4]) < 0 || parseFloat(data[3]) > 100 || parseFloat(data[4]) > 100) {
                    img.addClass("svg-yellow");
                    opStatus.append(img);
                }
                //========================
                img = $("<img>", { class: "svg-inject", src: "img/magnet.svg","data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[5] + "ms</h6>" });
                if(parseFloat(data[5]) < 22){
                    img.addClass("svg-red");
                    opStatus.append(img);
                }
                //========================
                /*
                img = $("<img>", { class: "svg-inject", src: "img/speedometer.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + speed + "RPM</h6>" });
                if (speed > 6000) {
                    img.addClass("svg-red");
                    opStatus.append(img);
                } else if (speed > 3000) {
                    img.addClass("svg-yellow");
                    opStatus.append(img);
                }
                */
                //========================
                if (parseFloat(data[7]) != 1 && parseFloat(data[15]) === 0) {
                    img = $("<img>", { class: "svg-inject", src: "img/alert.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>Probably forgot PIN 11 to 12V</h6>" });
                    opStatus.append(img);
                }
                //========================
                var errors = sendCommand("errors");
                if (errors.length > 1 && errors.indexOf("No Errors") === -1) {

                    img = $("<img>", { class: "svg-inject", src: "img/alert.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + errors + "</h6>" });
                    opStatus.append(img);
                }
            }else{
                img = $("<img>", { class: "svg-inject", src: "img/alert.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>Inverter Disconnected</h6>" });
                opStatus.append(img);
            }
			
			$("#opStatus").empty().append(opStatus);
            
            //console.log(document.querySelectorAll('.svg-inject'));

            new SVGInjector().inject(document.querySelectorAll('.svg-inject'));
			
			buildTips();

            $('.tooltip').remove();
            $('[data-toggle="tooltip"]').tooltip();

            if(os=== "mobile")
            {
                $(".svg-inject").attr("style","width:80px; height:80px;");
            }
        }
    });
    
    statusRefreshTimer = setTimeout(function () {
		clearTimeout(statusRefreshTimer);
        buildStatus(true); //ajax syncro mode
    }, 12000);
};