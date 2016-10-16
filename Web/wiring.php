<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="js/jspdf.js"></script>
        <script>
            function printWiring()
            {
                var doc = new jsPDF('l', 'mm', [279, 215]);
                doc.setDisplayMode(1);
                doc.setFontSize(28);
                doc.text(110, 20, "Wiring Diagram");
                var img = new Image();
                img.onload = function() {
                    doc.addImage(this, 'PNG' , 25, 40, 225, 150, "wiring", "none");
                    doc.save("wiring.pdf");
                };
                img.src = "img/wiring.png";
            }
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
             <div class="row">
                <div class="span1"></div>
                <div class="span10">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                <center>
                                    <a href="http://johanneshuebner.com/quickcms/index.html%3Fen_main-board,21.html" target="_blank">Main Board</a>
                                </center>
                                </td>
                                <td>
                                <center>
                                    <a href="http://johanneshuebner.com/quickcms/index.html%3Fen_sensor-board,22.html" target="_blank">Sensor Board</a>
                                </center>
                                </td>
                                <td>
                                <center>
                                    <a href="http://johanneshuebner.com/quickcms/index.html%3Fen_gate-drivers,23.html" target="_blank">Gate Drivers</a>
                                </center>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="3">
                                    <img src="img/wiring.png" />
                                </td>
                            </tr>
                             <tr>
                                <td colspan="3">
                                    <button type="button" class="btn btn-info" onClick="printWiring();">Print</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="span1"></div>
            </div>
        </div>
    </body>
</html>