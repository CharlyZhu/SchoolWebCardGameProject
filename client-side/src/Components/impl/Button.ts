import {IGameObject} from "../IGameObject";
import Message from "../../game/Message";

export default class Button extends Phaser.GameObjects.Image implements IGameObject {
    private readonly _txtText: Message;
    private _disabled: boolean;
    private _arrTexture: string[] = new Array();

    public constructor(scene: Phaser.Scene, x: number, y: number, text: string, buttonTexture: string, buttonDisabledTexture: string, buttonHighlightedTexture: string, clickCb=()=>{}) {
        super(scene, x, y, buttonTexture);
        this.scale = 4;

        this._arrTexture.push(buttonTexture);
        this._arrTexture.push(buttonHighlightedTexture);
        this._arrTexture.push(buttonDisabledTexture);

        this._txtText = new Message(scene, x, y, text, 15, true, 'Georgia', '#3b1d1b', 100, false);
        this._txtText.setOrigin(.5, .5);

        this.setInteractive().on('pointerdown', ()=>{
            clickCb();
        }).on('pointerover', ()=>{
            if (!this._disabled)
                this.setTexture(buttonHighlightedTexture);
        }).on('pointerout', ()=>{
            if (!this._disabled)
                this.setTexture(buttonTexture);
        });
    }

    public onEnable() {
        this.scene.add.existing(this._txtText);
    }

    public setDisabled(value: boolean): void {
        this._disabled = value;
        if (this._disabled)
            this.setTexture(this._arrTexture[2]);
        else
            this.setTexture(this._arrTexture[0]);
    }

    public setText(text: string) {
        this._txtText.text = text;
    }
}