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
                <div class="col-lg-10">
                        <table class="table table-active table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <button type="button" class="btn btn-primary" onClick="setCANDefaults()"><i class="glyphicon glyphicon-erase"></i> Reset CAN Mapping</button>
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-active table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <!--
                                        can c
                                        can id 0 4 test
                                        
                                        Can::AddSend(paramIdx, values[0], values[1], values[2], values[3]);
                                        
                                        printf("Invalid CAN Id %x\r\n", values[0]);
                                        printf("Invalid Offset %d\r\n", values[1]);
                                        printf("Invalid length %d\r\n", values[2]);
                                    -->
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