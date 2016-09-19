var activeTab = "#graphA";
var activeTabText = "Motor";
var syncronizedTimer;
var syncronizedStop;
var syncronizedDelay = 1000;
var syncronizedAccuracy = 0;
var data;
var options;
var xaxis = [];
var chart;
var ctx;
var xhr;

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
        value: syncronizedDelay,
        //scale: 'logarithmic',
        step: 1,
        reversed : true
    }).on('slide', function() {

        syncronizedDelay = $("#speed").slider('getValue');
        chart.options.animation.duration = syncronizedDelay;

        var t = Math.round(syncronizedDelay / 1000 * 60);
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
    });
    
    /*
    $(document).click(function (e) {
        if(xhr)
            xhr.abort();
    });
    */

    Chart.defaults.global.animationSteps = 12;

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

    syncronizedStop = false;
	syncronizedAccuracy = 0;

    var duration = $("#speed").slider('getValue');

    if(activeTab === "#graphA")
    {
        initMotorChart(duration);
        updateChart(["speed"],true,0.8);
    }
    else  if(activeTab === "#graphB")
    {
        initTemperatureChart(duration);
        updateChart(["tmpm","tmphs"]);
    }
    else  if(activeTab === "#graphC")
    {
        initBatteryChart(duration);
        updateChart(["udc","uac"]);
    }
    else  if(activeTab === "#graphD")
    {
        initAmperageChart(duration);
        updateChart(["il1rms","idc"]);
    }
    else  if(activeTab === "#graphE")
    {
        initFrequenciesChart(duration);
        updateChart(["fweak","fstat","ampnom"]);
    }

    if(chart)
        chart.destroy();
    
    chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function stopChart()
{
    syncronizedStop = true;

    clearTimeout(syncronizedTimer);

    if(xhr)
        xhr.abort();
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

function sineWave(phase, amplitude)
{
    var array = [];
    for(var j = 0; j <= phase * Math.PI; j += 0.1) {
        array.push(Math.sin(j)*amplitude); //[j, Math.sin(j)]
    }
    return array;
}

function initFrequenciesChart(duration)
{
   data = {
        labels: initTimeAxis(62),
        datasets: [{
            label: "Field Weakening",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "#ff0000",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(0, 0, 0, 0)",
            hoverBorderColor: "#ff0000",
            data: [0]
        },{
            label: "Stator Frequency",
            backgroundColor: "#90caf9",
            borderColor: "#33b5e5",
            borderWidth: 2,
            hoverBackgroundColor: "#90caf9",
            hoverBorderColor: "#33b5e5",
            data: [0],
            //y2axis: true
        },{
            label: "Amplitude Max",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "#bdbdbd",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(0, 0, 0, 0)",
            hoverBorderColor: "#bdbdbd",
            data: [0]
        },{
            label: "Amplitude Nominal",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "#FF8800",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "#FF8800",
            data: [0]
        }]
    };

	var fweak = getJSONFloatValue("fweak");
    var fmax = getJSONFloatValue("fmax");
    var step = fmax/10;
	
	for (var i = 0; i < 62; i++) {
		data.datasets[0].data.push(fweak);
	}
    data.datasets[2].data = sineWave(4,fmax);
    //data.datasets[3].data = sineWave(4,80);

    options = {
        //scaleUse2Y: true,
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
                    labelString: 'Frequency (Hz)'
                },
                ticks: {
                    reverse: false,
                    stepSize: step,
                    suggestedMin: 0, //important
                    suggestedMax: fmax + step //important
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
            duration: duration,
        }
    };
}

function initAmperageChart(duration)
{
    //RMS = LOCKED-ROTOR CURRENT
    data = {
        labels: initTimeAxis(61),
        datasets: [{
            label: "AC Current",
            backgroundColor: "rgba(51, 153, 255,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(51, 153, 255,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        },{
            label: "DC Current",
            backgroundColor: "rgba(102, 255, 51,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        }]
    };

    var ocurlim = getJSONFloatValue("ocurlim");
    if(ocurlim === 0)
        ocurlim = 100;

	var step = ocurlim/10;

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
                    labelString: 'Current (A)'
                },
                ticks: {
                    reverse: false,
                    stepSize: step,
                    suggestedMin: 0, //important
                    suggestedMax: ocurlim + step //important
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
            duration: duration,
            //onComplete: function(animation) {
            //},
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function initMotorChart(duration)
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
            duration: duration,
            //onComplete: function(animation) {
            //},
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function initTemperatureChart(duration)
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
            duration: duration,
            //onComplete: function(animation) {
            //},
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function initBatteryChart(duration)
{
    data = {
        labels: initTimeAxis(61),
        datasets: [
        {
            label: "Battery",
            backgroundColor: "rgba(102, 255, 51,0.2)",
            borderColor: "rgba(0,0,0,0.2)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(102, 255, 51,0.4)",
            hoverBorderColor: "rgba(0,0,0,0.5)",
            data: [0]
        },{
            label: "Inverter",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 2,
            hoverBackgroundColor: "rgba(255,99,132,0.4)",
            hoverBorderColor: "rgba(255,99,132,1)",
            data: [0]
        }]
    };

    var udclim = getJSONFloatValue("udclim");
    var step = 50;

    if(udclim === 0)
        udclim = 300;

    if(udclim < 100)
        step = udclim/10;

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
                    labelString: 'Voltage'
                },
                ticks: {
                    reverse: false,
                    stepSize: step,
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
            duration: duration,
            //onComplete: function(animation) {
            //},
            /*
            onProgress: function () {
            }
            */
        }
    };
}

function updateChart(value,autosize,accuracy)
{
    clearTimeout(syncronizedTimer);
    //console.log(syncronizedDelay);

    syncronizedTimer = setTimeout( function ()
    {
        var l = 0;

        for (var i = 0; i < value.length; i++)
        {
			if(value[i] != "fweak")
            {
				//try {
				var point = 0;
				//var point = getJSONFloatValue(value[i]);
				//var point = getRandom(1.0,80.0);
				//console.log(point);
				
				xhr = $.ajax("serial.php?i=" + value[i],{
					async: false,
					success: function(data){
						point = parseFloat(data.replace("get " + value[i] + "\n",""));
						//point = Math.abs(point); //heavy process
					}
				});

				if(value[i] == "ampnom")
				{
					var max = Math.max.apply(Math, data.datasets[i].data);
					data.datasets[i+1].data = sineWave(2, max*point/100);

				}else{

					l = data.datasets[i].data.length;
					if(accuracy)
					{
						var p = data.datasets[i].data[l-1];
						var c = (p*accuracy);
						//console.log("Last point:" + p + ">" +c);
						
						if (syncronizedAccuracy < 3 && point < c){
							point = p;
							if(p!=c)
								syncronizedAccuracy ++;
						}else{
							syncronizedAccuracy = 0;
						}
					}
					
					if(l > xaxis.length)
						data.datasets[i].data = [];
						//data.datasets[0].data.shift();
				
					data.datasets[i].data.push(point);
				}
            }
            //} catch (e) { console.log(e); }
        }

        if(autosize)
        {
            if(l == 1) //do it at start
            {
                var largest = Math.max.apply(Math, data.datasets[0].data);
                var step = 50;
    			if(largest > 3000){
                    step = 1000;
    			}else if(largest > 1000){
                    step = 500;
                }else if(largest > 500){
                    step = 100;
                }

                chart.options.scales.yAxes[0].ticks.suggestedMax = largest + step;
                chart.options.scales.yAxes[0].ticks.stepSize = step;
            }
        }

        chart.update();
		
        if(!syncronizedStop)
            updateChart(value,autosize,accuracy);

    },1000);//syncronizedDelay);
}

function getRandom(min, max) {
    return (Math.random() * (max - min) + min).toFixed(1);
}