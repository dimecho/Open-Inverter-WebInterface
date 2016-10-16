<?php
    
    if(isset($_GET["ajax"])){

        require('config.inc.php');

        if(isset($_GET["fuse"]))
        {
            //if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            //}else{
                $command = "avrdude -c " .$_GET["isp"]. " -p attiny13 -P " .$serial->_device. " -U lfuse:w:0x7A:m -U hfuse:w:0xFF:m";
            //}
        }else{
            $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../attiny' " .$_GET["file"]. " " .$_GET["isp"]. " " .$serial->_device;
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
        <?php include "header.php"; ?>
        <script>
            $(document).on('click', '.browse', function(){
                var file = $('.file');
                file.trigger('click');
            });

            $(document).on('click', '.fuses', function(){
                window.location.href = "attiny.php?fuses=1";
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
                        <?php if(isset($_GET["fuses"])){ ?>
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
                                                url: "attiny.php?ajax=1&fuse=1",
                                                data: {},
                                                success: function(data){
                                                    console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <span class='label label-success'>Fuses Reset</span><br/><br/>
                                    <label class="checkbox"><input type="checkbox" checked="checked"> SPIEN *</label>
                                    <label class="checkbox"><input type="checkbox"> CKDIV8</label>
                                    <label class="checkbox"><input type="checkbox" checked="checked"> SUT0</label>
                                    <label class="checkbox"><input type="checkbox" checked="checked"> CKSEL0</label>
                                    <br/>
                                    <a href="http://eleccelerator.com/fusecalc/fusecalc.php?chip=attiny13a&LOW=7A&HIGH=FF&LOCKBIT=FF">Fuse Calculator</a>
                                    <br/>
                                    <div id="output"></div>
                                </td>
                            </tr>
                        <?php }else if(isset($_FILES["firmware"])){ ?>
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
                                                url: "attiny.php?ajax=1<?php
                                                    $name = basename($_FILES['firmware']['tmp_name']);
                                                    $tmp_name = "/tmp/$name.bin";
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    //echo $_FILES['firmware']['tmp_name'];
                                                    echo "&file=" .$tmp_name;
                                                    echo "&isp=" .$_POST["isp"];
                                                ?>",
                                                data: {},
                                                success: function(data){
                                                    console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <div id="output"></div>
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
                                            <select name="isp" class="form-control" form="Aform">
                                                <option value="ponyser" selected="selected">ponyser</option>
                                                <option value="usbtiny">usbtiny</option>
                                                <option value="usbasp">usbasp</option>
                                                <option value="usbtinyisp">usbtinyisp</option>
                                                <option value="arduino">arduino</option>
                                            </select>
                                            <button class="browse btn btn-primary" type="button"><i class="icon-search"></i> Select HEX</button>
                                            <button class="fuses btn btn-inverse" type="button"><i class="icon-download-alt icon-white"></i> Reset Fuses</button>
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
<?php } ?>