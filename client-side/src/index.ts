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
    pixelArt: true,
    zoom: 4,
    backgroundColor: 0x0000ff,
};

// Creating the game instance.
const game = new Phaser.Game(gameConfig);

// Creating the scene objects.
const loader = new LoaderScene();
const main = new MainScene();

const initGame = () => {
    // Add scenes to the game.
    game.scene.add("loader", loader, true);
    game.scene.add("mainscene", main);

    // Initialize the game after getting a response from server.
    server.init((response) => handleResponse(response)).then(() => {});
};

initGame();
