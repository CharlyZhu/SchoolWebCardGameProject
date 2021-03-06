connOnMessageCb = (conn, msg)=>{
    // Input prep section. Decoding can be added in the future.
    // Translate message to object.
    let obj = JSON.parse(msg);
    switch (obj.type) {
        case "heartBeat":
            conn.lastHeartBeatTimeStamp = getCurrentTime();
            // Calculates ping and stores it in network obj.
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
                    // When a player indicates that they are ready to enter a match.
                    conn.displayMessage("You have connected to the server, your assigned ID is [" + conn.id + "], finding you a game, please wait...");
                    conn.status = "QUEUEING";
                    conn.sendJson({type: "game", action: "confirm-ready"});
                    break;
                case "end-turn":
                    // When a player tries end their turn.
                    if (!conn.validateGameAction())
                        break;
                    conn.opponent.setIsTurn();
                    break;
                case "deal":
                    // When a player tries to use a card.
                    if (!conn.validateGameAction())
                        break;
                    // Validates player card information.
                    if (obj.value < 0 || obj.value > conn.arrCardsInHand.length)
                        break;
                    // Obtains the card UID from card hand index and validates card data.
                    let cardUid = conn.arrCardsInHand[obj.value];
                    let cardData = cardMgr.getCardData(cardUid);
                    if (!cardData)
                        break;
                    // Check if player have enough mana.
                    let cardCost = cardData.cost;
                    if (cardCost === -1) {
                        if (conn.mana <= 0) {
                            conn.displayMessage("You cannot use that, you do not have any mana.");
                            break;
                        }
                        cardCost = conn.mana;
                    }
                    if (conn.mana < cardCost) {
                        conn.displayMessage("You do not have enough mana.");
                        break;
                    }

                    // Doing this before calculation of damage as strength and weapon damage affects damage.
                    if (cardData.weapon && cardData.weapon > 0)
                        conn.weapon = cardData.weapon;
                    if (cardData.strength && cardData.strength > 0)
                        conn.strength = cardData.strength;

                    // Deal card damage if it has any.
                    conn.dealDamage(cardData.damage);

                    // Doing this after calculation of damage as player left over mana is required to calculate.
                    if (cardCost > 0)
                        conn.alterMana(-cardCost);
                    conn.removeCard(obj.value);

                    if (cardData.discard && cardData.discard > 0)
                        conn.discard(cardData.discard);
                    if (cardData.draw && cardData.draw > 0)
                        conn.drawCard(cardData.draw);
                    if (cardData.heal && cardData.heal > 0)
                        conn.heal(cardData.heal);

                    if (cardData.mana && cardData.mana > 0)
                        conn.alterMana(cardData.mana);

                    conn.showCardOnBoard(cardUid);
                    conn.opponent.showCardOnBoard(cardUid, true);
                    break;
                case "draw":
                    /* This functionality should not be open for common users. */
                    if (!conn.iAmHacker)
                        return;
                    if (!conn.validateGameAction())
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