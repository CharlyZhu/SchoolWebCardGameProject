import { IGameObject } from "../IGameObject";
import Message from "../../game/Message";

export default class Button extends Phaser.GameObjects.Container {
    private _disabled: boolean;
    private _arrTexture: string[] = new Array();
    private spr_Button: Phaser.GameObjects.Image;
    private readonly _txtText: Phaser.GameObjects.Text;

    public constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        text: string,
        buttonTexture: string,
        buttonDisabledTexture: string,
        buttonHighlightedTexture: string,
        clickCb = () => {}
    ) {
        super(scene, x, y);
        this.scale = 4;

        this._arrTexture.push(buttonTexture);
        this._arrTexture.push(buttonHighlightedTexture);
        this._arrTexture.push(buttonDisabledTexture);

        this.spr_Button = new Phaser.GameObjects.Image(
            scene,
            0,
            0,
            buttonTexture
        );
        this.add(this.spr_Button);

        this._txtText = new Phaser.GameObjects.Text(scene, 0, 0, text, {
            fontFamily: "Georgia",
            fontSize: "1",
        });
        this._txtText.setOrigin(0.5);
        this.add(this._txtText);

        this.spr_Button
            .setInteractive()
            .on("pointerdown", () => {
                clickCb();
            })
            .on("pointerover", () => {
                if (!this._disabled)
                    this.spr_Button.setTexture(buttonHighlightedTexture);
            })
            .on("pointerout", () => {
                if (!this._disabled) this.spr_Button.setTexture(buttonTexture);
            });
    }

    public onEnable() {
        this.scene.add.existing(this._txtText);
    }

    public setDisabled(value: boolean): void {
        this._disabled = value;
        if (this._disabled) this.spr_Button.setTexture(this._arrTexture[2]);
        else this.spr_Button.setTexture(this._arrTexture[0]);
    }

    public setText(text: string) {
        this._txtText.text = text;
    }
}
