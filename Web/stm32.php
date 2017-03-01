<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
        $(document).ready(function()
        {
            $.ajax("stm32.csv",{
                async: false,
                success: function(data)
                {
                    var tbody = $("#stm32pin tbody").empty();

                    var row = data.split("\n");

                    for (var i = 0; i < row.length; i++) {
                        
                        var split = row[i].split(",");

                        var tr = $("<tr>");
                        tr.append($("<td>").append(split[0]));
                        tr.append($("<td>").append(split[1]));
                        tr.append($("<td>").append(split[2]));
                        tbody.append(tr);
                    }
                },
                error: function(xhr, textStatus, errorThrown){
                }
            });
        });
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
                                    <ul>
                                        <li><a href="https://www.olimex.com/Products/ARM/ST/STM32-H103/resources/STM32-H103.pdf" target="_blank">Olimex H103 Datasheet</a></li>
                                        <li><a href="http://www.st.com/content/st_com/en/products/microcontrollers/stm32-32-bit-arm-cortex-mcus/stm32f1-series/stm32f103/stm32f103rb.html" target="_blank">STM32F103RB Datasheet</a></li>
                                        <li><a href="http://www.st.com/en/development-tools/stm32cubemx.html" target="_blank">STM32CubeMX Software</a></li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <a data-fancybox="gallery" href="img/smt32-h103-top.jpg">
                                        <img src="img/smt32-h103-top.jpg" class="img-thumbnail img-rounded" />
                                    </a>
                                </td>
                                <td>
                                    <a data-fancybox="gallery" href="img/STMF103RxTx_pinout.png">
                                        <img src="img/STMF103RxTx_pinout.png" class="img-thumbnail img-rounded" />
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p>STM32 Pin Summary</p>
                    <table  class="table table-bordered table-striped" id="stm32pin" >
                        <thead></thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>