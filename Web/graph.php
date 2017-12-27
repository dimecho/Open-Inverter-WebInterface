<?php
    
    //session_save_path(sys_get_temp_dir()); //For accessing same session with different port
    session_start();
	
	set_time_limit(0);
	
    //Allow for Cross Origin Resource Sharing
    //header("Access-Control-Allow-Origin: *");
    //header("Access-Control-Allow-Methods: GET, POST");
    //if(!isset($_SESSION["stop"])){
    //    $_SESSION["stop"] = 0;
    //}
    
    if(isset($_GET["delay"])){
        $_SESSION["delay"] = $_GET["delay"] * 1000;
    }
    if(isset($_GET["stream"])){

        require("serial.php");

        //header('Content-type: application/octet-stream');
        header('Content-type: text/html; charset=utf-8');

        $split = explode(",", urldecode($_GET["stream"]));
        $values = array();

        while(true) //$_SESSION["stop"] === 0)
        {
            for ($i = 0; $i < count($split); $i++)
            {
                if (trim($split[$i]) != "")
                {
                    //echo $split[$i];
                    $values[$i] = readSerial("get " .$split[$i]);
                }
            }

            echo implode(",",$values);

            flush();
            ob_flush();
            usleep($_SESSION["delay"]);
        }
        //echo $values;
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="/css/bootstrap-slider.css" />
        <script type="text/javascript" src="/js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="/js/moment.js"></script>
        <script type="text/javascript" src="/js/chart.js"></script>
        <script type="text/javascript" src="/js/chartjs-plugin-zoom.js"></script>
        <script type="text/javascript" src="/js/chartjs-plugin-streaming.js"></script>
        <script type="text/javascript" src="/js/graph.js"></script>
        <script type="text/javascript" src="/js/jspdf.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered" id="render">
                        <tr>
                            <td>
                                <ul class="nav nav-tabs" role="tablist">
                                    <li role="tab" class="nav-item"><a class="nav-link active" href="#graphA" data-toggle="tab">Motor</a></li>
                                    <li role="tab" class="nav-item"><a class="nav-link" href="#graphB" data-toggle="tab">Temperature</a></li>
                                    <li role="tab" class="nav-item"><a class="nav-link" href="#graphC" data-toggle="tab">Battery</a></li>
                                    <li role="tab" class="nav-item"><a class="nav-link" href="#graphD" data-toggle="tab">Sensors</a></li>
                                    <li role="tab" class="nav-item"><a class="nav-link" href="#graphE" data-toggle="tab">Frequencies</a></li>
                                    <!--<li role="tab" class="nav-item"><a class="nav-link" href="#graphF">Pulse Amplitude</a></li>-->
                                    <li role="tab" class="nav-item"><a class="nav-link" href="#graphG">PWM</a></li>
                                </ul>
                                <div class="tab-content">
                                    <div role="tabpanel" id="graphA" class="tab-pane fade in active"></div>
                                    <div role="tabpanel" id="graphB" class="tab-pane fade"></div>
                                    <div role="tabpanel" id="graphC" class="tab-pane fade"></div>
                                    <div role="tabpanel" id="graphD" class="tab-pane fade"></div>
                                    <div role="tabpanel" id="graphE" class="tab-pane fade"></div>
                                    <div role="tabpanel" id="graphF" class="tab-pane fade"></div>
                                    <div role="tabpanel" id="graphG" class="tab-pane fade"></div>
                                </div>
                                <canvas id="canvas"></canvas>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="btn-group" style="width:100%">
                        <button class="btn btn-success" onClick="startChart();">Start Graph</button>
                        <button class="btn btn-danger" onClick="stopChart();" >Stop Graph</button>
                        <div class="btn btn-info" style="height:34px">
                        Sync
                        <input
                            id="speed"
                            type="hidden"
                            data-provide="slider"
                            data-slider-min="200"
                            data-slider-max="3000"
                            data-slider-step="1"
                            data-slider-value="1000"
                            data-slider-reversed=true
                            data-slider-orientation="horizontal"
                            data-slider-selection="after"
                            data-slider-tooltip="hide" />
                        </div>
                        <button type="button" class="btn btn-warning" onClick="exportPDF(true);">Export PDF</button>
                        <button type="button" class="btn btn-info" onClick="exportPDF();">Export Image</button>
                    </div>
                </div>
            </div>
        </div>
        <br/>
    </body>
</html>
<?php } ?>