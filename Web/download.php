<?php
    session_start();

    include_once("common.php");
    
    detectOS();

    if(isset($_GET["start"]) || isset($_GET["download"])){

        $id = $GLOBALS["Software"][$_GET["start"]];
        if($id == "")
            $id = $GLOBALS["Software"][$_GET["download"]];

        if($id['download']['all']){
            $source = $id['download']['all'];
        }else{
            $source = $id['download'][$GLOBALS['OS']];
        }
        
        if ($GLOBALS["OS"] === "mac") {
            $destination = getenv("HOME"). "/Downloads/";
        }else if ($GLOBALS["OS"]=== "windows") {
            $destination = getenv("USERPROFILE"). "\\Downloads\\";
        }else if ($GLOBALS["OS"] === "linux") {
            $destination = getenv("HOME"). "/Downloads/";
        }

        $filename = basename($source);
            
        $destination = $destination . $filename;
    }

    if(isset($_GET["software"])){

        $array = array (
            'title' => "",
            'download' => "",
            'path' => "",
            'size' => 0,
            'version' => ""
        );
        
        $id = $GLOBALS["Software"][$_GET["software"]];

        $array['title'] = $id['title'];
        if($id['download']['all']){
            $array['download'] = $id['download']['all'];
        }else{
            $array['download'] = $id['download'][$GLOBALS['OS']];
        }
        $array['path'] = $id['path'][$GLOBALS['OS']];
        $array['size'] = $id['download']['size'];
        $array['version'] = $id['download']['version'];

        echo json_encode($array);
        
    }else if(isset($_GET["pause"])){

        echo $_GET["pause"];
        $_SESSION["pause"] = $_GET["pause"];

    }else if(isset($_GET["download"])){

        if($source != "") //Linux scripts without download
        {
            set_time_limit(10000);
            $_SESSION["pause"] = "";
            /*
            $source = file_get_contents($_GET["url"]);
            if (empty($source)) {
              die('No Content Received');
            }
            if (!is_dir($destination)){
               echo $error;
            }
            if (file_put_contents($destination . $filename , $source)) {
               echo ",100";
            }
            */
            
            ob_flush();
            flush();

            $curl = curl_init();
            
            curl_setopt($curl, CURLOPT_URL, $source);
            if (file_exists($destination)) {
                $from = filesize($destination);
                //curl_setopt($curl, CURLOPT_RANGE, $from . "-");
                curl_setopt($curl, CURLOPT_RESUME_FROM, $from);
                $handle = fopen($destination, 'a+');
            }else{
                $handle = fopen($destination, 'w+');
            }
            if (!$handle) {
                exit;
            }

            $callback = function($resource,$download_size, $downloaded, $upload_size, $uploaded)
            {
                if($download_size > 0)
                    echo "," .round($downloaded / $download_size  * 100);

                ob_flush();
                flush();

                while($_SESSION["pause"] == "pause")
                {
                    sleep(1);
                }
            };
            /*
            $abort = function()
            {
                echo "error";
            };
            */
            //curl_setopt($curl, CURLOPT_TIMEOUT, 300);
            curl_setopt($curl, CURLOPT_BINARYTRANSFER, true);
            curl_setopt($curl, CURLOPT_FILE, $handle); // Set the output file for the curl request
            curl_setopt($curl, CURLOPT_HEADER, false);
            //curl_setopt($curl, CURLOPT_WRITEHEADER, '/dev/null');
            curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true); // Follow http redirections
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // Verify SSL certificate of the remote server
            curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30); // Wait 30s maximum while trying to connect to the remote server
            curl_setopt($curl, CURLOPT_MAXREDIRS, 4); // Following a maximum of 4 redirections
            curl_setopt($curl, CURLOPT_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS | CURLPROTO_FTP | CURLPROTO_FTPS); // Only allow http(s) and ftp(s) protocol for connection to the remote server
            curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // Define the UserAgent to be used for requests to the remote server.
            curl_setopt($curl, CURLOPT_REFERER, dirname($source)); // Define the Referer to be used for requests to the remote server.
            curl_setopt($curl, CURLOPT_BUFFERSIZE, 1024);

            curl_setopt($curl, CURLOPT_NOPROGRESS, false);
            curl_setopt($curl, CURLOPT_PROGRESSFUNCTION, $callback);
            //curl_setopt($curl, CURLOPT_READFUNCTION, $abort); // check if user request abort


            //$data = curl_exec($curl);
            $error = curl_error($curl);
            curl_exec($curl);
            curl_close($curl);
            fclose($handle);

            ob_flush();
            flush();
            
            echo $error;
        }

    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            $(document).ready(function() {
                download(<?php echo "\"".$_GET["start"]."\""; ?>);
            });
        </script>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php" ?>
            <br/><br/>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <center>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <td>
                                        <span>
                                        <?php echo $source; ?>
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="input-group">
                                            <span class = "input-group-addon" style="width:90%">
                                                <div class="progress progress-striped active">
                                                  <div class="progress-bar" style="width:1%" id="progressBar"></div>
                                                </div>
                                            </span>
                                            <span class = "input-group-addon">
                                                <button class="pause btn btn-primary" type="button">Pause</button>
                                            </span>
                                        </div>
                                        <div id="output" style="display:none"></div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span><?php echo $destination; ?></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </center>
                </div>
                <div class="col-md-1"></div>
            </div>
        </div>
    </body>
</html>
<?php } ?>