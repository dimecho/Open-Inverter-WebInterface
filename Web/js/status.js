var statusRefreshTimer;

$(document).ready(function () {

    var version = getJSONFloatValue("version");
    if(version > 0)
        $("#firmwareVersion").empty().append("Firmware v" + version);
    
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

                var span = $("<span>", { class: "tooltip1" });
                var img = $("<img>", { class: "svg-inject", src: "img/key.svg" });
                //$("#potentiometer").hide();

                if (parseFloat(data[15]) === 3) {
                    span.attr("data-tooltip-content", "<h6>Boost Mode</h6>");
                    img.addClass("svg-yellow");
                } else if (parseFloat(data[15]) === 4) {
                    span.attr("data-tooltip-content", "<h6>Buck Mode</h6>");
                    img.addClass("svg-yellow");
                }else if (parseFloat(data[0]) === 0) {
                    span.attr("data-tooltip-content", "<h6>Off</h6>");
                    img.addClass("svg-red");
                } else if (parseFloat(data[0]) === 1) {
                    if (parseFloat(data[6]) === 1) {
                        img.addClass("svg-yellow");
                        span.attr("data-tooltip-content", "<h6>Pulse Only - Do not leave ON</h6>");
                    } else {
                        span.attr("data-tooltip-content", "<h6>Running</h6>");
                        img.addClass("svg-green");
                    }
                } else if (parseFloat(data[0]) === 2) {
                    span.attr("data-tooltip-content", "<h6>Manual Mode</h6>");
                    img.addClass("svg-green");
                    $("#potentiometer").show();
                }
                span.append(img);
                opStatus.append(span);
                //========================
                /*
                if(json.ocurlim.value > 0){
                    div.append($("<img>", {src:"img/amperage.svg"}));
                }
                opStatus.append(div);
                */
                //========================
                span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + data[1] + "V</h6>" });
                img = $("<img>", { class: "svg-inject", src: "img/battery.svg" });
                if (parseFloat(data[1]) > parseFloat(data[2]) && parseFloat(data[1]) > 10 && parseFloat(data[1]) < 520) { // && parseFloat(data[15]) !== 0) {
                    img.addClass("svg-green");
                } else {
                    img.addClass("svg-red");
                }
                span.append(img);
                opStatus.append(span);
                //========================
                span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + data[3] + "°C</h6>" });
                img = $("<img>", { class: "svg-inject", src: "img/temperature.svg" });
                if (parseFloat(data[3]) > 150 || parseFloat(data[4]) > 150) {
                    img.addClass("svg-red");
                    span.append(img);
                    opStatus.append(span);
                } else if (parseFloat(data[3]) < 0 || parseFloat(data[4]) < 0 || parseFloat(data[3]) > 100 || parseFloat(data[4]) > 100) {
                    img.addClass("svg-yellow");
                    span.append(img);
                    opStatus.append(span);
                }
                //========================
                span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + data[5] + "ms</h6>" });
                img = $("<img>", { class: "svg-inject", src: "img/magnet.svg" });
                if(parseFloat(data[5]) < 22){
                    img.addClass("svg-red");
                    span.append(img);
                    opStatus.append(span);
                }
                //========================
                /*
                span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>" + speed + "RPM</h6>" });
                img = $("<img>", { class: "svg-inject", src: "img/speedometer.svg" });
                if (speed > 6000) {
                    img.addClass("svg-red");
                    span.append(img);
                    opStatus.append(span);
                } else if (speed > 3000) {
                    img.addClass("svg-yellow");
                    span.append(img);
                    opStatus.append(span);
                }
                */
                //========================
                if (parseFloat(data[7]) != 1 && parseFloat(data[15]) === 0) {
                    span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>Probably forgot PIN 11 to 12V</h6>" });
                    span.append($("<img>", { class: "svg-inject", src: "img/alert.svg" }));
                    opStatus.append(span);
                }
                //========================
                var errors = getErrors();
                if (errors.length > 1 && errors.indexOf("No Errors") === -1) {
                    span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6><pre>" + errors + "</pre></h6>" });
                    span.append($("<img>", { class: "svg-inject", src: "img/alert.svg" }));
                    opStatus.append(span);
                }
            }else{
                span = $("<span>", { class: "tooltip1", "data-tooltip-content": "<h6>Inverter Disconnected</h6>" });
                span.append($("<img>", { class: "svg-inject", src: "img/alert.svg" }));
                opStatus.append(span);
            }
			
			$("#opStatus").empty().append(opStatus);
           
            var SVGInject = document.querySelectorAll('img.svg-inject');
            SVGInjector(SVGInject);
			
			$(".tooltipstered").tooltipster("destroy");
            $(".tooltip1").tooltipster();
			
			buildTips();
        }
    });
    
    statusRefreshTimer = setTimeout(function () {
		clearTimeout(statusRefreshTimer);
        buildStatus(true); //ajax syncro mode
    }, 12000);
};

function getErrors() {
    var e = ""
    $.ajax("/serial.php?command=errors", {
        async: false,
        success: function success(data) {
            e = data;
        }
    });
    //console.log(e);
    return e;
};