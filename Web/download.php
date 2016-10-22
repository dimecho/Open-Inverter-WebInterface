<?php
    session_start();

    if(isset($_GET["url"])){

        $source = $_GET["url"];

        if (strpos($_SERVER['HTTP_USER_AGENT'], 'Windows') !== false) {
            $destination = getenv("USERPROFILE"). "\\Downloads\\";
        }else{
            $destination = getenv("HOME"). "/Downloads/";
        }
        $destination = $destination . basename($_GET["url"]);
    }
    
    if(isset($_GET["app"])){
        $app = $_GET["app"];
    }

    if(isset($_GET["pause"])){

        echo $_GET["pause"];
        $_SESSION["pause"] = $_GET["pause"];
    
    }else if(isset($_GET["download"])){

        set_time_limit(10000);

        $_SESSION["pause"] = "";

        ob_flush();
        flush();

        $curl = curl_init();
        
        curl_setopt($curl, CURLOPT_URL, $_GET["url"]);
        if (file_exists($destination)) {
            $from = filesize($destination);
            curl_setopt($curl, CURLOPT_RANGE, $from . "-");
            curl_setopt($curl, CURLOPT_RESUME_FROM, $from);
            $handle = fopen($destination, 'a+');
        }else{
            $handle = fopen($destination, 'w+');
        }
        if (!$handle) {
            exit;
        }
        //curl_setopt($curl, CURLOPT_TIMEOUT, 300);
        curl_setopt($curl, CURLOPT_BINARYTRANSFER, true);
        curl_setopt($curl, CURLOPT_FILE, $handle); // Set the output file for the curl request
        //curl_setopt($curl, CURLOPT_HEADER, false);
        //curl_setopt($curl, CURLOPT_WRITEHEADER, '/dev/null');
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true); // Follow http redirections
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); // Verify SSL certificate of the remote server
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 30); // Wait 30s maximum while trying to connect to the remote server
        curl_setopt($curl, CURLOPT_MAXREDIRS, 5); // Following a maximum of 2 redirections
        curl_setopt($curl, CURLOPT_PROTOCOLS, CURLPROTO_HTTP | CURLPROTO_HTTPS | CURLPROTO_FTP | CURLPROTO_FTPS); // Only allow http(s) and ftp(s) protocol for connection to the remote server
        curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // Define the UserAgent to be used for requests to the remote server.
        //curl_setopt($curl, CURLOPT_REFERER, $_GET["url"]); // Define the Referer to be used for requests to the remote server.
        
        function callback($resource,$download_size, $downloaded, $upload_size, $uploaded)
        {
            if($download_size > 0)
                echo "," .round($downloaded / $download_size  * 100);
            //ob_flush();
            //flush();
            while($_SESSION["pause"] == "pause")
            {
                sleep(1);
            }
        }
        curl_setopt($curl, CURLOPT_BUFFERSIZE, 1024*8);
        curl_setopt($curl, CURLOPT_NOPROGRESS, false);
        curl_setopt($curl, CURLOPT_PROGRESSFUNCTION, 'callback' );

        //$data = curl_exec($curl);
        //$error = curl_error($curl);
        curl_exec($curl);
        curl_close($curl);
        fclose($handle);

        ob_flush();
        flush();

        //echo $error;
        
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php" ?>
        <script>
            var pause = false;
            $(document).on('click', '.pause', function(){
                $.ajax("download.php?pause=" + this.textContent.toLowerCase(),{
                    //async: false,
                    success: function(data)
                    {
                        console.log(data);
                        if(data == "Pause")
                        {
                            this.textContent = "Resume";
                        }else{
                            this.textContent = "Pause";
                        }
                    },
                    error: function(xhr, textStatus, errorThrown){
                    }
                });
                
            });
            $(document).ready(function() { download(<?php echo "\"$source\",\"$app\""; ?>); });
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