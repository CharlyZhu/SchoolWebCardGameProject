require("./CardManager");
require("./MessageHandler");
require("./CommandHandler");

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

        console.log("[INFO] New connection established with ID number [" + conn.id + "].");
        conn.sendJson({type: "info", message: "Your assigned ID is [" + conn.id + "], there are currently " + this.connections.length + " online connection(s)."});
        this.broadcast({type: "broadcast", message: "New connection joined with ID number [" + conn.id + "].", from: conn.nickname});

        // Heart beat callback function.
        conn.heartBeatIntervalCb = () => {
            return setInterval(() => {
                // Sends heart beat packet to client and checks if the client's last response time had been over time out time.
                conn.sendJson({ type: "heartBeat", timestamp: getCurrentTime()});
            }, 1000);
        };
        conn.heartBeatIntervalId = conn.heartBeatIntervalCb();

        // Calls on msg receive.
        conn.on('message', (msg) => connOnMessageCb(conn, msg));

        // Calls on connection close.
        conn.on('close', () => {
            this.broadcast({type: "info", message: "Connection closed.", from: conn.nickname});
            console.log("[INFO] Connection [" + conn.id + "] closed.");
            clearInterval(conn.heartBeatIntervalId);
        });

        // Calls on error occur.
        conn.on('error', (e) => {
            console.log("[ERROR] Connection [" + conn.id + "] produced error:");
            console.log(e);
            conn.close();
        });
    }

    /* Initialize the connection
    * Connection holds basic player information */
    connInit(conn, connId) {
        conn.id = connId;
        conn.status = "CONNECTED";
        conn.nickname = "ID-" + conn.id;
        conn.lastAliveTimeStamp = getCurrentTime();
        conn.lastHeartBeatTimeStamp = getCurrentTime();
        conn.iAmHacker = false;
        conn.arrCardDeck = Object.assign({}, cardMgr.cardDeck);
        conn.arrCardsInHand = Array();

        conn.health = 100;
        conn.damage = 6;
        conn.mana = 0;
        conn.isTurn = false;

        conn.displayMessage = (message = "Unspecified Message")=>{
            conn.sendJson({type: "game", action: "message", value: message});
        };

        conn.setIsTurn = ()=>{
            conn.isTurn = true;
            conn.opponent.isTurn = false;
            conn.displayMessage("It is your turn to act now!");

            conn.mana += 3;
            conn.updateInfo("mana");
            conn.updateInfo("enemy-mana");
            conn.opponent.updateInfo("mana");
            conn.opponent.updateInfo("enemy-mana");

            if (conn.arrCardsInHand.length < 5)
                conn.drawCard();
            else
                conn.displayMessage("You did not draw a card as you cannot hold more than 5 cards.");

            conn.sendTurnStatus();
            conn.opponent.sendTurnStatus();
        };

        conn.updateInfo = (infoType) => {
            switch(infoType) {
                case "health":
                    conn.sendJson({type: "game", action: "info", info_type: "health", is_enemy: false, value: conn.health});
                    break;
                case "enemy-health":
                    conn.sendJson({type: "game", action: "info", info_type: "health", is_enemy: true, value: conn.opponent.health});
                    break;
                case "cards-left":
                    conn.sendJson({type: "game", action: "info", info_type: "cards-left", is_enemy: false, value: getCardsLeft(conn)});
                    break;
                case "enemy-cards-left":
                    conn.sendJson({type: "game", action: "info", info_type: "cards-left", is_enemy: true, value: getCardsLeft(conn.opponent)});
                    break;
                case "mana":
                    conn.sendJson({type: "game", action: "info", info_type: "mana", is_enemy: false, value: conn.mana});
                    break;
                case "enemy-mana":
                    conn.sendJson({type: "game", action: "info", info_type: "mana", is_enemy: true, value: conn.opponent.mana});
                    break;
            }
        };

        conn.sendTurnStatus = ()=>{
            conn.sendJson({type: "game", action: "turn-status", value: conn.isTurn});
        };

        // Initializes the draw card function.
        conn.drawCard = (amount = 1) => {
            for (let i = 0; i < amount; i++) {
                let cardId = getRandomCardFromDeck(conn);
                conn.sendJson({type: "game", action: "draw", value: cardId - 1});
                // Subtract the number of a specific type of card from the deck.
                conn.arrCardDeck[cardId] -= 1;
                conn.arrCardsInHand.push(cardId);
            }
            conn.updateInfo("cards-left");
            conn.updateInfo("enemy-cards-left");
            conn.opponent.updateInfo("cards-left");
            conn.opponent.updateInfo("enemy-cards-left");
        };

        // conn.useCard is called if we want that player to draw a card.
        conn.useCard = (handIndex) => {
            conn.sendJson({type: "game", action: "deal", value: handIndex});
            conn.arrCardsInHand.splice(handIndex, 1);
        };

        // conn.showCardOnBoard is called to show a card on the desk.
        conn.showCardOnBoard = (cardId) => {
            conn.sendJson({type: "game", action: "showOnBoard", value: cardId});
        };

        // Initializes the send JSON function.
        conn.sendJson = (jsonObj) => {
            // Checks if connections is open, send if it is.
            if (conn.readyState !== 1)
                return;

            // Check if string is valid.
            let strObj = JSON.stringify(jsonObj);
            if (strObj.length > 500) {
                console.log("[WARN] [ConnManager] String length too long.");
                return;
            }

            if (conn.iAmHacker === true)
                conn.send(strObj);
            else
                conn.send(strObj.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
        };

        // Handles command JSON object for conn.
        conn.handleCommand = connOnCmdCb;
    }

    // A checker that runs at a certain interval, checking player status and maintaining gameplay.
    globalChecker() {
        setInterval(()=>{
            // Remove connections that has a ready state of CLOSED.
            this.connections = this.connections.filter((conn)=>{
                return conn.readyState !== undefined && conn.readyState !== 3;
            });

            this.removeAFKPlayer();
            this.matchQueueingPlayer();
        }, serverConfig.timeout.checkFrequency);
    }

    // Closes connections that are inactive or potentially offline.
    removeAFKPlayer() {
        this.connections.forEach((conn)=>{
            if (getCurrentTime() - conn.lastAliveTimeStamp > serverConfig.timeout.inactivity) {
                if (conn.readyState === 1) {
                    conn.sendJson({type: "info", message: "You have been kicked for inactivity."});
                    conn.close();
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
    }

    // Matches the first connection with a random connection that is ready to enter game.
    matchQueueingPlayer() {
        let queueingConns = this.connections.filter((conn)=>{
            return conn.status == "QUEUEING";
        });
        if (queueingConns.length < 2)
            return;
        let firstConn = queueingConns[0];
        let secondConn = queueingConns[1 + Math.floor(Math.random() * (queueingConns.length - 1))];
        this.setupOpponent(firstConn, secondConn);
        this.setupOpponent(secondConn, firstConn);
        firstConn.setIsTurn();
    }

    setupOpponent(conn, opponentConn) {
        conn.opponent = opponentConn;
        conn.updateInfo("health");
        conn.updateInfo("cards-left");
        conn.updateInfo("mana");
        conn.updateInfo("enemy-health");
        conn.updateInfo("enemy-cards-left");
        conn.updateInfo("enemy-mana");
        conn.displayMessage("Game starting.. You have been assigned to opponent [" + opponentConn.id + "], try not to cheat during the game.");
        conn.drawCard(3);
        conn.status = "IN-GAME";
    }
}

connMgr = new ConnManager();