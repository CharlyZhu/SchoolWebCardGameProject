require("../card/CardManager");
require("./connInit");
require("./callbacks/connOnMessageCb");
require("./callbacks/connOnCommandCb");
require("./callbacks/connOnCloseCb");

// Server configuration, can be put to a file in the future.
serverConfig = {
    server: {
        ip: "",
        port: 8001,
        updateFrequency: 1000
    },
    // If timeout is reached, connection will be kicked. Unit is in ms.
    timeout: {
        heartbeat: 3000,
        inactivity: 20 * 60 * 1000
    }
};

// This class holds all definition of connections in the game.
class Server {
    constructor() {
        this.connections = Array();
        this.connId = 0;
    }

    /****************************************************************************************************************
     * Public Server Methods
     ****************************************************************************************************************/
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
        conn.on('error', (e)=>{
            console.log("[ERROR] Connection [" + conn.id + "] produced error:");
            console.log(e);
            conn.close();
        });
    }

    // A checker that runs globally at a certain interval, checking player status and maintaining game play. Returns the ID.
    globalChecker() {
        return setInterval(()=>{
            // Remove connections that has a ready state of CLOSED.
            this.connections = this.connections.filter(conn=>{return conn.isOnline();});
            this.removeAFKPlayer();

            this.queueingPlayers = this.connections.filter(conn=>{return conn.status == "QUEUEING"});
            this.matchQueueingPlayer();

            this.inGamePlayers = this.connections.filter(conn=>{return conn.status == "IN-GAME"});
            this.checkWinningPlayer();
            this.checkOvertimeTurn();
        }, serverConfig.server.updateFrequency);
    }

    /****************************************************************************************************************
     * Private Server Methods
     ****************************************************************************************************************/
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
        this.connections = this.connections.filter(conn=>{return conn.isOnline();});
    }

    // Matches the first connection with a random connection that is ready to enter game.
    matchQueueingPlayer() {
        if (this.queueingPlayers.length < 2) return;
        let firstConn = this.queueingPlayers[0];
        let secondConn = this.queueingPlayers[1 + Math.floor(Math.random() * (this.queueingPlayers.length - 1))];
        firstConn.setupOpponent(secondConn);
        secondConn.setupOpponent(firstConn);
        firstConn.setIsTurn();
        console.log("[INFO] The game between [" + firstConn.id + "] and [" + secondConn.id + "] has started.");
    }

    // Checks connections if their turn time had ran out.
    checkOvertimeTurn() {
        this.inGamePlayers.forEach((conn)=>{
            if (!conn.isTurn)
                return;
            if (conn.turnTime <= 0)
                conn.opponent.setIsTurn();
            conn.turnTime--;
        });
    }

    // Checks if there is a winner.
    checkWinningPlayer() {
        this.inGamePlayers.forEach(conn=>{
            if (!conn.opponent.isOnline()){
                if (!conn.isOnline())
                    return;
                conn.displayMessage("Your opponent has left the game.", '#123456', true);
                conn.setWin(true);
            }

            if (conn.health <= 0) {
                conn.setWin(false);
                conn.opponent.setWin(true);
            }
        });
    }
}

// The connMgr object, used in index.js.
connMgr = new Server();