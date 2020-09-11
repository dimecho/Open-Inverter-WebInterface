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
        <script src="js/jquery.knob.js"></script>
        <script src="js/chart.js"></script>
        <script src="js/chartjs-plugin-annotation.js"></script>
        <script src="js/chartjs-plugin-datalabels.js"></script>
		<script src="js/jscolor.js"></script>
        <script src="js/graph.js"></script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container bg-light">
            <div class="row">
                <div class="col" id="buildGraphMenu">
                    <div id="potentiometer" style="display:none">
                        <input class="knob" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
                    </div>
                </div>
            </div>
            <div class="row mt-4"></div>
            <div class="row">
                <div class="col-auto mr-auto mb-auto mt-auto" id="buildGraphButtons"></div>
                <div class="col-auto text-right" id="buildGraphExport"></div>
            </div>
            <div class="row p-4">
                <div class="col" id="buildGraphZoom"></div>
            </div>
            <div class="row">
                <div class="col">
					<!-- http://jsfiddle.net/jmpxgufu/100/ -->
					<div class="chartWrapper bg-light">
						<div class="chartAreaWrapper">
							<div class="chartAreaWrapper2">
								<canvas id="chartCanvas"></canvas>
							</div>
						</div>
						<canvas id="chartAxis" width="0"></canvas>
					</div>
                </div>
            </div>
            <div class="row p-4">
                <div class="col" id="buildGraphSlider">
                </div>
            </div>
            <div class="row mt-4"></div>
            <div class="row p-2 text-center">
                <div class="col">
                    <code id="devmode"><a href="#" id="text_devmode-off">Developer Mode is OFF</a></code>
                </div>
            </div>
        </div>
        <div class="modal fade" id="graphSettings">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chart Settings:</h5>
                    <button type="button" class="close text-muted" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body container">
                    <div class="row">
                        <div class="col">
                            <fieldset class="form-group">
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
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onClick="graphSettings(true)">OK</button>
                </div>
            </div>
        </div>
        </div>
        <div class="modal" id="graphPoints">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close text-muted" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="container" id="buildPointsMenu"></div>
                </div>
                <div class="modal-footer">
                    <button class="browse btn btn-primary" type="button" data-dismiss="modal"><i class="icons icon-ok"></i> OK</button>
                </div>
            </div>
        </div>
        </div>
        <div class="modal" id="graphPointsColor">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="container" id="colorWheel"></div>
                </div>
            </div>
        </div>
        </div>
        <?php include "footer.php" ?>
    </body>
</html>
<?php } ?>