import Message from "./Message";

export default class FloatIndication extends Phaser.GameObjects.Image {
    private _msgDisplay: Message;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, message: string) {
        super(scene, x, y, texture);
        this.scale = 3;
        this.alpha = .9;
        scene.add.existing(this);

        this._msgDisplay = new Message(this.scene, this.x, this.y, message, 20, true, "Arial", 'white').setOrigin(.5, .5);
    }

    onUpdate() {
        this._msgDisplay.y -= 0.2;
        this.y -= 0.2;
        this._msgDisplay.alpha -= 0.002;
        this.alpha -= 0.002;
        if (this.alpha <= 0) {
            this._msgDisplay.destroy();
            this.destroy();
        }
    }
}