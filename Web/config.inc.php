<?php

    set_time_limit(30);
    
    function serialDevice()
    {
        $com = "/dev/cu.usbserial";
        $uname = strtolower(php_uname('s'));

        if (strpos($uname, "darwin") !== false) {
            exec("stty -f " .$com. " 115200 -parity cs8 cstopb echo -crtscts -hupcl -ixon");
        }else if (strpos($uname, "win") !== false) {
            exec("mode " .$com. ": BAUD=115200 PARITY=n DATA=8 STOP=2 to=on dtr=off rts=off");
        }else{
            exec("stty -f " .$com. " speed 115200 -parity cs8 cstopb echo -crtscts -hupcl -ixon");
        }

        return $com;
    }
    
?>