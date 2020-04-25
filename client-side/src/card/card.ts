import { MainScene } from "../scenes/MainScene";

export default class Card extends Phaser.GameObjects.Image {
  public isRevealed: boolean;

  public name: string;
  public uid: number;
  public manaCost: number;
  public effects: {};
  public imageURL: string;
  public cardGraphics: Phaser.GameObjects.Graphics;

  public constructor(
    //JSONString: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureID: string
  ) {
    super(scene, x, y, textureID);

    // let cardJSON = JSON.parse(JSONString);

    // this.name = cardJSON.name;

    // this.uid = cardJSON.uid;

    // this.manaCost = cardJSON.manaCost;

    // this.effects = cardJSON.effects;

    // this.imageURL = cardJSON.imageURL;

    //this.cardGraphics = new Phaser.GameObjects.Graphics()

    this.setInteractive();
    this.on("pointerdown", () => {
      this.cardClicked();
      this.setInteractive(false);
    });
  }

  public toString(): string {
    return (
      "Name: " +
      this.name +
      "\nUID: " +
      this.uid.toString() +
      "\nMana Cost: " +
      this.manaCost.toString() +
      "\nEffects: " +
      JSON.stringify(this.effects) +
      "\nImage Url: " +
      this.imageURL
    );
  }

  public playCard(): void {
    this.alpha = 0;
  }

  public cardClicked(): void {
    this.playCard();
  }
}
