<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="/css/bootstrap-slider.css" />
        <script type="text/javascript" src="/js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="/js/status.js"></script>
        <script type="text/javascript" src="/js/simple.js"></script>
        <style>
            /*
            #udc .slider-track-high {
                background: green;
            }
            #udc .slider-track-low {
                background: red;
            }
            #udc .slider-selection {
                background: yellow;
            }
            */
            .tooltip-inner {
                user-select: none;
                -moz-user-select: none;
                -khtml-user-select: none;
                -webkit-user-select: none;
                -o-user-select: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered"><tbody><tr><td><h4>Auto Tuning</h4></td></tr></tbody></table>
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="boostTuning();"><i class="glyphicon glyphicon-flash"></i> Boost Tuning</button>
                            </td>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="fweakTuning();"><i class="glyphicon glyphicon-random"></i> Fweak Tuning</button>
                            </td>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="polePairTest();"><i class="glyphicon glyphicon-transfer"></i> Pole Pair Test</button>
                            </td>
                            <td>
                                <button class="browse btn btn-primary" type="button" onclick="numimpTest();"><i class="glyphicon glyphicon-record"></i> Encoder Pulse Test</button>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered"><thead><tr><td><h4>Motor</h4></td></tr></thead></table>
                    <table class="table table-active bg-light table-bordered" id="parameters_Motor"></table>
                    <table class="table table-active bg-light table-bordered"><tbody><tr><td><h4>Battery</h4></td></tr></tbody></table>
                    <table class="table table-active bg-light table-bordered" id="parameters_Battery"></table>
                </div>
            </div>
        </div>
    </body>
</html>