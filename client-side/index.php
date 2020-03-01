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
        <title>Based God Snowy</title>
        <link rel="shortcut icon" href="client-side/images/favicon.ico">
        <link rel="stylesheet" href="css/style.css">
    </head>

    <body>
        <!-- Demo code for client server communication -->
        <div class="websocket">
            <div class="receive">
                <p>Feedback from server</p>
                <div id="receive-box"></div>
            </div>
            <div class="send">
                <textarea type="text" id="msg-need-send"></textarea>
                <p>
                    <button id="send-btn">Send</button>
                </p>
            </div>
            <button id="exit">Close Connection</button>
        </div>
        <script>
            class serverCom {
                init(){
                    if (window.WebSocket) {
                        //this.ws = new WebSocket("ws://54.37.66.227:8001");
                        this.ws = new WebSocket("ws://localhost:8001");

                        // Listener for when connection is made and the server is open.
                        this.ws.onopen = e => {
                            console.log("Connected to server at " + this.ws.url + ".");
                            resolve();
                        };

                        // Listener for when error occurs.
                        this.ws.onerror = () => {
                            console.log("Connection failed when connecting to " + this.ws.url + ".");
                            reject();
                        };

                        // Listener for when server sends back a message.
                        this.ws.onmessage = e => {
                            let data = JSON.stringify(e.data);
                            console.log("MSG：" + data);
                        };

                        // Listener for when server shuts down.
                        this.ws.onclose = () => {
                            console.log("Server closed.");
                        };
                    }
                }

                // Function for sending an object info to server.
                sendToServer(output){
                    // Output prep section. Encoding can be added in the future.
                    this.ws.send(JSON.stringify(output));
                }
            }
            const msgBox = document.getElementById("msg-need-send");
            const sendBtn = document.getElementById("send-btn");
            const exit = document.getElementById("exit");
            const receiveBox = document.getElementById("receive-box");

            // Web server stuff:
            const server = new serverCom();

            server.init();

            // server.sendToServer({ type: "log", message: "Client feedback." });
            // server.sendToServer({ type: "broadcast", message: "THIS IS A BROADCAST MESSAGE" });

            const ws = server.ws;
            ws.onmessage = data => {
                // When server feeds back data, this logs data inside HTML.
                receiveBox.innerHTML += `<p>${data.data}</p>`;
                receiveBox.scrollTo({
                    top: receiveBox.scrollHeight,
                    behavior: "smooth"
                });
            };

            sendBtn.onclick = () => {
                // 点击发送按钮。将数据发送给服务端
                server.sendToServer({ type: "broadcast", message: msgBox.value });
            };

            exit.onclick = () => {
                // 客户端主动关闭连接
                ws.close();
            };
        </script>
        <!-- End of demo code for client server communication -->

        <?php
            // Defines where server-side base address is.
            $server_address = "https://www.empiraft.com/";
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
        ?>
    </body>
</html>