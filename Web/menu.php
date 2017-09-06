<div class="row">
    <div class="col-lg-1"></div>
    <div class="col-lg-10">
        <div class="navbar navbar-light bg-light navbar-expand-md">
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown"> 
                        <a class="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-cd"></i> <b>Motor</b></a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" onclick="alertify.startInverterMode(&quot;&lt;i class=\&quot;glyphicon glyphicon-dashboard\&quot;&gt;&lt;/i&gt; Warning: Before starting the inverter set the throttle control to zero.&quot;);"><i class="glyphicon glyphicon-flash"></i> Start Inverter</a>
                            <a class="dropdown-item" onclick="stopInverter()"><i class="glyphicon glyphicon-alert"></i> Stop Inverter</a>
                            <a class="dropdown-item" onclick="setDefaults()"><i class="glyphicon glyphicon-erase"></i> Reset to Default</a>
                            <a class="dropdown-item" href="/db.php"><i class="glyphicon glyphicon-align-justify"></i> Motor Database</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/index.php"><i class="glyphicon glyphicon-transfer"></i> Parameters</a>
                            <a class="dropdown-item" href="/graph.php"><i class="glyphicon glyphicon-signal"></i> Graph</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#" onclick="uploadSnapshot();"><i class="glyphicon glyphicon-upload"></i> Upload</a>
                            <a class="dropdown-item" href="#" onclick="downloadSnapshot();"><i class="glyphicon glyphicon-download"></i>  Download</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/simple.php"><i class="glyphicon glyphicon-random"></i> Auto Tuning</a>
                        </div>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="dropdown-toggle nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-compressed"></i> <b>Inverter</b></a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onclick="checkSoftware(&apos;openocd&apos;)"><i class="glyphicon glyphicon-object-align-horizontal"></i> Flash Bootloader</a>
                            <a class="dropdown-item" href="/firmware.php"><i class="glyphicon glyphicon-object-align-left"></i> Flash Firmware</a>
                            <a class="dropdown-item" href="#" onclick="checkSoftware(&apos;attiny&apos;)"><i class="glyphicon glyphicon-object-align-bottom"></i> Flash ATtiny13 Chip</a>
                            <a class="dropdown-item" href="#" onclick="checkSoftware(&apos;arm&apos;)"><i class="glyphicon glyphicon-console"></i> Compile from Source</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/switch-check.php"><i class="glyphicon glyphicon-dashboard"></i> Switch Check</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="/wiring.php"><i class="glyphicon glyphicon-flash"></i> Wiring Diagram</a>
                            <a class="dropdown-item" href="#" onclick="checkSoftware(&apos;eagle&apos;)"><i class="glyphicon glyphicon-cog"></i> Schematics</a>
                            <a class="dropdown-item" href="/components.php"><i class="glyphicon glyphicon-list-alt"></i> Components</a>
                        </div>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <a class="dropdown-toggle nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="glyphicon glyphicon-info-sign"></i> <b>Info</b></a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="/motor-class.php"><i class="glyphicon glyphicon-tasks"></i> Motor Classification</a>
                            <a class="dropdown-item" href="/igbt-test.php"><i class="glyphicon glyphicon-hand-down"></i> IGBT Test</a>
                            <a class="dropdown-item" href="/encoder.php"><i class="glyphicon glyphicon-record"></i> Encoder</a>
                            <a class="dropdown-item" href="/dashboard/arduino.php"><i class="glyphicon glyphicon-phone"></i> Arduino LCD</a>
                            <a class="dropdown-item" href="/design.php"><i class="glyphicon glyphicon-flash"></i> Power Stage</a>
                            <a class="dropdown-item" href="/tips.php"><i class="glyphicon glyphicon-question-sign"></i> Tips</a>
                        </div>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item"> <a href="/uninstall.php" class="nav-link"><i class="fa fa-trash"></i> <b>Uninstall</b></a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <div id="opStatus"></div>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item"><span><h3 class="label" id="firmwareVersion" style="color:black;font-weight:normal"></h3></span>
                    </li>
                </ul>
            </div>
        </div>
        <div id="potentiometer" style="display:none">
            <center>
                <input class="knob" data-displayinput="true" data-min="0" data-max="100"
                data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
            </center>
            <br>
        </div>
        <form enctype="multipart/form-data" action="/open.php" method="POST">
            <input type="file" name="file" class="fileSVG" hidden onchange="javascript:this.form.submit();"
            accept=".svg">
            <input type="submit" hidden>
        </form>
        <form enctype="multipart/form-data" action="/snapshot.php" method="POST">
            <input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();"
            accept=".txt">
            <input type="submit" hidden>
        </form>
    </div>
    <div class="col-lg-1"></div>
</div>