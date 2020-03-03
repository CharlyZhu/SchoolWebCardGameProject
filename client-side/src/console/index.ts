import { WebSocketServer } from "../network/WebSocketServer";
import { setupEmojiBox } from "./emojiHandler";
import { setupInputControl } from "./inputControl";
import { ConsolePlayer } from "../player/impl/ConsolePlayer";
import { handleResponse, setConnectionDetails } from "./responseHandler";
import { obtainCardList } from "../card/CardManager";

// Load stuff. TODO: Move to another location.
let loadProgressPercent = 0;
const loadSection: HTMLElement = document.querySelector("#load");
function addLoadProgress(progress: number) {
    loadProgressPercent += progress;
    loadSection.innerText = "Loaded: " + loadProgressPercent + "%";
}

// Declare variables.
export const player = new ConsolePlayer();
export const server = new WebSocketServer();

// Chain of method calls, call whats needed first then the next.
obtainCardList().then(()=>{
    addLoadProgress(30);
    setupEmojiBox().then(()=>{
        addLoadProgress(30);
        server.init((response)=>handleResponse(response)).then(()=> {
            addLoadProgress(30);
            serverSetupCb(server);
        });
    });
});

// Callback function that runs after server initialization.
function serverSetupCb(server) {
    setupInputControl();
    server.setTimerTask({type: "obtain", target: "info"}, 1000, ()=>setConnectionDetails("-", "-", "DISCONNECTED"));
    addLoadProgress(10);
}
