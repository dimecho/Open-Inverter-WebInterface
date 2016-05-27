<!DOCTYPE html>
<html lang="en">
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
        
            $(document).ready(function()
            {
                $('#parameters').editable({
                    selector: 'a',
                    url: 'serial.php',
                    mode: 'popup',
                    pk: 1,
                    showbuttons: true,
                    ajaxOptions: {
                        type: 'get',
                        //type: 'put',
                        //dataType: 'json'
                    },
                    success: function(response, newValue) {
                        //console.log(response);
                        if(response.indexOf("Set OK"))
                        {
                            var id = this.id;
                            //console.log(this.id);

                            $("#" + id).addClass('alert-warning');
                            var span = $("<span>", { class:"label label-warning offset1"}).append("changed");
                            $("#" + id).parent().append(span);
                            
                            setTimeout(function(){

                                $.ajax("serial.php?save=1",{
                                    success: function(data)
                                    {
                                        //console.log(data);
                                        $("#" + id).removeClass('alert-warning');
                                        span.removeClass('label-warning');

                                        if(data.indexOf("Parameters stored") != -1)
                                        {
                                            $("#" + id).addClass('alert-success');
                                            span.addClass('label-success');
                                            span.text("saved");
                                        }else{
                                            $("#" + id).addClass('label-important');
                                            span.addClass('label-important');
                                            span.text("error");
                                        }
                                    }
                                });
                            },2000);
                            setTimeout(function(){
                                span.remove();
                            },5000);
                        }
                    }
                });

                //setTimeout(function(){
                    loadJSON();
                //},500);
                $('.tooltip-custom').tooltipster();
            });
        </script>
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