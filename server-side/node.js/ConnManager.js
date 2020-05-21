require("./CardManager");
require("./connOnMessageCb");
require("./connOnCommandCb");
require("./connOnCloseCb");
require("./connInit");

// Server configuration, can be put to a file in the future.
serverConfig = {
    server: {
        ip: "",
        port: 8001
    },
    timeout: {
        checkFrequency: 1000,
        heartbeat: 3000,
        inactivity: 20 * 60 * 1000
    }
};

// This class holds all definition of connections in the game.
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
        // Push the new connection to the array.
        this.connections.push(conn);
        // Assign an unique ID for the new connection and initialize it.
        connInit(conn, this.connId++);
        console.log("[INFO] New connection established with ID number [" + conn.id + "].");

        // Sets up listeners.
        conn.on('message', (msg)=>connOnMessageCb(conn, msg));
        conn.on('close', ()=>connOnCloseCb(conn));
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
            this.checkOvertimeTurn();
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

    checkOvertimeTurn() {
        this.connections.forEach((conn)=>{
            if (conn.isTurn && conn.turnTime <= 0)
                conn.opponent.setIsTurn();

            if (conn.isTurn)
                conn.turnTime--;
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
        conn.sendJson({type: "game", action: "confirm-game"});
        conn.drawCard(3);
        conn.status = "IN-GAME";
    }
}

// The connMgr object, used in server.js.
connMgr = new ConnManager();