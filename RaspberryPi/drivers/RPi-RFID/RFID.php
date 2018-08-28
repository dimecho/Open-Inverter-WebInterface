<?php
	if(isset($_GET["id"]))
	{
		$_SESSION["rfid"] = $_GET["id"];
	}else{
		unset($_SESSION["rfid"]);
	}
?>