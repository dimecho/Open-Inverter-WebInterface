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
                <div class="col-lg-1"></div>
                <div class="col-lg-10">
                    <table class="table table-active bg-light table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <center>
                                        <h2>Motor Configuraton Database</h2>
                                        <br/>
                                        <div class="input-group" style="width:60%">
                                            <span class = "input-group-addon" style="width:90%">
                                                <select class="form-control" onchange="setMotorImage()" id="motor" style="width:100%;" size="1"></select>
                                            </span>
                                            <span class = "input-group-addon">
                                                <button class="browse btn btn-primary" type="button"><i class="icon-list-alt"></i> Select Motor</button>
                                            </span>
                                        </div>
                                        <br/><br/>
                                        <div class="container">
                                            <div class="row">
                                                <div class="col-lg-4">
                                                    <img src="" id="motorimage" class="rounded float-left" width="100%">
                                                </div>
                                                <div class="col-lg-8">
                                                    <div class="input-group align-text-top">
                                                        <span class="input-group-addon" style="width:100%">
                                                            <ul class="text-left" id="motorinfo"></ul>
                                                        </span>
                                                        <span class="input-group-addon" style="width:100%" id="motortune"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-lg-1"></div>
            </div>
        </div>
    </body>
</html>