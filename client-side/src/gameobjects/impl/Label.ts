import {GameScene} from "../../scenes/GameScene";
import Message from "../../game/Message";

export default class Label extends Phaser.GameObjects.Sprite {
    private _message: Message;

    public constructor(scene: GameScene, x: number, y: number, iconSprite: string, message: string, scale: number=1) {
        super(scene, x, y, iconSprite);
        this.setScale(scale);
        this._message = new Message(scene, x + this.width + 5, y, message, scale * 15, true);
        this.setOrigin(0, 0);
        scene.add.existing(this);
    }
}