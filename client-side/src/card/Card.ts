import { MainScene } from "../scenes/MainScene";

export default class Card extends Phaser.GameObjects.Image {
    public indexInHand: number;

    public isRevealed: boolean = true;

    public name: string;
    public uid: number;
    public manaCost: number;
    public effects: {};
    public imageURL: string;

    public constructor(scene: Phaser.Scene, x: number, y: number, textureID: string) {
        super(scene, x, y, textureID);
        this.scale = 0.25;
        // let cardJSON = JSON.parse(JSONString);
        // this.name = cardJSON.name;
        // console.log(this.name);
        // this.uid = cardJSON.uid;
        // this.manaCost = cardJSON.manaCost;
        // this.effects = cardJSON.effects;
        // this.imageURL = cardJSON.imageURL;

        this.setInteractive();
        /*this.on("pointerdown", () => {
            this.cardClicked();
            this.setInteractive(false);
        });*/
    }

    public toString(): string {
        return "Name: " + this.name +
            "\nUID: " + this.uid.toString() +
            "\nMana Cost: " + this.manaCost.toString() +
            "\nEffects: " + JSON.stringify(this.effects) +
            "\nImage Url: " + this.imageURL;
    }

    public playCard(): void {
        this.alpha = 0;
        this.isRevealed = false;
    }

    public cardClicked(): void {
        this.playCard();
    }

    public cardDrawn(): void {
        this.alpha = 1;
        this.isRevealed = true;
        this.setInteractive();
    }
}
