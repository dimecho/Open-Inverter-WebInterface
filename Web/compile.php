<?php
    if(isset($_GET["ajax"])){
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            $command = "cmd.exe /c '" .$_SERVER["DOCUMENT_ROOT"]. "/../Windows/source.bat'";
        }else{
            $command = "'" .$_SERVER["DOCUMENT_ROOT"]. "/../source'";
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
        <?php include "header.php" ?>
        <script>
            $(document).ready(function() {
                var progressBar = $("#progressBar");
                for (i = 0; i < 100; i++) {
                    setTimeout(function(){ progressBar.css("width", i + "%"); }, i*2000);
                }
                $.ajax({
                    /*
                    xhr: function()
                    {
                        var xhr = new window.XMLHttpRequest();
                        xhr.addEventListener("progress", function(e){
                            console.log(e.target.responseText);
                        }, false);
                        return xhr;
                    },
                    */
                    //async: false,
                    type: "GET",
                    url: "compile.php?ajax=1",
                    data: {},
                    success: function(data){
                        console.log(data);
                        progressBar.css("width","100%");
                        $("#output").append($("<pre>").append(data));
                    }
                });
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
                    <center>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="progress progress-striped active">
                                            <div class="bar" style="width:1%" id="progressBar"></div>
                                        </div>
                                        <div id="output"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </div>
                <div class="span1"></div>
            </div>
        </div>
    </body>
</html>
<?php } ?>