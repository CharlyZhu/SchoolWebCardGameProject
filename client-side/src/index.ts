import "phaser";
import { WebSocketServer } from "./network/WebSocketServer";
import { Loader } from "./scenes/loader";
import { MainScene } from "./scenes/MainScene";

const initGame = () => {
  const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: 0x0000ff,
  };

  const game = new Phaser.Game(config);

  const loader = new Loader();
  const main = new MainScene();

  game.scene.add("loader", loader, true);
  game.scene.add("mainscene", main);

  // Webserver stuff:
  const server = new WebSocketServer();
  server.init(()=>{
    // Handles responds.
  }).then(() => {
    server.sendToServer({ type: "log", message: "Rowan sends his regards" });
  });
};

initGame();
