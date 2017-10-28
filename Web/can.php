<?php
    if(isset($_POST["data"])){

        $data = $_POST["data"];
        $file = fopen(realpath(dirname(__FILE__)) . "/db/database.can", "w");
        fwrite($file, $data);
        fclose($file);
        
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/status.js"></script>
        <script type="text/javascript" src="/js/can.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10" align="center">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <span class="badge badge-lg badge-warning">CAN bus speed is fixed to 250kbps</span><br/><br/>
                                <span class="text-muted glyphicon glyphicon-warning-sign"></span> <a href="http://johanneshuebner.com/quickcms/index.html%3Fen_can-communication,31.html" target="_blank">CAN Details and Limitations</a><br/>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active table-bordered">
                            <tr>
                                <td>
                                    <button type="button" class="btn btn-danger" onClick="setCANDefaults()"><i class="glyphicon glyphicon-erase"></i> Reset CAN Mapping</button>
                                </td>
                                <td>
                                    <button type="button" class="btn btn-success" onClick="saveCANMapping()"><i class="glyphicon glyphicon-erase"></i> Save CAN Mapping</button>
                                </td>
                            </tr>
                    </table>
                    <div class="loader" style="display: none;"></div>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" style="display:none;" id="parameters"></table>
                </div>
                <div class="col-lg-1"></div>
            </div>
        </div>
    </body>
</html>
<?php } ?>