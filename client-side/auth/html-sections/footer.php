<!-- Footer section -->
<footer>
    <!-- Suggest login/register section, remove when player is logged in or about to login -->
    <?php
        if (isset($_COOKIE["page-id"]))
            require "./html-sections/footer-account-button.php";
    ?>
    <h3>帝 国 游 戏 爱 好 者 协 会</h3>

    <!-- Copyright section -->
    <p>帝国游戏 Empiraft Games © 2018-2020 All rights reserved.</p>
</footer>