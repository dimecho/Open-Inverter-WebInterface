<?php
    include_once("common.php");
    
    detectOS();
    
    if(isset($_GET["hw"])){
        
        set_time_limit(10000);
        
        exec(runCommand("source",$_GET["hw"]), $output, $return);
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/sourcecode.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="col">
                    <center>
                        <table class="table table-active bg-light table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="progress progress-striped active">
                                            <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                        </div>
                                        <div id="output"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </div>
            </div>
        </div>
    </body>
</html>
<?php } ?>