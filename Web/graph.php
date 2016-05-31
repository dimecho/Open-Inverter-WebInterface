<!DOCTYPE html>
<html>
    <head>
        <title>Huebner Inverter</title>
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-slider.css" />

        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
        <script type="text/javascript" src="js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="js/chart.js"></script>
        <script type="text/javascript" src="js/graph.js"></script>
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
        <?php include "menu.php" ?>
        <br/>
        <div class="row">
            <div class="span1"></div>
            <div class="span10">
                <table class="table table-bordered" style="background-color:#e6e6e6;">
                    <tbody>
                        <td>
                            <ul class="nav nav-tabs">
                              <li class="active"><a data-toggle="tab" href="#sectionGraphA">Motor Speed</a></li>
                              <li><a data-toggle="tab" href="#sectionGraphB">Temperature</a></li>
                              <li><a data-toggle="tab" href="#sectionGraphC">Slip Control</a></li>
                            </ul>
                            <div class="tab-content">
                                <div id="sectionGraphA" class="tab-pane fade in active"> 
                                </div>
                                <div id="sectionGraphB" class="tab-pane fade"> 
                                </div>
                                <div id="sectionGraphC" class="tab-pane fade">
                                </div>
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
                <button type="button" class="btn btn-success" onClick="updateChart();">Start Graph</button>
                <button type="button" class="btn btn-danger" onClick="clearTimeout(syncronized);">Stop Graph</button>
                <button type="button" class="btn btn-info">Speed
                    <input
                    id="speed"
                    type="text"
                    data-provide="slider"
                    data-slider-min="20"
                    data-slider-max="400"
                    data-slider-step="10"
                    data-slider-value="80"
                    data-slider-orientation="horizontal"
                    data-slider-selection="after"
                    data-slider-tooltip="hide" />
                </button>
            </div>
            </center>
            </div>
            <div class="span1"></div>
        </div>
    </body>
</html>