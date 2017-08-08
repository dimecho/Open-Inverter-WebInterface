<?php
    include_once("common.php");
    
    detectOS();
    
    if(isset($_GET["ajax"])){
        
        set_time_limit(10000);
        
        exec(runCommand("source",""), $output, $return);
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            $(document).ready(function() {
                var progressBar = $("#progressBar");
                for (i = 0; i < 100; i++) {
                    setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                }
                var notify = $.notify({
                        message: 'Compiling ...',
                    },{
                        allow_dismiss: false,
                        type: 'danger'
                });
                $.ajax({
                    /*
                    xhr: function()
                    {
                        var xhr = new window.XMLHttpRequest();
                        xhr.addEventListener("progress", function(e){
                            console.log(e.target.responseText);
                        }, false);
                        return xhr;
                    },
                    */
                    //async: false,
                    type: "GET",
                    url: "/compile.php?ajax=1",
                    data: {},
                    success: function(data){
                        //console.log(data);
                        notify.update({'type': 'success', 'allow_dismiss': true, 'message': 'Compiled'});
                        progressBar.css("width","100%");
                        $("#output").append($("<pre>").append(data));
                    }
                });
            });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <center>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="progress progress-striped active">
                                            <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                        </div>
                                        <div id="output"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>
<?php } ?>