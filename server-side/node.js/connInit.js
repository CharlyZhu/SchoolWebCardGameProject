// Initialize the connection to hold basic player information
connInit = (conn, connId)=>{
    // Connection id will increase when a new one joins in.
    conn.id = connId;
    // Connection status can be CONNECTED, QUEUEING, IN-GAME, END-GAME
    conn.status = "CONNECTED";
    // Nick name can be obtained by player login info in the future.
    conn.nickname = "ID-" + conn.id;
    // Set up time stamp for heartbeat functionality.
    conn.lastAliveTimeStamp = conn.lastHeartBeatTimeStamp = getCurrentTime();
    // Obtains the deck that the player will be playing.
    conn.arrCardDeck = Object.assign({}, cardMgr.cardDeck);
    // Assigns the cards in player hand to be an empty array.
    conn.arrCardsInHand = Array();
    // Basic player game info setup.
    conn.health = 100;
    conn.damage = 6;
    conn.mana = 0;
    conn.isTurn = false;
    conn.turnTime = 60;

    // Heart beat callback function.
    conn.heartBeatIntervalCb = () => {
        return setInterval(() => {
            // Sends heart beat packet to client and checks if the client's last response time had been over time out time.
            conn.sendJson({ type: "heartBeat", timestamp: getCurrentTime()});
        }, 1000);
    };
    conn.heartBeatIntervalId = conn.heartBeatIntervalCb();

    // Sends client an message which will be displayed at the message bar.
    conn.displayMessage = (message, color='black', bold=false)=>{
        conn.sendJson({type: "game", action: "message", value: message, color: color, bold: bold});
    };

    // Sets that it is one player's turn. This will also set that player's opponent to end their turn.
    conn.setIsTurn = ()=>{
        conn.isTurn = true;
        conn.turnTime = 60;
        conn.opponent.isTurn = false;
        conn.displayMessage("It is your turn to act now!", '#062903', true); // TODO: This could be moved to client side?

        // TODO: Maybe this should be set to some sort of add mana function.
        conn.mana += 3;
        conn.updateInfo("mana");
        conn.updateInfo("enemy-mana");
        conn.opponent.updateInfo("mana");
        conn.opponent.updateInfo("enemy-mana");

        if (conn.arrCardsInHand.length < 5)
            conn.drawCard();
        else
            conn.displayMessage("You did not draw a card as you cannot hold more than 5 cards.", '#FF9E00'); // TODO: This could be moved to client side?

        conn.sendTurnStatus();
        conn.opponent.sendTurnStatus();
    };

    // Gets that if the player is still online.
    conn.isOnline = ()=>{
        return conn.readyState !== undefined && conn.readyState !== 3;
    };

    // Set if player has won the game.
    conn.setWin = (value)=>{
        if (value)
            conn.displayMessage("You have won the game.", '#123456', true); // TODO: This could be moved to client side?
        else
            conn.displayMessage("You have lost the game.", '#654321', true); // TODO: This could be moved to client side?
        conn.sendJson({type: "game", action: "game-end", value: value});
        conn.status = "GAME-ENDED";
    };

    // Sends player game information.
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

    // Tells player if it is their turn.
    conn.sendTurnStatus = ()=>{
        conn.sendJson({type: "game", action: "turn-status", value: conn.isTurn});
    };

    // Draws certain amount of cards for player.
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

    // Called when player issues request to play a certain card from their hand.
    conn.useCard = (handIndex) => {
        conn.sendJson({type: "game", action: "deal", value: handIndex});
        conn.arrCardsInHand.splice(handIndex, 1);
    };

    // To show that one player has played a card on the board.
    conn.showCardOnBoard = (cardId, isEnemy=false) => {
        conn.sendJson({type: "game", action: "showOnBoard", value: cardId, is_enemy: isEnemy});
    };

    // Base function for ending json object to client.
    conn.sendJson = (jsonObj) => {
        // Checks if connections is open, send if it is.
        if (!conn.isOnline()) return;
        // Stringify json object.
        let strObj = JSON.stringify(jsonObj);
        // Filters string to avoid HTML injection.
        conn.send(strObj.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
    };
};