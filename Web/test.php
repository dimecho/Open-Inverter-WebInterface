<?php
	include_once("common.php");
    
    if(isset($_POST["flash"]))
    {
		$os = detectOS();
		
		$file = str_replace(" ", "%", getcwd()) . "/firmware/stm32_test.bin";
		
		//print_r($_FILES);
		if(isset($_FILES["file"])) {
			$file = $_FILES['file']['tmp_name'];
		}

        $interface = urldecode($_POST["interface"]);
        $software = getSoftware();

        if ($os === "windows") {
            $file = str_replace("/","\\",$file);
            $interface = str_replace("/","\\",$interface);
        }

        if (strpos($interface, "stlink-v2") !== false) {
            $command = runCommand("stlink", $file. " - " .$software["stlink"]["download"]["version"], $os, 0);
        }else{
            $command = runCommand("openocd", $file. " " .$interface. " - " .$software["openocd"]["download"]["version"], $os, 0);
        }
        exec($command, $output, $return);

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
        <script src="js/jquery.knob.js"></script>
        <script src="js/firmware.js"></script>
        <script src="js/test.js"></script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="container bg-light">
                        <div class="row">
                            <div class="col">
                                <nav>
                                    <div class="nav nav-tabs" role="tablist">
                                        <a class="nav-link active" href="#tabAnalog" id="text_analog" data-bs-toggle="tab" role="tab">Analog</a>
                                        <a class="nav-link d-none" href="#tabDigital" id="text_digital" data-bs-toggle="tab" role="tab">Digital</a>
                                        <a class="nav-link" href="#tabHardware" id="text_hardware" data-bs-toggle="tab" role="tab">Hardware</a>
                                    </div>
                                </nav>
                                <div class="tab-content">
                                    <div class="tab-pane show active container" id="tabAnalog" role="tabpanel">
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">
                                                <button type="button" class="btn btn-danger" onClick="stopTest()"><i class="icons icon-cancel"></i> <span id="text_stop">Stop</span></button>
                                            </div>
                                            <div class="col">
                                                <button type="button" class="btn btn-success" onClick="startTest()"><i class="icons icon-ok"></i> <span id="text_start">Start</span></button>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">Protection</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id="din_mprot"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Emergency</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id ="din_emcystop"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Brake</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id ="din_brake"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Start</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id ="din_start"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Forward</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id ="din_forward"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Reverse</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id ="din_reverse"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Cruise</div>
                                            <div class="col"><div class="circle-size-1 circle-grey" id ="din_cruise"></div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Potentiometer</div>
                                        </div>
                                        <div class="row text-center">
                                            <div class="col">
                                                <input class="knob text-dark" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                    </div>
                                    <div class="tab-pane container" id="tabDigital" role="tabpanel">
                                        <div class="row mt-4"></div>
                                         <div class="row">
                                            <div class="col">
                                                <button type="button" class="btn btn-primary" onClick="location.href='can.php'"><i class="icons icon-list"></i> CAN Mapping</button>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">CAN Interface:</div>
                                            <div class="col"><select name="can" class="form-control" id="can-interface"></select></div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">Receive:</div>
                                            <div class="col">Send:</div>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <textarea type="text" id="can-receive" class="md-textarea form-control" rows="7" readonly></textarea>
                                            </div>
                                            <div class="col">
                                                <div class="input-group w-100">
                                                    <span class = "input-group-addon w-75">
                                                        <input type="text" class="form-control" id="can-send" />
                                                    </span>
                                                    <span class = "input-group-addon w-25 text-center">
                                                        <button class="btn btn-primary" type="button"><i class="icons icon-select"></i> Send</button>
                                                    </span>
                                                </div>
                                                <br>
                                                <textarea type="text" id="can-send-log" class="md-textarea form-control" rows="4" readonly></textarea>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                    </div>
                                    <div class="tab-pane container" id="tabHardware" role="tabpanel">
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">
                                                <button type="button" class="btn btn-primary" onClick="window.open('https://github.com/jsphuebner/stm32-test')"><i class="icons icon-download"></i> <span id="text_download">Download Test Firmware</span></button>
                                            </div>
                                            <div class="col">
                                                <form enctype="multipart/form-data" action="test.php" method="POST" id="firmwareForm">
                                                    <input name="firmware" type="file" class="file" hidden onchange="setFirmwareFile()"/>
                                                    <button class="browse btn btn-primary" type="button"><i class="icons icon-select"></i> Select stm32_test.bin</button>
                                                </form>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">Hardware:</div>
                                            <div class="col"><select name="hardware" class="form-control" id="hardware-version"></select></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Debugger:</div>
                                            <div class="col"><select name="debugger" class="form-control" id="debugger-interface"></select></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Serial:</div>
                                            <div class="col"><select name="serial" class="form-control" id="serial2-interface"></select></div>
                                        </div>
                                        <div class="row">
                                            <div class="col">Firmware:</div>
                                            <div class="col"><input type="text" class="form-control" id="firmware-file-path" value="firmware/stm32_test.bin" readonly /></div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">
                                                <button class="btn btn-success" type="button" onClick="$('#hwtestconfirm').modal()"><i class="icons icon-chip"></i> Flash Test Firmware</button>
                                            </div>
                                            <div class="col">
                                                <button class="btn btn-success" type="button" onClick="hardwareTestRun()"><i class="icons icon-test"></i> Run Test Results</button>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">
                                                <center><div class="spinner-border text-dark d-none"></div></center>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                        <div class="row">
                                            <div class="col">
                                                <div class="container" id="hardware-results"></div>
                                                <center>
                                                    <img src="" id="hardware-image" class="img-thumbnail rounded" />
                                                </center>
                                            </div>
                                        </div>
                                        <div class="row mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" id="hwtestconfirm" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content bg-light">
                <div class="modal-header">
                    <h5 class="modal-title">Warning</h5>
                    <button type="button" class="btn-close btn-close-dark" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4><i class="icons icon-alert"></i> Warning: This test will <font color=red>ERASE FLASH</font></h4>
                    <br>Debugger (JTAG/ST-Link) <b>AND</b> Serial (UART) must be connected.<br><br>
                        After the test is complete you will need to flash original bootloader and firmware.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="icons icon-cancel"></i> Cancel</button>
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onClick="startTest()"><i class="icons icon-ok"></i> Continue Test</button>
                </div>
            </div>
        </div>
        <?php include "footer.php" ?>
    </body>
</html>
<?php } ?>