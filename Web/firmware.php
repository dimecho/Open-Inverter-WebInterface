<?php

    require('config.inc.php');

    error_reporting(E_ERROR | E_PARSE);

    if(isset($_GET["ajax"]))
    {
        $os = detectOS();
        if ($os === "mac") {
            $file = "/tmp/firmware.bin";
        }else{
            $file = sys_get_temp_dir(). "/firmware.bin";
        }
        //TODO: dynamic - $_GET["serial"]
        
        $uart = fopen(serialDevice(null), "r+"); //Read & Write
        //stream_set_blocking($uart, 1); //O_NONBLOCK
        //stream_set_timeout($uart, 30);
        
        $PAGE_SIZE_BYTES = 1024;
        $len = filesize($file);
        
        if ($len < 1) {
            print "File is empty\n";
            exit;
        }
        
        $handle = fopen($file, "rb");
        $read = fread($handle, $len);
        $data = bytearray($read);
        fclose($handle);
        
        $pages = round(($len + $PAGE_SIZE_BYTES - 1) / $PAGE_SIZE_BYTES);
        
        while((count($data) % $PAGE_SIZE_BYTES) > 0) //Fill ramaining bytes with zeros, prevents corrupted endings
            array_push($data, 0);

        print "File length is " .$len. " bytes/" .$pages. " pages\n";
        
        print "Resetting device...\n";
        
        fwrite($uart, "reset\r");
        
        $c = wait_for_char($uart,array('S','2')); //Wait for size request

        if($c == '2') //version 2 bootloader
        {
            fwrite($uart, 0xAA); //Send magic
            wait_for_char($uart,array('S'));
        }
        
        print "Sending number of pages.." .$pages. "\n";
        
        fwrite($uart, chr($pages)); //Use 'chr', sending 'int' will cause Transmission Error
        //fputs($uart,$pages);
        
        wait_for_char($uart,array('P')); //Wait for page request
        
        ob_flush();
        
        $page = 0;
        $done = false;
        $idx = 0;
        
        while($done != true)
        {
            print "Sending page " .$page. " ...\n";
            
            $crc = calcStmCrc($data, $idx, $PAGE_SIZE_BYTES);
            $c = "";
            
            while ($c != "C")
            {
                $idx = $page * $PAGE_SIZE_BYTES;
                $cnt = 0;
                
                while ($cnt < $PAGE_SIZE_BYTES)
                {
                    fwrite($uart, chr($data[$idx]));
                    //print chr($data[$idx]);
                    $idx++;
                    $cnt++;
                }
                
                $c = fread($uart,1);

                if ($c == "T")
                    print "Transmission Error\n";
            }
          
            print "Sending CRC...\n";
            
            fwrite($uart, chr($crc & 0xFF));
            fwrite($uart, chr(($crc >> 8) & 0xFF));
            fwrite($uart, chr(($crc >> 16) & 0xFF));
            fwrite($uart, chr(($crc >> 24) & 0xFF));
            
            $c = fread($uart,1);
            
            if ('D' == $c) {
                print "CRC correct!\n";
                print "Update done!\n";
                $done = true;
            }else if ('E' == $c) {
                print "CRC error!\n";
            }else if ('P' == $c) {
                print "CRC correct!\n";
                $page = $page + 1;
            }
        }
        fclose($uart);
    }else{
?>
<!DOCTYPE html>
<html>
    <head>
        <?php include "header.php"; ?>
        <script type="text/javascript" src="/js/firmware.js"></script>
        <?php
            if(isset($_FILES["firmware"]))
            {
                $os = detectOS();
                if ($os === "mac") {
                    $file = "/tmp/firmware.bin";
                }else{
                    $file = sys_get_temp_dir(). "/firmware.bin";
                }
                if(file_exists($file)) {
                    unlink($file);
                }
                move_uploaded_file($_FILES['firmware']['tmp_name'], $file);
                echo "<script>$(document).ready(function() { firmwareFlash() });</script>";
            }
        ?>
    </head>
    <body>
        <div class="container">
            <?php include "menu.php"; ?>
            <br/><br/>
            <div class="row">
                <div class="col">
                    <table class="table table-active bg-light table-bordered">
                        <tr align="center">
                            <td>
                            <?php
                            if(isset($_FILES["firmware"])){
                                echo "<div class=\"progress progress-striped active\">";
                                echo "<div class=\"progress-bar\" style=\"width:1%\" id=\"progressBar\"></div>";
                                echo "</div>";
                                echo "<span class=\"badge badge-lg badge-warning\">Tip: If Olimex is bricked, try pressing \"reset\" button while flashing</span>";
                                echo "<br/><br/>";
                                echo "<div id=\"output\"></div>";
                            }else{
                            ?>
                                <div class="loader"></div>
                                <div class="input-group w-100">
                                    <span class="input-group-addon hidden w-75">
                                        <select name="serial" class="form-control" form="Aform" id="serialList"></select>
                                    </span>
                                    <span class="input-group-addon hidden w-25">
                                        <button class="btn btn-primary" type="button" id="browseFirmware"><i class="glyphicon glyphicon-search"></i> Select stm32_sine.bin</button>
                                    </span>
                                </div>
                                <br/><br/>
                                <span class="badge badge-lg badge-warning" id="f_c_txt" ></span>
                                <br/><br/>
                                <img class="rounded" id="f_c_img" />
                            <?php
                            }
                            ?>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <form method="POST" action="/firmware.php" enctype="multipart/form-data" id="firmwareForm">
            <input type="file" name="firmware" id="firmwareFile" hidden />
            <input type="submit" hidden />
        </form>
    </body>
</html>
<?php
    }

    function calcStmCrc($data, $idx, $len)
    {
        $cnt = 0;
        $crc = 0xffffffff;
        
        while ($cnt < $len)
        {
            $word = $data[$idx] | ($data[$idx+1] << 8) | ($data[$idx+2] << 16) | ($data[$idx+3] << 24);
            $cnt = $cnt + 4;
            $idx = $idx + 4;

            $crc = $crc ^ $word;
            for($i = 0; $i < 32; $i++)
            {
                if ($crc & 0x80000000)
                {
                    $crc = (($crc << 1) ^ 0x04C11DB7) & 0xffffffff; //Polynomial used in STM32
                }else{
                    $crc = ($crc << 1) & 0xffffffff;
                }
            }
        }
        
        return $crc;
    }
    
    function bytearray($s)
    {
        return array_slice(unpack("C*", "\0".$s), 1);
    }
    
    function wait_for_char($uart, $c)
    {
        while($recv_char = fread($uart,1))
        {
            //print $recv_char. "\n";
            foreach($c as $item)
                if($recv_char == $item)
                    return $recv_char;
        }
        return -1;
    }
?>