var statusRefreshTimer;

$(document).ready(function () {
    
    buildStatus(true);

    var iconic = IconicJS({
        autoInjectSelector: 'img.iconic',
        pngFallback: 'assets/png',
        each: function (svg) {
            console.log('Injected an SVG! ' + svg.id);
        },
        autoInjectDone: function (count) {
            console.log('Auto injection of ' + count + ' SVGs complete. We did it.');
        }
    });
});

function buildStatus(sync) {

    var error = false;

    $.ajax("/serial.php?get=opmode,udc,udcmin,tmpm,tmphs,deadtime,din_start,din_mprot,chargemode", {
        async: sync,
        success: function success(data)
        {
            if(data.indexOf("Error") != -1)
            {
                error = true;
                return;
            }

            data = data.replace("\n\n", "\n");
            data = data.split(/\n/);

            console.log(data);
            
            var opStatus = $("<span>");
            var img = $("<img>", { class: "iconic", "data-src": "img/key.svg", "data-toggle": "tooltip", "data-html": "true" });

            if(data[0] !== "") {

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
                    div.append($("<img>", {"data-src":"img/amperage.svg"}));
                }
                opStatus.append(div);
                */
                //========================
                img = $("<img>", { class: "iconic", "data-src": "img/battery.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[1] + "V</h6>" });
                if (parseFloat(data[1]) > parseFloat(data[2]) && parseFloat(data[1]) > 10 && parseFloat(data[1]) < 520) { // && parseFloat(data[15]) !== 0) {
                    img.addClass("svg-green");
                } else {
                    img.addClass("svg-red");
                }
                opStatus.append(img);
                //========================
                img = $("<img>", { class: "iconic", "data-src": "img/temperature.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[3] + "°C</h6>"});
                if (parseFloat(data[3]) > 150 || parseFloat(data[4]) > 150) {
                    img.addClass("svg-red");
                    opStatus.append(img);
                } else if (parseFloat(data[3]) < 0 || parseFloat(data[4]) < 0 || parseFloat(data[3]) > 100 || parseFloat(data[4]) > 100) {
                    img.addClass("svg-yellow");
                    opStatus.append(img);
                }
                //========================
                img = $("<img>", { class: "iconic", "data-src": "img/magnet.svg","data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + data[5] + "ms</h6>" });
                if(parseFloat(data[5]) < 22){
                    img.addClass("svg-red");
                    opStatus.append(img);
                }
                //========================
                /*
                img = $("<img>", { class: "iconic", src: "img/speedometer.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + speed + "RPM</h6>" });
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
                    img = $("<img>", { class: "iconic", "data-src": "img/alert.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>Probably forgot PIN 11 to 12V</h6>" });
                    opStatus.append(img);
                }
                //========================
                var errors = sendCommand("errors");
                if (errors.length > 1 && errors.indexOf("No Errors") === -1) {

                    img = $("<img>", { class: "iconic", "data-src": "img/alert.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>" + errors + "</h6>" });
                    opStatus.append(img);
                }
            }else{
                img = $("<img>", { class: "iconic", "data-src": "img/alert.svg", "data-toggle": "tooltip", "data-html": "true", "title": "<h6>Inverter Disconnected</h6>" });
                opStatus.append(img);
            }
			
			$("#opStatus").empty().append(opStatus);

            buildTips();
            
            //console.log(document.querySelectorAll('.svg-inject'));
            //new SVGInjector().inject(document.querySelectorAll('.svg-inject'));
			
            $('.tooltip').remove();
            $('[data-toggle="tooltip"]').tooltip();

            if(os === "mobile")
            {
                $(".svg-inject").attr("style","width:80px; height:80px;");
            }
        }
    });
    
    if(error === false)
        statusRefreshTimer = setTimeout(function () {
    		clearTimeout(statusRefreshTimer);
            buildStatus(true); //ajax syncro mode
        }, 12000);
}