<?php
	 include_once("common.php");
		
    $os = detectOS();
		
    if(isset($_GET["ajax"])){
        $command = runCommand("openocd", urldecode($_GET["file"]). " " .urldecode($_GET["interface"]),$os);
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
        <?php include "header.php"; ?>
        <script>
            var jtag_interface = [
                "interface/ftdi/olimex-arm-usb-ocd-h.cfg",
                "interface/ftdi/olimex-arm-usb-tiny-h.cfg",
				"interface/ftdi/olimex-arm-jtag-swd.cfg",
                "interface/ftdi/jtag-lock-pick_tiny_2.cfg",
                "interface/stlink-v2.cfg",
                "interface/jlink.cfg",
                "interface/cmsis-dap.cfg"
            ];

            var jtag_name = [
                "Olimex OCD-H",
                "Olimex Tiny-H",
				"Olimex CooCox",
                "Lock-Pick Tiny v2.0",
                "STlink v2.0",
                "J-Link",
                "CoLinkEx v1.2"
            ];

            function setJTAGImage() {
                var img = $("#jtag-interface").val().split("/").pop().slice(0, -4);
                if(img == "stlink-v2")
                {
                    window.location.href = "st-link.php";
                }else{
                    $("#jtag-image").attr("src", "/firmware/img/" + img + ".jpg");
                    $("#jtag-name").html(jtag_name[$("#jtag-interface option:selected").index()]);
                }
            }

            $(document).on('click', '.browse', function(){
                var file = $('.file');
                file.trigger('click');
            });

            function bootloaderUpload() {
                
                var file = $('.file').get(0).files[0].name;

                if (file.toUpperCase().indexOf(".BIN") !=-1 || file.toUpperCase().indexOf(".HEX") !=-1) {
                    $('#Aform').submit();
                }else{
                    $.notify({ message: "Bootloader file must be .bin or .hex format" }, { type: "danger" });
                }
            }
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <button type="button" class="btn btn-primary" onClick="window.open('https://github.com/jsphuebner/tumanako-inverter-fw-bootloader')"><i class="glyphicon glyphicon-circle-arrow-down"></i> Download Bootloader</button>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered">
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
                                                    //$tmp_dir = ini_get('upload_tmp_dir') ? ini_get('upload_tmp_dir') : sys_get_temp_dir();
                                                    echo "'";
                                                    echo "/bootloader.php?ajax=1";
                                                    if ($os === "mac") {
                                                        $tmp_name = "/tmp/" .$_FILES['firmware']["name"];
                                                    }else{
                                                        $tmp_name = sys_get_temp_dir(). "/" .$_FILES['firmware']["name"];
                                                    }
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    echo "&file=" .urlencode($tmp_name);
                                                    echo "&format=" .$_GET['firmware'];
                                                    echo "&interface=" .urlencode($_POST["interface"]);
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
                                    <div class="input-group w-100">
                                        <span class = "input-group-addon w-75">
                                            <select name="interface" class="form-control" form="Aform" onchange="setJTAGImage()" id="jtag-interface"></select>
                                        </span>
                                        <span class = "input-group-addon w-25">
                                            <button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select stm32_loader.bin</button>
                                        </span>
										
                                    </div>
                                    <br/><br/>
									<center>
                                    <h2 id="jtag-name"></h2>
                                    <img src="" id="jtag-image" class="rounded" />
									</center>
                                </td>
                            </tr>
                        <?php } ?>
                    </table>
                </div>
            </div>
        </div>
        <form enctype="multipart/form-data" action="/bootloader.php" method="POST" id="Aform">
            <input name="firmware" type="file" class="file" hidden onchange="bootloaderUpload()"/>
        </form>
    </body>
</html>
<?php } ?>