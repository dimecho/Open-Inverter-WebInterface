<?php

    session_save_path(sys_get_temp_dir()); //For accessing same session with different port
    session_start();

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

        require("config.inc.php");

        //header('Content-type: application/octet-stream');
        header('Content-type: text/html; charset=utf-8');

        $split = split(",", urldecode($_GET["stream"]));
        $values = array();

        while(true) //$_SESSION["stop"] === 0)
        {
            for ($i = 0; $i < count($split); $i++)
            {
                if (trim($split[$i]) != "")
                {
                    //echo $split[$i];
                    $cmd = "get " .$split[$i]. "\n";
                    $serial->sendMessage($cmd);
                    $read = $serial->readPort();
                    $read = str_replace($cmd,"",$read); //Remove serial echo
                    $values[$i] = $read;
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
        <link rel="stylesheet" type="text/css" href="css/bootstrap-slider.css" />
        <script type="text/javascript" src="js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="js/chart.js"></script>
        <script type="text/javascript" src="js/graph.js"></script>
        <script type="text/javascript" src="js/jspdf.js"></script>
        <style type="text/css">
            .nav-tabs > li > a {
                color: #49afcd;
            }
            .nav-tabs > li > a:hover {
                color: #000000; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="span1"></div>
                <div class="span10">
                    <table class="table table-bordered" style="background-color:#e6e6e6;" id="render">
                        <tbody>
                            <td>
                                <ul class="nav nav-tabs">
                                    <li class="active"><a data-toggle="tab" href="#graphA">Motor</a></li>
                                    <li><a data-toggle="tab" href="#graphB">Temperature</a></li>
                                    <li><a data-toggle="tab" href="#graphC">Battery</a></li>
                                    <li><a data-toggle="tab" href="#graphD">Sensors</a></li>
                                    <li><a data-toggle="tab" href="#graphE">Frequencies</a></li>
                                </ul>
                                <div class="tab-content">
                                    <div id="graphA" class="tab-pane fade in active"></div>
                                    <div id="graphB" class="tab-pane fade"></div>
                                    <div id="graphC" class="tab-pane fade"></div>
                                    <div id="graphD" class="tab-pane fade"></div>
                                    <div id="graphE" class="tab-pane fade"></div>
                                </div>
                                <canvas id="canvas"></canvas>  
                            </td>
                        </tbody>
                    </table>
                </div>
                <div class="span1"></div>
            </div>
            <div class="row">
                <div class="span1"></div>
                <div class="span10">
                    <center>
                        <div class="btn-group">
                            <button type="button" class="btn btn-success" onClick="startChart();">Start Graph</button>
                            <button type="button" class="btn btn-danger" onClick="stopChart();">Stop Graph</button>
                            <div class="btn btn-info">Sync
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
                    </center>
                </div>
                <div class="span1"></div>
            </div>
        </div><br/>
    </body>
</html>
<?php } ?>