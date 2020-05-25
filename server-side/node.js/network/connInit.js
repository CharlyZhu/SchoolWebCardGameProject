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
            conn.displayMessage("Action denied, you are not in a game yet...", '#800000', true);
            return false;
        }
        if (!conn.isTurn) {
            conn.displayMessage("Action denied, it is not your turn yet...", '#800000', true);
            return false;
        }
        return true;
    };

    // Sets that it is one player's turn. This will also set that player's opponent to end their turn.
    conn.setIsTurn = ()=>{
        conn.isTurn = true;
        conn.turnTime = playerConfig.gamePlay.timePerTurn;
        conn.opponent.isTurn = false;
        conn.displayMessage("It is your turn, act now!", '#062903', true); // TODO: This could be moved to client side?
        conn.alterMana(playerConfig.gamePlay.manaPerTurn);
        conn.drawCard();
        conn.sendTurnStatus();
        conn.opponent.sendTurnStatus();
    };

    // Attempts to draw certain amount of cards for player. Will do nothing if player cannot draw more cards.
    conn.drawCard = (amount = 1) => {
        for (let i = 0; i < amount; i++) {
            if (conn.arrCardsInHand.length + 1 > playerConfig.gamePlay.maxHand) {
                conn.displayMessage("Your hand is full, you cannot hold more than " + playerConfig.gamePlay.maxHand + " cards.", '#FF9E00');
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
    };

    // Tells player if it is their turn.
    conn.sendTurnStatus = ()=>{
        conn.sendJson({type: "game", action: "turn-status", value: conn.isTurn});
    };

    // Alters player's mana value.
    conn.alterMana = (value) => {
        conn.mana += parseInt(value);
        conn.updateInfo("mana");
        conn.opponent.updateInfo("mana", true);
    };

    // Alters player's health value.
    conn.alterHealth = (value) => {
        conn.health += parseInt(value);
        conn.updateInfo("health");
        conn.opponent.updateInfo("health", true);
    };

    // Sets player's weapon damage value.
    conn.setWeapon = (value) => {
        conn.weapon = value;
        conn.updateInfo("weapon");
        conn.opponent.updateInfo("weapon", true);
    };

    // Sets player's strength value.
    conn.setStrength = (value)=>{
        conn.strength += parseInt(value);
        conn.updateInfo("strength");
        conn.opponent.updateInfo("strength", true);
    };

    // Sets player's armour value.
    conn.setArmour = (value)=>{
        conn.armour += parseInt(value);
        conn.updateInfo("armour");
        conn.opponent.updateInfo("armour", true);
    };

    // Calculates the damage from damage object and damages player's opponent.
    conn.dealDamage = (dmgObj) => {
        // If damage object is undefined, just skip it.
        if (!dmgObj)
            return;
        let armour = conn.opponent.armour;
        // Calculate weapon damage.
        if (dmgObj.weapon) {
            let dmg = dmgObj.weapon * conn.weapon - armour;
            armour -= dmgObj.weapon * conn.weapon;
            if (dmg > 0) {
                conn.opponent.alterHealth(-dmg);
                conn.displayMessage("[CARD SPRITE] You swing your weapon at your foe and dealt " + dmg + " damage.", "#402056", true);
            }
        }
        if (armour < 0)
            armour = 0;
        // Calculate strength damage.
        if (dmgObj.strength) {
            let dmg = 0;
            // If strength is -1, deal all mana as damage.
            if (dmgObj.strength === -1) {
                conn.displayMessage("[CARD SPRITE] Throwing in all you've got? I like that...", "#402056", true);
                for (let i = 0; i < conn.mana; i++) {
                    conn.opponent.alterHealth(-Math.max(conn.strength - armour, 0));
                    armour -= conn.strength;
                    if (armour < 0)
                        armour = 0;
                }
            }
            else {
                dmg = dmgObj.strength * conn.strength - armour;
                armour -= dmgObj.strength * conn.strength;
                if (dmg > 0) {
                    conn.displayMessage("[CARD SPRITE] The force of your strength dealt " + dmg + " damage.", "#402056", true);
                    conn.opponent.alterHealth(-dmg);
                }
                else
                    conn.displayMessage("[CARD SPRITE] You strike the enemy but their armour blocked all the damage.", "#402056", true);
            }
        }
        if (armour < 0)
            armour = 0;
        // Calculate random damage.
        if (dmgObj.random) {
            let dmg = dmgObj.random[0] + Math.floor(Math.random() * dmgObj.random[1]) - armour;
            if (dmg < 3)
                conn.displayMessage("[CARD SPRITE] With some luck, you dealt " + dmg + " extra damage.", "#402056", true);
            else if (dmg < 6)
                conn.displayMessage("[CARD SPRITE] Lucky shot! You dealt " + dmg + " extra damage.", "#402056", true);
            if (dmg === 6)
                conn.displayMessage("[CARD SPRITE] Critical hit! You dealt " + dmg + " extra damage.", "#402056", true);
            conn.opponent.alterHealth(-dmg);
        }
    };

    // Discards a certain amount of random cards for player.
    conn.discard = (amount=1)=>{
        conn.displayMessage("[CARD SPRITE] Discarding card? An interesting choice indeed.", "#402056", true);
        while (conn.getRandomCardFromDeck() >= 0 && amount > 0) {
            let card = conn.getRandomCardFromDeck();
            if (card !== -1) {
                conn.displayMessage("Card " + cardMgr.getCardData(card).name + " was torn apart by an ancient power.", "#565000", true);
                conn.removeCard(card);
            }
            else
                conn.displayMessage("Your hand was empty, the card sprite seemed extremely angry.", "#565000", true);
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
        conn.displayMessage("Game starting.. You have been assigned to opponent [" + opponentConn.id + "], cheating is punishable by death!");
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