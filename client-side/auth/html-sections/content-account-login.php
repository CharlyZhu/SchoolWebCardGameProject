<div class="dark-box">
    <h1>登 入</h1>
    <form class="login" action=<?php echo($server_address."includes/login.inc.php");?> method="post">
        <!-- 游戏ID填充 -->
        <div class="text-box uid">
            <i class="fas fa-user"></i>
            <input type="text" name="uid" placeholder="游戏ID / 账户号码" autocomplete="off">
        </div>
        <span class="uid"><i class="fas fa-exclamation-circle"></i>游戏 ID 不合法 ！</span>
        <!-- 密码填充 -->
        <div class="text-box pwd">
            <i class="fas fa-lock"></i>
            <input type="password" name="pwd" placeholder="密码" autocomplete="off">
        </div>
        <span class="pwd"><i class="fas fa-exclamation-circle"></i>密码不正确 ！</span>
        <!-- 验证码填充 -->
        <div class="text-box captcha">
            <i class="fas fa-clipboard-check"></i>
            <input type="text" name="captcha" placeholder="验证码" autocomplete="off" />
        </div>
        <img class="captcha" src="external-source/securimage/securimage_show.php?" alt="验证码" />
        <span class="captcha"><i class="fas fa-exclamation-circle"></i>验证码不正确 ！</span>
        <ul>
            <li><a class="notice reg" href="?page=account">还没有账号？</a></li>
            <li><a class="notice" href="?page=help&action=find_pwd">忘记密码</a></li>
        </ul>
        <div class="dark">
            <p> <i class="fas fa-exclamation-circle"></i>如果您还没有账号，请您先验证QQ，我们的系统会指导您完成账号信息补全，如果您有账号，也可通过QQ验证登入。</p>
            <button class="button_3 qq-btn" type="button" onclick="location.href='?page=account&action=qq-auth'">Q Q 验 证</button>
        </div>
        <button class="button_3 login-btn" type="submit" name="login_submit">登 入</button>
    </form>
</div>