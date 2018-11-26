<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            $(document).ready(function() {
                $.notify({ message: "Reference Tutorial By: Arber Kramar" }, { type: 'success' });
            });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
             <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <center>
                                    <b>INSTRUCTIONS FOR PROGRAMMING OF OLIMEX CHIP WITH JOHANNES CODE</b><br>
                                    <b>V1.1</b><br>
                                </center>
                                 <ol>
                                    <li>Buy a programming dongle<br>
                                    <a data-fancybox="gallery" href="firmware/img/st-linkv2.jpg">
                                        <img src="firmware/img/st-linkv2.jpg" class="img-thumbnail rounded" />
                                    </a><br><br>
                                    </li>
                                    <li>Load software for Windows, probably have to register with ST
                                        <ul>
                                            <li><a href="http://www.st.com/en/development-tools/stsw-link004.html" target="_blank">http://www.st.com/en/development-tools/stsw-link004.html</a></li>
                                            <li><a href="http://www.st.com/content/st_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-utilities/stsw-link009.html" target="_blank">http://www.st.com/content/st_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-utilities/stsw-link009.html</a><br><br>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>STlink and Olimex chip are connected according to table and picture - observe cable colour<br><br>
                                        <b>JTAG CONNECTOR PIN DESCRIPTION</b>
                                        <table class="table table-active table-bordered">
                                            <tr>
                                                <td><b>Pin #</b></td><td><b>Signal Name</b></td><td><b>Pin #</b></td><td><b>Signal Name</b></td>
                                            </tr>
                                            <tr>
                                                <td>1</td><td>TVCC 3.3V <font color="red">(3.3V)</font></td><td>2</td><td>TVCC 3.3V</td>
                                            </tr>
                                            <tr>
                                                <td>3</td><td>TRST</td><td>4</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>5</td><td>TDI</td><td>6</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>7</td><td>TMS <font color="orange">(SWDIO)</font></td><td>8</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>9</td><td>TCK <font color="khaki">(SWCLK)</font></td><td>10</td><td>GND <font color="grey">(GND)</font></td>
                                            </tr>
                                            <tr>
                                                <td>11</td><td>NC</td><td>12</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>13</td><td>TDO</td><td>12</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>15</td><td>RST</td><td>16</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>17</td><td>NC</td><td>18</td><td>GND</td>
                                            </tr>
                                            <tr>
                                                <td>19</td><td>NC</td><td>20</td><td>GND</td>
                                            </tr>
                                        </table>
                                        <a data-fancybox="gallery" href="firmware/img/st-linkv2-jtag.jpg">
                                            <img src="firmware/img/st-linkv2-jtag.jpg" class="img-thumbnail rounded" />
                                        </a><br><br>
                                    </li>
                                    <li>Run the program and select Connect in menu. Also select SWD port.
                                        <a data-fancybox="gallery" href="firmware/img/st-link-utility1.png">
                                            <img src="firmware/img/st-link-utility1.png" class="img-thumbnail rounded" />
                                        </a><br><br>
                                        <a data-fancybox="gallery" href="firmware/img/st-link-utility2.png">
                                            <img src="firmware/img/st-link-utility2.png" class="img-thumbnail rounded" />
                                        </a><br><br>
                                    </li>
                                    <li>We erase flash by selecting option »Erase chip«!<br><br></li>
                                    <li>We select Bootloader program to load. Best is to select .hex files. Run Start
                                         <a data-fancybox="gallery" href="firmware/img/st-link-utility3.png">
                                            <img src="firmware/img/st-link-utility3.png" class="img-thumbnail rounded" />
                                        </a><br><br>
                                    </li>
                                    <li>We now select our software to load and run program.
                                        <a data-fancybox="gallery" href="firmware/img/st-link-utility4.png">
                                            <img src="firmware/img/st-link-utility4.png" class="img-thumbnail rounded" />
                                        </a><br><br>
                                    </li>
                                    <li>After a successfull flash Olimex LED starts to pulse.</li>
                                </ol>
                            </td>
                        </tr>
						<tr>
                            <td>
                                <center>
                                    <b>Android Phone + ST Link V2</b><br>
                                    <b><a href="https://play.google.com/store/apps/details?id=ru.zdevs.zflasherstm32&hl=en_US" target="_blank">ZFlasher STM32</a></b><br>
                                </center>
								<ol><li>For flashing with Android use USB-OTG cable.</li></ol><br><br>
								<a data-fancybox="gallery" href="firmware/img/st-link-zflasher.jpg">
                                    <img src="firmware/img/st-link-zflasher.jpg" class="img-thumbnail rounded" />
                                </a><br><br>
							</td>
						</tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>