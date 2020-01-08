<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
        <script src="js/ion.rangeSlider.js"></script>
        <script src="js/3d/three.js"></script>
        <script src="js/3d/GLTFLoader.js"></script>
        <script src="js/3d/DRACOLoader.js"></script>
        <script src="js/3d/OrbitControls.js"></script>
        <script src="js/3d/Projector.js"></script>
        
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
                                giveCredit("js/3d/models/<?php echo $_GET['id'] ?>.txt");
                            });
                        </script>
                        <input id="explode" type="text" data-provide="slider" />
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
    <script src="js/design.js"></script>
</html>