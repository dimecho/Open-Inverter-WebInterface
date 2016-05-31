<?php

if (!file_exists("/usr/local/gcc_arm")) {
    echo "0";
    exit;
} else {
    echo "1";
}

?>