<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php"; ?>
        <script src="js/jspdf.js"></script>
        <script src="js/wiring.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
             <div class="row">
                <div class="col">
                    <div class="container bg-light">
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col">
                                <div class="card" id="hw1">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-qrcode"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="glyphicon glyphicon-flash"></i> Wiring</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a href="attiny.php">
                                                    <button type="button" class="btn btn-danger"><i class="glyphicon glyphicon-object-align-bottom"></i> ATTiny13</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" id="hw1d">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-qrcode"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="glyphicon glyphicon-flash"></i> Wiring</button>
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
                                <div class="card" id="hw2">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-qrcode"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="glyphicon glyphicon-flash"></i> Wiring</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="firmware/img/esp8266.png">
                                                    <button type="button" class="btn btn-danger"><i class="glyphicon glyphicon-object-align-bottom"></i> ESP8266</button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" id="hw3">
                                    <img class="card-img-top" src="" alt="">
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-qrcode"></i> Pinout</button>
                                                </a>
                                            </div>
                                            <div class="col">
                                                <a data-fancybox="gallery" href="">
                                                    <button type="button" class="btn btn-success"><i class="glyphicon glyphicon-flash"></i> Wiring</button>
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
                                        <img src="<?php echo $wiring; ?>" class="img-thumbnail rounded" />
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