<?php
	include_once '../utils/general_util.php';
	include_once '../utils/account_util.php';
    
    // If get and state are set.
    if (isset($_GET["code"]) && isset($_GET["state"]))
    {
        // App id.
        $qq_app_id = "101563338";
        // App pwd.
        $qq_app_pwd = "f0baa303d4cef06a3c62d475398b2e0b";
        $call_back_url = "https://www.empiraft.com/includes/qq-callback.inc.php";
        $raw_state = $_GET["state"];
		
		$state = substr($raw_state, 0, 36);
		$mc_token = substr($raw_state, 36, 16);

        $url_token = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=" .$qq_app_id.
        "&client_secret=" .$qq_app_pwd. "&code=" .$_GET["code"]. "&redirect_uri=" .$call_back_url;
        $response = file_get_contents($url_token);
        // Obtain access_token.
        $access_token = convertUrlQuery($response)["access_token"];

        $url_me = "https://graph.qq.com/oauth2.0/me?access_token=" .$access_token;
        $response = file_get_contents($url_me);
        $json_response = json_decode(str_replace("callback(", "", str_replace(");", "", $response)));
		$open_id = $json_response->openid;

        $url_info = "https://graph.qq.com/user/get_user_info?access_token=". $access_token ."&oauth_consumer_key=". $json_response->client_id ."&openid=". $open_id;
        $response = file_get_contents($url_info);
        $json_response = json_decode($response);
		$nick_name = json_decode($response)->nickname;
		$gender = json_decode($response)->gender;
		$profile_pic = json_decode($response)->figureurl_qq;
		
		if ($mc_token != "")
		{
			$account = findAccountWithOpenId($open_id);
			if ($account)
			{
				writeMCAuthCache($account['name'], $mc_token);
			}
		}
		
		registerQQCache($open_id, $nick_name, $gender, $profile_pic, $state, "register_cache");
        header("Location: www.empiraft.com");
    }