<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/can.js"></script>
    </head>
    <body>
    	<div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col">
                    <div class="container bg-light">
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col col-md-4">
                                <p class="d-none" id="can-interface-label">CAN Interface:</p>
                                <p>Inverter CAN Speed:</p>
								<p>Inverter CAN Period:</p>
                            </div>
							<div class="col col-md-4 text-center">
								<select name="interface" class="d-none form-control" onchange="setCANImage()" id="can-interface"></select>
								<select name="speed" class="form-control" onchange="setCANSpeed()" id="can-speed">
									<option value="0">250kbps</option>
									<option value="1">500kbps</option>
									<option value="2">800kbps</option>
									<option value="3">1000kbps</option>
								</select>
								<select name="period" class="form-control" onchange="setCANPeriod()" id="can-period">
									<option value="0">100ms</option>
									<option value="1">10ms</option>
								</select>
							</div>
							<div class="col col-md-4 text-center" id="can-image">
								<img src="" class="img-thumbnail rounded pop" />
                            </div>
                        </div>
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col" id="can-app"></div>
                            <div class="col" id="can-firmware"></div>
                            <div class="col">
                                <button type="button" class="btn btn-danger" onClick="new bootstrap.Modal(document.getElementById('resetCAN'), {}).show()"><i class="icons icon-reset"></i> Reset CAN</button>
                            </div>
                            <div class="col">
                               <button type="button" class="btn btn-success" onClick="saveCANMapping()"><i class="icons icon-save"></i> Save CAN</button>
                            </div>
                        </div>
                        <div class="row"><hr></div>
                    </div>
					<center>
						<div class="spinner-border text-dark" id="loader-parameters"></div>
					</center>
                    <table class="table table-active bg-light table-bordered table-striped table-hover d-none" id="parameters"></table>
                </div>
            </div>
        </div>
        <div class="modal" id="resetCAN">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-light">
                <div class="modal-header">
                    <h5 class="modal-title">Reset CANBus</h5>
                    <button type="button" class="close text-muted" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">CANBus Settings will be Reset to Default!</div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"> Cancel</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" onClick="setCANDefaults()"> Reset</button>
                </div>
            </div>
        </div>
    </div>
        <?php include "footer.php" ?>
    </body>
</html>