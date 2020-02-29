<?php
    session_start();

	include_once '../utils/general_util.php';

    // 错误等待时间
    $error_wait = getCurrentTime(10);

    // 检测用户是否通过表单提交来到此页面。
    if (isset($_POST['login_submit']))
    {
        include_once $_SERVER['DOCUMENT_ROOT'].'/utils/account_util.php';
        include_once $_SERVER['DOCUMENT_ROOT'].'/external-source/securimage/securimage.php';

        // 获取所需的参数。
        $userid = $_POST['uid'];
        $password = $_POST['pwd'];
        $captcha = $_POST['captcha'];
        $callback = $_POST['callback'];
        $userip = getClientIpAddress();
        $securimage = new Securimage();

        /*
        code:
        0   - 成功,
        100 - 缺少参数,
        101 - 账号或密码不正确,
        200 - 服务器或数据库故障,
        300 - 验证码错误,
        400 - 非法访问
        */
        // 检测用户是否给全了所有参数。
        if (empty($userid) || empty($password) || empty($captcha) || empty($callback))
        {
            header("Location: ".$callback."/?code=100&wait=$error_wait");
            exit();
        }

		// 检查验证码错误。
		if ($securimage->check($captcha) == false) 
		{
			header("Location: ".$callback."/?code=300&wait=$error_wait");
			exit;
        }
        
        // 检查账号是否存在。
        if (checkAccountWithPassword($userid, $password))
        {
			header("Location: ".$callback."/?code=0");
			exit;
        }
        else
        {
			header("Location: ".$callback."/?code=101&wait=$error_wait");
			exit;
        }
    }
    else
    {
        header("Location: ".$callback."/?code=400&wait=$error_wait");
        exit;
    }