<!DOCTYPE html>
<html>
    <head>
        <?php include "../header.php" ?>
        <link rel="stylesheet" href="../css/androidstudio.css">
        <script src="../js/highlight.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
    </head>
    <body>
        <div class="container">
            <?php include "../menu.php" ?>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <table class="table table-active table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <button type="button" class="btn btn-primary" onClick="checkSoftware('arduino')"><i class="glyphicon glyphicon-th-large"></i> Open Arduino IDE</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-active table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <table class="table table-bordered table-striped" >
                                        <thead></thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>LCD</strong></td>
                                                <td><strong>Aurduino (Nano)</strong></td>
                                                <td><strong>Main Board</strong></td>
                                            </tr>
                                            <tr>
                                                <td>GND</td>
                                                <td>GND</td>
                                                <td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>VCC</td>
                                                <td>5V</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>SDA</td>
                                                <td>A4</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>SDL</td>
                                                <td>A5</td>
                                                <td>-</td>
                                            </tr>
                                            <tr>
                                                <td>-</td>
                                                <td>RX0</td>
                                                <td>TX</td>
                                            </tr>
                                            <tr>
                                                <td>-</td>
                                                <td>TX1</td>
                                                <td>RX</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <span class="glyphicon glyphicon-triangle-right"></span> Interface uses <a href="https://bitbucket.org/fmalpartida/new-liquidcrystal/downloads" target="_blank">NewLiquidCrystal Library</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-active table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <a data-fancybox="gallery" href="arduino/img/DSC03848.jpg">
                                        <img src="arduino/img/DSC03848.jpg" class="img-thumbnail rounded" />
                                    </a>
                                </td>
                                <td>
                                    <a data-fancybox="gallery" href="arduino/img/DSC03852.jpg">
                                        <img src="arduino/img/DSC03852.jpg" class="img-thumbnail rounded" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-active table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <pre>
                                        <code><?php
                                        $code = file_get_contents('./arduino/lcd_display/lcd_display.ino');
                                        $code = str_replace("<", "&lt;", $code);
                                        $code = str_replace("<", "&gt;", $code);
                                        echo $code;
                                        ?></code>
                                    </pre>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>