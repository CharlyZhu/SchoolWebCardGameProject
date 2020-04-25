import { ICard, CardManager, arrCardList } from "../card/CardManager";
import { GameObjects } from "phaser";
import Card from "../card/Card";

export class MainScene extends Phaser.Scene {
  private _cardManager: CardManager;

  constructor() {
    super("mainscene");
  }

  public preload() {
    this.load.image("sqrgreen", "assets/sprites/ui/square-green.png");
    this.load.image("sqrorange", "assets/sprites/ui/square-orange.png");
    this.load.image("sqrblue", "assets/sprites/ui/square-blue.png");
    this.load.image("sqrgrey", "assets/sprites/ui/square-grey.png");

    this.load.image("dummycard", "assets/sprites/ui/dummy-card.png");

    const loaderPrefix: string = "assets/cards/json/";
    this.load.json("card0002", loaderPrefix + "000" + 2 + ".json");
    this.load.json("card0003", loaderPrefix + "000" + 3 + ".json");
    this.load.json("card0004", loaderPrefix + "000" + 4 + ".json");
    this.load.json("card0005", loaderPrefix + "000" + 5 + ".json");
    this.load.json("card0006", loaderPrefix + "000" + 6 + ".json");
  }

  public create() {
    console.log("main loaded");

    const playerHand = this.add.image(600, 500, "sqrgreen");
    playerHand.scaleX = 2;

    const deck = this.add.image(1000, 500, "sqrorange");
    deck.scaleX = 0.5;
    deck.scaleY = 0.8;
    deck.setInteractive();
    deck.on("pointerdown", () => {
      this._cardManager.drawCard();
    });

    const playerStats = this.add.image(100, 500, "sqrgrey");
    deck.scaleX = 0.5;
    deck.scaleY = 0.8;

    const opponentZone = this.add.image(600, 100, "sqrblue");
    deck.scaleX = 0.5;
    deck.scaleY = 0.8;
    console.log("UI added");

    this._cardManager = new CardManager(this);

    console.log(arrCardList);
  }

  public update() {}
}
