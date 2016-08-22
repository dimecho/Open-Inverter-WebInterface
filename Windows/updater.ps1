$PAGE_SIZE_BYTES = 1024
$PAGE_SIZE_WORDS = ($PAGE_SIZE_BYTES / 4)
$serial

function update($binFile, $ttyDev)
{
	$data = [System.IO.File]::ReadAllBytes($binFile)
   	$page = 0
   	$done = 0
	$len = $data.Count
 	if ($len -lt 1)
 	{
 		return
 	}

 	$pages = [math]::Round(($len + $PAGE_SIZE_BYTES - 1) / $PAGE_SIZE_BYTES)
 	Write-Host "File length is $len bytes/$pages pages"

	$serial = New-Object System.IO.Ports.SerialPort $ttyDev,115200,None,8,Two
    #$serial.ReadTimeout = 1500
    #$serial.WriteTimeout = 1500
	$serial.Open()

	if (!$serial.IsOpen){
		Write-Host "Could not open $ttyDev"
		return
	}
	
	Write-Host "Resetting device..."

	$serial.Write("reset`r")
	
	wait_for_char 'S' #Wait for size request

  	Write-Host "Sending number of pages..."

  	$serial.WriteLine($pages)

  	wait_for_char 'P' #Wait for page request

  	while(!$done)
   	{
		$start = ($PAGE_SIZE_WORDS * $page)
   		Write-Host "Sending page $page ($start)... "
		
   		$serial.Write($data[$start..($start + $PAGE_SIZE_WORDS)])
		
   		wait_for_char 'C' #Wait for CRC request
		#wait_for_char 'T' #Wait for CRC request
		
   		$crc = crc32 $data[$start..($start + $PAGE_SIZE_WORDS)] $PAGE_SIZE_WORDS
		Write-Host "Sending CRC $crc ... "
   		$serial.Write($crc)

   		$recv_char = '';
      	while ($recv_char -eq '')
      	{
         	$recv_char = $serial.ReadChar()
      	}
		Write-Host ">$recv_char"
		
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

	$serial.Close()
}

function wait_for_char($c)
{
	while($recv_char = $serial.ReadChar())
	{
		#Write-Host $recv_char
		if($recv_char -eq [char]$c){
			return
		}
	}
}

function crc32($data, $len)
{
	$crc = 0xffffffff
	
   	for ($i = 0; $i -lt $len; $i++)
   	{
      	$crc = crc32_word [Int32]$crc [Int32]$data[$i]
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
	      	$crc = ([Int32]$crc -shl 1) -xor 0x04C11DB7; # Polynomial used in STM32
	    }else{
	      	$crc = ([Int32]$crc -shl 1);
	    }
	}
  	return($crc);
}

if(!$args[0] -and !$args[1]){
	Write-Host "Usage: .\update.ps1 stm32_sine.bin com1" -ForegroundColor Green
}else{
	update $args[0] $args[1]
}