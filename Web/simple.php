<!DOCTYPE html>
<html>
    <head>
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
        <title>Huebner Inverter</title>
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-slider.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-editable.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.css" />

        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
        <script type="text/javascript" src="js/bootstrap-slider.js"></script>
        <script type="text/javascript" src="js/bootstrap-editable.js"></script>
        <script type="text/javascript" src="js/simple.js"></script>
    </head>
    <body>
        <?php include "menu.php" ?>
        <br/>
        <div class="row">
            <div class="span1"></div>
            <div class="span10">
                <div class="list-group">
                    <button type="button" class="list-group-item">Motor</button>
                    <table class="table table-bordered" style="background-color:#e6e6e6;" id="parameters_Motor">
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                    <button type="button" class="list-group-item">Battery</button>
                    <table class="table table-bordered" style="background-color:#e6e6e6;" id="parameters_Battery">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>Regenerative (%)</td>
                                <td><input id="brknormpedal" type="text" data-provide="slider" data-slider-min="1" data-slider-max="100" data-slider-value="1" data-slider-enabled="false" />&nbsp;&nbsp;<input id="brknormpedal-enabled" type="checkbox" /></td>
                            </tr>
                            <tr>
                                <td>Voltage (V)</td>
                                <td><input id="fmax" type="text" data-provide="slider" data-slider-min="1" data-slider-max="400" data-slider-value="55"/></td>
                            </tr>
                            <tr>
                                <td>Amperage (A)</td>
                                <td><input id="fmax" type="text" data-provide="slider" data-slider-min="5" data-slider-max="200" data-slider-value="10"/></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="span1"></div>
        </div>
    </body>
</html>