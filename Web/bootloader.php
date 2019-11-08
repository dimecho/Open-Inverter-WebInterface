<?php
	include_once("common.php");
    $os = detectOS();
	
    if(isset($_GET["ajax"]))
    {
        $file = urldecode($_GET["file"]);
        $interface = urldecode($_GET["interface"]);

        if (strpos($interface, "stlink-v2") !== false) {
            $command = runCommand("stlink", $file, $os, 0);
        }else{
            $command = runCommand("openocd", $file. " " .$interface, $os, 0);
        }
        exec($command, $output, $return);
		echo sys_get_temp_dir();
        echo "\n$command\n";
        foreach ($output as $line) {
            echo "$line\n";
        }
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
		<script src="js/firmware.js"></script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <button type="button" class="btn btn-primary" onClick="window.open('https://github.com/jsphuebner/tumanako-inverter-fw-bootloader')"><i class="icons icon-download"></i> Download Bootloader</button>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                            <?php
    						if(isset($_FILES["firmware"])){
    							require "upload-status.php";
                            }else{
                            ?>
                               <script>
                                    $(document).ready(function() {
    									if(os == "esp8266") {
    										$("#firmware-interface").append($("<option>",{value:"swd-esp8266",selected:'selected'}).append("SWD over ESP8266"));
    									}else{
                                            unblockSerial();
    										for (var i = 0; i < jtag_interface.length; i++) {
    											$("#firmware-interface").append($("<option>",{value:jtag_interface[i],selected:'selected'}).append(jtag_name[i]));
    										}
    									}
                                        $("#firmware-interface").prop('selectedIndex', 0);
    									$(".spinner-border").addClass("d-none"); //.hide();
    									$(".input-group-addon").removeClass("d-none"); //.show();
                                        setInterfaceImage();
                                        displayHWVersion();
                                    });
                                </script>
    							<center>
    							<div class="spinner-border text-dark"></div>
                                <div class="input-group w-100">
                                    <span class = "input-group-addon d-none w-75">
    								    <form enctype="multipart/form-data" action="bootloader.php" method="POST" id="firmwareForm">
    										<input name="firmware" type="file" class="file" hidden onchange="firmwareUpload()" />
    										<select name="interface" class="form-control" form="firmwareForm" onchange="setInterfaceImage()" id="firmware-interface"></select>
    									</form>
    								</span>
                                    <span class = "input-group-addon d-none w-25 text-center">
    									<button class="browse btn btn-primary" type="button"><i class="icons icon-select"></i> Select stm32_loader.bin</button>
    								</span>
                                </div>
                                <br><br><h2 id="jtag-name"></h2>
    							<span class="badge badge-lg bg-warning" id="jtag-txt"></span><br><br>
                                <img src="" id="jtag-image" class="img-thumbnail rounded" />
    							</center>
                            <?php
    							} 
    						?>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <?php include "footer.php" ?>
    </body>
</html>
<?php } ?>