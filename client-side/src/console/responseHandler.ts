import $ from "jquery";
import {player, server} from "./index";
import {emojisList} from "./emojiHandler";

export function handleResponse(response: string) {
    let jsonObj = JSON.parse(response);
    switch(jsonObj.type) {
        case "heartBeat":
            // Sending the server timestamp back to server to complete ping test server side.
            server.sendToServer({type: "heartBeat", timestamp: jsonObj.timestamp});
            return;
        case "obtainedInfo":
            setConnectionDetails(jsonObj.ping, jsonObj.name, jsonObj.status)
            return;
        case "ping":
            addHTMLToReceiveBox("[PING] Pong: " + jsonObj.value + "ms");
            break;
        case "info":
            addHTMLToReceiveBox("[INFO] " + jsonObj.message);
            break;
        case "broadcast":
            addHTMLToReceiveBox("[MSG] [" + jsonObj.from + "] " + jsonObj.message);
            break;
        case "img":
            addHTMLToReceiveBox("[IMG] [" + jsonObj.from + "] <img src='" + jsonObj.message + "' alt='IMG' />");
            break;
        case "emoji":
            addHTMLToReceiveBox("[IMG] [" + jsonObj.from + "] <img class='emoji' src='" + emojisList[jsonObj.value] + "' alt='IMG' />");
            break;
        case "link":
            addHTMLToReceiveBox("[LINK] [" + jsonObj.from + "] <a href='" + jsonObj.message + "' target='_blank'> "+ jsonObj.message +" </a>");
            break;
        case "game":
            switch (jsonObj.action) {
                case "draw":
                    player.addCard(jsonObj.value);
                    break;
                case "remove":
                    player.removeCard(jsonObj.value + 1);
                    break;
                case "info":
                    setGameDetails(jsonObj.value.health, jsonObj.value.mana, jsonObj.value.cardsLeft, jsonObj.value.enemyHealth, jsonObj.value.enemyMana, jsonObj.value.enemyCardsLeft);
                    break;
            }
            break;
    }
    console.log(JSON.stringify(jsonObj));
}

const receiveBox: HTMLElement = document.querySelector("#receive-box");
let scrollHeight: number = 0;
// Adds a new paragraph to receive box in web page, scrolling to the bottom.
export function addHTMLToReceiveBox(innerHTML: string) {
    if (innerHTML === "")
        return;
    receiveBox.innerHTML += `<p>${innerHTML}</p>`;
    let newChild: ChildNode = receiveBox.lastChild;
    scrollHeight += $(<HTMLElement>newChild).outerHeight(true);;
    receiveBox.scrollTo({
        top: scrollHeight,
        behavior: "smooth"
    });
}

const infoBox: HTMLElement = document.querySelector(".websocket .info");
export function setConnectionDetails(ping: string, name: string, status: string) {
    infoBox.innerHTML = "<div><p class='grey'>PING:</p> " + ping + "ms</div>" +
        "<div><p class='grey'>CURRENT NAME:</p>  " + name + "</div>" +
        "<div><p class='grey'>CURRENT STATUS:</p>  " + status + "</div>";
}

const gameDetailBox: HTMLElement = document.querySelector(".websocket .game .details");
export function setGameDetails(health: string, mana: string, cardsLeft: string, enemyHealth: string, enemyMana: string, enemyCardsLeft: string) {
    gameDetailBox.innerHTML = "<div><p class='grey'>HEALTH:</p> " + health + "</div>" +
        "<div><p class='grey'>MANA:</p> " + mana + "</div>" +
        "<div><p class='grey'>CARDS LEFT:</p> " + cardsLeft + "</div>" +
        "<div><p class='grey'>ENEMY HEALTH:</p> " + enemyHealth + "</div>" +
        "<div><p class='grey'>ENEMY MANA:</p> " + enemyMana + "</div>" +
        "<div><p class='grey'>ENEMY CARDS LEFT:</p> " + enemyCardsLeft + "</div>";
}