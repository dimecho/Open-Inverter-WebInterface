var syncronized;
var speed ;
var data;
var xaxis = [];
var chart;

$(document).ready(function()
{
    speed = $("#speed").slider(); //$('.slider').slider();
    var ctx = document.getElementById("canvas").getContext("2d");
    var count = 10;
    for (i = 0; i < 200; i++) {
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

    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
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
        }
    });

    //updateChart();
});

function updateChart()
{
    var delay =  speed.slider('getValue');
    //console.log(speed.slider('getValue'));

    clearTimeout(syncronized);
    syncronized = setTimeout( function ()
    {
        $.ajax("serial.php?i=speed",{
        //$.ajax("test/speed.data",{
            async: false,
            beforeSend: function (req) {
              req.overrideMimeType('text/plain; charset=x-user-defined');
            },
            success: function(d)
            {
                //console.log(data);

                try {

                    //data.datasets[0].data.push(getRandom(300,4000));
                    data.datasets[0].data.push(parseInt(d.replace("get speed\n","")));
                   
                    if(data.datasets[0].data.length > xaxis.length)
                        data.datasets[0].data = [];
                        //data.datasets[0].data.shift();

                    chart.update();
                } catch (e) {
                    console.log(e);
                }
            }
        });
        
        updateChart();
    },delay);
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}