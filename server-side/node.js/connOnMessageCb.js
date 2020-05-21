connOnMessageCb = (conn, msg)=>{
    // Input prep section. Decoding can be added in the future.
    // Translate message to object.
    let obj = JSON.parse(msg);

    // TODO: Move to connInit.
    function isActionLegal() {
        if (!conn.opponent) {
            conn.displayMessage("Action denied, you are not in a game yet...", '#800000');
            return false;
        }
        if (!conn.isTurn) {
            conn.displayMessage("Action denied, it is not your turn yet...", '#800000');
            return false;
        }
        return true;
    }

    switch (obj.type) {
        case "heartBeat":
            conn.lastHeartBeatTimeStamp = getCurrentTime();
            // Calculates ping and stores it in conn obj.
            conn.ping = getCurrentTime() - obj.timestamp;
            break;
        case "status":
            conn.status = obj.value;
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
            connOnCmdCb(conn, obj);
            break;
        case "emoji":
            console.log("[INFO] Emoji received: " + obj.value);
            conn.lastAliveTimeStamp = getCurrentTime();
            this.broadcast({type: "emoji", value: obj.value, from: conn.nickname});
            break;
        case "game":
            conn.lastAliveTimeStamp = getCurrentTime();
            switch (obj.action) {
                case "client-ready":
                    conn.displayMessage("You have connected to the server, your assigned ID is [" + conn.id + "], finding you a game, please wait...");
                    conn.status = "QUEUEING";
                    conn.sendJson({type: "game", action: "confirm-ready"});
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

                    let cardUid = conn.arrCardsInHand[obj.value];
                    // TODO: Card index is wrong, needs fixing.
                    let cardData = cardMgr.getCardData(cardUid - 1);
                    if (!cardData)
                        break;

                    // TODO: Card logic goes here.
                    let cardCost = cardData.cost;
                    console.log(cardCost);
                    if (conn.mana < cardCost) {
                        conn.displayMessage("You do not have enough mana.")
                        break;
                    }

                    // TODO: Make method.
                    conn.mana -= cardCost;
                    conn.updateInfo("mana");
                    conn.opponent.updateInfo("enemy-mana");

                    conn.sendJson({type: "game", action: "damage", is_enemy: false}); // TODO: Move to elsewhere.
                    conn.opponent.sendJson({type: "game", action: "damage", is_enemy: true}); // TODO: Move to elsewhere.

                    conn.useCard(obj.value);
                    conn.showCardOnBoard(cardUid);
                    conn.opponent.showCardOnBoard(cardUid, true);
                    break;
                case "draw":
                    /* This functionality should not be open for common users. */
                    if (!conn.iAmHacker)
                        return;
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