import {IGameObject} from "../IGameObject";
import Message from "../../game/Message";

export default class FloatIndication extends Phaser.GameObjects.Image implements IGameObject {
    private _intervalId: NodeJS.Timeout;
    private readonly _message: string;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, message: string) {
        super(scene, x, y, texture);
        this.scale = 3;
        //this.alpha = Math.max(0, Math.min(1, damage / 6));
        this._message = message;
    }

    public onEnable() {
        let message = new Message(this.scene, this.x, this.y, this._message, 20, true, "Arial", 'white').setOrigin(.5, .5);
        this._intervalId = setInterval(()=>{
            this.y -= 0.1;
            message.y -= 0.1;
            this.alpha -= 0.001;
            message.alpha -= 0.001;
            if (this.alpha <= 0) {
                message.destroy();
                this.destroy();
            }
        }, 5);
    }
}