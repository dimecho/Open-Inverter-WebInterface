<!DOCTYPE html>
<html>
    <head>
        <?php
            include "header.php";
        ?>
        <script>
            $(document).on('click', '.browse', function(){
                $(this).attr("disabled", true);
                $.ajax("/snapshot.php?db=" + $("#motor").val(),{
                    async: false,
                    success: function(data){
                        console.log(data);
                        window.location.href = "/index.php";
                    }
                });
                $(this).removeAttr("disabled");
            });

            function setMotorImage(){
                var s = $("#motor").val().split("@");
                $("#motorimage").attr("src", "/db/img/" + s[0] + ".jpg");
            }
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
                            <tr>
                                <td>
                                    <center>
                                        <h2>Motor Configuraton Database</h2>
                                        <br/>
                                        <div class="input-group" style="width:60%">
                                            <span class = "input-group-addon" style="width:90%">
                                                <select class="form-control" onchange="setMotorImage()" id="motor" style="width:100%;" size="1">
                                                <?php
                                                    $files = glob(getcwd() ."/db/*.txt");
                                                    foreach($files as $file) {
                                                        echo "<option value=\"" .basename($file, ".txt") ."\">" .basename($file, ".txt") ."</option>";
                                                    }
                                                ?>
                                                </select>
                                            </span>
                                            <span class = "input-group-addon">
                                                <button class="browse btn btn-primary" type="button"><i class="icon-list-alt"></i> Set Motor</button>
                                            </span>
                                        </div>
                                        <br/><br/>
                                        <div>
                                            <br/>
                                            <?php
                                                $files = glob(getcwd() ."/db/*.txt");
                                                foreach($files as $file) {
                                                    $s = explode("@", basename($file, ".txt"));
                                                    echo "<img src=\"/db/img/" .$s[0].".jpg\" id=\"motorimage\" class=\"img-rounded\" >";
                                                    break;
                                                }
                                            ?>
                                            <br/><br/>
                                        </div>
                                    </center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>