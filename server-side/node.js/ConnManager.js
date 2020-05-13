require("./CardManager");
require("./MessageHandler");
require("./CommandHandler");
require("./connInit");

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
        connInit(conn, this.connId++);

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


    // A checker that runs at a certain interval, checking player status and maintaining gameplay.
    globalChecker() {
        setInterval(()=>{
            // Remove connections that has a ready state of CLOSED.
            this.connections = this.connections.filter((conn)=>{
                return conn.readyState !== undefined && conn.readyState !== 3;
            });

            this.removeAFKPlayer();
            this.matchQueueingPlayer();
            this.checkWinningPlayer();
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

    checkWinningPlayer() {
        let inGameConns = this.connections.filter((conn)=>{
            return conn.status == "IN-GAME";
        });
        inGameConns.forEach(conn=>{
            if (!conn.opponent.isOnline()){
                conn.displayMessage("Your opponent has left the game.", '#123456', true);
                conn.setWin(true);
            }

            if (conn.health <= 0) {
                conn.setWin(false);
                conn.opponent.setWin(true);
            }
        });
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