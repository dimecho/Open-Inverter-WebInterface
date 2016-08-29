var activeTab = "#graphA";
var activeTabText = "Motor";
var syncronized;
var data;
var options;
var xaxis = [];
var chart;
var ctx;

$(document).ready(function()
{
    $("#speed").slider({
        /*
        formatter: function(value) {
            return 'Current value: ' + value;
        },
        */
        min: 200,
        max: 3000,
        value: 1000,
        //scale: 'logarithmic',
        step: 1,
        reversed : true
    }).on('slide', function() {
        var t = $("#speed").slider('getValue');
        t = Math.round(t / 1000 * 60);
        //console.log(t);
        chart.config.data.labels = initTimeAxis(t);
        chart.update();
    });

    $('a[data-toggle="tab"]').on('shown', function (e) {
        //console.log(e);
        activeTab = e.target.hash;
        activeTabText = e.target.text;

        startChart();
        stopChart();
    })

    ctx = document.getElementById("canvas").getContext("2d");
    /*
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    */
    var count = 10;

    startChart();
    stopChart();
});

function exportPDF(pdf)
{
    //ctx.save();
    //ctx.scale(4,4);
    //var render = ctx.canvas.toDataURL('image/jpeg',1.0);
    //ctx.restore();

    var render = ctx.canvas.toDataURL("image/png", 1.0);

    if(pdf)
    {
        //console.log($('.tab-pane.active').find('p:hidden').text());
        var doc = new jsPDF('l', 'mm', [279, 215]);
        doc.setProperties({
            title: "",
            subject: "",    
            author: '',
            creator: '© 2016'
        });
        doc.setDisplayMode(1);
        doc.setFontSize(28);
        doc.text(110, 20, activeTabText);
        
        doc.addImage(render, 'JPEG' , 18, 40, 250, 120, "graph", "none");
        doc.save("graph.pdf");

        /*
        var margins = {
            top: 32,
            //bottom: 20,
            left: 20,
            //right: 15,
            //width: 700,
            //height: 450
        };
        var options = {
            format: 'JPEG',
            //pagesplit: true,
            "background": '#000',
            //"width": margins.width,
            //"height": margins.height,
            //"elementHandlers": specialElementHandlers
        };
        var date = new Date();
        //var d = date.Now().format("MM-DD-YYYY h:mma");
        //console.log(d);

        document.getElementById("canvas").style.backgroundColor = 'rgba(255, 255, 255, 1)';
        //doc.addHTML($("#render"), 0.5, 2, options,function() {
        doc.addHTML(ctx.canvas, margins.left, margins.top, options,function() {
            document.getElementById("canvas").style.backgroundColor = 'rgba(255, 255, 255, 0)';
            doc.save("graph.pdf");
        }, margins);
        */
    }else{

        var data = atob(render.substring( "data:image/png;base64,".length ) ),
        asArray = new Uint8Array(data.length);

        for( var i = 0, len = data.length; i < len; ++i ) {
            asArray[i] = data.charCodeAt(i);    
        }
        var blob = new Blob( [ asArray.buffer ], {type: "image/png"} );

        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "graph.png";
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function startChart(init)
{
    //console.log(activeTab);
    
    stopChart();

    if(activeTab === "#graphA")
    {
        initMotorChart();
        updateChart(["speed"]);
    }
    else  if(activeTab === "#graphB")
    {
        initTemperatureChart();
        updateChart(["tmpm","tmphs"]);
    }
    else  if(activeTab === "#graphC")
    {
        initBatteryChart();
        updateChart(["udc"]);
    }
    else  if(activeTab === "#graphD")
    {
        initAmperageChart();
        updateChart(["il1","il2"]);
    }

    if(chart)
        chart.destroy();
    
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function initTimeAxis(seconds)
{
    xaxis = [];
    for (var i = 0; i < seconds; i++) {
        if((i/10) % 1 != 0)
        {
            xaxis.push("");
        }else{
            xaxis.push(i);
        }
        //xaxis.push(i.toString());
    }
    return xaxis;
}

function initAmperageChart()
{
    //RMS = LOCKED-ROTOR CURRENT
    data = {
        labels: initTimeAxis(61),
        datasets: [{
            label: "iL1",
            backgroundColor: "rgba(51, 153, 255,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        },{
            label: "iL2",
            backgroundColor: "rgba(102, 255, 51,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        }]
    };

    var ocurlim = (0-getJSONFloatValue("ocurlim"));
    if(ocurlim === 0)
        ocurlim = 100;

    options = {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(0, 0, 0)'
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        tooltips:{
            enabled: false
        },
        /*
        tooltipEvents: [],
        showTooltips: true,
        onAnimationComplete: function() {
            this.showTooltip(this.segments, true);
        },
        tooltipTemplate: "<%= label %> - <%= value %>",
        */
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time (Seconds)'
                },
                ticks: {
                    reverse: false,
                    maxRotation: 0,
                    stepSize: 50,
                    //suggestedMin: 0, //important
                    //suggestedMax: 100 //important
                }
            }],
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Amperage'
                },
                ticks: {
                    reverse: false,
                    stepSize: 10,
                    suggestedMin: 0, //important
                    suggestedMax: ocurlim //important
                }
            }]
        },
        pan: {
            enabled: true,
            mode: 'xy'
        },
        zoom: {
            enabled: true,
            mode: 'xy',
            limits: {
                max: 100,
                min: 0.5
            }
        },
        animation: {
            duration: 1000,
            onComplete: function(animation) {
                //updateChart(["il1","il2"],true);
                //exportPDF();
            },
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function initMotorChart()
{
    data = {
        labels: initTimeAxis(61),
        datasets: [
        {
            label: "Motor Speed",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };

    options = {
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(0, 0, 0)'
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time (Seconds)'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Speed (RPM)'
                },
                ticks: {
                    reverse: false,
                    stepSize: 500,
                    suggestedMin: 0, //important
                    suggestedMax: 5000 //important
                }
            }]
        },
        pan: {
            enabled: true,
            mode: 'xy'
        },
        zoom: {
            enabled: true,
            mode: 'xy',
            limits: {
                max: 100,
                min: 0.5
            }
        },
        animation: {
            duration: 1000,
            onComplete: function(animation) {
                //updateChart(["il1","il2"],true);
                //exportPDF();
            },
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function initTemperatureChart()
{
    data = {
        labels: initTimeAxis(61),
        datasets: [{
            label: "Motor",
            backgroundColor: "rgba(51, 153, 255,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        },{
            label: "Inverter",
            backgroundColor: "rgba(102, 255, 51,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        }]
    };

    options = {
        legend: {
            display: true,
            labels: {
                fontColor: 'rgb(0, 0, 0)'
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time (Seconds)'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Degree °C'
                },
                ticks: {
                    reverse: false,
                    stepSize: 10,
                    suggestedMin: 0, //important
                    suggestedMax: 110 //important
                }
            }]
        },
        pan: {
            enabled: true,
            mode: 'xy'
        },
        zoom: {
            enabled: true,
            mode: 'xy',
            limits: {
                max: 100,
                min: 0.5
            }
        },
        animation: {
            duration: 1000,
            onComplete: function(animation) {
                //updateChart(["il1","il2"],true);
                //exportPDF();
            },
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function initBatteryChart()
{
    data = {
        labels: initTimeAxis(61),
        datasets: [
        {
            label: "Voltage",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };

    var udclim = (0-getJSONFloatValue("udclim"));
    if(udclim === 0)
        udclim = 300;

    options = {
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        elements: {
            point:{
                radius: 0
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time (Seconds)'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
                display: true,
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'Voltage'
                },
                ticks: {
                    reverse: false,
                    stepSize: 50,
                    suggestedMin: 0, //important
                    suggestedMax: udclim //important
                }
            }]
        },
        pan: {
            enabled: true,
            mode: 'xy'
        },
        zoom: {
            enabled: true,
            mode: 'xy',
            limits: {
                max: 100,
                min: 0.5
            }
        },
        animation: {
            duration: 1000,
            onComplete: function(animation) {
                //updateChart(["il1","il2"],true);
                //exportPDF();
            },
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function stopChart()
{
    clearTimeout(syncronized);
}

function updateChart(value, animated)
{
    clearTimeout(syncronized);
    var delay = 1000; //$("#speed").slider('getValue');
    //console.log(delay);

    syncronized = setTimeout( function ()
    {
        for (var i = 0; i < value.length; i++) {
            try {
                //getJSONFloatValue(value[i])
                //var point = getJSONFloatValue(value[i]);
               
                var point = getRandom(1.0,80.0);
                //console.log(point);

                point = Math.abs(point);
                data.datasets[i].data.push(point);
                
                if(data.datasets[i].data.length > xaxis.length)
                    data.datasets[i].data = [];
                    //data.datasets[0].data.shift();

                chart.update();

            } catch (e) {
                console.log(e);
            }
        }
        if(!animated)
            updateChart(value);

    },delay);
}

function getRandom(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}