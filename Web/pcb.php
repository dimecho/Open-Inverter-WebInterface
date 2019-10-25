<?php

function findImage($dir, $find)
{
    foreach (glob("$dir/bom/img/*.jpg") as $filename) {
        if (strpos($filename, $find) !== false) {
            echo $filename;
            exit;
        }
    }
}

if(isset($_GET["find"])) {

    $path = 'pcb/';
    $find = $_GET["find"]. ".jpg";

    if($_GET["smd"] == 1) {
        findImage($path. "Hardware v3.0", $find);
    }else{
        foreach(glob($path. '*', GLOB_ONLYDIR) as $dirname) {
            findImage($dirname, $find);
        }
    }
}else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php"; ?>
        <script src="js/pcb.js"></script>
        <script>
        $(document).ready(function () {
            <?php
            if(isset($_GET["hardware"])){
                echo "loadComponents('" . $_GET["hardware"] . "');";
            }else{
                echo "loadList();";
            }
            ?>
        });
        </script>
        <style>
        .tooltip {
          opacity: 1 !important;
        }
        .tooltip > .tooltip-inner {
          border: 1px solid;
          padding: 10px;
          max-width: 450px;
          color: black;
          text-align: left;
          background: #fff;
          opacity: 1.0;
          filter: alpha(opacity=100);
        }
        .tooltip > .tooltip-arrow { border-bottom-color:black; }
        </style>
    </head>
    <body>
    	<?php include "menu.php" ?>
        <div class="container">
             <div class="row">
                <div class="col">
                    <div class="container bg-light" id="pcbList" style="display:none">
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col">
                                <div class="card" id="h1">
                                    <a href="">
                                        <img class="card-img-top" src="" alt="">
                                    </a>
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                  </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" id="h1d">
                                    <a href="">
                                        <img class="card-img-top" src="" alt="">
                                    </a>
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col">
                                <div class="card" id="h2">
                                    <a href="">
                                        <img class="card-img-top" src="" alt="">
                                    </a>
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                  </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card" id="h3">
                                    <a href="">
                                        <img class="card-img-top" src="" alt="">
                                    </a>
                                    <div class="card-body">
                                    <h5 class="card-title text-center"></h5>
                                    <p class="card-text"></p>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container bg-light" id="pcbComponents" style="display:none">
                        <div class="row"><hr></div>
                        <div class="row">
                            <div class="col" id="pcbComponentsTable">
                            </div>
                        </div>
                    </div>
                    <br>
                </div>
            </div>
        </div>
    </body>
</html>
<?php
}
?>