<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="js/components.js"></script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/>
            <div class="row">
                <div class="span1"></div>
                <div class="span10" id="components"></div>
                <div class="span1"></div>
            </div>
            <br/><br/><br/><br/><br/><br/>
            <!-- PDF -->
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" >
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <br/>
                        </div>
                        <div class="modal-body">
                            <iframe src="" width="100%" height="100%" frameborder="0" id="componentPDF"></iframe>
                            <!--<object type="application/pdf" data="bom/capacitor_tags.pdf" width="100%" height="100%">Not Working</object>-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>