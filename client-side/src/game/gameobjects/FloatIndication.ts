import Message from "./Message";

export default class FloatIndication extends Phaser.GameObjects.Image {
    private _msgDisplay: Message;
    private _velocityY: number;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, message: string) {
        super(scene, x, y, texture);
        this.scale = 3;
        this.alpha = .9;
        this._velocityY = 0;
        scene.add.existing(this);

        this._msgDisplay = new Message(this.scene, this.x, this.y, message, 20, true, "Arial", 'white').setOrigin(.5, .5);
    }

    onUpdate() {
        this._velocityY += 0.03;
        this._msgDisplay.y -= this._velocityY;
        this.y -= this._velocityY;
        this._msgDisplay.alpha -= 0.004;
        this.alpha -= 0.004;
        if (this.alpha <= 0) {
            this._msgDisplay.destroy();
            this.destroy();
        }
    }
}