<?php
	include_once("common.php");
    $os = detectOS();
	
    if(isset($_GET["ajax"]))
    {
        $file = urldecode($_GET["file"]);
        $interface = urldecode($_GET["interface"]);
        $software = getSoftware();

        if (strpos($interface, "stlink-v2") !== false) {
            $command = runCommand("stlink", $file. " - " .$software["stlink"]["download"]["version"], $os, 0);
        }else{
            $command = runCommand("openocd", $file. " " .$interface. " - " .$software["openocd"]["download"]["version"], $os, 0);
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
                                <button type="button" class="btn btn-primary" onClick="window.open('https://github.com/jsphuebner/tumanako-inverter-fw-bootloader')"><i class="icons icon-download"></i> <span id="text_download">Download Bootloader</span></button>
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
							<center>
							<div class="spinner-border text-dark"></div>
                            <div class="input-group w-100">
                                <span class = "input-group-addon d-none w-75">
								    <form enctype="multipart/form-data" action="bootloader.php" method="POST" id="firmware-form">
										<input name="firmware" type="file" class="file" accept=".bin,.hex" onchange="firmwareUpload(this.files[0])" hidden >
										<select name="interface" class="form-control" form="firmware-form" onchange="setInterfaceImage(hardware,this.selectedIndex)" id="firmware-interface"></select>
                                        <input type="submit" hidden />
									</form>
								</span>
                                <span class = "input-group-addon d-none w-25 text-center">
									<button class="browse btn btn-primary" type="button" id="browseFile"><i class="icons icon-select"></i> Select Bootloader</button>
								</span>
                            </div>
                            <br><br>
                            <div class="progress progress-striped active">
                                <div class="progress-bar" style="width:0%"></div>
                            </div>
                            <div class="form-check" style="text-align:left">
                                <label class="form-check-label">
                                    <input type="checkbox" class="form-check-input" id="firmware-result-show">
                                       Show Details
                                </label>
                            </div>
                            <br><br>
                            <pre id="firmware-result" style="text-align:left"></pre>
                            <h2 id="jtag-name"></h2>
                            <nav>
                                <div class="nav nav-tabs" role="tablist" id="hardwareTabs"></div>
                            </nav>
                            <div class="tab-content" id="hardwareTabContent"></div>
							<span class="badge badge-lg bg-warning mb-3" id="jtag-txt"></span>
                            <img src="" id="jtag-image" class="img-thumbnail rounded" />
                            <div class="container d-none" id="swd-options">
                                <div class="row">
                                    <div class="col">
                                        <button type="button" class="btn btn-danger" onClick="window.open('/swd/zero')"><i class="icons icon-reset"></i> <span id="text_swd_erase">Erase Flash</span></button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-success" onClick="hardResetSWD()"><i class="icons icon-flash"></i> <span id="text_swd_reset">Hard Reset</span></button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-primary" onClick="window.open('/swd/hex?bootloader')"><i class="icons icon-chip"></i> <span id="text_swd_download_hex_boot">Bootloader Hex</span></button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-primary" onClick="window.open('/swd/bin?bootloader')"><i class="icons icon-binary"></i> <span id="text_swd_download_bin_boot">Bootloader Bin</span></button>
                                    </div>
                                </div>
                            </div>
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