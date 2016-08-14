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
                if (strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh') !== false) {
                    echo "window.location.href = '_firmware.php';";
                }else{
                ?>
                    var file = $(".file");
                    file.trigger('click');
                <?php
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
                                    if (strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh') !== false) {
                                        $name = basename($_FILES['firmware']['tmp_name']);
                                        move_uploaded_file($_FILES['firmware']['tmp_name'], "/tmp/$name.bin");
                                        $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../updater' '/tmp/$name.bin' " .$serial->_device. " 2>&1; echo $?";
                                        $output = shell_exec($command);
                                    }else{
                                        //Windows: double backslash \\ should be used to print a single \
                                        //Windows: safe_mode = Off
                                        $output = exec("'" .$_SERVER["DOCUMENT_ROOT"]. "/../updater.exe' '" .$_FILES['firmware']['tmp_name']. "' " .$serial->_device);
                                    }

                                    echo "<span class='label'>$command</span>";
                                    echo "<pre>$output</pre>";
                                ?>
                                </td>
                            </tr>
                        <?php }else{ ?>
                            <tr>
                                <td>
                                    <center>
                                        <form enctype="multipart/form-data" action="firmware.php" method="POST" id="Aform">
                                            <input type="file" name="firmware" class="file" hidden onchange="javascript:this.form.submit();"/>
                                            <input type="submit" hidden/>
                                        </form>
                                        <div class="input-append">
                                            <select name="rslist" class="form-control" form="Aform">
                                                <option value="<?php echo $serial->_device; ?>" selected="selected"><?php echo $serial->_device; ?></option>
                                            </select>
                                            <button class="browse btn btn-primary" type="button"><i class="icon-search"></i> Select BIN</button>
                                        </div>
                                        <br/><br/>
                                        <span class="label label-warning">Caution: Main board for Olimex powered with 3.3V - Double check your USB-TTL adapter.</span>
                                        <br/><br/>
                                        <img src="img/usb_ttl.jpg" />
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