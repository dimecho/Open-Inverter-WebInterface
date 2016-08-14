<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php"; ?>
        <script>
            $(document).on('click', '.browse', function(){
                <?php
                if (strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh') !== false) {
                    echo "window.location.href = '_attiny.php';";
                }else{
                    echo "var file = $('.file');";
                    echo "file.trigger('click');";
                }
                ?>
            });
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
                                    $name = basename($_FILES['firmware']['tmp_name']);
                                    move_uploaded_file($_FILES['firmware']['tmp_name'], "/tmp/$name.hex");
                                    $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../attiny' '/tmp/$name.hex' " .$_POST["isplist"]. " " .$serial->_device. " 2>&1; echo $?";
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
                                    <form enctype="multipart/form-data" action="attiny.php" method="POST" id="Aform">
                                        <input type="file" name="firmware" class="file" hidden onchange="javascript:this.form.submit();" />
                                        <input type="submit" hidden />
                                    </form>
                                    <div class="input-append">
                                            <select name="isplist" class="form-control" form="Aform">
                                                <option value="ponyser" selected="selected">ponyser</option>
                                                <option value="usbtiny">usbtiny</option>
                                                <option value="usbasp">usbasp</option>
                                                <option value="usbtinyisp">usbtinyisp</option>
                                                <option value="arduino">arduino</option>
                                            </select>
                                            <button class="browse btn btn-primary" type="button"><i class="icon-search"></i> Select HEX</button>
                                            <button class="btn btn-inverse" type="button"><i class="icon-download-alt icon-white"></i> Reset Fuses</button>
                                        </form>
                                    </div>
                                    <br/><br/>
                                    <span class="label label-important">Prolific chipset USB to Serial adapters will not work, use a "legacy" serial port.</span>
                                    <br/><br/>
                                    <div style="background-color:#ffffff;">
                                        <img src="img/avr_programmer_serial.png" />
                                        <br/><img src="img/attiny13.png" /><img src="img/avr_programmer.jpg" /><br/>
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