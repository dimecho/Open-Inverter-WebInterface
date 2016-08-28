<?php include "install.php"; ?>
<script>
function buildEncoderAlert()
{
    alertify.buildEncoder("Build encoder",
        function() {
            $.ajax("open.php?app=inkscape");
        },
        function() {
            <?php checkOpenSCAD(); ?>;
            //$.ajax("open.php?app=inkscape_openscad");
        }
    );
}
$(document).ready(function()
{
    $(".knob").knob({
        /*change : function (value) {
            console.log("change : " + value);
        },*/
        release : function (value) {
            //console.log(this.$.attr('value'));
            console.log("release : " + value);
        },
        cancel : function () {
            console.log("cancel : ", this);
        },
        /*format : function (value) {
            return value + '%';
        },*/
    });
 });
</script>
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
                            <li><a tabindex="-1" href="#" onClick="uploadSnapshot();">Upload Parameters</a></li>
                            <li><a tabindex="-1" href="#" onClick="downloadSnapshot();">Download Parameters</a></li>
                            <li><a tabindex="-1" href="index.php">Advanced Parameters</a></li>
                            <li><a tabindex="-1" href="simple.php">Simple Parameters</a></li>
                            <!--
                            <li><a tabindex="-1" href="simple.php">Simple Parameters</a></li>
                            -->
                            <!--
                            <li><a tabindex="-1" href="graph.php">Show Graph</a></li>
                            -->
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="#" onClick="<?php checkOpenOCD(); ?>">Flash Bootloader</a></li>
                            <li><a tabindex="-1" href="firmware.php">Flash Firmware</a></li>
                            <li><a tabindex="-1" href="#" onClick="<?php checkAVRCompiler(); ?>">Flash ATtiny13 Chip</a></li>
                            <li><a tabindex="-1" href="#" onClick="<?php checkARMCompiler(); ?>">Compile from Source</a></li>
                            <?php if(checkCompiler()) { ?>
                                <li><a tabindex="-1" href="#" onClick="confirmGCCRemove()">Remove GCC ARM Compiler</a></li>
                            <?php } ?>
                            <li class="divider"></li>
                            <li><a tabindex="-1" href="#" onClick="<?php checkEagle(); ?>">Schematics</a></li>
                            <li><a tabindex="-1" href="components.php">Components</a></li>
                            <li><a tabindex="-1" href="wiring.php">Wiring Diagram</a></li>
                            <li><a tabindex="-1" href="igbt-test.php">IGBT Test</a></li>
                            <li><a tabindex="-1" href="#" onClick="<?php checkInkscape(); ?>">Build Encoder</a></li>
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
        <div class="accordion" id="potentiometer" style="display:none">
            <div class="accordion-group">
                <div id="collapseOne" class="accordion-body collapse">
                    <div class="accordion-inner">
                        <center>
                            <input class="knob" data-displayInput=true data-min="0" data-max="100" data-fgColor="#222222" value="0"/>
                        </center>
                    </div>
                </div>
            </div>
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
    <div class="span1"></div>
</div>