<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Huebner Inverter</title>
        
        <link rel="stylesheet" type="text/css" href="css/style.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.css" />
        <link rel="stylesheet" type="text/css" href="css/bootstrap-editable.css" />
        <link rel="stylesheet" type="text/css" href="css/tooltipster.css" />

        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/bootstrap.js"></script>
        <script type="text/javascript" src="js/bootstrap-editable.js"></script>
        <script type="text/javascript" src="js/tooltipster.js"></script>

        <script>
        
            //defaults
            //$.fn.editable.defaults.url = 'serial.php'; 
            //$.fn.editable.defaults.mode = 'inline';
            //$.fn.editable.defaults.mode = 'popup';
            //$.fn.editable.defaults.ajaxOptions = {type: "PUT"};

            $(document).ready(function()
            {
                $('#parameters').editable({
                    selector: 'a',
                    url: 'serial.php',
                    pk: 1,
                    ajaxOptions: {
                        type: 'get',
                        //type: 'put',
                        //dataType: 'json'
                    }
                });
            });
        </script>
    </head>

    <body>
        <?php include "menu.php" ?>
        <br/>
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="center-block" id="title">
                <h3>Inverter Console</h3>
            </div>
            <table class="table table-bordered table-striped table-hover" style="clear: both; background-color:#e6e6e6;" id="parameters">
            </table>
        </div>
    </body>
</html>