<?php
	include_once 'general_util.php';
	include_once '../models/database.php';
	
	// Create table if it does not exist.
	function setupAccountsTable()
	{	
		// Instantiate DB & connection_aborted
		$conn = $GLOBALS['database']->getConnection();
		// Query.
		$query = "CREATE TABLE IF NOT EXISTS t_account
		(
			uid VARCHAR(7) UNIQUE KEY NOT NULL,
			name VARCHAR(20) PRIMARY KEY NOT NULL,
			open_id VARCHAR(50) NOT NULL,
			pwd VARCHAR(255) NOT NULL,
			ip_address VARCHAR(15) NOT NULL DEFAULT '255.255.255.255',
			last_login TIMESTAMP,
			created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)";
		if ($conn->query($query) === true) {}
		else echo "错误: " .$query. " " . $conn->error;
		// Close connection.
		mysqli_close($conn);
	}
	
	// Create table for qq information.
	function setupQQInfoTable()
	{	
		// Instantiate DB & connection_aborted
        $conn = $GLOBALS['database']->getConnection();
		// Query.
		$query = "CREATE TABLE IF NOT EXISTS t_qq_info
		(
			open_id VARCHAR(50) UNIQUE KEY NOT NULL,
			nickname VARCHAR(50) NOT NULL,
			gender VARCHAR(10) DEFAULT '男',
			profile_pic VARCHAR(100) NOT NULL,
			state VARCHAR(50) NOT NULL,
			info VARCHAR(255) NOT NULL,
			ip_adress VARCHAR(15) NOT NULL DEFAULT '255.255.255.255',
			created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8";
		if ($conn->query($query) === true) {}
		else echo "错误: " .$query. " " . $conn->error;
		// Close connection.
		mysqli_close($conn);
	}