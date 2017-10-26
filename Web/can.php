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
                        <tr>
                            <td>
                                <h2>Limits</h2>
                                <div class="input-group" width="80%">
                                    <span class="input-group-addon">
                                        <ul class="text-left">
                                            <li>A maximum of 8 messages can be defined</li>
                                            <li>Per message a maximum of 8 values can be mapped</li>
                                            <li>A value can not span across the 32-bit boundary, it must be fully contained in the first<br/> or second 32 bits of the message. E.g. "can tx udc 123 16 32 10" is not allowed</li>
                                            <li>A value can span maximum 32 bits</li>
                                            <li><a href="http://johanneshuebner.com/quickcms/index.html%3Fen_can-communication,31.html" target="_blank">More Info</a></li>
                                        </ul>
                                    </span>
                                </div>
                                <span class="badge badge-lg badge-warning ">CAN bus speed is fixed to 250kbps</span><br/>
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
                    <table class="table table-active bg-light table-bordered table-striped table-hover" style="display:none;" id="parameters"></table>
                </div>
                <div class="col-lg-1"></div>
            </div>
        </div>
    </body>
</html>