<?php


class InverterTerminal
{
	private $serial;

	function InverterTerminal(phpSerial $serial)
	{
		$this->serial = $serial;
		//Flush buffer
		//$serial->readPort();
		/*while (strlen($serial->readPort()) > 0)
		{
			usleep(100000);
		}*/
	}
	
	function getParamValueList(&$list)
	{
		$this->sendCmdAndParse("list", "/([_a-zA-Z0-9]+)\s+\[(.*)\]/", array($this, "processList"), $list);
		return $list;
	}

	function getAttributes(&$list)
	{
		$this->sendCmdAndParse("atr", 
			"/([_a-zA-Z0-9]+)\s+([\-0-9]+\.[0-9]+)\s\-\s([\-0-9]+\.[0-9]+)\s\[([\-0-9]+\.[0-9]+)\]/", 
			array($this, "processAttributes"), $list);
		return $list;
	}
	
	function getValues(&$list)
	{
		$this->sendCmdAndParse( "all", "/([_a-zA-Z0-9]+)\s+([\-0-9]+\.[0-9]+)/", array($this, "processValues"), $list);
		return $list;
	}
	
	function getAttributesAndValues()
	{
		$this->serial->sendMessage("json\n");
		$read = $this->readAll();
		
		//Check if json command is known
		if (substr($read,5,7) == "Unknown")
		{
			$list = array();
			$this->getParamValueList($list);
			$this->getAttributes($list);
			$this->getValues($list);
		}
		else
		{
			$list = (array)json_decode(substr($read,5));
			
			foreach ($list as $item)
			{
				$item->enum = $this->parseEnum($item->unit);
				$item->unit = htmlentities($item->enum?"":$item->unit);
			}
		}
		
		return $list;
	}
	
	function sendCmd($cmd, $silent=false, $responseTime=0.1)
	{
		$this->serial->sendMessage("$cmd\n", $responseTime);
		$read = $this->serial->readPort();
		$lines = $this->linesToArray($read);
		if (!$silent)
			echo "Sending command '$cmd'... Response: '$lines[0]'";
		return $lines;
	}

	function repeatCmd($responseTime=0.1)
	{
		$this->serial->sendMessage("!", $responseTime);
		$read = $this->serial->readPort();
		$lines = $this->linesToArray($read, 0);
		$lines[0] = ltrim($lines[0], "!");
		return $lines;
	}
	
	private function linesToArray($lines, $firstValid = 1)
	{
		$lines = preg_split("[\n|\r]", $lines);
		$contentLines = array();
		
		for ($i = $firstValid; $i < count($lines); $i++)
		{
			if (trim($lines[$i]) != "")
				$contentLines[] = $lines[$i];
		}
		
		return $contentLines;
	}

	private function sendCmdAndParse($cmd, $regex, callable $process, &$userArg, $responseTime=0.1)
	{
		$this->serial->sendMessage("$cmd\n", $responseTime);

		$read = $this->readAll();
		$lines = $this->linesToArray($read);

		foreach ($lines as $line)
		{
			if (preg_match($regex, $line, $parts))
			{
				$process($parts, $userArg);
			}
		}
	}
	
	private function processList($parts, &$combined)
	{
		$name = $parts[1];
		$unit = htmlentities($parts[2], ENT_COMPAT | ENT_HTML401, 'UTF-8');
		if (!isset($combined[$name]) || !is_object($combined[$name])) $combined[$name] = new stdClass();
		
		$enum = $this->parseEnum($unit);
		$combined[$name]->unit = $enum?"":$unit;
		$combined[$name]->enum = $enum;
		$combined[$name]->isparam = false;
	}
	
	private function processAttributes($parts, &$combined)
	{
		$name = $parts[1];
		$min = rtrim(rtrim($parts[2], "0"), ".");
		$max = rtrim(rtrim($parts[3], "0"), ".");
		$def = rtrim(rtrim($parts[4], "0"), ".");
		if (!isset($combined[$name]) || !is_object($combined[$name])) $combined[$name] = new stdClass();
		
		$combined[$name]->minimum = $min;
		$combined[$name]->maximum = $max;
		$combined[$name]->default = $def;
		$combined[$name]->isparam = true;
	}

	private function processValues($parts, &$combined)
	{
		$name = $parts[1];
		$value = $parts[2];
		if (!isset($combined[$name]) || !is_object($combined[$name])) $combined[$name] = new stdClass();
		
		$combined[$name]->value = rtrim(rtrim($value, "0"), ".");
	}

	private function parseEnum($unit)
	{
		$enum = array();
		if (preg_match_all("/(\-{0,1}[0-9]+)=([a-zA-Z0-9_\-\.]+)[,\s]{0,2}/", $unit, $parts))
		{
			$unit = "";
			for ($i = 0; $i < count($parts[1]); $i++)
			{
				$enum[$parts[1][$i]] = $parts[2][$i];
			}
			return $enum;
		}
		return false;
	}
	
	private function readAll()
	{
        $read = "";
        
        do
        {
            $str = $this->serial->readPort();
            $read .= $str;
            usleep(100000);
        } while (strlen($str) > 0);
        
        return $read;
	}
}


?>