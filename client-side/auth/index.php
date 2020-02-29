<?php session_start(); ?>

<!DOCTYPE html>
<html lang="zh_CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <meta name="description" content="帝国游戏官方网站，我们在创新的路上从未止步。">
    <meta name="keywords" content="我的世界, Minecraft, 神话, 服务器">
    <meta name="author" content="Mythraft">
    <title>帝国游戏 - 官方网站</title>
    <link rel="shortcut icon" href="./images/favicon.ico">
    <link rel="stylesheet" href="./css/normalise.css">
    <link rel="stylesheet" href="./css/global-style.css">
    <link rel="stylesheet" href="./css/overlay.css">
    <link rel="stylesheet" href="./css/header-style.css">
    <link rel="stylesheet" href="./css/showcase-style.css">
    <link rel="stylesheet" href="./css/items.css">
    <link rel="stylesheet" href="css/sections.css">
    <link rel="stylesheet" href="./css/banner-style.css">
    <link rel="stylesheet" href="./css/features-style.css">
    <link rel="stylesheet" href="./css/announcement-style.css">
    <link rel="stylesheet" href="./css/account-style.css">
    <link rel="stylesheet" href="./css/qq-auth-style.css">
    <link rel="stylesheet" href="./css/footer-style.css">
    <link rel="stylesheet" href="./css/tablet-style.css">
    <link rel="stylesheet" href="./css/mobile-style.css">
</head>

<body>
<!-- jQuery -->
<script src="./scripts/jquery-3.4.1.min.js"></script>
<script src="./scripts/jquery-ui.min.js"></script>
<!-- Utils -->
<script src="./scripts/utils.js"></script>

<?php
// Defines where server-side base address is.
$server_address = "http://localhost/SchoolWebCardGameProject/server-side/auth/rest-api/";
// JavaScript setup.
echo("
    <script> 
        serverAddress = \"".$server_address."\";
        setCookie(\"url\", window.location.href, 365 * 24 * 60 * 60 * 1000);
        uuid = getCookie(\"page_id\");
        if (uuid) console.log(\"cookie: \" + uuid);
        else uuid = generateUUID();
    </script>
");

// Obtains header.
require "./html-sections/header.php";

// Obtains content.
require "./html-sections/content-account.php";

if (!isset($_COOKIE["agreement"]) || $_COOKIE["agreement"] != "true")
    require "./html-sections/warning-footer.php";

// Obtains footer.
require "./html-sections/footer.php";

// Obtains overlay.
require "./html-sections/overlay.php";

// Checks if the current page loaded matches the keyword.
function is_page($keyword) {
    return ((!isset($_GET["page"]) && $keyword == "home") || (isset($_GET["page"]) && $_GET["page"] == $keyword));
}

// Echo the class current if the current page matches keyword.
function highlight($keyword) {
    if (is_page($keyword))
        echo "class=\"current\"";
}
?>
<!-- Post Page Load Scripts -->
<!-- 手机版导航栏图标，待修复 -->
<script src="./scripts/mobile-button.js"></script>
<!-- 登陆/注册表格实时验证 -->
<script src="./scripts/form-checker.js"></script>
<!-- 导航栏换页面 -->
<!--script src="./scripts/page-switcher.js"></script-->
</body>
</html>

