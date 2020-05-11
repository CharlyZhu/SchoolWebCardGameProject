import {server} from "../index";

export default class Card extends Phaser.GameObjects.Image {
    public indexInHand: number;

    public name: string;
    public uid: number;
    public manaCost: number;
    public effects: {};
    public imageURL: string;

    public constructor(scene: Phaser.Scene, x: number, y: number, textureID: string, scale: number=3.5) {
        super(scene, x, y, textureID);
        this.scale = scale;

        this.setInteractive().on('pointerdown', ()=>{
            if (this.indexInHand != null) {
                server.sendDealCardRequest(this.indexInHand);
            }
        }).on('pointerover', ()=>{
            this.setTint(0xaaaaaa);
        }).on('pointerout', ()=>{
            this.setTint(0xffffff);
        });
    }

    public toString(): string {
        return "Name: " + this.name +
            "\nUID: " + this.uid.toString() +
            "\nMana Cost: " + this.manaCost.toString() +
            "\nEffects: " + JSON.stringify(this.effects) +
            "\nImage Url: " + this.imageURL;
    }
}
