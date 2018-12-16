<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/potentiometer.js"></script>
        <script src="js/jquery.knob.js"></script>
        <script src="js/test.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
            <div class="row">
                <div class="col">
                    <div class="container bg-light">
                        <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item"><a class="nav-link" href="#tabAnalog">Analog</a></li>
                                    <li class="nav-item"><a class="nav-link" href="#tabDigital">Digital</a></li>
                                    <li class="nav-item"><a class="nav-link" href="#tabHardware">Hardware</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="row"><hr></div>
                        <div class="container" id="tabAnalog">
                            <div class="row">
                                <div class="col text-center">
                                    <button type="button" class="btn btn-danger" onClick="stopTest()"><i class="glyphicon glyphicon-erase"></i> Stop</button>
                                </div>
                                <div class="col text-center">
                                    <button type="button" class="btn btn-success" onClick="startTest()"><i class="glyphicon glyphicon-erase"></i> Start</button>
                                </div>
                            </div>
                            <div class="row"><hr></div>
                            <div class="row">
                                <div class="col">Protection</div>
                                <div class="col"><div class="circle-grey" id="din_mprot"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Emergency</div>
                                <div class="col"><div class="circle-grey" id ="din_emcystop"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Brake</div>
                                <div class="col"><div class="circle-grey" id ="din_brake"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Start</div>
                                <div class="col"><div class="circle-grey" id ="din_start"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Forward</div>
                                <div class="col"><div class="circle-grey" id ="din_forward"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Reverse</div>
                                <div class="col"><div class="circle-grey" id ="din_reverse"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Cruise</div>
                                <div class="col"><div class="circle-grey" id ="din_cruise"></div></div>
                            </div>
                            <div class="row">
                                <div class="col">Potentiometer</div>
                            </div>
                            <div class="row text-center">
                                <div class="col">
                                    <input class="knob" data-displayinput="true" data-min="0" data-max="100" data-fgcolor="#222222" data-bgcolor="#FFFFFF" value="0">
                                </div>
                            </div>
                        </div>
                        <div class="row"><hr></div>
                    </div>
                    <div class="container" id="tabDigital" style="display: none;">
                        <div class="row">
                            <div class="col"></div>
                        </div>
                    </div>
                    <div class="container" id="tabHardware" style="display: none;">
                        <div class="row">
                            <div class="col"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>