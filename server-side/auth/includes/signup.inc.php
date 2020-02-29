<?php
	session_start();

    //$callback = $_POST['callback'];
    $callback = "https://www.empiraft.com/zh_cn/new?page=account&action=register";
	// 检测用户是否通过表单提交来到此页面。
	if (isset($_POST['signup_submit']))
	{
		include_once '../utils/account_util.php';
		include_once '../external-source/securimage/securimage.php';
		include_once '../utils/general_util.php';

		// 错误等待时间
		$error_wait = getCurrentTime(10);

		// 获取所需的参数。
		$username = $_POST['uid'];
		$password = $_POST['pwd'];
		$password_repeat = $_POST['cfm-pwd'];
		$captcha = $_POST['captcha'];
		$user_id = createUid();
		$user_ip = getClientIpAddress();
		$securimage = new Securimage();

		// State for qq cache.
		$state = $_POST["page-id"];

		/*
			code:
			0   - 成功,
			100 - 缺少参数,
			101 - 用户名不合法,
			102 - 密码不合法,
			103 - 密码和确认密码不吻合,
			104 - QQ验证不通过,
			200 - 服务器或数据库故障,
			201 - 用户名冲突,
			202 - 用户号码冲突,
			203 - QQ验证冲突,
			300 - 验证码错误,
			400 - 非法访问,
		*/
		// 检测用户是否给全了所有参数。
		if (empty($username) || empty($password) || empty($password_repeat) || empty($captcha) || empty($state) || empty($callback))
		{
			header("Location: ".$callback."&code=100&username=$username&wait=$error_wait");
			exit();
		}

		// 检查用户名是否符合标准。
		if (preg_match("/\W/", $username))
		{
			header("Location: ".$callback."&code=101&wait=$error_wait");
			exit();
		}

		// Try finding qq cache.
		$qqcache = findQQCacheByState($state);
		// 检查 QQ Cache。
		if (!$qqcache || !$qqcache["open_id"])
		{
			header("Location: ".$callback."&code=104&username=$username&wait=$error_wait");
			exit();
		}
		// Get open id.
		$openid = $qqcache["open_id"];
		if (findAccountWithOpenId($openid))
		{
			header("Location: ".$callback."&code=203&username=$username&wait=$error_wait");
			exit();
		}

		// 检查密码是否符合标准。
		if (preg_match("/[^a-zA-Z0-9!@#\$%\^&\*_-]/", $password) || !preg_match("/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[!@#\$%\^&\*_-]))|((?=.*[!@#\$%\^&\*_-])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[!@#\$%\^&\*_-])))/", $password))
		{
			header("Location: ".$callback."&code=102&username=$username&wait=$error_wait");
			exit();
		}

		// 检查密码和验证密码是否对应。
		if ($password !== $password_repeat)
		{
			header("Location: ".$callback."&code=103&username=$username&wait=$error_wait");
			exit();
		}

		// 检查用户名冲突。
		if (findAccountWithName($username))
		{
			header("Location: ".$callback."&code=201&wait=$error_wait");
			exit();
		}

		// 检查账户号码冲突。
		if (findAccountWithUid($user_id))
		{
			header("Location: ".$callback."&code=202&wait=$error_wait");
			exit();
		}

		// 检查验证码错误。
		if ($securimage->check($captcha) == false)
		{
			header("Location: ".$callback."&code=300&username=$username&wait=$error_wait");
			exit();
		}
		createAccount($username, $user_id, $openid, $password);
		if (findAccountWithName($username) && findAccountWithUid($user_id))
			header("Location: ".$callback."&code=0&username=$username");
        exit();
	}
	else
	{
		header("Location: ".$callback."&type=signup&code=400");
		exit;
	}