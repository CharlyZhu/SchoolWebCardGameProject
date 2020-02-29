<?php
	include_once '../utils/account_util.php';
	 
	// Headers.
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	header('Connection: Keep-Alive');
	
	$resultArr = array();
	
	// Tries to create tables.
	setupTables();

	// Logic.
	if (!isset($_POST['action']))
	    exit();

    switch($_POST['action'])
    {
        case 'has_player':
            if (isset($_POST['name']) && fetchAccountInfo($_POST['name']))
                $resultArr['result'] = true;
            else
                $resultArr['result'] = false;
            break;
        case 'validate_player':
            if (isset($_POST['name']) && isset($_POST['pwd']) && validateAccount($_POST['name'], $_POST['pwd']))
                $resultArr['result'] = true;
            else
                $resultArr['result'] = false;
            break;
        case 'fetch_player':
            if (isset($_POST['name']) && isset($_POST['pwd']) && validateAccount($_POST['name'], $_POST['pwd']))
                $resultArr['result'] = fetchAccountInfo($_POST['name']);
            else
                $resultArr['result'] = null;
            break;
    }
	echo json_encode($resultArr);