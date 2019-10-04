<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/index.js"></script>
    </head>
    <body>
        <div class="container">
		<?php include "menu.php" ?>
            <div class="row">
                <div class="col" align="center">
                    <hr>
                    <div class="loader hidden"></div>
                    <i class="icons icon-com display-2 hidden" id="com"></i>
                    <div class="container table-active table-bordered hidden" id="saveload">
                        <div class="row p-2">
                            <div class="col">
                                <button type="button" class="btn btn-primary" onclick="downloadSnapshot()"><i class="icons icon-down"></i> Save to File</button>
                            </div>
                            <div class="col">
                                <button type="button" class="btn btn-success" onclick="uploadSnapshot()"><i class="icons icon-up"></i> Load from File</button>
                            </div>
                        </div>
                    </div>
                    <a class="calculator" data-fancybox data-src="#calculator" href="javascript:;"></a>
                    <div class="hidden" id="calculator" style="width:60%;border-radius:5px">
                    </div>
                    <hr>
                    <table class="table table-active table-bordered bg-light table-striped table-hover" id="parameters"></table>
                </div>
            </div>
        </div>
    </body>
</html>