/* Initialize the connection
 * Connection holds basic player information
 */
connInit = (conn, connId)=>{
    conn.id = connId;
    conn.status = "CONNECTED";
    conn.nickname = "ID-" + conn.id;
    conn.lastAliveTimeStamp = getCurrentTime();
    conn.lastHeartBeatTimeStamp = getCurrentTime();
    conn.arrCardDeck = Object.assign({}, cardMgr.cardDeck);
    conn.arrCardsInHand = Array();
    conn.health = 100;
    conn.damage = 6;
    conn.mana = 0;
    conn.isTurn = false;

    /* This value is solely an ester egg and can be removed */
    conn.iAmHacker = false;

    conn.displayMessage = (message, color='black', bold=false)=>{
        conn.sendJson({type: "game", action: "message", value: message, color: color, bold: bold});
    };

    conn.setIsTurn = ()=>{
        conn.isTurn = true;
        conn.opponent.isTurn = false;
        conn.displayMessage("It is your turn to act now!", '#062903', true);

        conn.mana += 3;
        conn.updateInfo("mana");
        conn.updateInfo("enemy-mana");
        conn.opponent.updateInfo("mana");
        conn.opponent.updateInfo("enemy-mana");

        if (conn.arrCardsInHand.length < 5)
            conn.drawCard();
        else
            conn.displayMessage("You did not draw a card as you cannot hold more than 5 cards.", '#FF9E00');

        conn.sendTurnStatus();
        conn.opponent.sendTurnStatus();
    };

    conn.isOnline = ()=>{
        return conn.readyState !== undefined && conn.readyState !== 3;
    };

    conn.setWin = (value)=>{
        if (value)
            conn.displayMessage("You have won the game.", '#123456', true);
        else
            conn.displayMessage("You have lost the game.", '#654321', true);
        conn.sendJson({type: "game", action: "game-end", value: value});
        conn.status = "GAME-ENDED";
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
};