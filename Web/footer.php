<div class="row mt-1"></div>
<div class="modal fade" id="serial" tabindex="-1" role="dialog" aria-labelledby="serialTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered bg-light" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="serialTitle">Select Serial Interface:</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <select name="interface" class="form-control" form="serialForm" id="serial-interface"></select>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal" onClick="selectSerial()"><i class="icons icon-save"></i> Save</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="software" tabindex="-1" role="dialog" aria-labelledby="softwareTitle" aria-hidden="true">
    <div class="modal-dialog bg-light" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="softwareTitle">Software Install</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                <button class="btn btn-success" type="button" data-dismiss="modal" id="software-install">Install</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="hardware" tabindex="-1" role="dialog" aria-labelledby="hardwareTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered bg-light" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="hardwareTitle">Select Hardware Version:</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <select name="hardware" class="form-control" form="hardwareForm" id="hwver">
                    <option value=0>Hardware v1.0</option>
                    <option value=1>Hardware v2.0</option>
                    <option value=2>Hardware v3.0</option>
                </select>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-dismiss="modal" onClick="selectHardware()"><i class="icons icon-save"></i> Save</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="safety" tabindex="-1" role="dialog" aria-labelledby="safetyTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered bg-light" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="safetyTitle"></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body container">
                <div class="row">
                    <div class="col-3"></div>
                    <div class="col-6 text-dark border" align="center">
                        <div class="row bg-warning p-1">
                            <div class="col"><h1 class="icons icon-alert"></h1></div>
                            <div class="col"><h1>WARNING</h1></div>
                        </div>
                        <div class="row p-2">
                            <div class="col"><h2>HIGH VOLTAGE</h2></div>
                            <div class="col"><h1 class="icons icon-electric-shock display-3"></h1></div>
                        </div>
                    </div>
                    <div class="col-3"></div>
                </div>
                <div class="row mt-3">
                    <div class="col">
                        <p>This project is for educational purpose. High power electronics can cause damage, death or injury. You have decided to build your own inverter so you are responsible for what you do.</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <center><button type="button" class="btn btn-danger" data-dismiss="modal" onClick="setCookie('safety', 1, 360);location.reload();"><i class="icons icon-power"></i> I Agree</button></center>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="startInverterMode" tabindex="-1" role="dialog" aria-labelledby="startInverterModeTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg bg-light" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="startInverterModeTitle">Inverter Mode</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body container">
                <div class="row" align="center">
                    <div class="col"><button type="button" class="btn btn-success" data-dismiss="modal" onClick="startInverterMode(1)">Start Auto</button></div>
                    <div class="col"><button type="button" class="btn btn-primary" data-dismiss="modal" onClick="startInverterMode(2)">Manual Run</button></div>
                    <div class="col"><button type="button" class="btn btn-primary" data-dismiss="modal" onClick="startInverterMode(5)">Sine Wave</button></div>
                    <div class="col"><button type="button" class="btn btn-danger" data-dismiss="modal" onClick="startInverterMode(3)">Boost</button></div>
                    <div class="col"><button type="button" class="btn btn-danger" data-dismiss="modal" onClick="startInverterMode(4)">Buck</button></div>
                </div>
            </div>
            <div class="modal-footer mr-auto">Warning: Before starting the inverter set the throttle control to zero.</div>
        </div>
    </div>
</div>
<div class="modal fade" id="resetInverterDefault" tabindex="-1" role="dialog" aria-labelledby="resetInverterDefaultTitle" aria-hidden="true">
    <div class="modal-dialog bg-light" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="resetInverterDefaultTitle">Reset Inverter</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">All Settings will be Reset to Default!</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal"> Cancel</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" onClick="setDefaults()"> Reset</button>
            </div>
        </div>
    </div>
</div>