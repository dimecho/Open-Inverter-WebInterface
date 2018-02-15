<?php
    
    set_time_limit(10000);

    include("common.php");
    
    $os = detectOS();
    $software = getSoftware();

    if(!isset($_GET["url"]) && isset($_GET["app"]))
    {
        exec(runCommand($_GET["app"],""), $output, $return);
        
        //echo "$command\n";
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }
    else if(isset($_GET["remove"]))
    {
        exec(runCommand($_GET["remove"],"uninstall"));
        
        //echo runCommand($_GET["remove"],"uninstall");
        echo $_GET["remove"];
    }
    else if(isset($_GET["check"]))
    {
        checkSoftware($software,$os,$_GET["check"],false);
    }

    function checkSoftware($software,$os,$app,$quite)
    {
        $path = $software[$app]["path"][$os];
        
        if($app == "arm"){
            checkARMCompiler($software,$os,$path,false);
			return false;
        }else if($app == "inkscape") {
            if ($os === "mac") {
                if(!is_file($software["xquartz"]["path"]["mac"]))
                {
                    echo "confirmDownload('xquartz')";
                    return false;
                }
            }
		}else if($app == "eagle") {
			if ($os === "windows") {
                if(!is_file($software["designsparkpcb"]["path"]["windows"])){
                    echo "confirmDownload('designsparkpcb')";
                    return false;
                }
            }
        }

		if(is_file($path)) {
            if(!$quite)
                echo "openExternalApp('" .$app. "')";
            return true;
        }else{
            if(!$quite)
                echo "confirmDownload('" .$app. "')";
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
                            echo "confirmDownload('source')";
                        }
                    }else{
                        echo "confirmDownload('python')";
                    }
                }else{
                    echo "confirmDownload('gcc')";
                }
            }
        }else{
            echo "confirmDownload('arm')";
        }
    }
?>