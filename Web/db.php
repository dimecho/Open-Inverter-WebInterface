<!DOCTYPE html>
<html>
    <head>
        <?php
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                $.ajax("upload.php?db=" + $("#motor").val(),{
                    async: false,
                    success: function(data){
                        console.log(data);
                        window.location.href = "/index.php";
                    }
                });
            });

            function setMotorImage(){
                var s = $("#motor").val().split("@");
                $("#motorimage").attr("src", "db/img/" + s[0] + ".jpg");
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
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <center>
                                        <h2>Motor Configuraton Database</h2>
                                        <br/>
                                        <div class="input-append">
                                            <select class="form-control" onchange="setMotorImage()" id="motor" style="width: 250px;" size="1">
                                            <?php
                                                $files = glob(getcwd() ."/db/*.txt");
                                                foreach($files as $file) {
                                                    echo "<option value=\"" .basename($file, ".txt") ."\">" .basename($file, ".txt") ."</option>";
                                                }
                                            ?>
                                            </select>
                                            <button class="browse btn btn-primary" type="button"><i class="icon-list-alt"></i> Set Motor</button>
                                        </div>
                                        <br/><br/>
                                        <div>
                                            <br/>
                                            <img src="db/img/Siemens_1PV5135.jpg" id="motorimage" class="img-rounded" />
                                            <br/><br/>
                                        </div>
                                    </center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="span1"></div>
            </div>
        </div>
    </body>
</html>