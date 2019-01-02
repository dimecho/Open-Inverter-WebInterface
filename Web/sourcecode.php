<?php
    include_once("common.php");
    
    $os = detectOS();
    
    if(isset($_GET["hw"])){
        
        set_time_limit(10000);

        $command = runCommand("source",$_GET["hw"],$os,1);
        exec($command, $output, $return);

        echo "\n$command\n";
        foreach ($output as $line) {
            echo "$line\n";
        }
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php"; ?>
        <script src="js/sourcecode.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br><br>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr align="center">
                            <td>
                                <div class="progress progress-striped active">
                                    <div class="progress-bar" style="width:1%"></div>
                                </div>
                                <div id="output"></div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
<?php } ?>