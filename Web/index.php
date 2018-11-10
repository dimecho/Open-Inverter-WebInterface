<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="js/status.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col" align="center">
                    <div class="loader hidden"></div>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" id="parameters"></table>
                </div>
            </div>
        </div>
        <a class="serial" data-fancybox data-src="#serial" href="javascript:;"></a>
        <div class="hidden" id="serial" style="width:60%;border-radius:5px">
            <p>
            Select Serial Interface:
            </p>
            <select name="interface" class="form-control" form="serialForm" id="serial-interface"></select>
            <br/>
            <button class="browse btn btn-primary" type="button" onClick="$.fancybox.close();selectSerial();"><i class="glyphicon glyphicon-search"></i> Save</button>
        </div>
        <a class="safety" data-fancybox data-src="#warning" href="javascript:;"></a>
        <div class="hidden" id="warning" style="width:60%;border-radius:5px">
            <center>
                <img src="img/safety.png" />
            </center>
            <p>
            This project is for educational purpose. High power electronics can cause damage, death or injury. You have decided to build your own inverter so you are responsible for what you do.
            </p>
            <table class="table">
                <tr>
                    <td>
                        <center><button type="button" class="btn btn-danger" onClick="$.fancybox.close();setCookie('safety', 1, 360);location.reload();"><i class="glyphicon glyphicon-cog"></i> I Agree</button></center>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>