<?php session_start(); ?>

<!DOCTYPE html>
<html lang="zh_CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name=viewport content="width=device-width, initial-scale=1">
    <meta name="description" content="Online card game web project for school. Client side prototype">
    <meta name="keywords" content="card, phaser, web, game">
    <meta name="author" content="Rowan, Scott, Charly">
    <title>Slain the Rowans</title>
    <link rel="shortcut icon" href="./images/favicon.ico">
    <link rel="stylesheet" href="./css/style.css">
</head>

<body>
<!-- jQuery -->
<script src="./scripts/jquery-3.4.1.min.js"></script>
<script src="./scripts/jquery-ui.min.js"></script>
<!-- Utils -->
<script src="./scripts/utils.js"></script>

<?php
// Defines where server base address is.
$server_address = "https://www.empiraft.com/";

// JavaScript setup.
echo("
				<script> 
					serverAdress = \"".$server_address."\"; 
					setCookie(\"url\", window.location.href, 365 * 24 * 60 * 60 * 1000);
					uuid = getCookie(\"page_id\");
					if (uuid) console.log(\"cookie: \" + uuid);
					else uuid = generateUUID();
				</script>
				");
?>
<!-- Post Page Load Scripts -->
<script src="./scripts/mobile-button.js"></script>
</body>
</html>

