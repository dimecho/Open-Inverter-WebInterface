<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/components.js"></script>
        <script>
        $(document).ready(function () {
            <?php
            if(isset($_GET["hardware"])){
                if($_GET["hardware"] == "1"){
            ?>
                $("#components").empty();
                buildTable("Main Board v4", "/pcb/Hardware v1.0/bom/base_board4.csv");
                buildTable("Gate Driver v2", "/pcb/Hardware v1.0/bom/gate_driver2.csv", "Note: DC-DC has changed. PCB \"gate_driver.brd\" contains different size (old) component RH0515D or IH0515S");
                buildTable("Sensor Board v3", "/pcb/Hardware v1.0/bom/sensor_board3.csv", "Add C4 & C5 100nF when using LEM HTFS current sensors");
            <?php
                }else if($_GET["hardware"] == "damien"){
            ?>
                $("#components").empty();
                buildTable("Combined Board v8", "/pcb/Hardware v1.0 (Damien Mod)/bom/combi_v8.csv");
                buildTable("Main Board v2", "/pcb/Hardware v1.0 (Damien Mod)/bom/main_board_v2.csv");
                buildTable("Gate Driver v2", "/pcb/Hardware v1.0 (Damien Mod)/bom/igbt_v2.csv", "U1, U1 and link out ZD1, ZD2 components are optional for Desat detection tuning");
                buildTable("Sensor Board v1", "/pcb/Hardware v1.0 (Damien Mod)/bom/sensor_board_v1.csv");
            <?php
                }else if($_GET["hardware"] == "tesla"){
            ?>
                $("#components").empty();
                buildTable("Tesla Large Drive Unit Logic Board v2", "/pcb/Hardware v2.0 (Tesla Mod)/bom/tesla_board_v2.csv");
            <?php } }else{ ?>
                
            <?php } ?>
            $("#components").show();
        });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10" id="components" style="display:none">
                     <table class="table table-active bg-light table-bordered">
                        <tbody>
                            <tr align="center">
                                <td>
                                    <a href="/components.php?hardware=1">
                                        <img src="/img/hardware_v1.jpg" class="img-thumbnail img-rounded" />
                                    </a><br/><br/>
                                    Hardware v1.0 (Johannes Huebner)
                                </td>
                                <td>
                                    <a href="/components.php?hardware=damien">
                                        <img src="/img/hardware_v1_damien.jpg" class="img-thumbnail img-rounded" />
                                    </a><br/><br/>
                                    Hardware v1.0 (Damien Maguire)
                                </td>
                            </tr>
                            <tr align="center">
                                <td>
                                    <a href="/components.php?hardware=tesla">
                                        <img src="/img/hardware_v2_tesla.jpg" class="img-thumbnail img-rounded" />
                                    </a><br/><br/>
                                    Hardware v2.0 (Tesla Mod)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-lg-1"></div>
            </div>
            <br/><br/><br/><br/><br/><br/>
            <!-- PDF -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <br/>
                        </div>
                        <div class="modal-body">
                            <iframe src="" width="100%" height="100%" frameborder="0" id="componentPDF"></iframe>
                            <!--<object type="application/pdf" data="pcb/Capacitor-Tags.pdf" width="100%" height="100%">Not Working</object>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>