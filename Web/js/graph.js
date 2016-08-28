var activeTab = "#graphA";
var syncronized;
var data;
var options;
var xaxis = [];
var chart;
var ctx;

$(document).ready(function()
{
    $('a[data-toggle="tab"]').on('shown', function (e) {
        activeTab = e.target.hash;
        startChart();
        stopChart();
    })

    $("#speed").slider({
        min: 200,
        max: 2000,
        value: 400,
        //scale: 'logarithmic',
        step: 500,
        reversed : true
    });

    ctx = document.getElementById("canvas").getContext("2d");
    var count = 10;

    startChart();
    stopChart();
});

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

function initAmperageChart()
{
    //RMS = LOCKED-ROTOR CURRENT

    xaxis = [];
     for (var i = 0; i < 200; i++) {
            xaxis.push("");
            //xaxis.push(i.toString());
    }
    data = {
        labels : xaxis,
        datasets: [{
            label: "iL1",
            backgroundColor: "rgba(51, 153, 255,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        },{
            label: "iL2",
            backgroundColor: "rgba(102, 255, 51,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };

    var ocurlim = (0-getJSONFloatValue("ocurlim"));
    if(ocurlim === 0)
        ocurlim = 100;

    options = {
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        elements: {
            point:{
                radius: 1
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
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
            duration: 0,
            /*
            onComplete: function(animation) {
                //updateChart();
            },
            onProgress: function () {
            }
            */
        }
    };
}

function initMotorChart()
{
    xaxis = [];
     for (var i = 0; i < 200; i++) {
            xaxis.push("");
            //xaxis.push(i.toString());
    }

    data = {
        labels : xaxis,
        datasets: [
        {
            label: "Motor Speed",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };

    options = {
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        elements: {
            point:{
                radius: 1
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: 'RPM'
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
            duration: 0,
            /*
            onComplete: function(animation) {
                //updateChart();
            },
            onProgress: function () {
            }
            */
        }
    };
}

function initTemperatureChart()
{
    xaxis = [];
     for (var i = 0; i < 200; i++) {
            xaxis.push("");
            //xaxis.push(i.toString());
    }

    data = {
        labels : xaxis,
        datasets: [{
            label: "Motor",
            backgroundColor: "rgba(51, 153, 255,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        },{
            label: "Inverter",
            backgroundColor: "rgba(102, 255, 51,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };

    options = {
        legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
        elements: {
            point:{
                radius: 1
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
                position: 'left',
                scaleLabel: {
                    display: true,
                    labelString: '°C'
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
            duration: 0,
            /*
            onComplete: function(animation) {
                //updateChart();
            },
            onProgress: function () {
            }
            */
        }
    };
}

function initBatteryChart()
{
    xaxis = [];
     for (var i = 0; i < 200; i++) {
            xaxis.push("");
            //xaxis.push(i.toString());
    }

    data = {
        labels : xaxis,
        datasets: [
        {
            label: "Voltage",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
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
                radius: 1
            }
        },
        tooltips:{
            enabled: false
        },
        responsive: true,
        //maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: false,
                position: 'bottom',
                
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                },
                ticks: {
                    maxRotation: 0,
                    reverse: false
                }
            }],
            yAxes: [{
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
            duration: 0,
            /*
            onComplete: function(animation) {
                //updateChart();
            },
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

function updateChart(value)
{
    var delay =  $("#speed").slider('getValue');
    console.log(delay);

    syncronized = setTimeout( function ()
    {
        for (var i = 0; i < value.length; i++) {
            try {
                //getJSONFloatValue(value[i])
                var point = getJSONFloatValue(value[i]);
                //var point = getRandom(1.0,80.0);
                //console.log(point);

                data.datasets[i].data.push(point);
                
                if(data.datasets[i].data.length > xaxis.length)
                    data.datasets[i].data = [];
                    //data.datasets[0].data.shift();

                chart.update();

            } catch (e) {
                console.log(e);
            }
        }

        updateChart(value);

    },delay);
}

function getRandom(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}