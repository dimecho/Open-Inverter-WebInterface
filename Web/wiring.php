<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/jspdf.js"></script>
        <script src="js/wiring.js"></script>
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
                            <div class="col">
                                <div class="card" id="h1">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="icons icon-list"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="icons icon-connect"></i> Wiring</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a href="attiny.php">
                                                    <button type="button" class="btn btn-danger"><i class="icons icon-chip"></i> ATTiny13</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" id="h1d">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="icons icon-list"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="icons icon-connect"></i> Wiring</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col">
                                <div class="card" id="h2">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="icons icon-list"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="icons icon-connect"></i> Wiring</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="pcb/Hardware v1.0/diagrams/esp8266.png">
                                                    <button type="button" class="btn btn-danger"><i class="icons icon-chip"></i> ESP8266</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" id="h3">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="icons icon-list"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="icons icon-connect"></i> Wiring</button>
                                                </a>
                                            </div>
											<div class="col">
                                                <a data-fancybox="gallery" href="pcb/Hardware v3.0/diagrams/esp8266.png">
                                                    <button type="button" class="btn btn-danger"><i class="icons icon-chip"></i> ESP8266</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br>
                    <table class="table table-active bg-light table-bordered" id="wiring" style="display:none">
                        <tbody>
                            <tr>
                                <td colspan="3">
									<center>
                                    <a data-fancybox href="<?php echo $wiring; ?>">
                                        <img src="<?php echo $wiring; ?>" class="rounded" />
                                    </a>
									</center>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <button type="button" class="btn btn-info" onClick="printWiring();">Print</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div id="pinout" style="display:none">
                        <p>Main Connector Pin Summary</p>
                        <table  class="table table-active bg-light table-bordered table-striped" >
                            <thead></thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>