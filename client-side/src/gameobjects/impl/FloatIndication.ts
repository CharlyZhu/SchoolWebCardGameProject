import {IGameObject} from "../IGameObject";
import Message from "../../game/Message";

export default class FloatIndication extends Phaser.GameObjects.Image implements IGameObject {
    private _intervalId: NodeJS.Timeout;
    private readonly _message: string;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, message: string) {
        super(scene, x, y, texture);
        this.scale = 3;
        this.alpha = .9;
        this._message = message;
    }

    public onEnable() {
        let message = new Message(this.scene, this.x, this.y, this._message, 20, true, "Arial", 'white').setOrigin(.5, .5);
        this._intervalId = setInterval(()=>{
            message.y -= 0.2;
            this.y -= 0.2;
            message.alpha -= 0.002;
            this.alpha -= 0.002;
            if (this.alpha <= 0) {
                clearInterval(this._intervalId);
                message.destroy();
                this.destroy();
            }
        }, 5);
    }
}