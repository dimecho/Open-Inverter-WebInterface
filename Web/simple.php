<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
        <script src="js/ion.rangeSlider.js"></script>
        <script src="js/simple.js"></script>
    </head>
    <body>
    	<?php include "menu.php" ?>
        <div class="container">
            <div class="row">
                <div class="col">
				    <div class="container bg-light">
                        <div class="row justify-content-center"><h4>Automatic Tuning</h4></div>
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col">
								<button class="browse btn btn-primary" type="button" onclick="boostTuning();"><i class="icons icon-power"></i> Boost Tuning</button>
                            </div>
                            <div class="col">
								<button class="browse btn btn-primary" type="button" onclick="fweakTuning();"><i class="icons icon-tune"></i> Fweak Tuning</button>
                            </div>
							<div class="col">
								<button class="browse btn btn-primary" type="button" onclick="polePairTest();"><i class="icons icon-connect"></i> Pole Pair Test</button>
                            </div>
							<div class="col">
								<button class="browse btn btn-primary" type="button" onclick="numimpTest();"><i class="icons icon-encoder"></i> Encoder Pulse Test</button>
                            </div>
                        </div>
						<div class="row"><hr></div>
						<div class="row">
                            <div class="col">
								<button class="browse btn btn-success" type="button" onclick="tempTuning();"><i class="icons icon-temp"></i> Temp Sensors</button>
                            </div>
                            <div class="col">
                            </div>
							<div class="col">
                            </div>
							<div class="col">
                            </div>
                        </div>
                        <div class="row"><hr></div>
                    </div>
                    <br>
                    <center><div class="loader hidden"></div></center>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Motor</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Motor"></table>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Battery</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Battery"></table>
                    <a class="temp-tune" data-fancybox data-src="#temp-tune" href="javascript:;"></a>
                    <div class="hidden" id="temp-tune" style="width:60%;border-radius:5px">
                        <div class="container">
                            <div class="row">
                                <div class="col">
                                    Current Temperature (&#8451;):
                                </div>
                                 <div class="col">
                                    <input type="text" class="form-control" id="temp-degree">
                                </div>
                            </div>
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col" align="center">
                                    <button class="btn btn-danger" type="button" onClick="$.fancybox.close();"><i class="glyphicon glyphicon-remove"></i> Cancel</button>
                                </div>
                                <div class="col" align="center">
                                    <button class="btn btn-success" type="button" id="temp-continue"><i class="glyphicon glyphicon-ok"></i> Continue</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>