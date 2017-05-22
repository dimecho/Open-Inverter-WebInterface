<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script type="text/javascript" src="js/uninstall.js"></script>
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
                                    <span class="glyphicon glyphicon-trash"></span> Remove Software installed by Huebner Inverter.
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table table-bordered" width="100%">
                        <tbody>
                        <?php
                            include_once("common.php");
                            detectOS();

                            $found = false;
                            foreach($GLOBALS["Software"] as $id => $item)
                            {
                                if(is_file($item["path"][$GLOBALS["OS"]])) //Filter only installed software
                                {
                                    $disabled = "";
                                    $builtin = "";

                                    if($GLOBALS["OS"] == "mac" && strpos($item["path"]["mac"], "/usr/bin") !== false) //Cannot remove OSX built-in
                                    {
                                        $disabled = "disabled='disabled'";
                                        $builtin = "<span style='color:red;'> (built-in)</span>";
                                    }

                                    if($found == false)
                                    {
                                        $found = true;
                                        echo "<tr><td><input type='checkbox' onclick='UninstallEverything();' class='everything' /> <span><b>Everything</b></span></td></tr>";
                                    }

                                    echo "<tr><td><input id='" .$id. "' type='checkbox' " . $disabled. " /> <span>" .$item["title"]. " " .$item["download"]["version"]. "</span>" .$builtin." <img src='img/loading.gif' id='" .$id. "_progress' style='display:none;'></td></tr>";
                                }
                            }
                        ?>
                        </tbody>
                    </table>
                    <button class="browse btn btn-primary" type="button" onclick="Uninstall();"><i class="glyphicon glyphicon-trash"></i> Uninstall</button>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>