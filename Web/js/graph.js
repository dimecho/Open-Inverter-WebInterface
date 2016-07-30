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
        min: 20,
        max: 400,
        value: 80,
        //scale: 'logarithmic',
        step: 10
    });

    ctx = document.getElementById("canvas").getContext("2d");
    var count = 10;

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

    initMotorChart();
    
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
});

function startChart()
{
    //console.log(activeTab);
    
    stopChart();

    chart.destroy();
   
    if(activeTab === "#graphA")
    {
        initMotorChart();
        updateChart("speed");
    }
    else  if(activeTab === "#graphB")
    {
        initTemperatureChart();
        //updateChart("tmpm");
        updateChart("tmphs");
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
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
        datasets: [{
            label: "Motor Speed",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
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
            label: "Motor Speed",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };
}

function stopChart()
{
    clearTimeout(syncronized);
}

function updateChart(value)
{
    var delay =  $("#speed").slider('getValue');
    //console.log(delay);

    syncronized = setTimeout( function ()
    {
        try {
            //data.datasets[0].data.push(getRandom(300,4000));
            //console.log(getGraphValue(value));

            data.datasets[0].data.push(getGraphValue(value));
           
            if(data.datasets[0].data.length > xaxis.length)
                data.datasets[0].data = [];
                //data.datasets[0].data.shift();
            chart.update();

        } catch (e) {
            console.log(e);
        }

        updateChart(value);

    },delay);
}

function getGraphValue(value) {

    $.ajax("serial.php?i=" + value,{
    //$.ajax("test/speed.data",{
        async: false,
        beforeSend: function (req) {
          req.overrideMimeType('text/plain; charset=x-user-defined');
        },
        success: function(data)
        {
            //console.log(data);
            return parseInt(data.replace("get " + value + "\n",""));
        }
    });
    return 0;
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}