import { serverCom } from "./serverCom";
import { setCookie, getCookie } from "../util";
import $ from "jquery";

const msgBox: HTMLElement = document.getElementById("msg-need-send");
const sendBtn: HTMLElement = document.getElementById("send-btn");
const exit: HTMLElement = document.getElementById("exit");
const receiveBox: HTMLElement = document.getElementById("receive-box");

const pingSection: HTMLElement = document.getElementById("ping");
const nameSection: HTMLElement = document.getElementById("name");
const statusSection: HTMLElement = document.getElementById("status");

const gameDetails: NodeListOf<HTMLElement> = document.querySelectorAll("#game .details p");

async function readString(url: string): Promise<string> {
    let request: XMLHttpRequest = new XMLHttpRequest();
    // Sets obtain method and url.
    request.open("get", url);
    // Sets send body (data) to nothing.
    request.send(null);
    return await new Promise<string>((resolve, reject)=>{
        // Sets callback on XHR object message return.
        request.onload = function () {
            // If status returned is 200, data is successfully obtained.
            if (request.status == 200) {
                let jsonStr = request.responseText;
                if (jsonStr !== "")
                    resolve(jsonStr);
            }
            reject("");
        };
    });
}

async function readJSON(url: string): Promise<{}> {
    return await new Promise<{}>((resolve, reject)=>{
        readString(url).then((jsonStr)=>{
            resolve(JSON.parse(jsonStr));
        }).catch(()=>{
            reject({});
        });
    });
}

// Array to store prev commands.
let cmdHis: Array<string> = Array();
let cmdIdxPtr: number = 0;

// Check if there is a cached command history cookie, if there is, apply that too.
let cmdHisCookie = getCookie("command_history");
if (cmdHisCookie) {
    cmdHis = JSON.parse(cmdHisCookie).history;
    cmdIdxPtr = cmdHis.length;
}

let emojiList = [];
// Obtain emoji list from server.
readJSON("//www.empiraft.com/resources/card_game/json/?file=emojis").then((result)=>{
    emojiList = result.emojis;
    // Create emojis from the list.
    let emojiBox: HTMLElement = document.getElementById("emoji-box");
    emojiBox.innerHTML = "";
    for (let i: number = 0; i < emojiList.length; i++) {
        emojiBox.innerHTML += "<img class='emoji' src='" + emojiList[i] + "'/>";
    }
    let emojiItems: HTMLCollection = emojiBox.children;
    // Let emoji buttons work.
    for (let i:number = 0; i < emojiItems.length; i++) {
        (<HTMLElement>emojiItems.item(i)).onclick = () => {
            server.sendToServer({type: "emoji", value: i});
        };
    }
});

let cardsList = [];
// Obtain cards list from server.
readJSON("//www.empiraft.com/resources/card_game/json/?file=cards").then((result)=>{
    cardsList = result.cards;
    // Create cards from the list.
});

const addCard = (cardId: number): void => {
    let cardBox: HTMLElement = document.getElementById("game");
    cardBox.innerHTML += "<div class='card'><img src='//www.empiraft.com/resources/card_game/json/" + cardsList[cardId].imgUrl + "' /></div>";
    reassignCardOnClickCb();
};

const removeCard = (slotId: number): void => {
    let cardBox: HTMLElement = document.getElementById("game");
    cardBox.children[slotId].remove();
    reassignCardOnClickCb();
};

const reassignCardOnClickCb = (): void => {
    let handCards: HTMLCollection = document.getElementById("game").children;
    if (handCards.length <= 1)
        return;
    for (let i: number = 1; i < handCards.length; i++) {
        (<HTMLElement>handCards.item(i)).onclick = () => { server.sendToServer({type: "game", action: "play-card", value: i - 1}); };
    }
};

// Web server stuff:
const server = new serverCom();
let ws: WebSocket = null;
let scrollHeight: number = 0;
server.init().then(() => {
    ws = server.ws;

    // Calls when message received from server.
    ws.onmessage = data => {
        let newLine: string = "";

        // Process data.
        let json = JSON.parse(data.data);
        switch(json.type) {
            case "heartBeat":
                // Sending the server timestamp back to server to complete ping test server side.
                server.sendToServer({type: "heartBeat", timestamp: json.timestamp});
                return;
            case "obtainedInfo":
                pingSection.innerHTML = "<p class='grey'>PING:</p> " + json.ping + "ms";
                nameSection.innerHTML = "<p class='grey'>CURRENT NAME:</p>  " + json.name;
                statusSection.innerHTML = "<p class='grey'>CURRENT STATUS:</p>  " + json.status;
                return;
            case "ping":
                newLine = "[PING] Pong: " + json.value + "ms";
                break;
            case "info":
                newLine = "[INFO] " + json.message;
                break;
            case "broadcast":
                newLine = "[MSG] [" + json.from + "] " + json.message;
                break;
            case "img":
                newLine = "[IMG] [" + json.from + "] <img src='" + json.message + "' alt='IMG' />";
                break;
            case "emoji":
                newLine = "[IMG] [" + json.from + "] <img class='emoji' src='" + emojiList[json.value] + "' alt='IMG' />";
                break;
            case "link":
                newLine = "[LINK] [" + json.from + "] <a href='" + json.message + "' target='_blank'> "+ json.message +" </a>";
                break;
            case "game":
                switch (json.action) {
                    case "draw":
                        addCard(json.value);
                        break;
                    case "remove":
                        removeCard(json.value + 1);
                        break;
                    case "info":
                        gameDetails.item(0).innerHTML = "<p class='grey'>HEALTH:</p> " + json.value.health;
                        gameDetails.item(1).innerHTML = "<p class='grey'>MANA:</p> " + json.value.mana;
                        gameDetails.item(2).innerHTML = "<p class='grey'>CARDS LEFT:</p> " + json.value.cardsLeft;
                        gameDetails.item(3).innerHTML = "<p class='grey'>ENEMY HEALTH:</p> " + json.value.enemyHealth;
                        gameDetails.item(4).innerHTML = "<p class='grey'>ENEMY MANA:</p> " + json.value.enemyMana;
                        gameDetails.item(5).innerHTML = "<p class='grey'>ENEMY CARDS LEFT:</p> " + json.value.enemyCardsLeft;
                        break;
                }
                break;
        }
        if (newLine === "")
            return;
        console.log(JSON.stringify(json));

        // When server feeds back data, this logs data inside HTML.
        receiveBox.innerHTML += `<p>${newLine}</p>`;
        let newChild: ChildNode = receiveBox.lastChild;
        scrollHeight += $(<HTMLElement>newChild).outerHeight(true);;
        receiveBox.scrollTo({
            top: scrollHeight,
            behavior: "smooth"
        });
        console.log(scrollHeight)
    };

    // Key press listener.
    document.onkeydown = function (event: KeyboardEvent) {
        // Calls on enter pressed, sends the message in the chat box.
        if (event && event.key === "Enter") {
            sendBtn.click();
            // Cancels key press event so that enter does not get logged.
            return false;
        }

        // Calls on up and down arrows are pressed, moves command index pointer therefore changing value within msg box.
        if (event && event.key === "ArrowUp") {
            if (cmdIdxPtr > 0) {
                cmdIdxPtr--;
                (<HTMLInputElement> msgBox).value = cmdHis[cmdIdxPtr];
            }
            return false;
        }
        if (event && event.key === "ArrowDown") {
            if (cmdIdxPtr < cmdHis.length - 1) {
                cmdIdxPtr++;
                (<HTMLInputElement> msgBox).value = cmdHis[cmdIdxPtr];
                return false;
            }
            // If pointer points to the last history, make pointer the length of the history (index + 1) and set value to empty.
            cmdIdxPtr = cmdHis.length;
            (<HTMLInputElement> msgBox).value = "";
            return false;
        }
    };

    sendBtn.onclick = () => {
        // Detect if input box is empty, then send info to server.
        let input: string = (<HTMLInputElement> msgBox).value.trim();
        if (input !== "") {
            // If new input is not identical to the last input recorded, input to input history for future use.
            if (input !== cmdHis[cmdHis.length - 1]) {
                cmdHis.push(input);
                setCookie("command_history", JSON.stringify({history: cmdHis, ptr: cmdIdxPtr}), 1000 * 60 * 60 * 24);
            }
            cmdIdxPtr = cmdHis.length;
            // Decide upon whether to treat input as command or message.
            if (!input.startsWith('/'))
                server.sendChat(input);
            else
                server.sendCommand(input);
        }

        (<HTMLInputElement> msgBox).value = "";
    };

    exit.onclick = () => {
        // Request to close socket.
        ws.close();
    };

    let checker = setInterval(()=>{
        server.sendToServer({type: "obtain", target: "info"});

        if (server.ws.readyState === server.ws.CLOSED) {
            clearInterval(checker);
            pingSection.innerHTML = "<p class='grey'>PING:</p> -ms";
            nameSection.innerHTML = "<p class='grey'>CURRENT NAME:</p>  -";
            statusSection.innerHTML = "<p class='grey'>CURRENT STATUS:</p>  DISCONNECTED";
        }
    }, 1000);
});