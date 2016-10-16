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
                <div class="span1"></div>
                <div class="span10">
                        <table class="table table-bordered"><thead><tr><td><h4>Motor</h4></td></tr></thead></table>
                        <table class="table table-bordered" id="parameters_Motor"></table>
                        <table class="table table-bordered"><tbody><tr><td><h4>Battery</h4></td></tr></tbody></table>
                        <table class="table table-bordered" id="parameters_Battery"></table>
                    
                </div>
                <div class="span1"></div>
            </div>
        </div>
    </body>
</html>