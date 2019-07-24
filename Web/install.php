<?php
    
    set_time_limit(10000);

    include_once("common.php");
    
    $os = detectOS();
    $software = getSoftware();

    if(!isset($_GET["url"]) && isset($_GET["app"]))
    {
        exec(runCommand($_GET["app"],"",$os,0), $output, $return);
        
        //echo "$command\n";
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }
    else if(isset($_GET["remove"]))
    {
        exec(runCommand($_GET["remove"],"uninstall",$os,0));
        echo $_GET["remove"];
    }
    else if(isset($_GET["check"]))
    {
        checkSoftware($software,$os,$_GET["check"],false);
    }

    function confirmDownload($software,$os,$app)
    {
        $crc = $software[$app]["checksum"][$os];

        if($crc !== "")
        {
            echo "confirmDownload('" . $app. "','" .$crc. "')";
        }else{
            echo "confirmDownload('" . $app. "')";
        }
    }

    function checkSoftware($software,$os,$app,$quite)
    {
        $path = $software[$app]["path"][$os];
        $args = "";
		
		if ($os === "windows") {
			$path = str_replace("~",getenv("USERPROFILE"),$path);
        }else if ($os === "mac" || $os === "linux") {
            $path = str_replace("~",getenv("HOME"),$path);
        }
		
        if($app == "arm"){
            checkARMCompiler($software,$os,$path,false);
			return false;
        }else if($app == "inkscape") {
            if ($os === "mac") {
                if(!is_file($software["xquartz"]["path"]["mac"]))
                {
                    confirmDownload($software,$os,"xquartz");
                    return false;
                }
            }
		}else if($app == "eagle") {
			if ($os === "windows") {
                if(!is_file($software["designsparkpcb"]["path"]["windows"])){
                    confirmDownload($software,$os,"designsparkpcb");
                    return false;
                }
            }
        }

		if(is_file($path)) {
            if($_GET["args"])
                $args = $_GET["args"];
            if(!$quite)
                echo "openExternalApp('" .$app. "','" . $args . "')";
            return true;
        }else{
            if(!$quite)
                confirmDownload($software,$os,$app);
			return false;
        }
    }

    function checkARMCompiler($software,$os,$path,$remove)
    {
        if(is_file($path))
        {
            if($remove)
            {
                removeDirectory($path);
            }else{
                if(checkSoftware($software,$os,"gcc",true))
                {
                    if(checkSoftware($software,$os,"python",true))
                    {
                        if(checkSoftware($software,$os,"source",true))
                        {
                            echo "openExternalApp('source')";
                        }else{
                            confirmDownload($software,$os,"source");
                        }
                    }else{
                        confirmDownload($software,$os,"python");
                    }
                }else{
                    confirmDownload($software,$os,"gcc");
                }
            }
        }else{
            confirmDownload($software,$os,"arm");
        }
    }
?>