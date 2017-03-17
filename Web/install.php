<?php

    include_once("common.php");

    detectOS();

    if(!isset($_GET["url"]) && isset($_GET["app"]))
    {
        set_time_limit(10000);
        
        exec(runCommand($_GET["app"]), $output, $return);
        
        //echo "$command\n";
        
        foreach ($output as $line) {
            echo "$line\n";
        }
    }
    else if(isset($_GET["remove"]))
    {
        $id = $GLOBALS["Software"]["arm"];
        $path = $id['path'][$GLOBALS['OS']];

        checkARMCompiler($path,true);
        //checkAVRCompiler($path,true);

        echo "done";
    }

    function checkSoftware($app,$quite)
    {
        $id = $GLOBALS["Software"][$app];
        $path = $id['path'][$GLOBALS['OS']];
        
        if($app == "arm")
        {
            checkARMCompiler($path,false);

        }else  if($app == "inkscape") {

            if ($GLOBALS["OS"] === "mac") {
                if(!is_file($GLOBALS["X11"]))
                {
                    echo "confirmDownload('xquartz')";
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

    function checkARMCompiler($path,$remove)
    {
        if(is_file($path))
        {
            if($remove)
            {
                removeDirectory($path);
            }else{
                if(checkSoftware("gcc",true))
                {
                    if(checkSoftware("python",true))
                    {
                        if(checkSoftware("source",true))
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

    function removeDirectory($path) {
        $files = glob($path . '/*');
        foreach ($files as $file) {
            is_dir($file) ? removeDirectory($file) : unlink($file);
        }
        rmdir($path);
        return;
    }
?>