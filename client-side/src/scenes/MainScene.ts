import { ICard } from "../card/CardManager";
import { Card } from "../card/card";
import { GameObjects } from "phaser";

export class MainScene extends Phaser.Scene {
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

    const card1 = this.add.image(400, 500, "dummycard");
    card1.scale = 0.3;

    const card2 = this.add.image(500, 500, "dummycard");
    card2.scale = 0.3;

    const card3 = this.add.image(600, 500, "dummycard");
    card3.scale = 0.3;

    const card4 = this.add.image(700, 500, "dummycard");
    card4.scale = 0.3;

    const card5 = this.add.image(800, 500, "dummycard");
    card5.scale = 0.3;
  }

  public update() {}
}
