import { WebSocketServer } from "../network/WebSocketServer";
import { setupEmojiBox } from "./emojiHandler";
import { setupInputControl } from "./inputControl";
import { ConsolePlayer } from "../player/impl/ConsolePlayer";
import { handleResponse, setConnectionDetails } from "./responseHandler";
import { obtainCardList } from "../card/CardManager";

// Things that has to be loaded before server init. Should move to a promise thing later.
setupEmojiBox(document.querySelector("#emoji-box"));
obtainCardList();

// Web server stuff:
export const server = new WebSocketServer();
export const player = new ConsolePlayer();
server.init().then(() => {
    setupInputControl();

    // Calls when message received from server.
    server.ws.onmessage = (data) => handleResponse(data.data.toString());

    let checker = setInterval(()=>{
        server.sendToServer({type: "obtain", target: "info"});
        if (server.ws.readyState === server.ws.CLOSED) {
            clearInterval(checker);
            setConnectionDetails("-", "-", "DISCONNECTED");
        }
    }, 1000);
});