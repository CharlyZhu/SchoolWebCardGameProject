<section id="account">
    <div class="container">
        <div class="account">
            <?php
            if (isset($_COOKIE["page_id"]))
            {
                if (isset($_COOKIE["user_id"]))
                    require "./html-sections/content-account-account.php";
                else
                    require "./html-sections/content-account-register.php";
            }
            else
            {
                if (!isset($_GET["action"]) || $_GET["action"] == "login")
                    require "./html-sections/content-account-login.php";
                else if ($_GET["action"] == "qq-auth")
                    require "./html-sections/content-account-qqauth.php";
                else if ($_GET["action"] == "register")
                    require "./html-sections/content-account-register.php";
                else
                    header("Location: ?page=account");
            }
            ?>
        </div>
    </div>
</section>

<section class="banner">
    <div class="container">
        <h1>什么是帝国账号</h1>
    </div>
</section>
<section class="features">
    <div class="container">
        <div class="box">
            <img src="./images/icons/communication.png">
            <h3>便捷 · 交流</h3>
            <p>
                帝国游戏账户让您可以和您的朋友们愉快地交流并分享游戏体验，我们高效安全的多地服务器可以快速将您的信息和留言传递给您的好友。
                您不但可以在我们的网站上发送信息和留言，还可以创立您自己的公会主页等个人空间。
            </p>
        </div>
        <div class="box">
            <img src="./images/icons/safety.png">
            <h3>安全 · 保护</h3>
            <p>
                在这个网络发达的年代，保护您的信息安全是我们工作的重中之重。
                我们用最可靠的方式存储和传送您的个人数据，确保您的账户安全，并通过 QQ 互联来保障账户安全并通过多服务器验证来确保您的信息不被第三方团体盗取。
            </p>
        </div>
        <div class="box">
            <img src="./images/icons/multi-platform.png">
            <h3>随时 · 随地</h3>
            <p>
                我们将在不久的将来同步您的游戏数据到我们的数据中心，您将可以在多个平台任意时间对游戏进行操作。
                您将可以不用打开电脑就收割地里的庄稼，查看银行账户或给朋友转账，处理订单或管理背包，甚至对不喜欢的玩家进行通缉。
            </p>
        </div>
    </div>
</section>