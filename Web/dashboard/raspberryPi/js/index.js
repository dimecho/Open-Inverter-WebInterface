document.addEventListener("DOMContentLoaded", function(event) {

    var gauge = new RadialGauge({
        renderTo: 'battery',
        title: "Battery",
        units: "%",
        width: 200,
        height: 200,
        highlights: [
            {
                "from": 0,
                "to": 20,
                "color": "rgba(200, 50, 50, 0.8)"
            },
            {
                "from": 20,
                "to": 40,
                 "color": "rgba(90,90,90, 0.8)"
            },
            {
                "from": 40,
                "to": 60,
                "color": "rgba(90,90,90, 0.3)"
            },
            {
                "from": 80,
                "to": 100,
                "color": "rgba(39, 174, 96, 0.75)"
            }
        ],
        colorMajorTicks: "#ddd",
        colorMinorTicks: "#ddd",
        colorTitle: "#eee",
        colorUnits: "#ccc",
        colorNumbers: "#eee",
        colorPlate: "#222",
        colorBorderOuter: "#333",
        colorBorderOuterEnd: "#111",
        colorBorderMiddle: "#222",
        colorBorderMiddleEnd: "#111",
        colorBorderInner: "#111",
        colorBorderInnerEnd: "#333",
        colorNeedleShadowDown: "#333",
        colorNeedleCircleOuter: "#333",
        colorNeedleCircleOuterEnd: "#111",
        colorNeedleCircleInner: "#111",
        colorNeedleCircleInnerEnd: "#222",
        colorValueBoxRect: "#222",
        colorValueBoxRectEnd: "#333"
    }).draw();

    var gauge = new RadialGauge({
        renderTo: 'speed',
        width: 300,
        height: 300,
        //title: "SPEED",
        units: "Km/h",
        minValue: 0,
        maxValue: 200,
        majorTicks: [
            0,
            20,
            40,
            60,
            80,
            100,
            120,
            140,
            160,
            180,
            200
        ],
        minorTicks: 2,
        strokeTicks: true,
        highlights: [
            {
                "from": 40,
                "to": 60,
                "color": "rgba(90,90,90, 0.8)"
            },
            {
                "from": 60,
                "to": 100,
                "color": "rgba(90,90,90, 0.3)"
            },
            {
                "from": 160,
                "to": 200,
                "color": "rgba(200, 50, 50, .75)"
            }
        ],
        borderShadowWidth: 0,
        borders: false,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1500,
        animationRule: "linear",
        colorMajorTicks: "#ddd",
        colorMinorTicks: "#ddd",
        colorTitle: "#eee",
        colorUnits: "#ccc",
        colorNumbers: "#eee",
        colorPlate: "#222",
        colorBorderOuter: "#333",
        colorBorderOuterEnd: "#111",
        colorBorderMiddle: "#222",
        colorBorderMiddleEnd: "#111",
        colorBorderInner: "#111",
        colorBorderInnerEnd: "#333",
        colorNeedleShadowDown: "#333",
        colorNeedleCircleOuter: "#333",
        colorNeedleCircleOuterEnd: "#111",
        colorNeedleCircleInner: "#111",
        colorNeedleCircleInnerEnd: "#222",
        colorValueBoxRect: "#222",
        colorValueBoxRectEnd: "#333"
    }).draw();

    var gauge = new RadialGauge({
        renderTo: 'rpm',
        width: 300,
        height: 300,
        //title:"RPM",
        units: "1/min x 1000",
        minValue: 0,
        maxValue: 10,
        majorTicks: [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10
        ],
        minorTicks: 2,
        strokeTicks: true,
        highlights: [
            {
                "from": 3,
                "to": 6,
                "color": "rgba(90,90,90, 0.8)"
            },
            {
                "from": 6,
                "to": 8,
                "color": "rgba(90,90,90, 0.3)"
                
            },
            {
                "from": 8,
                "to": 10,
                "color": "rgba(200, 50, 50, .75)"
            }
        ],
        borderShadowWidth: 0,
        borders: true,
        needleType: "arrow",
        needleWidth: 4,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1500,
        valueBoxBorderRadius: 0,
        animationRule: "linear",
        colorMajorTicks: "#ddd",
        colorMinorTicks: "#ddd",
        colorTitle: "#eee",
        colorUnits: "#ccc",
        colorNumbers: "#eee",
        colorPlate: "#222",
        colorBorderOuter: "#333",
        colorBorderOuterEnd: "#111",
        colorBorderMiddle: "#222",
        colorBorderMiddleEnd: "#111",
        colorBorderInner: "#111",
        colorBorderInnerEnd: "#333",
        colorNeedleShadowDown: "#333",
        colorNeedleCircleOuter: "#333",
        colorNeedleCircleOuterEnd: "#111",
        colorNeedleCircleInner: "#111",
        colorNeedleCircleInnerEnd: "#222",
        colorValueBoxRect: "#222",
        colorValueBoxRectEnd: "#333"
    }).draw();

    var gauge = new RadialGauge({
        renderTo: 'temp',
        width: 200,
        height: 200,
        units: "°C",
        title: "Temperature",
        minValue: 0,
        maxValue: 200,
        majorTicks: [
            0,
            20,
            40,
            60,
            80,
            100,
            120,
            140,
            160,
            180,
            200
        ],
        minorTicks: 2,
        strokeTicks: true,
        highlights: [
            {
                "from": 0,
                "to": 40,
                "color": "rgba(0,0, 255, 0.5)"
            },
            {
                "from": 40,
                "to": 80,
                "color": "rgba(90,90,90, 0.8)"
            },
            {
                "from": 80,
                "to": 100,
                "color": "rgba(90,90,90, 0.3)"
            },
            {
                "from": 140,
                "to": 200,
                "color": "rgba(255, 0, 0, 0.5)"
            }
        ],
        ticksAngle: 225,
        startAngle: 67.5,
        borderShadowWidth: 0,
        borders: true,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1500,
        valueBoxBorderRadius: 0,
        animationRule: "linear",
        colorMajorTicks: "#ddd",
        colorMinorTicks: "#ddd",
        colorTitle: "#eee",
        colorUnits: "#ccc",
        colorNumbers: "#eee",
        colorPlate: "#222",
        colorBorderOuter: "#333",
        colorBorderOuterEnd: "#111",
        colorBorderMiddle: "#222",
        colorBorderMiddleEnd: "#111",
        colorBorderInner: "#111",
        colorBorderInnerEnd: "#333",
        colorNeedleShadowDown: "#333",
        colorNeedleCircleOuter: "#333",
        colorNeedleCircleOuterEnd: "#111",
        colorNeedleCircleInner: "#111",
        colorNeedleCircleInnerEnd: "#222",
        colorValueBoxRect: "#222",
        colorValueBoxRectEnd: "#333"
    }).draw();

    var status = document.getElementById("status");
    var icons = ["high-beam.svg","temp.svg", "battery.svg","emergency.svg"];

    for (i = 0; i < 4; i++)
    {
        var div = document.createElement("div");
        div.classList.add("col-2-sm");

        var img = document.createElement("img");
        img.classList.add("svg-inject");
        img.classList.add("svg-grey");
        img.src = "img/" + icons[i];

        SVGInjector(img);
        status.appendChild(div.appendChild(img));
    }
    //document.getElementById('distance').innerHTML = calculateDistance(startPos.coords.latitude, startPos.coords.longitude, position.coords.latitude, position.coords.longitude);
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = (lat2 - lat1).toRad();
  var dLon = (lon2 - lon1).toRad();
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  var d = R * c;
  return d;
};

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
};