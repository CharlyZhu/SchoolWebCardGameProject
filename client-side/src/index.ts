import "phaser";
import { WebSocketServer } from "./network/WebSocketServer";
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

  // Webserver stuff:
  const server = new WebSocketServer();
  server.init().then(() => {
    server.sendToServer({ type: "log", message: "Rowan sends his regards" });
  });
};

initGame();
