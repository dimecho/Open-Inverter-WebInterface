<?php
    include_once("common.php");
    
    detectOS();
    
    if(isset($_GET["ajax"])){
        
        $command = runCommand("openocd", $_GET["file"]. " " .$_GET["interface"]);
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
            var jtag_interface = [
                "olimex-arm-usb-ocd-h",
                "olimex-arm-usb-tiny-h",
                "jtag-lock-pick_tiny_2",
                "stlink-v2",
                "black-magic",
                "cmsis-dap"
            ];

            var jtag_name = [
                "Olimex OCD-H",
                "Olimex Tiny-H",
                "Lock-Pick Tiny v2.0",
                "STlink v2.0",
                "Black Magic Probe v2.1",
                "CoLinkEx v1.2"
            ];

            function setJTAGImage() {
                $("#jtag-image").attr("src", "firmware/img/" + $("#jtag-interface").val() + ".jpg");
                $("#jtag-name").html(jtag_name[$("#jtag-interface option:selected").index()]);
            }

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
                                            for (i = 0; i < 100; i++) {
                                                setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                                            }
                                            $.ajax({
                                                type: "GET",
                                                url:
                                                <?php
                                                    echo "'";
                                                    echo "bootloader.php?ajax=1";
                                                    if ($GLOBALS["OS"] === "mac") {
                                                        $tmp_name = "/tmp/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }else{
                                                        $tmp_name = sys_get_temp_dir(). "/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    echo "&file=" .$tmp_name;
                                                    echo "&interface=" .$_POST["interface"];
                                                    echo "'";
                                                ?>,
                                                success: function(data){
                                                    //console.log(data);
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
                                    for (var i = 0; i < jtag_interface.length; i++) {
                                        $("#jtag-interface").append($("<option>",{value:jtag_interface[i],selected:'selected'}).append(jtag_interface[i]));
                                    }
                                    $("#jtag-interface").prop('selectedIndex', 0);
                                    setJTAGImage();
                                });
                            </script>
                            <tr>
                                <td>
                                    <center>
                                        <div class="input-group" style="width:60%">
                                            <span class = "input-group-addon" style="width:80%">
                                                <select name="interface" class="form-control" form="Aform" onchange="setJTAGImage()" id="jtag-interface"></select>
                                            </span>
                                            <span class = "input-group-addon" style="width:40%">
                                                <button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select BIN</button>
                                            </span>
                                        </div>
                                        <br/><br/>
                                        <h2 id="jtag-name"></h2>
                                        <img src="" id="jtag-image" class="img-rounded" />
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
            <input name="firmware" type="file" class="file" hidden onchange="javascript:this.form.submit();"/>
            <input type="submit" hidden/>
        </form>
    </body>
</html>
<?php } ?>