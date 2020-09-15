<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
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
								<button type="button" class="btn btn-primary d-none" type="button" onclick="boostTuning()"><i class="icons icon-power"></i> Boost Tuning</button>
                                <button type="button" class="btn btn-primary d-none" type="button" onclick="syncofsTuning()"><i class="icons icon-power"></i> Syncofs Tuning</button>
                            </div>
                            <div class="col">
								<button type="button" class="btn btn-primary d-none" type="button" onclick="fweakTuning()"><i class="icons icon-tune"></i> Fweak Tuning</button>
                            </div>
							<div class="col">
								<button type="button" class="btn btn-primary d-none" type="button" onclick="polePairTest()"><i class="icons icon-connect"></i> Pole Pair Test</button>
                            </div>
							<div class="col">
								<button type="button" class="btn btn-primary d-none" type="button" onclick="numimpTest()"><i class="icons icon-encoder"></i> Encoder Pulse Test</button>
                            </div>
                        </div>
						<div class="row"><hr></div>
						<div class="row">
                            <div class="col">
								<button type="button" class="btn btn-success" type="button" onclick="tempTuning()"><i class="icons icon-temp"></i> Temp Sensors</button>
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
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Motor</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Motor"></table>
                    <table class="table table-active bg-light table-bordered"><tr><td><h4>Battery</h4></td></tr></table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters_Battery"></table>
                    <a class="temp-tune" data-fancybox data-src="#temp-tune" href="javascript:;"></a>
                    <div class="d-none" id="temp-tune" style="width:60%;border-radius:5px">
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
        <div class="modal" id="alertify">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-light">
                    <div class="modal-header">
                        <h5 class="modal-title" id="alertify_header"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="alertify_body"></div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" type="button" data-dismiss="modal" id="alertify_cancel"></button>
                        <button class="btn btn-success" type="button" data-dismiss="modal" id="alertify_ok"></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" id="syncofsTuning">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content bg-light">
                    <div class="modal-body">
                        <div class="container">
                            <div class="row">
                                <div class="col" align="center">
                                    <h3>syncofs</h3>
                                </div>
                                <div class="col" align="center">
                                    <h3>manualid</h3>
                                </div>
                            </div>
                            <div class="row" style="height: 20px;">
                                <div class="col" align="center">
                                    <h2 class="text-danger d-none" id="text_slowdown">Slow Down!</h2>
                                    <h2 class="text-warning d-none" id="text_close">Getting Close</h2>
                                    <h2 class="text-success d-none" id="text_found">Found!</h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col" align="center">
                                    <input class="dial notstored adjuster" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0" id="syncofs">
                                </div>
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
        <?php include "footer.php" ?>
    </body>
</html>