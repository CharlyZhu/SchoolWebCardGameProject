import "phaser";
import { WebSocketServer } from "./network/WebSocketServer";
import { MenuScene } from "./scenes/MenuScene";
import { LoaderScene } from "./scenes/LoaderScene";
import { MainScene } from "./scenes/MainScene";

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
    backgroundColor: 0x334455,
};

// Creating the game instance.
const game = new Phaser.Game(gameConfig);

// Add scenes to the game.
game.scene.add("menu", new MenuScene(), true);
game.scene.add("loader", new LoaderScene());
game.scene.add("mainscene", new MainScene());
