<div class="row">
    <div class="col-md-1"></div>
    <div class="col-md-10">
        <div class="navbar navbar-default">
            <div class="container-fluid">
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><i class="glyphicon glyphicon-cd"></i> <b>Motor</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" onClick='alertify.startInverterMode("<i class=\"glyphicon glyphicon-dashboard\"></i> Warning: Before starting the inverter set the throttle control to zero.");'><i class="glyphicon glyphicon-flash"></i> Start Inverter</a></li>
                            <li><a tabindex="-1" onClick="stopInverter()"><i class="glyphicon glyphicon-alert"></i> Stop Inverter</a></li>
                            <li><a tabindex="-1" onClick="setDefaults()"><i class="glyphicon glyphicon-erase"></i> Reset to Default</a></li>
                            <li><a tabindex="-1" href="/db.php"><i class="glyphicon glyphicon-align-justify"></i> Motor Database</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="/index.php"><i class="glyphicon glyphicon-transfer"></i> Parameters</a></li>
                            <li><a tabindex="-1" href="/graph.php"><i class="glyphicon glyphicon-signal"></i> Graph</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="#" onClick="uploadSnapshot();"><i class="glyphicon glyphicon-upload"></i> Upload</a></li>
                            <li><a tabindex="-1" href="#" onClick="downloadSnapshot();"><i class="glyphicon glyphicon-download"></i>  Download</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="/simple.php"><i class="glyphicon glyphicon-random"></i> Auto Tuning</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><i class="glyphicon glyphicon-compressed"></i> <b>Inverter</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('openocd')"><i class="glyphicon glyphicon-object-align-horizontal"></i> Flash Bootloader</a></li>
                            <li><a tabindex="-1" href="/firmware.php"><i class="glyphicon glyphicon-object-align-left"></i> Flash Firmware</a></li>
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('attiny')"><i class="glyphicon glyphicon-object-align-bottom"></i> Flash ATtiny13 Chip</a></li>
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('arm')"><i class="glyphicon glyphicon-console"></i> Compile from Source</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="/switch-check.php"><i class="glyphicon glyphicon-dashboard"></i> Switch Check</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="/wiring.php"><i class="glyphicon glyphicon-flash"></i> Wiring Diagram</a></li>
                            <li><a tabindex="-1" href="#" onClick="checkSoftware('eagle')"><i class="glyphicon glyphicon-cog"></i> Schematics</a></li>
                            <li><a tabindex="-1" href="/components.php"><i class="glyphicon glyphicon-list-alt"></i> Components</a></li>
                        </ul>
                    </li>
                </ul>
                <ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><i class="glyphicon glyphicon-info-sign"></i> <b>Info</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" href="/motor-class.php"><i class="glyphicon glyphicon-tasks"></i> Motor Classification</a></li>
                            <li><a tabindex="-1" href="/igbt-test.php"><i class="glyphicon glyphicon-hand-down"></i> IGBT Test</a></li>
                            <li><a tabindex="-1" href="/encoder.php"><i class="glyphicon glyphicon-record"></i> Encoder</a></li>
                            <li><a tabindex="-1" href="/dashboard/arduino.php"><i class="glyphicon glyphicon-phone"></i> Arduino LCD</a></li>
                            <li><a tabindex="-1" href="/design.php"><i class="glyphicon glyphicon-flash"></i> Power Stage</a></li>
                            <li><a tabindex="-1" href="/tips.php"><i class="glyphicon glyphicon-question-sign"></i> Tips</a></li>
                        </ul>
                    </li>
                </ul>
				<ul class="nav navbar-nav">
                    <li class="dropdown">
                        <a href="/uninstall.php"><i class="glyphicon glyphicon-trash"></i> <b>Uninstall</b></a>
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
        <form enctype="multipart/form-data" action="/open.php" method="POST">
            <input type="file" name="file" class="fileSVG" hidden onChange="javascript:this.form.submit();" accept=".svg"/>
            <input type="submit" hidden/>
        </form>
        <form enctype="multipart/form-data" action="/snapshot.php" method="POST">
            <input type="file" name="file" class="fileUpload" hidden onChange="javascript:this.form.submit();" accept=".txt"/>
            <input type="submit" hidden/>
        </form>
    </div>
    <div class="col-md-1"></div>
</div>