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
                        <tbody></tbody>
                    </table>
                </div>
            </div>
            <div class="span1"></div>
        </div>
    </body>
</html>