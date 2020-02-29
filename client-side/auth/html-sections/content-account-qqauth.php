<div class="dark-box large">
    <!-- QQ auth -->
    <h1>注册验证 / QQ登录</h1>
    <div>
        <script>
            document.write(
                "<iframe src=\"https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101563338&redirect_uri=https://www.empiraft.com/includes/qq-callback.inc.php" +
                "&state=" + uuid
                <?php
                if (isset($_GET["token"]))
                    echo " + \"".$_GET["token"]."\"";
                ?> + "&display=pc\"></iframe>");
        </script>
        <div class="dark">
            <i class="fas fa-exclamation-circle"></i>
            如果您在手机操作且无法拉起手机版QQ，请尝试更换阅览器再试或使用手机默认阅览器尝试。
        </div>
        <div class="dark">
            <p>
                <i class="fas fa-exclamation-circle"></i>
                如果您还没有账号，请您先验证QQ，我们的系统会指导您完成账号信息补全，如果您有账号，也可通过QQ验证登入。
                使用手机版QQ扫描二维码或点击头像授权登录，登录意味着您同意腾讯公司的第三方业务条款以及我们获取您个人信息的权益。
            </p>
            <button class="button_3" type="button" onclick="location.href='?page=account&action=login'">取 消 Q Q 验 证</button>
        </div>
    </div>
</div>
<script>
    setInterval(updatePageStatus, 1000);
</script>