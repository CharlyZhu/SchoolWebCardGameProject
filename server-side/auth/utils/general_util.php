<?php
	// Create random string with given length.
	function getRandChar($length)
	{
		$str = null;
		$strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
		$max = strlen($strPol) - 1;

		for($i=0;$i<$length;$i++)
			$str .= $strPol[rand(0, $max)]; //rand($min,$max)生成介于min和max两个数之间的一个随机整数

		return $str;
	}
	
	// 获取用户IP地址。
	function getClientIpAddress()
	{
		if (getenv('HTTP_CLIENT_IP'))
			$ip_address = getenv('HTTP_CLIENT_IP');
		else if(getenv('HTTP_X_FORWARDED_FOR'))
            $ip_address = getenv('HTTP_X_FORWARDED_FOR');
		else if(getenv('HTTP_X_FORWARDED'))
            $ip_address = getenv('HTTP_X_FORWARDED');
		else if(getenv('HTTP_FORWARDED_FOR'))
            $ip_address = getenv('HTTP_FORWARDED_FOR');
		else if(getenv('HTTP_FORWARDED'))
            $ip_address = getenv('HTTP_FORWARDED');
		else if(getenv('REMOTE_ADDR'))
            $ip_address = getenv('REMOTE_ADDR');
		else
            $ip_address = 'UNKNOWN';
	 
		return $ip_address;
	}

	// 获取当前时间加一个给定的数值(秒数)。
	function getCurrentTime($offset) {
		return time() + $offset;
	}

	// 解析url中参数信息，返回参数数组
	function convertUrlQuery($query) {
		$queryParts = explode('&', $query);

		$params = array();
		foreach ($queryParts as $param) 
		{
			$item = explode('=', $param);
			$params[$item[0]] = $item[1];
		}

		return $params;
	}