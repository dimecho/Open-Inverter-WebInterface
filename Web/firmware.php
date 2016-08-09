<!DOCTYPE html>
<html>
    <head>
        <?php
            require "config.inc.php";
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                var file = $(".file");
                file.trigger('click');
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
                                <td>Firmware Updated Successfully</td>
                            </tr>
                            <tr>
                                <td>
                                <?php
                                    $output = "";

                                    if (strpos($_SERVER['HTTP_USER_AGENT'], 'Macintosh') !== false) {
                                        $output = shell_exec("'" .$_SERVER["DOCUMENT_ROOT"]. "/../updater' '" .$_FILES['firmware']['tmp_name']. "' " .$serial->_device. " 2>&1; echo $?");
                                    }else{
                                        //Windows: double backslash \\ should be used to print a single \
                                        //Windows: safe_mode = Off
                                        $output = exec("'" .$_SERVER["DOCUMENT_ROOT"]. "/../updater.exe' '" .$_FILES['firmware']['tmp_name']. "' " .$serial->_device);
                                    }

                                    echo "<pre>$output</pre>";
                                ?>
                                </td>
                            </tr>
                        <?php }else{ ?>
                            <tr>
                                <td>Firmware Update</td>
                            </tr>
                            <tr>
                                <td>
                                    <form enctype="multipart/form-data" action="firmware.php" method="POST">
                                        <input type="file" name="firmware" class="file" hidden onchange="javascript:this.form.submit();"/>
                                        <input type="submit" hidden/>
                                    </form>
                                    <div class="input-append">
                                        <input type="text" class="form-control" disabled placeholder="Upload Firmware">
                                        <button class="browse btn btn-primary" type="button"><i class="icon-search"></i> Browse</button>
                                    </div>
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