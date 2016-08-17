<!DOCTYPE html>
<html>
    <head>
        <?php
            require "config.inc.php";
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                <?php
                if (strpos($_SERVER['HTTP_USER_AGENT'], 'Huebner Inverter') !== false) {
                    echo "window.location.href = '_bootloader.php';";
                }else{
                    echo "var file = $('.file');";
                    echo "file.trigger('click');";
                }
                ?>
            });

            function setJTAGImage(){
                $("#jtagimage").attr("src", "img/" + $("#jtag").val() + ".jpg");
            }
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="span1"></div>
                <div class="span10">
                    <table class="table table-bordered" style="background-color:#e6e6e6;">
                        <tbody>
                        <?php if(isset($_FILES["firmware"])){ ?>
                            <tr>
                                <td>
                                <?php
                                    //$name = basename($_FILES['firmware']['tmp_name']);
                                    //move_uploaded_file($_FILES['firmware']['tmp_name'], "/tmp/$name.bin");
                                    $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../openocd' " .$_FILES['firmware']['tmp_name']. " " .$_POST["rslist"]. " 2>&1; echo $?";
                                    $output = shell_exec($command);
                                    echo "<span class='label'>$command</span>";
                                    echo "<pre>$output</pre>";
                                ?>
                                </td>
                            </tr>
                        <?php }else{ ?>
                            <tr>
                                <td>
                                    <center>
                                        <form enctype="multipart/form-data" action="bootloader.php" method="POST" id="Aform">
                                            <input type="file" name="firmware" class="file" hidden onchange="javascript:this.form.submit();"/>
                                            <input type="submit" hidden/>
                                        </form>
                                        <div class="input-append">
                                            <select name="rslist" class="form-control" form="Aform" onchange="setJTAGImage()" id="jtag" >
                                                <option value="olimex-arm-usb-ocd-h" selected="selected">olimex-arm-usb-ocd-h</option>
                                                <option value="olimex-arm-usb-tiny-h">olimex-arm-usb-tiny-h</option>
                                                <option value="jtag-lock-pick_tiny_2">jtag-lock-pick_tiny_2</option>
                                                <option value="openocd-usb">openocd-usb</option>
                                            </select>
                                            <button class="browse btn btn-primary" type="button"><i class="icon-search"></i> Select BIN</button>
                                        </div>
                                        <br/><br/>
                                        <div style="background-color:#ffffff;">
                                            <img src="img/olimex-arm-usb-ocd-h.jpg" id="jtagimage" />
                                        </div>
                                    </center>
                                </td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>
                </div>
                <div class="span1"></div>
            </div>
        </div>
    </body>
</html>