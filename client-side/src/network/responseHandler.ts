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
                case "draw":
                    gamePlayer.addCardToHand(jsonObj.value);
                    break;
                case "deal":
                    gamePlayer.removeCardFromHand(jsonObj.value);
                    break;
                case "showOnBoard":
                    gamePlayer.displayCardOnBoard(jsonObj.value);
                    break;
            }
    }
    console.log(response);
}