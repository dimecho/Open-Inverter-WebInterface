<!DOCTYPE html>
<html>
    <head>
        <?php
            include "header.php";
        ?>
        <script type="text/javascript" src="/js/db.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr align="center">
                            <td>
                                <h2>Motor Configuraton Database</h2>
                                <br/>
                                <div class="input-group">
                                    <span class = "input-group-addon">
                                        <select class="form-control" onchange="setMotorImage()" id="motor" style="width:80%;" ></select>
                                    </span>
                                    <span class = "input-group-addon">
                                        <button class="browse btn btn-primary" type="button"><i class="icon-list-alt"></i> Select Motor</button>
                                    </span>
                                </div>
                                <br/><br/>
                                <table>
                                    <tr>
                                        <td>
                                            <img src="" id="motorimage" class="rounded pull-left" style="width:80%">
                                        </td>
                                        <td>
                                            <div class="input-group align-text-top">
                                                <span class="input-group-addon" style="width:90%">
                                                    <ul class="text-left" id="motorinfo"></ul>
                                                </span>
                                                <span class="input-group-addon" id="motortune"></span>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>