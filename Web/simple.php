<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
        <style>
			.modal.modal-wide .modal-dialog {
			  width: 90%;
			}
			.modal-wide .modal-body {
			  overflow-y: auto;
			}
		</style>
        <script src="js/ion.rangeSlider.js"></script>
        <script src="js/jquery.knob.js"></script>
        <script src="js/simple.js"></script>
    </head>
    <body>
    	<div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col">
				    <div class="container bg-light">
                        <div class="row justify-content-center"><h4>Automatic Tuning</h4></div>
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col">
								<button type="button" class="btn btn-primary d-none" onclick="boostTuning()"><i class="icons icon-power"></i> Boost Tuning</button>
                                <button type="button" class="btn btn-primary d-none" onclick="syncofsTuning()"><i class="icons icon-power"></i> Syncofs Tuning</button>
                            </div>
                            <div class="col">
								<button type="button" class="btn btn-primary d-none" onclick="fweakTuning()"><i class="icons icon-tune"></i> Fweak Tuning</button>
                            </div>
							<div class="col">
								<button type="button" class="btn btn-primary d-none" onclick="polePairTest()"><i class="icons icon-connect"></i> Pole Pair Test</button>
                            </div>
							<div class="col">
								<button type="button" class="btn btn-primary d-none" onclick="numimpTest()"><i class="icons icon-encoder"></i> Encoder Pulse Test</button>
                            </div>
                        </div>
						<div class="row"><hr></div>
						<div class="row">
                            <div class="col">
								<button type="button" class="btn btn-success" onclick="tempTuning()"><i class="icons icon-temp"></i> Temp Sensors</button>
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
                    <center><div class="spinner-border text-dark d-none" id="loader-parameters"></div></center>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4><i class="icons icon-motor"></i> Motor</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Motor"></table>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4><i class="icons icon-power"></i> Battery</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Battery"></table>
                </div>
            </div>
        </div>
        <div class="modal" id="alertify">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-light">
                    <div class="modal-header">
                        <h5 class="modal-title" id="alertify-header"></h5>
                        <button type="button" class="btn-close btn-close-dark" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="alertify-body"></div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-bs-dismiss="modal" id="alertify-cancel"></button>
                        <button class="btn btn-success" type="button" data-bs-dismiss="modal" id="alertify-ok"></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" id="syncofsTuning">
            <div class="modal-dialog modal-xl modal-dialog-centered" style="width: 90%; overflow-y: auto;">
                <div class="modal-content bg-light">
                    <div class="modal-body">
                        <div class="container">
                            <div class="row" >
                                <div class="col" align="center">
                                    <h3>syncofs</h3>
                                </div>
                                <div class="col" align="center">
                                	<h3 class="text-danger d-none" id="text_slowdown">Slow Down!</h3>
                                    <h3 class="text-warning d-none" id="text_close">Getting Close</h3>
                                    <h3 class="text-success d-none" id="text_found">Found!</h3>
                                </div>
                                <div class="col" align="center">
                                    <h3>manualid</h3>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col" align="center">
                                    <input class="dial notstored adjuster" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0" id="syncofs">
                                </div>
                                <div class="col" align="center" id="syncofsTuningMotor"></div>
                                <div class="col" align="center">
                                    <input class="dial notstored adjuster" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0" id="manualid">
                                </div>
                            </div>
                            <div class="row" align="center">
                                <div class="col" id="syncofsTuningGraph"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" id="tempTuning">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-light">
                    <div class="modal-body" id="temp-body">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="text" id="temp-current" name="temp-current" class="form-control" placeholder="">
                            </div>
                            <div class="input-group w-100">
                                <span class = "input-group-addon w-50">
                                    <select class="form-control" onchange="tempTuningChangeSensor('snshs',this.options[this.selectedIndex].value)"></select>
                                </span>
                                <span class = "input-group-addon w-50">
                                    <select class="form-control" onchange="tempTuningChangeSensor('snsm',this.options[this.selectedIndex].value)"></select>
                                </span>
                            </div>
                        </div>
                    </div>
                     <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-bs-dismiss="modal" id="temp-cancel"></button>
                        <button class="btn btn-success" type="button" id="temp-ok"></button>
                    </div>
                </div>
            </div>
        </div>
        <?php include "footer.php" ?>
    </body>
</html>