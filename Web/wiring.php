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
                <div class="col-md-1"></div>
                <div class="col-md-10">
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
                    <p>Main Connector (JP5) Pin Summary</p>
                    <table  class="table table-bordered table-striped" >
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td><strong>Pin</strong></td>
                                <td><strong>Name</strong></td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>GND</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>30mA output for IR diode</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Encoder input</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>3.3V</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Cruise Control Input (12V)</td>
                            </tr>
                            <tr>
                                <td>6</td>
                                <td>Throttle Input (0-3.3V)</td>
                            </tr>
                            <tr>
                                <td>7</td>
                                <td>Start input (12V)</td>
                            </tr>
                            <tr>
                                <td>8</td>
                                <td>Regen Pot Input (0-3.3V)</td>
                            </tr>
                            <tr>
                                <td>9</td>
                                <td>Brake Input (12V)</td>
                            </tr>
                            <tr>
                                <td>10</td>
                                <td>GND</td>
                            </tr>
                            <tr>
                                <td>11</td>
                                <td>Motor Protection Switch (12V, PWM inhibit when low)</td>
                            </tr>
                            <tr>
                                <td>12</td>
                                <td>DC contactor output (open collector 3A)</td>
                            </tr>
                            <tr>
                                <td>13</td>
                                <td>Forward (12V)</td>
                            </tr>
                            <tr>
                                <td>14</td>
                                <td>Error Signal (open collector 3A)</td>
                            </tr>
                            <tr>
                                <td>15</td>
                                <td>Reverse (12V)</td>
                            </tr>
                            <tr>
                                <td>16</td>
                                <td>Over/Under Voltage (open collector 3A)</td>
                            </tr>
                            <tr>
                                <td>17</td>
                                <td>Emergency Stop (12V, PWM inhibit when low)</td>
                            </tr>
                            <tr>
                                <td>18</td>
                                <td>Temperature PWM output (open collector 100mA)</td>
                            </tr>
                            <tr>
                                <td>19</td>
                                <td>BMS Over/Under Voltage input (12V)</td>
                            </tr>
                            <tr>
                                <td>20</td>
                                <td>Precharge Output (open collector 2A)</td>
                            </tr>
                            <tr>
                                <td>21</td>
                                <td>Motor Temperature Input -</td>
                            </tr>
                            <tr>
                                <td>22</td>
                                <td>Motor Temperature Input +</td>
                            </tr>
                            <tr>
                                <td>23</td>
                                <td>GND</td>
                            </tr>
                            <tr>
                                <td>24</td>
                                <td>Vcc (7-26V)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>