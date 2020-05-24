import {IGameObject} from "../IGameObject";
import Message from "../../game/Message";

export default class Icon extends Phaser.GameObjects.Image implements IGameObject {
    private readonly _text: Message;
    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, text: string, scale: number = 5) {
        super(scene, x, y, texture);
        this.scale = scale;
        this.setDepth(1);

        this._text = new Message(this.scene, x, y, "30", scale * 8, true, "Arial", 'white', 200, false);
        this._text.setOrigin(.5, .5);
        this._text.setDepth(1);
        this._text.alpha = .7;
    }

    public setText(value: string) {
        this._text.text = value;
    }

    public onEnable() {
        this.scene.add.existing(this._text);
    }
}