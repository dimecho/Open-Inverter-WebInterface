<?php

    set_time_limit(30);

    function serialDevice()
    {
        $com = "/dev/cu.usbserial";
        $uname = strtolower(php_uname('s'));

        if(!isset($_SESSION["serial"])) {

            if (strpos($uname, "win") !== false) {
                exec("mode " .$com. ": BAUD=115200 PARITY=n DATA=8 STOP=2 to=on xon=off octs=off rts=on");

            }else if (strpos($uname, "darwin") !== false) {
                //exec("screen " .$com. " 115200 &");
                //stty -f $serial 115200 parodd cs8 cstopb -crtscts -echo & cat $serial &
                //stty -f $serial 115200 & screen $serial 115200 &

            }else{
                #Raspberry Pi Fix
                if (strpos(php_uname('m'), "arm") !== false) {
                    exec("minicom -b 115200 -o -D " .$com. " &");
                    exec("killall minicom");
                }
                
                #Linux set TTY speed
                $errors = shell_exec("stty -F " .$com. " 115200 -parenb cs8 cstopb 2>&1");
                #$errors .= shell_exec("stty -F " .$com. " clocal -crtscts -ixon -ixoff");

                if($errors != "")
                    return "Error: " . $errors;
            }

            $uart = fopen($com, "rb+");

            if($uart) {
                //Unknown command sequence
                //--------------------
                fwrite($uart, "hello\r");
                
                while($read .= fread($uart, 1))
                    if(strpos($read,"\r") !== false)
                        break;
                
                fclose($uart);
                //--------------------

                $_SESSION["serial"] = 1;

            }else{
                return "Error: Cannot open ". $com;
            }
        }

        return $com;
    }
?>