<?php
    
    //session_save_path(sys_get_temp_dir()); //For accessing same session with different port
    session_start();
	
	set_time_limit(0);
	
    //Allow for Cross Origin Resource Sharing
    //header("Access-Control-Allow-Origin: *");
    //header("Access-Control-Allow-Methods: GET, POST");
    //if(!isset($_SESSION["stop"])){
    //    $_SESSION["stop"] = 0;
    //}
    
    if(isset($_GET["delay"])){
        $_SESSION["delay"] = $_GET["delay"] * 1000;
    }
    if(isset($_GET["stream"])){

        require("serial.php");

        //header('Content-type: application/octet-stream');
        header('Content-type: text/html; charset=utf-8');

        $split = explode(",", urldecode($_GET["stream"]));
        $values = array();

        while(true) //$_SESSION["stop"] === 0)
        {
            for ($i = 0; $i < count($split); $i++)
            {
                if (trim($split[$i]) != "")
                {
                    //echo $split[$i];
                    $values[$i] = readSerial("get " .$split[$i]);
                }
            }

            echo implode(",",$values);

            flush();
            ob_flush();
            usleep($_SESSION["delay"]);
        }
        //echo $values;
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/moment.js"></script>
        <script type="text/javascript" src="/js/chart.js"></script>
        <script type="text/javascript" src="/js/chartjs-plugin-zoom.js"></script>
        <script type="text/javascript" src="/js/chartjs-plugin-streaming.js"></script>
        <script type="text/javascript" src="/js/graph.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered" id="render">
                        <tr>
                            <td>
                                <div id="buildGraphMenu"></div>
                                <canvas id="canvas"></canvas>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col" align="center">
                    <div id="buildGraphFooter"></div>
                </div>
            </div>
        </div>
        <br/>
    </body>
</html>
<?php } ?>