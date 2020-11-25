<!DOCTYPE html>
<html>
    <head>
        <script>
            //For ESP8266
            function handleEvent(e) {
                console.log(e);
                var xhr = new XMLHttpRequest();
                xhr.open("GET", "/format");
                xhr.send();
                alert("File System not compressed! Please flash LittleFS binary.");
                window.location.href = "/update";
            }
            function addListeners(xhr) {
                xhr.addEventListener('error', handleEvent);
            }
            var xhr = new XMLHttpRequest();
            addListeners(xhr);
            xhr.open("GET", "js/menu.js");
            xhr.send();
        </script>
        <?php include "header.php" ?>
        <script src="js/index.js"></script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row" align="center">
                <div class="col">
                    <hr>
                    <div class="d-none spinner-border text-dark" id="loader-parameters"></div>
                    <i class="d-none icons icon-com display-2" id="com"></i>
                    <div class="d-none container table-active table-bordered" id="saveload">
                        <div class="row p-2">
                            <div class="col">
                                <button type="button" class="btn btn-secondary" onclick="downloadSnapshot()"><i class="icons icon-down"></i> Backup</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-secondary" onclick="uploadSnapshot()"><i class="icons icon-up"></i> Restore</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-secondary" id="share-parameters" onclick="shareParameter()"><i class="icons icon-share"></i> Share</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-secondary" id="save-parameters" onclick="saveParameter(true)"><i class="icons icon-save"></i> Save</button>
                            </div>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
            <div class="row" align="center" id="parameters-table">
                <div class="col">
                    <form action="https://openinverter.org/parameters/api.php" method="POST" enctype="multipart/form-data" id="parameters-share">
                        <input type="text" hidden id="parameters-json" name="data" />
                        <div class="input-group mb-3">
                            <div class="input-group-text">Subscription</div>
                            <input type="text" class="form-control" id="parameters-token" name="token" placeholder="Token">
                        </div>
                    </form>
                    <table class="table table-active table-bordered bg-light table-striped table-hover" id="parameters"></table>
                </div>
            </div>
        </div>
        <div class="modal" id="calculator">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content bg-light">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="close btn text-muted" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="calculator-content"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
        <div class="modal" id="usb-ttl-drivers">
	        <div class="modal-dialog modal-dialog-centered">
	            <div class="modal-content bg-light">
	                <div class="modal-header">
	                    <h5 class="modal-title">USB-TTL Drivers</h5>
	                    <button type="button" class="close btn text-muted" data-dismiss="modal" aria-label="Close">
	                        <span aria-hidden="true">&times;</span>
	                    </button>
	                </div>
	                <div class="modal-body">
	                	<div class="mb-3 hidden" id="usb-ttl-mac">Recommended Drivers: <a href="https://www.mac-usb-serial.com" target="_blank">mac-usb-serial.com</a></div>
                        <div class="mb-3">Manufacturer Drivers:</div>
                        <div class="form-group form-check mb-3" id="usb-ttl-list">
                            <div class="input-group-checkbox">
                                <input type="checkbox" name="ProlificUsbSerial" class="form-check-input"/><label class="form-label"><a href="http://www.prolific.com.tw/US/ShowProduct.aspx?p_id=229&pcid=41">Prolific</a></label>
                            </div>
                            <div class="input-group-checkbox">
                                <input type="checkbox" name="SiLabsUSBDriver" class="form-check-input"/><label class="form-label"><a href="https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers">CP210x</a></label>
                            </div>
                            <div class="input-group-checkbox">
                                <input type="checkbox" name="usbserial" class="form-check-input"/><label class="form-label"><a href="https://github.com/adrianmihalko/ch340g-ch34g-ch34x-mac-os-x-driver">CH34x</a></label>
                            </div>
                            <div id="usb-ttl-select" class="bg-danger text-light text-center mb-3 hidden">Select Drivers to Install</div>
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped progress-bar-animated" id="usb-ttl-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
	                </div>
	                <div class="modal-footer">
	                	<button class="btn btn-primary" type="button" onClick="installDrivers()"><i class="icons icon-download"></i> Install Drivers</button>
	                </div>
	            </div>
	        </div>
        </div>
        <div class="modal" id="inverter-restore">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content bg-light">
                    <div class="modal-header">
                        <h5 class="modal-title">Inverter Progress</h5>
                        <button type="button" class="close btn text-muted" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="inverter-status">
                            <div class="spinner-border" role="status"></div>
                            <span id="inverter-status-text"></span>
                        </div>
                        <div id="inverter-error" class="bg-danger text-white text-center mb-3 hidden">Error Loading Parameters</div>
                        <div id="inverter-success" class="bg-success text-white text-center mb-3 hidden">Parameters Loading Complete!</div>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
        <form action="snapshot.php" method="POST" enctype="multipart/form-data" id="parameterSnapshot">
            <input type="file" name="file" class="fileUpload" hidden onchange="javascript:this.form.submit();" accept=".json,.txt">
            <input type="submit" hidden />
        </form>
        <?php include "footer.php" ?>
    </body>
</html>