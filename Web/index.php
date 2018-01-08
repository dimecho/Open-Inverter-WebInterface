<!DOCTYPE html>
<html>
    <head>
        <script>
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "serial.php?init=1");
            xhr.send();
        </script>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/status.js"></script>
        <script type="text/javascript" src="/js/index.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col" align="center">
                    <div id="connection" style="display: none;">
                        <img src="/img/connection.jpg" class="thumbnail" width="80%" height="80%"/>
                        <br/><br/>
                        <div class="btn-group">
                            <button class="btn btn-warning">Warning</button>
                            <button class="btn btn-secondary">Do not connect 5 volt power to serial connection (3.3 volt only)</button>
                        </div>
                    </div>
                    <div class="loader" style="display: none;"></div>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" style="display:none;" id="parameters"></table>
                </div>
            </div>
        </div>
        <a class="safety" data-fancybox data-src="#warning" href="javascript:;" style="display: none;"></a>
        <div id="warning" style="display:none;width:60%;border-radius:5px">
            <center>
                <img src="/img/safety.png" />
            </center>
            <p>
            This project is for educational purpose. High power electronics can cause damage, death or injury. You have decided to build your own inverter so you are responsible for what you do.
            </p>
            <table class="table">
                <tbody>
                    <tr>
                        <td>
                            <center><button type="button" class="btn btn-danger" onClick="$.fancybox.close();setCookie('safety', 1, 360);buildParameters();"><i class="glyphicon glyphicon-cog"></i> I Agree</button></center>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>