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
        return "'" .$_SERVER["DOCUMENT_ROOT"]. "/../" . $command ."'";
    }else if ($os === "Windows") {
        //return"cmd.exe /c \"" .$_SERVER["DOCUMENT_ROOT"]. "\\..\\Windows\\" . $command . ".bat\"";
        return "powershell.exe -ExecutionPolicy Bypass -File \"" .$_SERVER["DOCUMENT_ROOT"]. "\\..\\Windows\\" . $command . ".ps1\"";
    }else if ($os === "Linux") {
        return "'" .$_SERVER["DOCUMENT_ROOT"]. "/../Linux/" . $command . ".sh'";
    }
    return "echo";
}
?>