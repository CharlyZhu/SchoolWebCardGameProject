import {server} from "../index";
import {gameManager} from "../scenes/MainScene";
import Character from "../gameobjects/impl/Character";

export function handleResponse(response: string) {
    let jsonObj = JSON.parse(response);

    switch(jsonObj.type) {
        case "heartBeat":
            // Sending the server timestamp back to server to complete ping test server side.
            server.sendToServer({type: "heartBeat", timestamp: jsonObj.timestamp});
            return;
        case "game":
            switch (jsonObj.action) {
                case "confirm-ready":
                    //gameManager.getGameObject("Character").animateWeaponUpgrade();
                    //gameManager.getGameObject("QueueNotice").destroy();
                    break;
                case "confirm-game":
                    gameManager.getGameObject("QueueNotice").destroy();
                    break;
                case "message":
                    gameManager.getGameObject("MessageBox").addMessage(jsonObj.value, jsonObj.color, jsonObj.bold);
                    break;
                case "damage":
                    let player: Character = <Character>gameManager.getGameObject("Character");
                    let enemy: Character = <Character>gameManager.getGameObject("EnemyCharacter");
                    if (jsonObj.is_enemy)
                        enemy.playAnimation("knight-attack-anim", ()=>{
                            enemy.playAnimation("knight-idle-anim");
                            player.animateDamage();
                        });
                    else
                        player.playAnimation("knight-attack-anim", ()=>{
                            player.playAnimation("knight-idle-anim");
                            enemy.animateDamage();
                        });
                    break;
                case "draw":
                    gameManager.getGameObject("CardHolder").addCardToHand(jsonObj.value);
                    break;
                case "deal":
                    gameManager.getGameObject("CardHolder").removeCardFromHand(jsonObj.value);
                    break;
                case "showOnBoard":
                    if (!jsonObj.is_enemy)
                        gameManager.getGameObject("Character").displayCard(jsonObj.value);
                    else
                        gameManager.getGameObject("EnemyCharacter").displayCard(jsonObj.value);
                    break;
                case "info":
                    // TODO: probably better to pass in a json object and let character handle it.
                    switch (jsonObj.info_type) {
                        case "health":
                            if (jsonObj.is_enemy)
                                gameManager.getGameObject("EnemyCharacter").updateHealth(jsonObj.value);
                            else
                                gameManager.getGameObject("Character").updateHealth(jsonObj.value);
                            break;
                        case "cards-left":
                            if (jsonObj.is_enemy)
                                gameManager.getGameObject("EnemyCharacter").updateCardsLeft(jsonObj.value);
                            else
                                gameManager.getGameObject("Character").updateCardsLeft(jsonObj.value);
                            break;
                        case "mana":
                            if (jsonObj.is_enemy)
                                gameManager.getGameObject("EnemyCharacter").updateMana(jsonObj.value);
                            else
                                gameManager.getGameObject("Character").updateMana(jsonObj.value);
                            break;
                    }
                    break;
                case "turn-status":
                    if (jsonObj.value){
                        gameManager.getGameObject("CardHolder").enableAllCards();
                        gameManager.getGameObject("EndTurnButton").setDisabled(false);
                        gameManager.getGameObject("EndTurnButton").setText("END TURN");
                        gameManager.getGameObject("Character").playAnimation("knight-idle-anim");
                        gameManager.getGameObject("EnemyCharacter").stopAnimation();
                        gameManager.getGameObject("TimeMeter").resetCountdown();
                    }
                    else{
                        gameManager.getGameObject("MessageBox").addMessage("Your enemy's turn has started.");
                        gameManager.getGameObject("CardHolder").disableAllCards();
                        gameManager.getGameObject("EndTurnButton").setDisabled(true);
                        gameManager.getGameObject("EndTurnButton").setText("TURN ENDED");
                        gameManager.getGameObject("EnemyCharacter").playAnimation("knight-idle-anim");
                        gameManager.getGameObject("Character").stopAnimation();
                        gameManager.getGameObject("TimeMeter").pauseCountdown();
                    }
                    break;
            }
    }
    console.log(response);
}