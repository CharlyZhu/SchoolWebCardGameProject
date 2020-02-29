<!-- Header section -->
<header>
    <div class="container">
        <div id="branding" onclick="location.href='?page=home'">
            <h1><span class="highlight">帝 国</span> · 游 戏</h1>
        </div>
        <nav>
            <!-- Main navigation bar -->
            <ul>
                <li <?php highlight("home"); ?>><a href="?page=home"><i class="fas fa-home"></i> 首 页</a></li>
                <li <?php highlight("account"); ?>><a href="?page=account"><i class="fas fa-user-circle"></i> 账 户</a></li>
                <li <?php highlight("products"); ?>><a href="?page=products"><i class="fas fa-download"></i> 产 品</a></li>
                <li <?php highlight("contact"); ?>><a href="?page=contact"><i class="fas fa-phone-square"></i> 联 系</a></li>
            </ul>

            <!-- Mobile navigation bar button -->
            <div class="menu-button">
                <div class="line1"></div>
                <div class="line2"></div>
                <div class="line3"></div>
            </div>
        </nav>
    </div>
</header>