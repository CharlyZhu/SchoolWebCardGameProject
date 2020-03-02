import "phaser";
import { serverCom } from "./serverCom/serverCom";
import { Loader } from "./scenes/loader";

const initGame = () => {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,

    };

    const game = new Phaser.Game(config);

    const loader =  new Loader();

    game.scene.add("loader", loader, true);
    
    // Webserver stuff:
    const server = new serverCom();
    server.init().then(() => {
        server.sendToServer({ type: "log", message: "Rowan sends his regards" });
    });
};



initGame();


