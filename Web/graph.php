<?php
    if(isset($_GET["debug"])){
		header("Content-Type: text/plain");
		for ($i = 0; $i < intval($_GET["loop"]); $i++)
			for ($x = 0; $x <= substr_count($_GET["stream"], ","); $x++)
				echo (rand(50, 100). "\n");
		usleep(intval($_GET["delay"]) * 1000);
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
        <script src="js/ion.rangeSlider.js"></script>
        <script src="js/potentiometer.js"></script>
        <script src="js/jquery.knob.js"></script>
        <script src="js/chart.js"></script>
        <script src="js/chartjs-plugin-annotation.js"></script>
        <script src="js/chartjs-plugin-datalabels.js"></script>
		<script src="js/jscolor.js"></script>
        <script src="js/graph.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <div class="row">
                <div class="col">
                    <div class="container bg-light">
                        <div class="row">
                            <div class="col">
                                <div id="buildGraphMenu"></div>
                                <div id="potentiometer" style="display:none">
                                    <input class="knob" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4"></div>
                        <div class="row">
                            <div class="col-8">
                                <div id="buildGraphButtons"></div>
                            </div>
                            <div class="col-4 text-right">
                                <div id="buildGraphExport"></div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div id="buildGraphZoom"></div>
                            </div>
                        </div>
                    </div>
					<!-- http://jsfiddle.net/jmpxgufu/100/ -->
					<div class="chartWrapper bg-light">
						<div class="chartAreaWrapper">
							<div class="chartAreaWrapper2">
								<canvas id="chartCanvas"></canvas>
							</div>
						</div>
						<canvas id="chartAxis" width="0"></canvas>
					</div>
                    <div class="container bg-light">
                        <div class="row">
                            <div class="col">
                                <div class="mx-auto" id="buildGraphSlider"></div>
                            </div>
                        </div>
                        <div class="row mt-4"></div>
                        <div class="row text-center">
                            <div class="col">
                                <code id="devmode"><a href="#">Developer Mode is OFF</a></code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <a class="graphSettings" data-fancybox data-src="#graphSettings" href="#"></a>
        <div class="hidden" id="graphSettings" style="width:60%;border-radius:5px">
            <div class="container">
                <div class="row">
                    <div class="col">
                        <fieldset class="form-group">
                            <legend>Chart Settings:</legend>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input type="checkbox" name="roundEdges" class="form-check-input"> Round Sharp Edges
                                </label>
                            </div>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input type="checkbox" name="showDataLabels" class="form-check-input"> Show Data Labels
                                </label>
                            </div>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input type="checkbox" name="showAnimation" class="form-check-input"> Show Animation
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div class="row"><hr></div>
                <div class="row">
                    <div class="col">Time Segments</div>
                    <div class="col">
                        <input type="text" name="graphDivision" class="form-control">
                    </div>
                </div>
                <div class="row">
                    <div class="col">Line Width</div>
                    <div class="col">
                        <input type="text" name="lineWidth" class="form-control">
                    </div>
                </div>
                <div class="row">
                    <div class="col">Stream Loop</div>
                    <div class="col">
                        <input type="text" name="streamLoop" class="form-control" value=1>
                    </div>
                </div>
                <div class="row">
                    <div class="col">Max Scroll Pages</div>
                    <div class="col">
                        <input type="text" name="pageLimit" class="form-control" value=4>
                    </div>
                </div>
                <div class="row"><hr></div>
                <div class="row text-center">
                    <div class="col">
                        <button class="browse btn btn-primary" type="button" onClick="$.fancybox.close();graphSettings(true);"><i class="icons icon-ok"></i> OK</button>
                    </div>
                </div>
            </div>
        </div>
		<a class="graphPoints" data-fancybox data-src="#graphPoints" href="#"></a>
        <div class="hidden" id="graphPoints" style="width:60%;border-radius:5px">
            <div class="container" id="buildPointsMenu"></div>
            <div class="container">
                <div class="row text-center">
                    <div class="col">
                        <button class="browse btn btn-primary" type="button" onClick="$.fancybox.close();"><i class="icons icon-ok"></i> OK</button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
<?php } ?>