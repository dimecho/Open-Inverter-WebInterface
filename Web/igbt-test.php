<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <h2>IGBT Finger Test</h2>
                                    Perform both tests for C1 and E2<br/>
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
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <a data-fancybox="gallery" href="/img/igbt-test-c1.png">
                                        <img src="/img/igbt-test-c1.png" class="img-thumbnail img-rounded" />
                                    </a>
                                </td>
                                <td>
                                    <a data-fancybox="gallery" href="/img/igbt-test-e2.png">
                                        <img src="/img/igbt-test-e2.png" class="img-thumbnail img-rounded" />
                                    </a>
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