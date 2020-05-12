import {IGameObject} from "../IGameObject";
import {MainScene} from "../../scenes/MainScene";
import Message from "../../game/Message";
import Card from "../../card/Card";
import {cardMgr} from "../../card/CardManager";

export default class Character extends Phaser.GameObjects.Sprite implements IGameObject {
    private readonly _txtHealth: Message;
    private readonly _txtCardsLeft: Message;
    private readonly _txtMana: Message;

    private _cardDisplay: Card;
    public readonly CARD_DEAL_POS_X;
    public readonly CARD_DEAL_POS_Y;

    public constructor(scene: MainScene, x: number, y: number, characterSprite: string, characterAnimation: string, scale: number = 5, reversed: boolean = false, startFrame: number = 0) {
        super(scene, x, y, characterSprite);
        this.setOrigin(.5, .5);
        this.scale = scale;

        if (reversed)
            this.scaleX = -this.scaleX;

        this.CARD_DEAL_POS_X = x + (reversed ? -150 : 150);
        this.CARD_DEAL_POS_Y = y + 20;

        //this.play(characterAnimation, true, startFrame);

        // Rendering out character information.
        this._txtHealth = new Message(this.scene, x - 30, y - scale * 20 - 30, "HEALTH", 13);
        this._txtCardsLeft = new Message(this.scene, x - 30, y - scale * 20 - 20, "CARDS_LEFT", 13);
        this._txtMana = new Message(this.scene, x - 30, y - scale * 20 - 10, "MANA", 13);
    }

    public playAnimation(characterAnimation: string) {
        this.play(characterAnimation, true);
    }

    public stopAnimation() {
        this.anims.pause(this.anims.currentAnim.frames[0]);
    }

    public displayCard(index: number) {
        if (this._cardDisplay) {
            this._cardDisplay.setTexture(cardMgr.getCardName(index - 1));
            return;
        }
        this._cardDisplay = new Card(this.scene, this.CARD_DEAL_POS_X, this.CARD_DEAL_POS_Y, cardMgr.getCardName(index - 1), 2);
        this._cardDisplay.scale = 1/*this._cardDisplay.scale * this.scale / 5*/;
        this.scene.add.existing(this._cardDisplay);
    }

    public updateHealthText(value: number): void {
        this._txtHealth.text = "Health: " + value;
    }

    public updateCardsLeftText(value: number): void {
        this._txtCardsLeft.text = "Cards Left: " + value;
    }

    public updateManaText(value: number): void {
        this._txtMana.text = "Mana: " + value;
    }

    onEnable() {}
}