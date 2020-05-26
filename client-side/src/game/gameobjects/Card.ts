import {server} from "../../index";

export default class Card extends Phaser.GameObjects.Image {
    public indexInHand: number;

    // These values are for card movement animation.
    public velocityX: number;
    public targetPosX: number;

    private _disabled: boolean;

    public constructor(scene: Phaser.Scene, x: number, y: number, textureID: string, scale: number=3.5) {
        super(scene, x, y, textureID);
        this.scale = scale;

        this.setInteractive().on('pointerdown', ()=>{
            if (this.indexInHand != null) {
                server.sendDealCardRequest(this.indexInHand);
            }
        }).on('pointerover', ()=>{
            if (!this._disabled)
                this.setTint(0xaaaaaa);
        }).on('pointerout', ()=>{
            if (!this._disabled)
                this.setTint(0xffffff);
        });
        this.scene.add.existing(this);

        this.velocityX = this.targetPosX = 0;
    }

    public setDisabled(value: boolean): void {
        this._disabled = value;
        if (this._disabled)
            this.setTint(0xaaaaaa);
        else
            this.setTint(0xffffff);
    }
}
