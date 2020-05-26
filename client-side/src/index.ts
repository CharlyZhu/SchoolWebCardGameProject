import "phaser";
import { WebSocketServer } from "./network/WebSocketServer";
import { MenuScene } from "./scenes/MenuScene";
import { LoaderScene } from "./scenes/LoaderScene";
import { GameScene } from "./scenes/GameScene";
import {getCookie} from "./util";

// Web server instance.
export const server = new WebSocketServer();

export const gameConfig = {
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
    audio: {
        sound: true,
        music: true
    }
};

let soundSetting = getCookie("sound");
gameConfig.audio.sound = soundSetting === null || soundSetting == true;
let musicSetting = getCookie("music");
gameConfig.audio.music = musicSetting === null || musicSetting == true;

// Creating the game instance.
const game = new Phaser.Game(gameConfig);

// Add scenes to the game.
game.scene.add("menu", new MenuScene(), true);
game.scene.add("loader", new LoaderScene());
game.scene.add("mainscene", new GameScene());
