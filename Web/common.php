<?php
    
    function detectOS()
    {
        $uname = strtolower(php_uname('s'));
        $os = "linux";

        if (strpos($uname, "darwin") !== false) {
            $os = "mac";
        }else if (strpos($uname, "win") !== false) {
            $os = "windows";
        }

        return $os;
    }

    function detectClientOS()
    {
        $uname = strtolower($_SERVER['HTTP_USER_AGENT']);
        $os = "linux";

        if (strpos($uname, "mac") !== false) {
            $os = "mac";
        }else if (strpos($uname, "win") !== false) {
            $os = "windows";
        }else if (strpos($uname, "iphone") !== false || strpos($uname, "ipad") !== false || strpos($uname, "android") !== false) {
            $os = "mobile";
        }

        return $os;
    }

    function getSoftware()
    {
        $data = file_get_contents($_SERVER["DOCUMENT_ROOT"] .  "/js/software.json");
        $json = json_decode($data, true);
        $json["gcc"]["download"]["version"] = (PHP_OS === 'WINNT' ? "4.7.1" : shell_exec("gcc -dumpversion"));
        $json["python"]["download"]["version"] = (PHP_OS === 'WINNT' ? "3.6.2" : shell_exec("python -c 'import sys; print(\".\".join(map(str, sys.version_info[:3])))'"));
        $json["php"]["download"]["version"] = (PHP_OS === 'WINNT' ? "5.6" : phpversion());
        
        return $json;
    }

    function commandOSCorrection($command,$args,$os)
    {
        if ($os === "windows") {
            $command = $command. ".ps1";
            //if(!empty($args))
            //   $command .= "\" -Arguments";
        }else if ($os === "linux") {
            $command = $command.".sh";
        }

        if(!empty($args)){

            if ($os === "mac" || $os === "windows") {
                
                $command = $command. "\"";
                $split = explode(" ",$args);
                foreach ($split as $key){
                    $command .= " \"" .$key. "\""; //wrap individual arguments
                }
            }else{
                $command .= " " .$args. "\""; //no wrap
            }
        }else{
            $command .= "\""; //close quote
        }

        return $command;
    }

    function runCommand($command,$args,$os)
    {
        $command = commandOSCorrection($command,$args,$os);
		
        if ($os === "mac") {
            return "\"" .$_SERVER["DOCUMENT_ROOT"]. "/../" .$command. " 2>&1 &";
        }else if ($os === "windows") {
            return "powershell.exe -ExecutionPolicy Bypass -File \"" .$_SERVER["DOCUMENT_ROOT"] . "\\..\\Windows\\" .$command. " 2>&1";
        }else if ($GLOBALS["OS"] === "linux") {
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