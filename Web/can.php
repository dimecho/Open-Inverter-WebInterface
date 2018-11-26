<?php
    if(isset($_POST["data"])){

        $data = $_POST["data"];
        $file = fopen(realpath(__DIR__ . "/js/can.json", "w"));
        fwrite($file, $data);
        fclose($file);

    }else if(isset($_GET["clear"])){

        unlink(realpath(__DIR__ . "/js/can.json"));
        
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/can.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br>
            <div class="row">
                <div class="col" align="center">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <p>CAN Bus Speed:</p>
								<select name="canspeed" class="form-control" id="can-speed">
									<option value="0">250kbps</option>
									<option value="1">500kbps</option>
									<option value="2">800kbps</option>
									<option value="3">1000kbps</option>
								</select>
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active table-bordered">
                        <tr>
                            <td>
                                <button type="button" class="btn btn-danger" onClick="setCANDefaults()"><i class="glyphicon glyphicon-erase"></i> Reset CAN</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-success" onClick="saveCANMapping()"><i class="glyphicon glyphicon-erase"></i> Save CAN</button>
                            </td>
                        </tr>
                    </table>
                    <div class="loader" style="display: none;"></div>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" style="display:none;" id="parameters"></table>
                </div>
            </div>
        </div>
    </body>
</html>
<?php } ?>