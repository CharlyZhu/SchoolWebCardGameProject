import {IGameObject} from "../IGameObject";

export default class TimeMeter extends Phaser.GameObjects.Image implements IGameObject {
    private readonly _fill: Phaser.GameObjects.Image;
    private readonly value: number;
    private intervalID: NodeJS.Timeout;
    private currentValue: number;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, fillTexture: string, maxValue: number) {
        super(scene, x, y, texture);
        this.scale = 3;
        this.setOrigin(0, 1);

        this.currentValue = this.value = maxValue;

        this._fill = new Phaser.GameObjects.Image(scene, x, y - 19, fillTexture);
        this._fill.scale = this.scale;
        this._fill.setOrigin(0, 1);

        scene.add.existing(this);
        this.scene.add.existing(this._fill);
    }

    public onEnable() {
    }

    private startCountdown() {
        this.intervalID = setInterval(()=>{
            this.currentValue--;
            this._fill.scaleY = this.scaleY * this.currentValue / this.value;
            if (this.currentValue == 0)
                this.pauseCountdown();
        }, 1000);
    }

    public pauseCountdown() {
        if (this.intervalID)
            clearInterval(this.intervalID);
    }

    public resetCountdown() {
        this.pauseCountdown();
        this.currentValue = this.value;
        this.startCountdown();
    }
}