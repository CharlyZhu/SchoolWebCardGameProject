<?php
	include_once 'general_util.php';
	include_once 'table_creator.php';
	include_once '../models/database.php';
	
	// Sets up tables used for project.
	function setupTables() {
		setupAccountsTable();
		setupQQInfoTable();
	}

	// Initializes statement and returns it, if something goes wrong, go to error page and returns null.
	function custom_stmt_init($conn, $query) {
	    $stmt = mysqli_stmt_init($conn);
        // Goto error page if statement preparation goes wrong.
        if (!mysqli_stmt_prepare($stmt, $query)) {
            header("Location: /error.php");
            return null;
        }
        return $stmt;
    }
	
	// Gets basic account information.
    // $type defines what &value represents, default(0) => byName, 1 => byUid, 2=> byToken.
    // WARN: Dangerous, do not send information back to client.
    function fetchAccountInfo($value, $type = 0) {
        // Instantiate DB & connection_aborted
        $conn = $GLOBALS['database']->getConnection();
        // Query.
        $query = "SELECT * FROM t_account WHERE name=?;";
        if ($type == 1)
            $query = "SELECT * FROM t_account WHERE uid=?;";
        else if ($type == 2)
            $query = "SELECT * FROM t_account WHERE token=?;";
        // Statement.
        $stmt = custom_stmt_init($conn, $query);
        if ($stmt == null)
            exit();
        // Statement binding.
        mysqli_stmt_bind_param($stmt, "s", $value);
        mysqli_stmt_execute($stmt);
        // Result fetching.
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        if (!$row)
            return null;
        $account = array(
            "uid" => $row['uid'],
            "name" => $row['name'],
            "token" => $row['token'],
            "ip_address" => $row['ip_address'],
            "last_login" => $row['last_login'],
            "created_on" => $row['created_on']
        );
        // Close statement.
        mysqli_stmt_close($stmt);
        // Close connection.
        mysqli_close($conn);
        return $account;
    }

    function validateAccount($accValue, $rawPwd) {
        // Instantiate DB & connection_aborted
        $conn = $GLOBALS['database']->getConnection();
        // Query.
        $query = "SELECT * FROM t_account WHERE uid = ? OR name = ?;";
        // Statement.
        $stmt = custom_stmt_init($conn, $query);
        if ($stmt == null)
            exit();
        // Statement binding.
        mysqli_stmt_bind_param($stmt, "ss", $accValue, $accValue);
        mysqli_stmt_execute($stmt);
        // Result fetching.
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        if (!$row)
            return null;
        // Validate password.
        if (!password_verify($rawPwd, $row['pwd']))
            return null;

        $account = array(
            "uid" => $row['uid'],
            "name" => $row['name'],
            "token" => $row['token'],
            "ip_address" => $row['ip_address'],
            "last_login" => $row['last_login'],
            "created_on" => $row['created_on']
        );
        // Close statement.
        mysqli_stmt_close($stmt);
        // Close connection.
        mysqli_close($conn);
        return $account;
    }
	
	function checkIfCanLogin($ip_address, $account)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "SELECT * FROM t_account WHERE last_login BETWEEN DATE_SUB(NOW(), INTERVAL 1 HOUR) AND NOW() AND ip_adress = ? AND uid = ?;";
		// Statement.
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query))
		{
			header("Location: /error.php");
			exit();
		}
		else
		{
			mysqli_stmt_bind_param($stmt, "ss", $ip_address, $account['uid']);
			mysqli_stmt_execute($stmt);
			$result = mysqli_stmt_get_result($stmt);
			if ($row = mysqli_fetch_assoc($result))
			{
				$account = array( "uid" => $row['uid'], 
								 "name" => $row['name'],
								 "created_on" => $row['created_on']);
				return $account;
			} 
			else return null;
		}
	}
	
	// Gets an account with its id or username and check its password.
	function checkAccountWithPassword($accountIdentifier, $rawPassword)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "SELECT * FROM t_account WHERE uid = ? OR name = ?;";
		// Statement.
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query))
		{
			header("Location: /error.php");
			exit();
		}
		else
		{
			mysqli_stmt_bind_param($stmt, "ss", $accountIdentifier, $accountIdentifier);
			mysqli_stmt_execute($stmt);
			$result = mysqli_stmt_get_result($stmt);
			if ($row = mysqli_fetch_assoc($result))
			{
				if (password_verify($rawPassword, $row['pwd']))
				{
					$account = array( "uid" => $row['uid'], 
									 "name" => $row['name'],
									 "created_on" => $row['created_on']);
					return $account;
				}
			} 
			return null;
		}
		// Close statement.
		mysqli_stmt_close($stmt);
		// Close connection.
		mysqli_close($conn);
	}
	
	function writeMCAuthCache($name, $token)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "INSERT INTO t_mc_auth (name, token, ip_adress) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token = ?, last_updated = CURRENT_TIMESTAMP, ip_adress = ?;";
		// Statement. 
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query)) { header("Location: /error.php"); exit(); }
		else
		{
			mysqli_stmt_bind_param($stmt, "sssss", $name, $token, getClientIpAddress(), $token, getClientIpAddress());
			mysqli_stmt_execute($stmt);
		}
		// Update login status.
		// Query.
		$query = "UPDATE t_account SET ip_adress = ?, last_login = CURRENT_TIMESTAMP WHERE name = ?;";
		// Statement. 
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query)) { header("Location: /error.php"); exit(); }
		else
		{
			mysqli_stmt_bind_param($stmt, "ss", getClientIpAddress(), $name);
			mysqli_stmt_execute($stmt);
		}
		// Close statement.
		mysqli_stmt_close($stmt);
		// Close connection.
		mysqli_close($conn);
	}
	
	function checkAllowMCLogin($name, $token, $mc_ip_adress)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "SELECT * FROM t_mc_auth WHERE name=? AND (token=? OR (ip_adress=? AND last_updated BETWEEN DATE_SUB(NOW(), INTERVAL 1 HOUR) AND NOW()));";
		// Statement.
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query))
		{
			header("Location: /error.php");
			exit();
		}
		else
		{
			mysqli_stmt_bind_param($stmt, "sss", $name, $token, $mc_ip_adress);
			mysqli_stmt_execute($stmt);
			$result = mysqli_stmt_get_result($stmt);
			if ($row = mysqli_fetch_assoc($result))
			{
				if ($mc_ip_adress != $row['ip_adress'])
				{
					// Update login status.
					// Query.
					$query = "UPDATE t_mc_auth SET ip_adress = ? WHERE name = ?;";
					// Statement. 
					$stmt = mysqli_stmt_init($conn);
					if (!mysqli_stmt_prepare($stmt, $query)) { header("Location: /error.php"); exit(); }
					else
					{
						mysqli_stmt_bind_param($stmt, "ss", $mc_ip_adress, $name);
						mysqli_stmt_execute($stmt);
					}
				}
				return array( "name" => $row['name'],
								"token" => $row['token'],
								"ip_adress" => $row['ip_adress'],
								"last_login" => $row['last_updated']
							 );
			} 
			else return null;
		}
	}
	
	// Register qq status to database.
	function registerQQCache($open_id, $nick_name, $gender, $profile_pic, $state, $info)
	{
        $ip_address = getClientIpAddress();
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "INSERT INTO t_qq_info (open_id, nickname, gender, profile_pic, state, info, ip_adress) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nickname = ?, gender = ?, profile_pic = ?, state = ?, info = ?, ip_adress = ?, created_on = CURRENT_TIMESTAMP;";
		// Statement. 
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query)) { header("Location: /error.php"); exit(); }
		else
		{
			mysqli_stmt_bind_param($stmt, "sssssssssssss", $open_id, $nick_name, $gender, $profile_pic, $state, $info, $ip_address, $nick_name, $gender, $profile_pic, $state, $info, $ip_address);
			mysqli_stmt_execute($stmt);
		}
		// Update login status.
		// Query.
		$query = "UPDATE t_account SET ip_adress = ?, last_login = CURRENT_TIMESTAMP WHERE open_id = ?;";
		// Statement. 
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query)) { header("Location: /error.php"); exit(); }
		else
		{
			mysqli_stmt_bind_param($stmt, "ss", $ip_address, $open_id);
			mysqli_stmt_execute($stmt);
		}
		// Close statement.
		mysqli_stmt_close($stmt);
		// Close connection.
		mysqli_close($conn);
	}
	
	function findQQCacheByState($state)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "SELECT * FROM t_qq_info WHERE state=?;";
		// Statement.
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query))
		{
			header("Location: /error.php");
			exit();
		}
		else
		{
			mysqli_stmt_bind_param($stmt, "s", $state);
			mysqli_stmt_execute($stmt);
			$result = mysqli_stmt_get_result($stmt);
			if ($row = mysqli_fetch_assoc($result))
			{
				return array( "open_id" => $row['open_id'],
								"nickname" => $row['nickname'],
								"gender" => $row['gender'],
								"profile_pic" => $row['profile_pic'],
								"info" => $row['info'],
								"state" => $row['state'],
								"info" => $row['info'],
								"ip_adress" => $row['ip_adress']
							 );
			} 
			else return null;
		}
	}
	
	function findQQCacheByOpenId($open_id)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "SELECT * FROM t_qq_info WHERE open_id=?;";
		// Statement.
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query))
		{
			header("Location: /error.php");
			exit();
		}
		else
		{
			mysqli_stmt_bind_param($stmt, "s", $open_id);
			mysqli_stmt_execute($stmt);
			$result = mysqli_stmt_get_result($stmt);
			if ($row = mysqli_fetch_assoc($result))
			{
				return array( "open_id" => $row['open_id'],
								"state" => $row['state'],
								"info" => $row['info'],
								"ip_adress" => $row['ip_adress']
							 );
			} 
			else return null;
		}
	}
	
	// Creates an account.
	function createAccount($username, $userid, $openid, $rawPassword)
	{
		// Instantiate DB & connection_aborted
		$database = new Database();
		$conn = $database->getConnection();
		// Query.
		$query = "INSERT INTO t_account (uid, name, open_id, pwd, ip_adress) VALUES (?, ?, ?, ?, ?);";
		// Statement.
		$stmt = mysqli_stmt_init($conn);
		if (!mysqli_stmt_prepare($stmt, $query)) { header("Location: /error.php"); exit(); }
		else
		{
			mysqli_stmt_bind_param($stmt, "sssss", $userid, $username, $openid, password_hash($rawPassword, PASSWORD_DEFAULT), getClientIpAddress());
			mysqli_stmt_execute($stmt);
		}
		// Close statement.
		mysqli_stmt_close($stmt);
		// Close connection.
		mysqli_close($conn);
	}
	
	// Generate a new uid for player.
	function createUid()
	{
		while (true)
		{
			$uid = rand(1000000, 10000000);
			// Checks if uid is perfect.
			if (isPerfectUid($uid)) continue;
			// Checks if uid exists.
			if (findAccountWithUid($uid)) continue;
			return $uid;
		}
	}
	
	// Checks if an uid is perfect.
	function isPerfectUid($uid)
	{
		$uidStr = strval($uid);
		// If there are continues 3 digits that are the same, then count as perfect.
		for ($c = 0; $c <= 9; $c++)
			if (strpos($uidStr, str_repeat($c, 3)) !== false)
				return true;
		return false;
	}