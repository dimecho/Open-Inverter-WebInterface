<?php
    include("common.php");
    
    detectOS();

    if(isset($_GET["ajax"])){
        
        $command = runCommand("updater" . " " .$_GET["file"]. " " .$_GET["serial"]);
        exec($command, $output, $return);

        echo "$command\n";
        foreach ($output as $line) {
            echo "$line\n";
        }
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                var file = $('.file');
                file.trigger('click');
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
                    <table class="table table-bordered">
                        <tbody>
                        <?php if(isset($_FILES["firmware"])){ ?>
                            <tr>
                                <td>
                                    <script>
                                        $(document).ready(function() {
                                            var progressBar = $("#progressBar");
                                            for (var i = 0; i < 100; i++) {
                                                setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                                            }
                                            $.ajax({
                                                type: "GET",
                                                url:
                                                <?php
                                                    echo "'";
                                                    echo "firmware.php?ajax=1";
                                                    if ($os === "Mac") {
                                                        $tmp_name = "/tmp/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }else{
                                                        $tmp_name = sys_get_temp_dir(). "/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    echo "&file=" .$tmp_name;
                                                    echo "&serial=" .$_POST["serial"];
                                                    echo "'";
                                                ?>,
                                                success: function(data){
                                                    deleteCookie("version");
                                                    //console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                    setTimeout( function (){
                                                        window.location.href = "/index.php";
                                                    },6400);
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <span class="label label-lg label-warning ">Tip: If Olimex is bricked, try pressing "reset" button while flashing</span>
                                    <br/><br/>
                                    <div id="output"></div>
                                </td>
                            </tr>
                        <?php }else{ ?>
                            <script>
                                $(document).ready(function() {
                                    $.ajax({
                                        type: "GET",
                                        url: "serial.php?com=list",
                                        success: function(data){
                                            console.log(data);
                                            var s = data.split(',');
                                            for (var i = 0; i < s.length; i++) {
                                                $("#serialList").append($("<option>",{value:s[i],selected:'selected'}).append(s[i]));
                                            }
                                        }
                                    });
                                });
                            </script>
                            <tr>
                                <td>
                                    <center>
                                        <div class="input-group" style="width:60%">
                                            <span class = "input-group-addon" style="width:90%">
                                                <select name="serial" class="form-control" form="Aform" id="serialList"></select>
                                            </span>
                                            <span class = "input-group-addon">
                                                <button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select BIN</button>
                                            </span>
                                        </div>
                                        <br/><br/>
                                        <span class="label label-lg label-warning">Caution: Main board for Olimex powered with 3.3V - Double check your USB-TTL adapter.</span>
                                        <br/><br/>
                                        <img src="img/usb_ttl.jpg" />
                                    </center>
                                </td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
        <form enctype="multipart/form-data" action="firmware.php" method="POST" id="Aform">
            <input name="firmware" type="file" class="file" hidden onchange="javascript:this.form.submit();"/>
            <input type="submit" hidden/>
        </form>
    </body>
</html>
<?php } ?>