<?php

    set_time_limit(30);

    function serialDevice()
    {
        $com = "/dev/cu.usbserial";

        if(!isset($_SESSION["serial"])) {

            if (PHP_OS === 'WINNT') {
                exec("mode " .$com. ": BAUD=115200 PARITY=n DATA=8 STOP=2 to=on xon=off octs=off rts=on");

            }else if (PHP_OS === 'Darwin') {
                //exec("screen " .$com. " 115200 &");
                //stty -f $serial 115200 parodd cs8 cstopb -crtscts -echo & cat $serial &
                //stty -f $serial 115200 & screen $serial 115200 &

            }else{
                #Raspberry Pi Fix
                exec("minicom -b 115200 -o -D " .$com. " &");
                exec("killall minicom");
                
                #Linux set TTY speed
                exec("stty -F " .$com. " 115200");
                exec("stty -F " .$com. " -parenb");
                exec("stty -F " .$com. " cs8");
                exec("stty -F " .$com. " cstopb");
                exec("stty -F " .$com. " clocal -crtscts -ixon -ixoff");
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
                return "";
            }
        }

        return $com;
    }
?>