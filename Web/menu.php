<div class="row">
    <div class="col-md-1"></div>
    <div class="col-md-10">
        <div class="navbar navbar-default">
            <div class="container-fluid">
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><b>Motor</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" onClick='alertify.startInverterMode("<i class=\"glyphicon glyphicon-dashboard\"></i> Warning: Before starting the inverter set the throttle control to zero.");'>Start Inverter</a></li>
                            <li><a tabindex="-1" onClick="stopInverter()">Stop Inverter</a></li>
                            <li><a tabindex="-1" onClick="setDefaults()">Reset to Default</a></li>
                            <li><a tabindex="-1" href="db.php">Motor Database</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="graph.php">Graph</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="#" onClick="uploadSnapshot();">Upload Parameters</a></li>
                            <li><a tabindex="-1" href="#" onClick="downloadSnapshot();">Download Parameters</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="index.php">Advanced Parameters</a></li>
                            <li><a tabindex="-1" href="simple.php">Simple Parameters</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><b>Inverter</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('openocd')">Flash Bootloader</a></li>
                            <li><a tabindex="-1" href="firmware.php">Flash Firmware</a></li>
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('attiny')">Flash ATtiny13 Chip</a></li>
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('arm')">Compile from Source</a></li>
                            <?php if(checkSoftware("gcc",true)) { ?>
                                <li><a tabindex="-1" href="#" onClick="confirmGCCRemove()">Remove GCC ARM Compiler</a></li>
                            <?php } ?>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="wiring.php">Wiring Diagram</a></li>
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('eagle')">Schematics</a></li>
                            <li><a tabindex="-1" href="components.php">Components</a></li>
                            <li><a tabindex="-1" href="stm32.php">STM32 Processor</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><b>Dashboard</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" href="switch-check.php">Switch Check</a></li>
                            <li><a tabindex="-1" href="arduino.php">Arduino LCD</a></li>
                            <li><a tabindex="-1" href="raspberrypi.php">RaspberryPi LCD</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><b>User</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" href="motor-class.php">Motor Classification</a></li>
                            <li><a tabindex="-1" href="igbt-test.php">IGBT Test</a></li>
                            <li><a tabindex="-1" href="encoder.php">Encoder</a></li>
                            <li><a tabindex="-1" href="design.php">Power Stage</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li><div id="opStatus"></div></li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li><span><h3 class="label" id="firmwareVersion" style="color:black;font-weight:normal"></h3></span></li>
                </ul>
            </div>
        </div>
        <div  id="potentiometer" style="display:none">
            <center>
                <input class="knob" data-displayInput=true data-min="0" data-max="100" data-fgColor="#222222" data-bgColor="#FFFFFF" value="0"/>
            </center>
            <br/>
        </div>
        <form enctype="multipart/form-data" action="open.php" method="POST">
            <input type="file" name="file" class="fileSVG" hidden onChange="javascript:this.form.submit();" accept=".svg"/>
            <input type="submit" hidden/>
        </form>
        <form enctype="multipart/form-data" action="upload.php" method="POST">
            <input type="file" name="file" class="fileUpload" hidden onChange="javascript:this.form.submit();" accept=".txt"/>
            <input type="submit" hidden/>
        </form>
    </div>
    <div class="col-md-1"></div>
</div>