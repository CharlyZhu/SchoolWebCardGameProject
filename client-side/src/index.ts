import "phaser";
import { Loader } from "./scenes/loader";

const initGame = () => {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: 0x0000ff
    };

    const game = new Phaser.Game(config);
    const loader = new Loader();
    game.scene.add("loader", loader, true);
};

initGame();
