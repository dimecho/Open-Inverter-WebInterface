<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/bootstrap-slider.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-editable.css" />
        <script type="text/javascript" src="js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="js/bootstrap-editable.js"></script>
        <script type="text/javascript" src="js/simple.js"></script>
        <style>
            /*
            #udc .slider-track-high {
                background: green;
            }
            #udc .slider-track-low {
                background: red;
            }
            */
            #udc .slider-selection {
                background: yellow;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <table class="table table-bordered"><tbody><tr><td><h4>Auto Tuning</h4></td></tr></tbody></table>
                    <table class="table table-bordered">
                        <tr>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="modeCheck();boostTuning();"><i class="glyphicon glyphicon-flash"></i> Boost Tuning</button>
                            </td>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="modeCheck();fweakTuning(10);"><i class="glyphicon glyphicon-random"></i> Fweak Tuning</button>
                            </td>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="modeCheck();polePairTest();"><i class="glyphicon glyphicon-transfer"></i> Pole Pair Test</button>
                            </td>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="modeCheck();numimpTest();"><i class="glyphicon glyphicon-record"></i> Encoder Pulse Test</button>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-bordered"><thead><tr><td><h4>Motor</h4></td></tr></thead></table>
                    <table class="table table-bordered" id="parameters_Motor"></table>
                    <table class="table table-bordered"><tbody><tr><td><h4>Battery</h4></td></tr></tbody></table>
                    <table class="table table-bordered" id="parameters_Battery"></table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>