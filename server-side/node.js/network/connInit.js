let playerConfig = {
    gamePlay: {
        timePerTurn: 60,
        manaPerTurn: 3,
        maxHand: 5
    },
    network: {
        heartbeatInterval: 1000
    }
};

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
    conn.health = 30;
    conn.mana = 0;
    conn.isTurn = false;
    conn.turnTime = playerConfig.gamePlay.timePerTurn;
    conn.weapon = 6;
    conn.strength = 1;
    conn.armour = 1;

    // Heart beat callback function.
    conn.heartBeatIntervalCb = ()=>{
        return setInterval(() => {
            // Sends heart beat packet to client and checks if the client's last response time had been over time out time.
            conn.sendJson({ type: "heartBeat", timestamp: getCurrentTime()});
        }, playerConfig.network.heartbeatInterval);
    };
    conn.heartBeatIntervalId = conn.heartBeatIntervalCb();

    // Sends client an message which will be displayed at the message bar.
    conn.displayMessage = (message, color='black', bold=false)=>{
        conn.sendJson({type: "game", action: "message", value: message, color: color, bold: bold});
    };

    // Returns if player can preform game action. Sends feed back to client if they cant.
    conn.validateGameAction = ()=>{
        if (!conn.opponent) {
            conn.displayMessage("Action denied, you are not in a game yet...", '#800000');
            return false;
        }
        if (!conn.isTurn) {
            conn.displayMessage("Action denied, it is not your turn yet...", '#800000');
            return false;
        }
        return true;
    };

    // Sets that it is one player's turn. This will also set that player's opponent to end their turn.
    conn.setIsTurn = ()=>{
        conn.isTurn = true;
        conn.turnTime = playerConfig.gamePlay.timePerTurn;
        conn.opponent.isTurn = false;
        conn.displayMessage("It is your turn to act now!", '#062903', true); // TODO: This could be moved to client side?
        conn.alterMana(playerConfig.gamePlay.manaPerTurn);
        conn.drawCard();
        conn.sendTurnStatus();
        conn.opponent.sendTurnStatus();
    };

    // Attempts to draw certain amount of cards for player. Will do nothing if player cannot draw more cards.
    conn.drawCard = (amount = 1) => {
        for (let i = 0; i < amount; i++) {
            if (conn.arrCardsInHand.length + 1 > playerConfig.gamePlay.maxHand) {
                conn.displayMessage("You did not draw more card as you cannot hold more than " + playerConfig.gamePlay.maxHand + " cards.", '#FF9E00');
                return;
            }
            let cardId = conn.getRandomCardFromDeck();
            conn.sendJson({type: "game", action: "draw", value: cardId});
            // Subtract the number of a specific type of card from the deck.
            conn.arrCardDeck[cardId] -= 1;
            conn.arrCardsInHand.push(cardId);
        }
        conn.updateInfo("cards-left");
        conn.opponent.updateInfo("cards-left", true);
        console.log(conn.getCardsLeft());
    };

    // Tells player if it is their turn.
    conn.sendTurnStatus = ()=>{
        conn.sendJson({type: "game", action: "turn-status", value: conn.isTurn});
    };

    // Alters player's mana value.
    conn.alterMana = (value) => {
        conn.mana += value;
        conn.updateInfo("mana");
        conn.opponent.updateInfo("mana", true);
    };

    // Damages opponent and plays animation.
    conn.damage = (value) => {
        conn.health -= value;
        // TODO: This could be simplified client side, client can check the change and decide what animation to play.
        conn.sendJson({type: "game", action: "damage", is_enemy: true, value: value});
        conn.opponent.sendJson({type: "game", action: "damage", is_enemy: false, value: value});
        conn.updateInfo("health");
        conn.opponent.updateInfo("health", true);
    };

    conn.heal = (value) => {
        conn.health += parseInt(value);
        // TODO: This could be simplified client side, client can check the change and decide what animation to play.
        conn.sendJson({type: "game", action: "heal", is_enemy: false, value: value});
        conn.opponent.sendJson({type: "game", action: "heal", is_enemy: true, value: value});
        conn.updateInfo("health");
        conn.opponent.updateInfo("health", true);
    };

    // Calculates the damage from damage object and damages player's opponent.
    conn.dealDamage = (dmgObj) => {
        if (!dmgObj)
            return;
        if (dmgObj.weapon) {
            let extraDmg = dmgObj.weapon * conn.weapon;
            conn.opponent.damage(Math.max(0, extraDmg - conn.opponent.armour));
        }
        if (dmgObj.strength) {
            let extraDmg = 0;
            // If strength is -1, deal all mana as damage.
            if (dmgObj.strength === -1) {
                for (let i = 0; i < conn.mana; i++)
                    conn.opponent.damage(conn.strength);
            }
            else
                extraDmg = dmgObj.strength * conn.strength;
            conn.opponent.damage(extraDmg);
        }
        if (dmgObj.random) {
            let extraDmg = dmgObj.random[0] + Math.floor(Math.random() * dmgObj.random[1]);
            conn.opponent.damage(extraDmg);
        }
    };

    // Discards a certain amount of random cards for player.
    conn.discard = (amount=1)=>{
        while (conn.getRandomCardFromDeck() >= 0 && amount > 0) {
            let card = conn.getRandomCardFromDeck();
            if (card !== -1)
                conn.removeCard(card);
            amount--;
        }
    };

    // Gets a random card from player's deck, returns -1 if there is no more card.
    conn.getRandomCardFromDeck = ()=>{
        if (conn.getCardsLeft === 0)
            return -1;
        let cardID = 0;
        do { cardID = Math.floor(Math.random() * 12); }
        while (conn.arrCardDeck[cardID] === undefined || conn.arrCardDeck[cardID] <= 0);
        return cardID;
    };

    // Gets how many cards player has left in their deck.
    conn.getCardsLeft = ()=>{
        let value = 0;
        for (let i = 0; i < 12; i++)
            value += conn.arrCardDeck[i];
        return value;
    };

    // Gets that if the player is still online.
    conn.isOnline = ()=>{
        return conn.readyState !== undefined && conn.readyState !== 3;
    };

    // Set if player had won the game.
    conn.setWin = (value)=>{
        if (value)
            conn.displayMessage("You have won the game.", '#123456', true); // TODO: This could be moved to client side?
        else
            conn.displayMessage("You have lost the game.", '#654321', true); // TODO: This could be moved to client side?
        conn.sendJson({type: "game", action: "game-end", value: value});
        conn.close();
    };

    // Sends player game information.
    conn.updateInfo = (infoType, isEnemy=false) => {
        let target = conn;
        if (isEnemy)
            target = conn.opponent;
        switch(infoType) {
            case "health":
                conn.sendJson({type: "game", action: "info", info_type: "health", is_enemy: isEnemy, value: target.health});
                break;
            case "cards-left":
                conn.sendJson({type: "game", action: "info", info_type: "cards-left", is_enemy: isEnemy, value: target.getCardsLeft()});
                break;
            case "mana":
                conn.sendJson({type: "game", action: "info", info_type: "mana", is_enemy: isEnemy, value: target.mana});
                break;
            case "weapon":
                conn.sendJson({type: "game", action: "info", info_type: "weapon", is_enemy: isEnemy, value: target.weapon});
                break;
            case "armour":
                conn.sendJson({type: "game", action: "info", info_type: "armour", is_enemy: isEnemy, value: target.armour});
                break;
            case "strength":
                conn.sendJson({type: "game", action: "info", info_type: "strength", is_enemy: isEnemy, value: target.strength});
                break;
        }
    };

    // Removes a card from player's hand.
    conn.removeCard = (handIndex) => {
        conn.sendJson({type: "game", action: "deal", value: handIndex});
        conn.arrCardsInHand.splice(handIndex, 1);
    };

    // To show that one player has played a card on the board.
    conn.showCardOnBoard = (cardId, isEnemy=false) => {
        conn.sendJson({type: "game", action: "showOnBoard", value: cardId, is_enemy: isEnemy});
    };

    conn.setupOpponent = (opponentConn)=>{
        conn.opponent = opponentConn;
        opponentConn.opponent = conn;
        conn.updateInfo("health");
        conn.updateInfo("cards-left");
        conn.updateInfo("mana");
        conn.updateInfo("weapon");
        conn.updateInfo("strength");
        conn.updateInfo("armour");
        conn.updateInfo("health", true);
        conn.updateInfo("cards-left", true);
        conn.updateInfo("mana", true);
        conn.updateInfo("weapon", true);
        conn.updateInfo("strength", true);
        conn.updateInfo("armour", true);
        conn.displayMessage("Game starting.. You have been assigned to opponent [" + opponentConn.id + "], try not to cheat during the game.");
        conn.sendJson({type: "game", action: "confirm-game"});
        conn.drawCard(3);
        conn.status = "IN-GAME";
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