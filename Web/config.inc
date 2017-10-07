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
                exec("stty -f " .$com. " 115200");
                exec("stty -f " .$com. " -parenb");
                exec("stty -f " .$com. " cs8");
                exec("stty -f " .$com. " cstopb");
                exec("stty -f " .$com. " clocal -crtscts -ixon -ixoff");
            }

            $uart = fopen($com, "r+");

            if($uart) {

                //Unknown command sequence
                //--------------------
                /*
                fwrite($uart, "hello");
                while($read .= fread($uart, 1))
                    if(strpos($read,"\n") !== false)
                        break;
                */
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