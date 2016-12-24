<?php
    global $os;

    function detectOS()
    {
        global $os;

        $os = "Uknown";
        if (strpos($_SERVER["HTTP_USER_AGENT"], "Macintosh") !== false) {
            $os = "Mac";
        }elseif (strpos($_SERVER["HTTP_USER_AGENT"], "Windows") !== false) {
            $os = "Windows";
        }else{
            $os = "Linux";
        }
    }

    function commandOSCorrection($command)
    {
        global $os;
        $split = explode(" ",$command);

        if(!empty($split)){

            if ($os === "Mac") {
                $command = $split[0]. "\"";
            }else if ($os === "Windows") {
                $command = $split[0]. ".ps1\" -Arguments";
            }else if ($os === "Linux") {
                $command = $split[0].".sh";
            }
            
            unset($split[0]);

            foreach ($split as $key){
                if ($os === "Mac" || $os === "Windows") {
                    $command .= " \"" .$key. "\""; //wrap individual arguments
                }else {
                    $command .= " " .$key; //no wrap
                }
            }
            if ($os === "Linux")
                $command .= "\""; //close quote
        }else{
            $command .= "\"";
        }

        return $command;
    }

    function runCommand($command)
    {
        global $os;
        $command = commandOSCorrection($command);

        if ($os === "Mac") {
            return "\"" .$_SERVER["DOCUMENT_ROOT"]. "/../" .$command. " 2>&1";
        }else if ($os === "Windows") {
            return "powershell.exe -ExecutionPolicy Bypass -File \"" .$_SERVER["DOCUMENT_ROOT"] . "\\..\\Windows\\" .$command. " 2>&1";
        }else if ($os === "Linux") {
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