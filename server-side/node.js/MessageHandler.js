connOnMessageCb = (conn, msg)=>{
    // Input prep section. Decoding can be added in the future.
    // Translate message to object.
    let obj = JSON.parse(msg);

    let isActionLegal = ()=>{
        if (!conn.opponent) {
            conn.displayMessage("Action denied, you are not in a game yet...");
            return false;
        }
        if (!conn.isTurn) {
            conn.displayMessage("Action denied, it is not your turn yet...");
            return false;
        }
        return true;
    };

    switch (obj.type) {
        case "heartBeat":
            conn.lastHeartBeatTimeStamp = getCurrentTime();
            // Calculates ping and stores it in conn obj.
            conn.ping = getCurrentTime() - obj.timestamp;
            break;
        case "status":
            conn.status = obj.value;
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
            conn.handleCommand(conn, obj);
            break;
        case "emoji":
            console.log("[INFO] Emoji received: " + obj.value);
            conn.lastAliveTimeStamp = getCurrentTime();
            this.broadcast({type: "emoji", value: obj.value, from: conn.nickname});
            break;
        case "game":
            switch (obj.action) {
                case "client-ready":
                    conn.displayMessage("You have connected to the server, your assigned ID is [" + conn.id + "], finding you a game, please wait...");
                    break;
                case "end-turn":
                    if (!isActionLegal())
                        break;
                    conn.opponent.setIsTurn();
                    break;
                case "deal":
                    if (!isActionLegal())
                        break;
                    // When a player tries to use a card.
                    if (obj.value < 0 || obj.value > conn.arrCardsInHand.length)
                        break;
                    let card = conn.arrCardsInHand[obj.value];

                    // TODO: Card logic goes here.

                    conn.useCard(obj.value);
                    conn.showCardOnBoard(card);
                    conn.opponent.showCardOnBoard(card);
                    break;
                case "draw":
                    if (!isActionLegal())
                        break;
                    if (conn.arrCardsInHand.length < 5){
                        conn.drawCard();
                        conn.displayMessage("You have drawn an extra card.");
                        break;
                    }
                    conn.displayMessage("You cannot hold more than 5 cards.");
                    break;
            }
            break;
        default:
            console.log("[INFO] Unknown typed text received: " + msg);
            break;
    }
};