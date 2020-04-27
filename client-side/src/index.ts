import "phaser";
import { WebSocketServer } from "./network/WebSocketServer";
import { LoaderScene } from "./scenes/LoaderScene";
import { MainScene } from "./scenes/MainScene";
import { handleResponse } from "./network/responseHandler";

// Web server instance.
export const server = new WebSocketServer();

const gameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: 0x0000ff,
};
// Creating the game instance.
const game = new Phaser.Game(gameConfig);

// Creating the scene objects.
const loader = new LoaderScene();
const main = new MainScene();

const initGame = () => {
    game.scene.add("loader", loader, true);
    game.scene.add("mainscene", main);

    server.init((response) => handleResponse(response)).then(() => {
        Object.defineProperty(server, "sendDealCardRequest", {value : (index: number)=>{
                server.sendToServer({type: "game", action: "deal", value: index});
            },
            writable : false});
        Object.defineProperty(server, "sendDrawCardRequest", {value : ()=>{
               server.sendToServer({type: "game", action: "draw"});
            },
            writable : false});
    });
};

initGame();
