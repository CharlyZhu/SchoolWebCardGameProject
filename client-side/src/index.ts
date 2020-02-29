import "phaser";
import { serverCom } from "./serverCom/serverCom";

const initGame = () => {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

    // Webserver stuff:
    const server = new serverCom();
    server.init().then(() => {
        server.sendToServer({ type: "log", message: "Rowan sends his regards" });
    });
};

function preload() {}

function create() {}

function update() {}

initGame();
