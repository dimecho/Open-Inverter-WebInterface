<?php
    include_once("common.php");
    
    detectOS();
    
    if(isset($_GET["ajax"])){

        if(isset($_GET["fuse"]))
        {
            $command = runCommand("fuse " .$_GET["isp"]. " " .$_GET["serial"]);
        }else{
            $command = runCommand("attiny " .$_GET["file"]. " " .$_GET["isp"]. " " .$_GET["serial"]);
        }
        exec($command, $output, $return);
        
        echo "$command\n";
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
                window.location.href = "attiny.php?fuses=1&isp=" + $("#ispList option:selected").text() + "&serial=" + $("#serialList option:selected").text();
            });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
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
                                                success: function(data){
                                                    console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <input type="checkbox" checked="checked"> SPIEN *
                                    <input type="checkbox"> CKDIV8
                                    <input type="checkbox" checked="checked"> SUT0
                                    <input type="checkbox" checked="checked"> CKSEL0
                                    <br/><br/>
                                    <a href="http://eleccelerator.com/fusecalc/fusecalc.php?chip=attiny13a&LOW=7A&HIGH=FF&LOCKBIT=FF" target="_blank">Fuse Calculator</a>
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
                                                url:
                                                <?php
                                                    echo "'";
                                                    echo "attiny.php?ajax=1";
                                                    if ($os === "Mac") {
                                                        $tmp_name = "/tmp/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }else{
                                                        $tmp_name = sys_get_temp_dir(). "/" .basename($_FILES['firmware']['tmp_name']). ".bin";
                                                    }
                                                    move_uploaded_file($_FILES['firmware']['tmp_name'], $tmp_name);
                                                    echo "&file=" .$tmp_name;
                                                    echo "&serial=" .$_POST["serial"];
                                                    echo "&isp=" .$_POST["isp"];
                                                    echo "'";
                                                ?>,
                                                success: function(data){
                                                    //console.log(data);
                                                    progressBar.css("width","100%");
                                                    $("#output").append($("<pre>").append(data));
                                                }
                                            });
                                        });
                                    </script>
                                    <div class="progress progress-striped active">
                                        <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                    </div>
                                    <div id="output"></div>
                                </td>
                            </tr>
                        <?php }else{ ?>
                            <script>
                                $(document).ready(function() {
                                    $.ajax({
                                        type: "GET",
                                        url: "serial.php?com=list",
                                        success: function(data){
                                            //console.log(data);
                                            var s = data.split(',');
                                            for (i = 0; i < s.length; i++) {
                                                $("#serialList").append($("<option>",{value:s[i],selected:'selected'}).append(s[i]));
                                            }
                                        }
                                    });
                                });
                            </script>
                            <tr>
                                <td>
                                <center>
                                    <div class="input-group" style="width:80%">
                                        <span class = "input-group-addon" style="width:30%">
                                            <select name="isp" class="form-control" form="Aform" id="ispList">
                                                <option value="ponyser" selected="selected">ponyser</option>
                                                <option value="usbtiny">usbtiny</option>
                                                <option value="usbasp">usbasp</option>
                                                <option value="usbtinyisp">usbtinyisp</option>
                                                <option value="arduino">arduino</option>
                                            </select>
                                        </span>
                                        <span class = "input-group-addon" style="width:70%">
                                            <select name="serial" class="form-control" form="Aform" id="serialList">
                                            </select>
                                        </span>
                                        <span class = "input-group-addon">
                                            <button class="browse btn btn-primary" type="button"><i class="glyphicon glyphicon-search"></i> Select HEX</button>
                                            <button class="fuses btn btn-danger" type="button"><i class="glyphicon glyphicon-download-alt"></i> Reset Fuses</button>
                                        </span>
                                    </div>
                                    <br/><br/>
                                    <span class="label label-lg label-danger">Prolific chipset USB to Serial adapters will not work, use a "legacy" serial port.</span>
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
                <div class="col-md-1"></div>
            </div>
        </div>
        <form enctype="multipart/form-data" action="attiny.php" method="POST" id="Aform">
            <input type="file" name="firmware" class="file" hidden onchange="javascript:this.form.submit();" />
            <input type="submit" hidden />
        </form>
    </body>
</html>
<?php } ?>