$PAGE_SIZE_BYTES = 1024
$PAGE_SIZE_WORDS = ($PAGE_SIZE_BYTES / 4)

function update($binFile, $ttyDev)
{
	$data = [System.IO.File]::ReadAllBytes($binFile)
   	$page = 0
   	$done = 0
   	$rst_cmd = "reset`r"
	$len = $data.Count

 	if ($len -lt 1)
 	{
 		return
 	}

 	$pages = ($len + $PAGE_SIZE_BYTES - 1) / $PAGE_SIZE_BYTES
 	Write-Host "File length is $len bytes/$pages pages"  -ForegroundColor Red

	$uart = New-Object System.IO.Ports.SerialPort $comPort,115200,None,8,one
	$uart.Open()

	if (!$uart)
	{
		return
	}
	
	Write-Host "Resetting device..."

	$uart.Write($rst_cmd)

	wait_for_char($uart, 'S') #Wait for size request

  	Write-Host "Sending number of pages..."

  	$uart.Write($pages)

  	wait_for_char($uart, 'P') #Wait for page request

  	while(!done)
   	{
   		Write-Host "Sending page $page... "

   		$uart.Write($data[$PAGE_SIZE_WORDS * $page])

   		wait_for_char($uart, 'C') #Wait for CRC request

		#Start-Sleep -s 1
   		Write-Host "Sending CRC... "

   		$crc = crc32($data[$PAGE_SIZE_WORDS * $page], $PAGE_SIZE_WORDS, 0xffffffff)
   		$uart.Write($crc)
   		#Write-Host $crc

   		$recv_char = '';
      	while ($recv_char -eq '')
      	{
         	$recv_char = $uart.ReadLine()
      	}

      	if ('D'-eq $recv_char)
	    {
	        Write-Host "CRC correct!"
	        Write-Host "Update done!"
	        $done = 1;
	    }
	    elseif ('E' -eq $recv_char)
	    {
	        Write-Host "CRC error!"
	    }
	    elseif ('P' -eq $recv_char)
	    {
	        Write-Host "CRC correct!"
	        $page++;
	    }
	    else
	    {
	        Write-Host "CRC correct!"
	        Write-Host "Update done!"
	        $done = 1;
	    }
   	}

	$uart.Close()
}

function wait_for_char($uart, $c)
{
	$recv_char = -1;
   	while ($c -ne $recv_char)
   	{
      	$recv_char = $uart.ReadLine()
   	}
}

function crc32($data, $len, $crc)
{
   	for ($i = 0; $i -lt $len; $i++)
   	{
      	$crc = crc32_word($crc, $data[$i]);
   	}
   	return $crc;
}

function crc32_word($crc, $data)
{
  	$crc = $crc -xor $data;

  	for($i=0; $i -lt 32; $i++)
  	{
	    if ($crc -and 0x80000000)
		{
	      	$crc = ($crc -shl 1) -xor 0x04C11DB7; # Polynomial used in STM32
	    }else{
	      	$crc = ($crc -shl 1);
	    }
	}
  	return($crc);
}

if(!$args[0] -and !$args[1]){
	Write-Host "Usage: .\update.ps1 stm32_sine.bin com1" -ForegroundColor Green
}else{
	update $args[0] $args[1]
}