import { ICard } from "../card/CardManager";
import { GameObjects } from "phaser";
import Card from "../card/Card";

export class MainScene extends Phaser.Scene {
  private _playerHand: Card[] = [];

  constructor() {
    super("mainscene");
  }

  public preload() {
    this.load.image("sqrgreen", "assets/sprites/ui/square-green.png");
    this.load.image("sqrorange", "assets/sprites/ui/square-orange.png");
    this.load.image("sqrblue", "assets/sprites/ui/square-blue.png");
    this.load.image("sqrgrey", "assets/sprites/ui/square-grey.png");

    this.load.image("dummycard", "assets/sprites/ui/dummy-card.png");
  }

  public create() {
    console.log("main loaded");

    const playerHand = this.add.image(600, 500, "sqrgreen");
    playerHand.scaleX = 2;

    const deck = this.add.image(1000, 500, "sqrorange");
    deck.scaleX = 0.5;
    deck.scaleY = 0.8;

    const playerStats = this.add.image(100, 500, "sqrgrey");
    deck.scaleX = 0.5;
    deck.scaleY = 0.8;

    const opponentZone = this.add.image(600, 100, "sqrblue");
    deck.scaleX = 0.5;
    deck.scaleY = 0.8;
    console.log("UI added");

    for (let i = 0; i < 5; i++) {
      const card = new Card(this, i * 100 + 400, 500, "dummycard");
      card.scale = 0.3;
      this._playerHand.push(card);
      this.add.existing(card);
      console.log("card added " + i.toString());
    }
  }

  public update() {}
}
