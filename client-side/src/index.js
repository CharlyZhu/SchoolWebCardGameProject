"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
const serverCom_1 = require("./serverCom/serverCom");
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
    const server = new serverCom_1.serverCom();
    server.init().then(() => {
        server.sendToServer({ message: "Hi from Rowan " });
    });
};
function preload() { }
function create() { }
function update() { }
initGame();
