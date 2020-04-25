<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>$(document).ready(function(){buildMenu()})</script>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col" align="center">
                    <div class="text-dark"><h1>IGBT Finger Test</h1></div>
                    <table class="container table-active bg-light table-bordered">
                        <tr>
                            <td>
                                Perform both tests for C1 and E2<br>
                                <ul>
                                    <li>C1-Collector (Positive) Test</li>
                                    <ol> 
                                        <li>With one hand touch +12V to turn on LED, -12V to turn off LED</li>
                                        <li>Other hand hold G1 (pin 4)</li>
                                    </ol>
                                    <li>E2-Emitter (Negative) Test</li>
                                    <ol> 
                                        <li>With one hand touch +12V to turn on LED, -12V to turn off LED</li>
                                        <li>Other hand hold G2 (pin 6)</li>
                                    </ol>
                                </ul>
                                <b>Note:</b> Touch battery first to dicharge static before touching G1/G2.
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active table-bordered">
                        <tr>
                            <td>
                                <a data-fancybox="gallery" href="img/igbt-test-c1.png">
                                    <img src="img/igbt-test-c1.png" class="img-thumbnail rounded" />
                                </a>
                            </td>
                            <td>
                                <a data-fancybox="gallery" href="img/igbt-test-e2.png">
                                    <img src="img/igbt-test-e2.png" class="img-thumbnail rounded" />
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>