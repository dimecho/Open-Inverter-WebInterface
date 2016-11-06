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

    function runCommand($command)
    {
        global $os;
        if ($os === "Mac") {
            return "'" .$_SERVER["DOCUMENT_ROOT"]. "/../" . $command ."' 2>&1";
        }else if ($os === "Windows") {
            return "powershell.exe -ExecutionPolicy Bypass -File \"" .$_SERVER["DOCUMENT_ROOT"]. "\\..\\Windows\\" . $command . ".ps1\" 2>&1";
        }else if ($os === "Linux") {
            if(is_file("/usr/bin/gnome-terminal")){
                //More transparent of what's going on
                return "gnome-terminal -e \"bash -c \"'" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" . $command . ".sh'\";read\" 2>&1";
            }else{
                //Process behind the scenes
                return "'" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" . $command . ".sh' 2>&1";
            }
        }
        return "echo";
    }
?>