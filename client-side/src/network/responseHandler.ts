import {gameConfig, server} from "../index";
import {gameManager} from "../scenes/GameScene";

// Back layer of the game, handles internet inputs.
export function handleResponse(response: string) {
    let jsonObj = JSON.parse(response);
    let countDown = 5;
    switch(jsonObj.type) {
        case "closed":
            gameManager.messageBox.addMessage("You are disconnected from the server.", "#832b1f", true);
            gameManager.stopBgm();
            setInterval(()=>{
                if (countDown == 0)
                    location.reload();
                gameManager.messageBox.addMessage("Going back to main menu in " + countDown + " seconds.", "#884433", true);
                countDown--;
            }, 1000, 1000);
            return;
        case "heartBeat":
            // Sending the server timestamp back to server to complete ping test server side.
            server.sendToServer({type: "heartBeat", timestamp: jsonObj.timestamp});
            return;
        case "game":
            switch (jsonObj.action) {
                case "game-end":
                    if (jsonObj.value) {
                        gameManager.messageBox.addMessage("You have won the game.", '#123456', true);
                        gameManager.playSound("win");
                    }
                    else {
                        gameManager.messageBox.addMessage("You have lost the game.", '#654321', true);
                        gameManager.playSound("lose");
                    }
                    break;
                case "confirm-game":
                    gameManager.queueNotice.destroy();
                    gameManager.bgm = gameManager.playSound("bgm", !gameConfig.audio.music, true, .1);
                    gameManager.messageBox.addMessage("[CARD SPRITE] On one foggy afternoon, the two warriors has meet on this narrow path.", "#402056", true);
                    gameManager.messageBox.addMessage("[CARD SPRITE] One thing is certain, there will be only one survivor.", "#402056", true);
                    break;
                case "message":
                    gameManager.messageBox.addMessage(jsonObj.value, jsonObj.color, jsonObj.bold);
                    break;
                case "draw":
                    gameManager.cardHolder.addCardToHand(jsonObj.value);
                    break;
                case "deal":
                    gameManager.cardHolder.removeCardFromHand(jsonObj.value);
                    break;
                case "showOnBoard":
                    if (!jsonObj.is_enemy)
                        gameManager.player.displayCard(jsonObj.value);
                    else
                        gameManager.player.enemy.displayCard(jsonObj.value);
                    break;
                case "info":
                    if (!jsonObj.is_enemy)
                        updateStats(gameManager.player, jsonObj);
                    else
                        updateStats(gameManager.player.enemy, jsonObj);
                    break;
                case "turn-status":
                    if (jsonObj.value){
                        gameManager.cardHolder.enableAllCards();
                        gameManager.endTurnBtn.setDisabled(false);
                        gameManager.endTurnBtn.setText("END TURN");
                        gameManager.player.playAnimation("knight-idle-anim");
                        gameManager.player.enemy.stopAnimation();
                        gameManager.timer.resetCountdown();
                    }
                    else{
                        gameManager.messageBox.addMessage("Your enemy's turn has started.");
                        gameManager.cardHolder.disableAllCards();
                        gameManager.endTurnBtn.setDisabled(true);
                        gameManager.endTurnBtn.setText("TURN ENDED");
                        gameManager.player.enemy.playAnimation("knight-idle-anim");
                        gameManager.player.stopAnimation();
                        gameManager.timer.pauseCountdown();
                    }
                    break;
            }
    }
    console.log(response);
}

function updateStats(player, jsonObj) {
    switch (jsonObj.info_type) {
        case "health":
            player.updateHealth(jsonObj.value);
            break;
        case "mana":
            player.updateMana(jsonObj.value);
            break;
        case "weapon":
            player.updateWeapon(jsonObj.value);
            break;
        case "armour":
            player.updateArmour(jsonObj.value);
            break;
        case "cards-left":
            player.updateCardsLeft(jsonObj.value);
            break;
        case "strength":
            player.updateStrength(jsonObj.value);
            break;
    }
}