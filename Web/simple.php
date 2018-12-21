<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
        <script src="js/ion.rangeSlider.js"></script>
        <script src="js/simple.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Auto Tuning</h4></td></tr></table>
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
                    <center><div class="loader hidden"></div></center>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Motor</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Motor"></table>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Battery</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Battery"></table>
                </div>
            </div>
        </div>
    </body>
</html>