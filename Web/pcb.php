<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/pcb.js"></script>
        <script>
        $(document).ready(function () {

            var pcb = "pcb/";

            <?php
            if(isset($_GET["hardware"])){
            ?>
				giveCredit(pcb + "/design.txt");
				$("#components").empty();
			<?php
                if($_GET["hardware"] == "1"){
            ?>
                pcb += "Hardware v1.0";
                buildTable("Main Board v4", pcb + "/bom/base_board4.csv");
                buildTable("Gate Driver v1", pcb + "/bom/gate_driver.csv");
                buildTable("Sensor Board v3", pcb + "/bom/sensor_board3.csv", "Add C4 & C5 100nF when using LEM HTFS current sensors");
            <?php
                }else if($_GET["hardware"] == "damien"){
            ?>
                pcb += "Hardware v1.0 (Damien Mod)";
                buildTable("Combined Board v8", pcb + "/bom/combi_v8.csv");
                buildTable("Main Board v2", pcb + "/bom/main_board_v2.csv");
                buildTable("Gate Driver v2", pcb + "/bom/igbt_v2.csv", "U1, U1 and link out ZD1, ZD2 components are optional for Desat detection tuning");
                buildTable("Sensor Board v1", pcb + "/bom/sensor_board_v1.csv");
            <?php
                }else if($_GET["hardware"] == "2"){
            ?>
                pcb += "Hardware v2.0";
                buildTable("Main Board v6", pcb + "/bom/base_board6.csv");
                buildTable("Gate Driver v2", pcb + "/bom/gate_driver2.csv");
                buildTable("Sensor Voltage", pcb + "/bom/sensor_voltage.csv");
                buildTable("Sensor Current", pcb + "/bom/sensor_current.csv");
            <?php
                }else if($_GET["hardware"] == "3"){
            ?>
                pcb += "Hardware v3.0";
                buildTable("Main Board v7", pcb + "/bom/base_board7.csv");
            <?php } }else{ ?>
                
            <?php } ?>
			
            $("#components").show();
        });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
            <div class="row">
                <div class="col" id="components" style="display:none">
                     <table class="table table-active bg-light table-bordered">
                        <tbody>
                            <tr align="center">
                                <td>
                                    <a href="?hardware=1">
                                        <img src="pcb/Hardware v1.0/bom/img/base_board4.jpg" class="img-thumbnail rounded" />
                                    </a><br><br>
                                    Hardware v1.0
                                </td>
                                <td>
                                    <a href="?hardware=damien">
                                        <img src="pcb/Hardware v1.0 (Damien Mod)/bom/img/main_board_v2.jpg" class="img-thumbnail rounded" />
                                    </a><br><br>
                                    Hardware v1.0 (Damien Maguire)
                                </td>
                            </tr>
                            <tr align="center">
                                <td>
                                     <a href="?hardware=2">
                                        <img src="pcb/Hardware v2.0/bom/img/base_board6.jpg" class="img-thumbnail rounded" />
                                    </a><br><br>
                                    Hardware v2.0
                                </td>
                                <td>
                                    <a href="?hardware=3">
                                        <img src="pcb/Hardware v3.0/bom/img/base_board7.jpg" class="img-thumbnail rounded" />
                                    </a><br><br>
                                    Hardware v3.0
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <br><br><br><br><br><br>
        </div>
    </body>
</html>