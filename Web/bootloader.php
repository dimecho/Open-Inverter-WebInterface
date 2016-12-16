<?php
    include_once("common.php");
    
    detectOS();
    
    if(isset($_GET["ajax"])){
        
        $command = runCommand("openocd") . " " .$_GET["file"]. " " .$_GET["rs"];

        exec($command . " 2>&1", $output, $return);
        
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

            function setJTAGImage(){
                $("#jtagimage").attr("src", "img/" + $("#jtag").val() + ".jpg");
            }
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
                                            for (i = 0; i < 100; i++) {
                                                setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                                            }
                                            $.ajax({
                                                type: "GET",
                                                url: "bootloader.php?ajax=1<?php
                                                    $name = basename($_FILES['firmware']['tmp_name']);
                                                    $tmp_name = "/tmp/$name.bin";
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    //echo $_FILES['firmware']['tmp_name'];
                                                    echo "&file=" .$tmp_name;
                                                    echo "&rs=" .$_POST["rs"];
                                                ?>",
                                                data: {},
                                                success: function(data){
                                                    console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                    </div>
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
                                            //console.log(data);
                                            var s = data.split(',');
                                            for (i = 0; i < s.length; i++) {
                                                $("#serialList").append($("<option>",{value:s[i],selected:'selected'}).append(s[i]));
                                            }
                                        }
                                    });
                                });
                            </script>
                            <tr>
                                <td>
                                    <center>
                                        <div class="input-group" style="width:80%">
                                            <span class = "input-group-addon" style="width:40%">
                                                <select name="rs" class="form-control" form="Aform" onchange="setJTAGImage()" id="jtag" >
                                                    <option value="olimex-arm-usb-ocd-h" selected="selected">olimex-arm-usb-ocd-h</option>
                                                    <option value="olimex-arm-usb-tiny-h">olimex-arm-usb-tiny-h</option>
                                                    <option value="jtag-lock-pick_tiny_2">jtag-lock-pick_tiny_2</option>
                                                    <option value="openocd-usb">openocd-usb</option>
                                                </select>
                                            </span>
                                            <span class = "input-group-addon" style="width:60%">
                                            <select name="serial" class="form-control" form="Aform" id="serialList">
                                            </select>
                                            </span>
                                            <span class = "input-group-addon">
                                            
                                                <button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select BIN</button>
                                            </span>
                                        </div>
                                        <br/><br/>
                                        <img src="img/olimex-arm-usb-ocd-h.jpg" id="jtagimage" class="img-rounded" />
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
        <form enctype="multipart/form-data" action="bootloader.php" method="POST" id="Aform">
            <input type="file" name="firmware" class="file" hidden onchange="javascript:this.form.submit();"/>
            <input type="submit" hidden/>
        </form>
    </body>
</html>
<?php } ?>