<!DOCTYPE html>
<html lang="en">
    <head>
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
        <title>Huebner Inverter</title>
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-editable.css" />
        <link rel="stylesheet" type="text/css" href="css/tooltipster.css" />

        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
        <script type="text/javascript" src="js/bootstrap-editable.js"></script>
        <script type="text/javascript" src="js/tooltipster.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </head>
    <body>
        <?php include "menu.php" ?>
        <div class="row-fluid">
        <div class="span1"></div>
        <div class="span10">
            <div id="connection" style="display: none;">
                <center>
                <img src="img/connection.jpg" class="thumbnail" width="80%" height="80%"/>
                <br/><br/>
                <div class="btn-group">
                    <button class="btn btn-warning">Warning</button>
                    <button class="btn">Do not connect 5 volt power to serial connection (3.3 volt only)</button>
                </div>
                </center>
            </div>
            <table class="table table-bordered table-striped table-hover" style="display: none;background-color:#e6e6e6;" id="parameters">
            </table>
        </div>
        <div class="span1"></div>
        </div>
    </body>
</html>