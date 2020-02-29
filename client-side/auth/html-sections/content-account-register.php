<div class="dark-box">
    <h1>注 册</h1>
    <form class="signup" action=<?php echo($server_address."includes/signup.inc.php");?> method="post">
        <div class="qq-display"> </div>
        <button class="button_3 recache-qq">重 置 Q Q 验 证</button>
        <?php
            if (isset($_GET["code"]))
            {
                echo "<span class=\"error\"><strong>";
                switch($_GET["code"])
                {
                    case "100":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>提交的表单缺少参数。";
                    break;
                    case "101":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>提供的用户名不合法，请更换后再试。";
                    break;
                    case "102":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>提供的密码不合法，请更换后再试。";
                    break;
                    case "103":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>提供的密码和确认密码不吻合，请确认后再试。";
                    break;
                    case "104":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>QQ验证不通过，请重置QQ验证后再试。";
                    break;
                    case "200":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>服务器或数据库故障，请联系管理员。";
                    break;
                    case "201":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>您申请的用户名已被注册了哦，请换一个再试吧。";
                    break;
                    case "202":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>生成的用户号码冲突，请稍后重新注册试试。";
                    break;
                    case "203":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>QQ验证冲突，请重置QQ验证后再试。";
                    break;
                    case "300":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>验证码错误，请重置验证码后再试。";
                    break;
                    case "400":
                        echo "<i class=\"fas fa-exclamation-circle\"></i>请通过正常渠道进行注册。";
                    break;
                }
                echo "</strong></span>";
            }
        ?>
        <div class="text-box uid">
            <i class="fas fa-user"></i>
            <input type="text" name="uid" placeholder="游戏ID" autocomplete="off">
        </div>
        <span class="uid"><i class="fas fa-exclamation-circle"></i>游戏 ID 不合法 ！</span>
        <div class="text-box pwd">
            <i class="fas fa-lock"></i>
            <input type="password" name="pwd" placeholder="密码" autocomplete="off">
        </div>
        <span class="pwd"><i class="fas fa-exclamation-circle"></i>密码强度过低 ！</span>
        <div class="text-box cfm-pwd">
            <i class="fas fa-check-double"></i>
            <input type="password" name="cfm-pwd" placeholder="确认密码" autocomplete="off">
        </div>
        <span class="cfm-pwd"><i class="fas fa-exclamation-circle"></i>密码和确认密码不匹配 ！</span>
        <div class="text-box captcha">
            <i class="fas fa-clipboard-check"></i>
            <input type="text" name="captcha" placeholder="验证码" autocomplete="off">
        </div>
        <img class="captcha" src=<?php echo($server_address."external-source/securimage/securimage_show.php");?> alt="验证码">
        <span class="captcha info"><i class="fas fa-exclamation-circle"></i>可以单击验证码图片进行更换。</span>
        <div class="page-id"> </div>
        <div class="callback"> </div>
        <button class="button_3 signup-btn" type="submit" name="signup_submit">注 册</button>
    </form>
</div>
<script>
    updatePageStatus();
    document.querySelector('.account .page-id').innerHTML = "<input type=\"hidden\" name=\"page-id\" value= " + uuid + " />";
    document.querySelector('.account .callback').innerHTML = "<input type=\"hidden\" name=\"callback\" value= " + getCookie("url") + " />";
</script>
<?php
    if (!isset($_GET["code"]))
        require "./html-sections/content-account-regulation.php";
?>