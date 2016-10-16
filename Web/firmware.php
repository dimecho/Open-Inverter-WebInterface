<?php
    require('config.inc.php');

    if(isset($_GET["ajax"])){

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            //Windows: safe_mode = Off
            $command = "powershell.exe -file '" .$_SERVER["DOCUMENT_ROOT"]. "/../Windows/updater.ps1' '" .$_GET["file"]. "' " .str_replace("\\.\\", "", $serial->_device);
        }else{
            $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../updater' " .$_GET["file"]. " " .$serial->_device;
        }

        exec($command . " 2>&1", $output, $return);

        foreach ($output as $line) {
            echo "$line\n";
        }
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                var file = $('.file');
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
                    <table class="table table-bordered">
                        <tbody>
                        <?php if(isset($_FILES["firmware"])){ ?>
                            <tr>
                                <td>
                                    <script>
                                        $(document).ready(function() {
                                            var progressBar = $("#progressBar");
                                            for (i = 0; i < 100; i++) {
                                                setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                                            }
                                            $.ajax({
                                                type: "GET",
                                                url: "firmware.php?ajax=1<?php
                                                    $name = basename($_FILES['firmware']['tmp_name']);
                                                    $tmp_name = "/tmp/$name.bin";
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    //echo $_FILES['firmware']['tmp_name'];
                                                    echo "&file=" .$tmp_name;
                                                ?>",
                                                data: {},
                                                success: function(data){
                                                    console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                    setTimeout( function (){
                                                        window.location.href = "/index.php";
                                                    },2500);
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <span class="label label-warning">Tip: If Olimex is bricked, try pressing "reset" button while flashing</span>
                                    <br/><br/>
                                    <div id="output"></div>
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
<?php } ?>