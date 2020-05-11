import {server} from "../index";
import {gamePlayer} from "../scenes/MainScene";

export function handleResponse(response: string) {
    let jsonObj = JSON.parse(response);

    switch(jsonObj.type) {
        case "heartBeat":
            // Sending the server timestamp back to server to complete ping test server side.
            server.sendToServer({type: "heartBeat", timestamp: jsonObj.timestamp});
            return;
        case "game":
            switch (jsonObj.action) {
                case "message":
                    gamePlayer.addMessage(jsonObj.value);
                    break;
                case "draw":
                    gamePlayer.addCardToHand(jsonObj.value);
                    break;
                case "deal":
                    gamePlayer.removeCardFromHand(jsonObj.value);
                    break;
                case "showOnBoard":
                    gamePlayer.displayCardOnBoard(jsonObj.value);
                    break;
                case "health-info":
                    gamePlayer.updateHealthTxt(jsonObj.value);
                    break;
                case "cards-left-info":
                    gamePlayer.updateCardsLeft(jsonObj.value);
                    break;
                case "enemy-health-info":
                    gamePlayer.updateEnemyHealth(jsonObj.value);
                    break;
            }
    }
    console.log(response);
}