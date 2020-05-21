import {IGameObject} from "../IGameObject";
import {MainScene} from "../../scenes/MainScene";
import Message from "../../game/Message";

export default class PlayerStats extends Phaser.GameObjects.Sprite implements IGameObject {
    private _message: Message;

    public constructor(scene: MainScene, x: number, y: number, iconSprite: string, message: string) {
        super(scene, x, y, iconSprite);
        this._message = new Message(scene, x + this.width + 5, y, message, 15);
        this.setOrigin(0, 0);
    }

    onEnable() {
    }
}