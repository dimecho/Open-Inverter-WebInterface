<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="js/switch-check.js"></script>
        <style>
            table { table-layout: fixed; }
            td { width: 10%; }
        </style>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
             <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span class="glyphicon glyphicon-triangle-right"></span> Check switches by flipping one at a time.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered" width="100%">
                        <tbody>
                            <tr>
                                <td>
                                    <center>
                                        Protection
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        Emergency
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        Brake
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        Start
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        Forward
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        Reverse
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        Cruise
                                    </center>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <center>
                                        <div class="circle-red" id="din_mprot"></div>
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <div class="circle-red" id ="din_emcystop"></div>
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <div class="circle-red" id ="din_brake"></div>
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <div class="circle-red" id ="din_start"></div>
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <div class="circle-red" id ="din_forward"></div>
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <div class="circle-red" id ="din_reverse"></div>
                                    </center>
                                </td>
                                <td>
                                    <center>
                                        <div class="circle-red" id ="din_cruise"></div>
                                    </center>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>