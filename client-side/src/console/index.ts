import { WebSocketServer } from "../network/WebSocketServer";
import { setupEmojiBox } from "./emojiHandler";
import { setupInputControl } from "./inputControl";
import { ConsolePlayer } from "../player/impl/ConsolePlayer";
import { handleResponse, setConnectionDetails } from "./responseHandler";
import { obtainCardList } from "../card/CardManager";

// Declare variables.
export const server = new WebSocketServer();
export const player = new ConsolePlayer();

// Chain of method calls, call whats needed first then the next.
obtainCardList().then(()=>{
    setupEmojiBox().then(()=>server.init().then(serverSetupCb));
});

// Callback function that runs after server initialization.
const serverSetupCb =()=>{
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
};