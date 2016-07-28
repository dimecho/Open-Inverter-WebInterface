<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <table class="table table-bordered" style="background-color:#e6e6e6;">
                <tbody>
                    <tr>
                        <td>
                            <h2>IGBT Finger Test</h2>
                            Perform both tests for C1 and E2<br/>
                            <ul>
                                <li>C1-Collector (Positive) Test</li>
                                <ol> 
                                    <li>With one hand touch +12V to turn on LED, -12V to turn off LED</li>
                                    <li>Other hand touch G1 (pin 4)</li>
                                </ol>
                                <li>E2-Emitter (Negative) Test</li>
                                <ol> 
                                    <li>With one hand touch +12V to turn on LED, -12V to turn off LED</li>
                                    <li>Other hand touch G2 (pin 6)</li>
                                </ol>
                            </ul>
                            <b>Note:</b> Touch battery first to dicharge static before touching G1/G2.
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered" style="background-color:#e6e6e6;">
                <tbody>
                    <tr>
                        <td>
                            <img src="img/igbt-test.png" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>