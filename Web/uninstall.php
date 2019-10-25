<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script src="js/uninstall.js"></script>
    </head>
    <body>
        <?php include "menu.php" ?>
        <div class="container">
             <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr>
                            <td>
                                <span class="icons icon-trash"></span> Remove Software installed by Huebner Inverter.
                            </td>
                        </tr>
                    </table>
                    <table class="table table-active bg-light table-bordered table-striped table-hover" width="100%">
                        <?php
                            $os = detectOS();
                            $software = getSoftware();
                            $found = false;

                            foreach($software as $id => $item)
                            {
								if(isset($item["path"][$os]))
								{
									if(is_file(checkHomePath($item["path"][$os],$os))) //Filter only installed software
									{
										$disabled = "";
										$builtin = "";

										if($os == "mac" && strpos($item["path"]["mac"], "/usr/bin") !== false) //Cannot remove OSX built-in
										{
											$disabled = "disabled='disabled'";
											$builtin = "<span style='color:red;'> (built-in)</span>";
										}

										if($found == false)
										{
											$found = true;
											echo "<tr><td><input type='checkbox' onclick='UninstallEverything();' class='everything' /> <span><b>Everything</b></span></td></tr>";
										}

										echo "<tr><td><input id='" .$id. "' type='checkbox' " . $disabled. " /> <span>" .$item["title"]. " " .$item["download"]["version"]. "</span>" .$builtin." <img src='/img/loading.gif' id='" .$id. "_progress' style='display:none;'></td></tr>";
									}
								}
                            }
                        ?>
                    </table>
                    <button class="browse btn btn-primary" type="button" onclick="Uninstall();"><i class="icons icon-trash"></i> Uninstall</button>
                </div>
            </div>
        </div>
        <br>
    </body>
</html>