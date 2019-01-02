<?php
    include_once("common.php");
    error_reporting(E_ERROR | E_PARSE);
    $os = detectOS();
    
    if(isset($_GET["flash"]))
    {
        $file = str_replace(" ", "%", getcwd()) . "/firmware/stm32_test.bin";
        $interface = urldecode($_GET["debugger"]);

        if ($os === "windows") {
            $file = str_replace("/","\\",$file);
            $interface = str_replace("/","\\",$interface);
        }

        if (strpos($interface, "stlink-v2") !== false) {
            $command = runCommand("stlink", $file, $os, 0);
        }else{
            $command = runCommand("openocd", $file. " " .$interface, $os, 0);
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
        <script src="js/potentiometer.js"></script>
        <script src="js/jquery.knob.js"></script>
        <script src="js/firmware.js"></script>
        <script src="js/test.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
            <div class="row">
                <div class="col">
                    <div class="container bg-light">
                        <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item"><a class="nav-link" href="#tabAnalog">Analog</a></li>
                                    <li class="nav-item"><a class="nav-link" href="#tabDigital">Digital</a></li>
                                    <li class="nav-item"><a class="nav-link" href="#tabHardware">Hardware</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="container" id="tabAnalog">
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col text-center">
                                    <button type="button" class="btn btn-danger" onClick="stopTest()"><i class="glyphicon glyphicon-remove"></i> Stop</button>
                                </div>
                                <div class="col text-center">
                                    <button type="button" class="btn btn-success" onClick="startTest()"><i class="glyphicon glyphicon-ok"></i> Start</button>
                                </div>
                            </div>
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col">Protection</div>
                                <div class="col"><div class="circle-grey" id="din_mprot"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Emergency</div>
                                <div class="col"><div class="circle-grey" id ="din_emcystop"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Brake</div>
                                <div class="col"><div class="circle-grey" id ="din_brake"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Start</div>
                                <div class="col"><div class="circle-grey" id ="din_start"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Forward</div>
                                <div class="col"><div class="circle-grey" id ="din_forward"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Reverse</div>
                                <div class="col"><div class="circle-grey" id ="din_reverse"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Cruise</div>
                                <div class="col"><div class="circle-grey" id ="din_cruise"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Potentiometer</div>
                            </div>
                            <div class="row text-center">
                                <div class="col">
                                    <input class="knob" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
                                </div>
                            </div>
                        </div>
                        <div class="container" id="tabDigital" style="display: none;">
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col"></div>
                            </div>
                        </div>
                        <div class="container" id="tabHardware" style="display: none;">
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col">
                                    <button class="btn btn-success" type="button" onClick="$('.hwtestconfirm').trigger('click');"><i class="glyphicon glyphicon-flash"></i> Start</button>
                                </div>
                            </div>
                            <div class="row"><hr></div>
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
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col">
                                    <center>
                                        <div class="loader hidden"></div>
                                        <img src="" id="hardware-image" class="rounded" />
                                     </center>
                                    <div class="container" id="hardware-results"></div>
                                </div>
                            </div>
                            <div class="row"><hr></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a class="hwtestconfirm" data-fancybox data-src="#hwtestconfirm" href="javascript:;"></a>
        <div class="hidden" id="hwtestconfirm" style="width:60%;border-radius:5px">
            <div class="container">
                <div class="row">
                    <div class="col" align="center">
                        <h4><i class="glyphicon glyphicon-warning-sign"></i> Warning: This test will <font color=red>ERASE FLASH</font></h4><br>
                        Debugger (JTAG/ST-Link) <b>AND</b> Serial (UART) must be connected.<br><br>
                        After the test is complete you will need to flash original bootloader and firmware.<br>
                    </div>
                </div>
                <div class="row"><hr></div>
                <div class="row">
                    <div class="col" align="center">
                        <button class="btn btn-danger" type="button" onClick="$.fancybox.close();"><i class="glyphicon glyphicon-remove"></i> Cancel</button>
                    </div>
                    <div class="col" align="center">
                        <button class="btn btn-success" type="button" onClick="startTest();"><i class="glyphicon glyphicon-ok"></i> Continue Test</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
<?php } ?>