<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            $(document).ready(function() {
                $(".safety").fancybox({
                    maxWidth    : 800,
                    maxHeight   : 640,
                    fitToView   : false,
                    width       : '80%',
                    height      : '80%',
                    autoSize    : false,
                    closeClick  : false,
                    openEffect  : 'none',
                    closeEffect : 'none'
                });
            });
        </script>
        <link rel="stylesheet" type="text/css" href="/css/bootstrap-editable.css" />
        <script type="text/javascript" src="/js/bootstrap-editable.js"></script>
        <script type="text/javascript" src="/js/status.js"></script>
        <script type="text/javascript" src="/js/index.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10">
                    <div id="connection" style="display: none;">
                        <center>
                            <img src="/img/connection.jpg" class="thumbnail" width="80%" height="80%"/>
                            <br/><br/>
                            <div class="btn-group">
                                <button class="btn btn-warning">Warning</button>
                                <button class="btn btn-default">Do not connect 5 volt power to serial connection (3.3 volt only)</button>
                            </div>
                        </center>
                    </div>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" style="display:none;" id="parameters"></table>
                </div>
                <div class="col-lg-1"></div>
            </div>
        </div>
        <a class="safety" data-fancybox data-src="#warning" href="javascript:;" style="display: none;"></a>
        <div id="warning" style="display:none;width:640px;border-radius:5px">
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
                            <center><button type="button" class="btn btn-danger" onClick="$.fancybox.close();setCookie('safety', 1, 360);"><i class="glyphicon glyphicon-cog"></i> I Agree</button></center>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>