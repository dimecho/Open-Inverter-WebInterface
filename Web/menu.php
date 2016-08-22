<?php include "install.php"; ?>
<div class="row">
    <div class="span1"></div>
    <div class="span10">
        <div class="navbar navbar-static" >
            <div class="navbar-inner">
                <div class="container">
                    <ul class="nav" role="navigation">
                    <li class="dropdown">
                        <a class="dropdown-toggle" role="button" data-toggle="dropdown"><b>Menu</b><b class="caret"></b></a>
                        <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
                            <li><a tabindex="-1" onClick="startInverterAlert()">Start Inverter</a></li>
                            <li><a tabindex="-1" onClick="stopInverter()">Stop Inverter</a></li>
                            <li><a tabindex="-1" onClick="setDefaults()">Reset to Default</a></li>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="graph.php">Graph</a></li>
                            <li class="divider"></li>
                            <!--
                            <li><a tabindex="-1" href="#">Save Parameters to Flash</a></li>
                            <li><a tabindex="-1" href="#">Save Parameters from Flash</a></li>
                            -->
                            <li><a tabindex="-1" href="upload.php">Upload Parameters</a></li>
                            <li><a tabindex="-1" href="snapshot.php">Download Parameters</a></li>
                            <li><a tabindex="-1" href="index.php">Advanced Parameters</a></li>
                            <li><a tabindex="-1" href="simple.php">Simple Parameters</a></li>
                            <!--
                            <li><a tabindex="-1" href="simple.php">Simple Parameters</a></li>
                            -->
                            <!--
                            <li><a tabindex="-1" href="graph.php">Show Graph</a></li>
                            -->
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="bootloader.php">Flash Bootloader</a></li>
                            <li><a tabindex="-1" href="firmware.php">Flash Firmware</a></li>
                            <li><a tabindex="-1" href="#" onClick=<?php checkAVRCompiler(); ?>>Flash ATtiny13 Chip</a></li>
                            <li><a tabindex="-1" href="#" onClick=<?php checkARMCompiler(); ?>>Compile from Source</a></li>
                            <?php if(checkCompiler()) { ?>
                                <li><a tabindex="-1" href="#" onClick=<?php echo "\"confirmGCCRemove()\""; ?>>Remove GCC ARM Compiler</a></li>
                            <?php } ?>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="#" onClick=<?php checkEagle(); ?>>Schematics</a></li>
                            <li><a tabindex="-1" href="components.php">Components</a></li>
                            <li><a tabindex="-1" href="wiring.php">Wiring Diagram</a></li>
                            <li><a tabindex="-1" href="igbt-test.php">IGBT Test</a></li>
                            <li><a tabindex="-1" href="#" onClick=<?php checkInkscape(); ?>>Build Encoder</a></li>
                        </ul>
                    </li>
                    <li>
                        <h3 class="label" id="titleVersion"></h3>&nbsp;&nbsp;<span id="titleOperation"></span>&nbsp;&nbsp;<span id="titleStatus"></span>
                    </li>
                    <li><div id="opStatus"></div></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div class="span1"></div>
</div>