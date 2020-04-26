require("./CardManager");

serverConfig = {
    server: {
        ip: "",
        port: 8001
    },
    timeout: {
        checkFrequency: 5000,
        heartbeat: 3000,
        inactivity: 20 * 60 * 1000
    }
};

class ConnManager {
    constructor() {
        this.connections = Array();
        this.connId = 0;
    }

    // Sends a json obj to all open connections.
    broadcast(jsonObj) {
        this.connections.forEach((conn) => {
            conn.sendJson(jsonObj);
        });
    }

    // Call back function when a new connection is made with the server.
    connCb(conn) {
        // Assign an unique ID for the new connection then store it within the connection.
        this.connections.push(conn);
        this.connInit(conn, this.connId++);

        // Connection should all draw 3 test cards at the start of the game.
        conn.drawCard(3);

        console.log("[INFO] New connection established with ID number [" + conn.id + "].");
        conn.sendJson({
            type: "info",
            message: "Your assigned ID is [" + conn.id + "], there are currently " + this.connections.length + " online connection(s)."
        });
        this.broadcast({
            type: "broadcast",
            message: "New connection joined with ID number [" + conn.id + "].",
            from: conn.nickname
        });

        // Start heart beat checking.
        conn.heartBeatInterval = (conn) => {
            return setInterval(() => {
                // Sends heart beat packet to client and checks if the client's last response time had been over time out time.
                conn.sendJson({ type: "heartBeat", timestamp: getCurrentTime()});
            }, 1000);
        };

        // Calls on msg receive.
        conn.on('message', function (msg) {
            // Input prep section. Decoding can be added in the future.
            // Translate message to object.
            let obj = JSON.parse(msg);
            switch (obj.type) {
                case "heartBeat":
                    conn.lastHeartBeatTimeStamp = getCurrentTime();
                    // Calculates ping and stores it in conn obj.
                    conn.ping = getCurrentTime() - obj.timestamp;
                    break;
                case "obtain":
                    switch (obj.target) {
                        case "info":
                            conn.sendJson(conn, {
                                type: "obtainedInfo",
                                ping: conn.ping,
                                name: conn.nickname,
                                status: conn.status
                            });
                            break;
                        case "player":
                            conn.sendJson(conn, {
                                type: "player",
                                health: conn.player.health,
                                mana: conn.player.mana
                            });
                            break;
                    }
                    break;
                case "log":
                    console.log("[INFO] Message received: " + obj.message);
                    break;
                case "broadcast":
                    console.log("[INFO] Broadcasting: " + obj.message);
                    // Fun hacker stuff.
                    if (obj.message === "I AM HACKER") {
                        conn.iAmHacker = true;
                        obj.message = "A HACKER HAS LOGGED IN!!!"
                    }
                    conn.lastAliveTimeStamp = getCurrentTime();
                    // Broadcasts messages to clients.
                    this.broadcast({type: "broadcast", message: obj.message, from: conn.nickname});
                    break;
                case "command":
                    console.log("[INFO] Command received: " + obj.label);
                    conn.lastAliveTimeStamp = getCurrentTime();
                    this.handleCommand(conn, obj);
                    break;
                case "emoji":
                    console.log("[INFO] Emoji received: " + obj.value);
                    conn.lastAliveTimeStamp = getCurrentTime();
                    this.broadcast({type: "emoji", value: obj.value, from: conn.nickname});
                    break;
                case "game":
                    switch (obj.action) {
                        case "play-card":
                            conn.sendJson({type: "game", action: "remove", value: obj.value});
                            console.log(conn.cards, obj.value, conn.cards[obj.value], cardList[conn.cards[obj.value] - 1]);
                            this.broadcast({
                                type: "img",
                                message: "https://www.empiraft.com/resources/card_game/json/" + cardList[conn.cards[obj.value] - 1].imgUrl,
                                from: conn.nickname
                            });
                            conn.cards.splice(obj.value, 1);
                            break;
                        case "end-turn":
                            conn.drawCard(1);
                            break;
                    }
                    break;
                default:
                    console.log("[INFO] Unknown typed text received: " + msg);
                    break;
            }
        });

        // Calls on connection close.
        conn.on('close', () => {
            this.broadcast({type: "info", message: "Connection closed.", from: conn.nickname});
            console.log("[INFO] Connection [" + conn.id + "] closed.");
            clearInterval(conn.heartBeatInterval);
        });

        // Calls on error occur.
        conn.on('error', (e) => {
            console.log("[ERROR] Connection [" + conn.id + "] produced error:");
            console.log(e);
            conn.close();
        });
    }

    connInit(conn, connId) {
        conn.id = connId;
        conn.status = "CONNECTED";
        conn.nickname = "ID-" + conn.id;
        conn.lastAliveTimeStamp = getCurrentTime();
        conn.lastHeartBeatTimeStamp = getCurrentTime();
        conn.iAmHacker = false;
        conn.deck = Object.assign({}, cardMgr.cardDeck);
        conn.cards = Array();

        // Initializes the draw card function.
        conn.drawCard = (amount) => {
            for (let i = 0; i < amount; i++) {
                let cardId = getRandomCardFromDeck(conn);
                conn.sendJson({type: "game", action: "draw", value: cardId - 1});
                conn.deck[cardId] -= 1;
                conn.cards.push(cardId);
            }
        };

        // Initializes the send JSON function.
        conn.sendJson = (jsonObj) => {
            // Checks if connections is open, send if it is.
            if (conn.readyState !== 1)
                return;

            // Check if string is valid.
            let strObj = JSON.stringify(jsonObj);
            if (strObj.length > 100) {
                console.log("String length too long.");
                return;
            }

            if (conn.iAmHacker === true)
                conn.send(strObj);
            else
                conn.send(strObj.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        };

        // Handles command JSON object for conn.
        conn.handleCommand = (cmdJsonObj) => {
            let cmdArgs = cmdJsonObj.args.split(' ');
            let argsCount = cmdArgs.length;
            if (cmdJsonObj.args === "")
                argsCount = 0;
            switch(cmdJsonObj.label) {
                case "connections":
                    if (argsCount === 0) {
                        conn.sendJson({type: "info", message: "Command error, not supported argument."});
                        break;
                    }
                    switch (cmdArgs[0]) {
                        case "count":
                            conn.sendJson({type: "info", message: "There are currently " + this.connections.length + " connection(s) online."});
                            break;
                        case "list":
                            let output = "Connections: ";
                            this.connections.forEach(conn => output += conn.id + " " );
                            conn.sendJson({type: "info", message: output.trim()});
                            break;
                    }
                    break;
                case "ping":
                    conn.sendJson({type: "ping", value: conn.ping});
                    break;
                case "status":
                    if (argsCount === 0) {
                        conn.sendJson({type: "info", message: "Your current status is: " + conn.status + "."});
                        break;
                    }
                    switch (cmdArgs[0]) {
                        case "list":
                            conn.sendJson({type: "info", message: "Allowed status: CONNECTED, QUEUEING, IN-GAME, BANNED."});
                            break;
                        case "set":
                            if (argsCount <= 1) {
                                conn.sendJson({type: "info", message: "Command error, not supported argument."});
                                break;
                            }
                            conn.status = cmdArgs[1];
                            conn.sendJson({type: "info", message: "Your status changed to: " + conn.status + "."});
                            break;
                        case "reset":
                            conn.status = "CONNECTED";
                            conn.sendJson({type: "info", message: "Your status changed to: " + conn.status + "."});
                            break;
                    }
                    break;
                case "nick":
                    if (argsCount === 0) {
                        conn.sendJson({type: "info", message: "  - nick set [NAME]	:: Setting nick name for yourself."});
                        conn.sendJson({type: "info", message: "  - nick check			:: Checking your current nickname."});
                        conn.sendJson({type: "info", message: "  - nick reset			:: Setting nick name back to default."});
                        break;
                    }
                    switch (cmdArgs[0]) {
                        case "set":
                            if (argsCount <= 1) {
                                conn.sendJson({type: "info", message: "Command error, not supported argument."});
                                break;
                            }
                            conn.nickname = cmdArgs[1];
                            conn.sendJson({type: "info", message: "Your nickname has changed to: " + conn.nickname + "."});
                            break;
                        case "check":
                            conn.sendJson({type: "info", message: "Your current nickname is: " + conn.nickname + "."});
                            break;
                        case "reset":
                            conn.nickname = "ID-" + conn.id;
                            conn.sendJson({type: "info", message: "Your nickname has changed to: " + conn.nickname + "."});
                            break;
                    }
                    break;
                case "img":
                    if (argsCount === 0) {
                        conn.sendJson({type: "info", message: "  - img [imgUrl] :: Sends image to others."});
                        break;
                    }
                    this.broadcast({type: "img", message: cmdArgs[0],  from: conn.nickname});
                    break;
                case "link":
                    if (argsCount === 0) {
                        conn.sendJson({type: "info", message: "  - link [url] :: Sends URL to others."});
                        break;
                    }
                    this.broadcast({type: "link", message: cmdArgs[0],  from: conn.nickname});
                    break;
                default:
                    conn.sendJson({type: "info", message: "Command error, no such command."});
                    break;
            }
        }
    }

    // Global interval thing that does some general stuff. TODO: MAKE COMMENT MORE SPECIFIC.
    globalChecker() {
        setInterval(()=>{
            // Remove connections that has a ready state of CLOSED.
            this.connections = this.connections.filter((conn)=>{
                return conn.readyState !== undefined && conn.readyState !== 3;
            });

            // Closes connections that are inactive or potentially offline.
            this.connections.forEach((conn)=>{
                if (getCurrentTime() - conn.lastAliveTimeStamp > serverConfig.timeout.inactivity) {
                    if (conn.readyState === 1) {
                        conn.sendJson({type: "info", message: "You have been kicked for inactivity."});
                        conn.close("time out");
                    }
                    console.log("[INFO] Connection [" + conn.id + "] terminated due to inactivity.");
                    return;
                }
                if (getCurrentTime() - conn.lastHeartBeatTimeStamp > serverConfig.timeout.heartbeat) {
                    if (conn.readyState === 1) {
                        conn.sendJson({type: "info", message: "You have been kicked for heartbeat timeout."});
                        conn.close();
                    }
                    console.log("[INFO] Connection [" + conn.id + "] terminated due to heartbeat timeout.");
                    return;
                }
            });
        }, serverConfig.timeout.checkFrequency);
    }
}

connMgr = new ConnManager();