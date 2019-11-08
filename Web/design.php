<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/bootstrap-slider.css" />
        <script src="js/bootstrap-slider.js"></script>
        <script src="js/three.js"></script>
        <script src="js/OrbitControls.js"></script>
        <script src="js/Projector.js"></script>
        <script src="js/design.js"></script>
		<style>
			canvas { width: 100%; height: 100% }
		</style>
    </head>
    <body>
        <div class="navbar navbar-expand-lg fixed-top navbar-light bg-light" id="mainMenu"></div>
        <div class="row mt-5"></div>
        <div class="row mt-5"></div>
        <div class="container">
            <div class="row">
                <div class="col" align="center">
                    <?php if(isset($_GET["id"])){ ?>
                        <script>
                            $(document).ready(function() {
                                initialize3D("<?php echo $_GET['id'] ?>");
                                giveCredit("/3d/<?php echo $_GET['id'] ?>.txt");
                            });
                        </script>
                        <input id="explode" type="hidden" data-slider-orientation="horizontal" data-slider-tooltip="hide" />
                        <br><br>
                        <canvas id="canvas"></canvas>
                    <?php }else{ ?>
                    <div class="text-dark"><h1>Power Stage - Design Ideas</h1></div>
                    <br>
                        <script>
                            $(document).ready(function() {
                                fill3DTable()
                            });
                        </script>
                        <table class="table table-active table-bordered" id="ideaTable"></table>
                    <?php } ?>
                </div>
            </div>
        </div>
    </body>
</html>