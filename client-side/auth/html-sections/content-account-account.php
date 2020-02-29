<!-- Account Info -->
<div class="dark-box info">
    <h3>个人信息</h3>
    <div class="qq-display"> </div>
    <button class="button_3">登 出 账 户</button>
</div>
<script>
    let btn = document.querySelector(".info button");
    btn.addEventListener('click', function (event)
    {
        clearAllAndReload();
    });

    // 用POST在服务器检查登陆状态。
    checkAgainstServer({action: 'qq_cache', state: uuid}, (obj)=>{
        if (obj.cache.state == getCookie("page_id"))
        {
            let qqDisplay = document.querySelector('.qq-display');
            qqDisplay.innerHTML = "<img src=" + obj.cache.profile_pic +
                " alt=\"profile-pic\" /> <br /><br /><br /><br /> " +
                "性别: " + obj.cache.gender + " <br /> " +
                "账户号码: " + obj.cache.account.uid + " <br /> " +
                "账号名称: " + obj.cache.account.name + " <br /> " +
                "创建时间: " + obj.cache.account.created_on + " <br /><br /> " +
                "<strong>恭喜您尊敬的 " + obj.cache.nickname + "， 您已成功登入帝国游戏平台。";
        }
        else
        {
            clearPageIdAndReload();
        }
    });
</script>