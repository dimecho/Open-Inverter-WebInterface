<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="/js/switch-check.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
             <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <span class="glyphicon glyphicon-triangle-right"></span> Check switches by flipping one at a time.
                            </td>
                        </tr>
                    </table>

                    <table class="table table-active bg-light table-bordered" width="100%">
                        <tr align="center">
                            <td>Protection</td>
                            <td>Emergency</td>
                            <td>Brake</td>
                            <td>Start</td>
                            <td>Forward</td>
                            <td>Reverse</td>
                            <td>Cruise</td>
                        </tr>
                        <tr align="center">
                            <td>
                                <div class="circle-red" id="din_mprot"></div>
                            </td>
                            <td>
                                <div class="circle-red" id ="din_emcystop"></div>
                            </td>
                            <td>
                                <div class="circle-red" id ="din_brake"></div>
                            </td>
                            <td>
                                <div class="circle-red" id ="din_start"></div>
                            </td>
                            <td>
                                <div class="circle-red" id ="din_forward"></div>
                            </td>
                            <td>
                                <div class="circle-red" id ="din_reverse"></div>
                            </td>
                            <td>
                                <div class="circle-red" id ="din_cruise"></div>
                            </td>
                        </tr>
                        <tr align="center">
                            <td colspan="7">
                                Potentiometer
                                <br/><br/>
                                <input class="pot" value=0 />
                                <br/><br/>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>