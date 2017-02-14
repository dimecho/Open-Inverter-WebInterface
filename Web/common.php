<?php
    $GLOBALS["OS"] = "Linux";
    $GLOBALS["X11"] = "/Applications/Utilities/XQuartz.app/Contents/MacOS/X11";
    
    function detectOS()
    {
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
            $GLOBALS["OS"] = "Mac";
        }elseif (strpos($_SERVER["HTTP_USER_AGENT"], "Windows") !== false) {
            $GLOBALS["OS"] = "Windows";
        }
    }

    function commandOSCorrection($command)
    {
        $split = explode(" ",$command);

        if(!empty($split)){

            if ($GLOBALS["OS"] === "Mac") {
                $command = $split[0]. "\"";
            }else if ($GLOBALS["OS"] === "Windows") {
                $command = $split[0]. ".ps1\" -Arguments";
            }else if ($GLOBALS["OS"] === "Linux") {
                $command = $split[0].".sh";
            }
            
            unset($split[0]);

            foreach ($split as $key){
                if ($GLOBALS["OS"] === "Mac" || $GLOBALS["OS"] === "Windows") {
                    $command .= " \"" .$key. "\""; //wrap individual arguments
                }else {
                    $command .= " " .$key; //no wrap
                }
            }
            if ($GLOBALS["OS"] === "Linux")
                $command .= "\""; //close quote
        }else{
            $command .= "\"";
        }

        return $command;
    }

    function runCommand($command)
    {
        $command = commandOSCorrection($command);

        if ($GLOBALS["OS"] === "Mac") {
            return "\"" .$_SERVER["DOCUMENT_ROOT"]. "/../" .$command. " 2>&1 &";
        }else if ($GLOBALS["OS"] === "Windows") {
            return "powershell.exe -ExecutionPolicy Bypass -File \"" .$_SERVER["DOCUMENT_ROOT"] . "\\..\\Windows\\" .$command. " 2>&1";
        }else if ($GLOBALS["OS"] === "Linux") {
            if(is_file("/usr/bin/gnome-terminal")){
                //More transparent of what's going on
                return "gnome-terminal -e 'bash -c \"" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" .$command. ";bash' 2>&1";
            }else{
                //Process behind the scenes
                return "\"" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" .$command. " 2>&1";
            }
        }
        return "echo";
    }
?>