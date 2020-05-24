import {IGameObject} from "../IGameObject";
import {gameManager, MainScene} from "../../scenes/MainScene";
import Message from "../../game/Message";
import Card from "../../card/Card";
import {cardMgr} from "../../card/CardManager";
import FloatIndication from "./FloatIndication";

export default class Character extends Phaser.GameObjects.Sprite implements IGameObject {
    private _arrPendingFloatIndicator: {}[];
    private readonly _txtHealth: Message;
    private readonly _txtCardsLeft: Message;
    private readonly _txtMana: Message;

    private _cardDisplay: Card;
    public readonly CARD_DEAL_POS_X;
    public readonly CARD_DEAL_POS_Y;

    private _health: number = 30;
    private _mana: number = 0;
    private _weapon: number = 6;
    private _strength: number = 1;
    private _armour: number = 1;

    public constructor(scene: MainScene, x: number, y: number, characterSprite: string, scale: number = 5, reversed: boolean = false) {
        super(scene, x, y, characterSprite);
        this.setOrigin(.5, .5);
        this.scale = scale;

        if (reversed)
            this.scaleX = -this.scaleX;

        this.CARD_DEAL_POS_X = x;
        this.CARD_DEAL_POS_Y = y - scale * 20 - 60;

        // Rendering out character information.
        this._txtHealth = new Message(this.scene, x - 30, y - scale * 20 - 30, "HEALTH", 13);
        this._txtCardsLeft = new Message(this.scene, x - 30, y - scale * 20 - 20, "CARDS_LEFT", 13);
        this._txtMana = new Message(this.scene, x - 30, y - scale * 20 - 10, "MANA", 13);

        this._arrPendingFloatIndicator = [];
    }

    public playAnimation(characterAnimation: string, onCompleteCb=()=>{}) {
        this.play(characterAnimation, true);
        this.once("animationcomplete", onCompleteCb);
    }

    // Animates that this character had been damaged.
    public animateDamage() {
        let times = 0;
        let id = setInterval(()=>{
            if (times % 2 === 0)
                this.setAlpha(.5);
            else
                this.setAlpha(1);
            if (++times === 20)
                clearInterval(id);
        }, 50);
    }

    public animateWeaponUpgrade() {
        let times = 0;
        let id = setInterval(()=>{
            if (times % 2 === 0)
                this.setTint(0xff3333);
            else
                this.setTint(0xffffff);
            if (++times === 6)
                clearInterval(id);
        }, 300);
    }

    public stopAnimation() {
        if (this.anims.currentAnim)
            this.anims.pause(this.anims.currentAnim.frames[0]);
    }

    public displayCard(index: number) {
        if (this._cardDisplay) {
            this._cardDisplay.setTexture(cardMgr.getCardName(index));
            return;
        }
        this._cardDisplay = new Card(this.scene, this.CARD_DEAL_POS_X, this.CARD_DEAL_POS_Y, cardMgr.getCardName(index), 2);
        this._cardDisplay.scale = 1;
        this.scene.add.existing(this._cardDisplay);
    }

    public updateHealth(value: number): void {
        let difference = Math.abs(this._health - value);
        if (difference != 0)
            this.addFloatIndication("health", (this._health > value ? "-" : "+") + difference);
        this._txtHealth.text = "Health: " + value;
        this._health = value;
    }

    public updateMana(value: number): void {
        let difference = Math.abs(this._mana - value);
        if (difference != 0)
            this.addFloatIndication("mana", (this._mana > value ? "-" : "+") + difference);
        this._txtMana.text = "Mana: " + value;
        this._mana = value;
    }

    public updateCardsLeft(value: number): void {
        this._txtCardsLeft.text = "Cards Left: " + value;
    }

    public addFloatIndication(type: string, value: string) {
        let texture = "icon-1";
        switch(type) {
            case "damage":
                texture = "icon-1";
                break;
            case "mana":
                texture = "icon-2";
                break;
            case "armour":
                texture = "icon-3";
                break;
            case "weapon":
                texture = "icon-4";
                break;
            case "strength":
                texture = "icon-4";
                break;
        }
        this._arrPendingFloatIndicator.push({texture: texture, value: value});
    }

    onEnable() {
        setInterval(()=>{
            if (this._arrPendingFloatIndicator.length > 0) {
                let indicator = this._arrPendingFloatIndicator.shift();
                gameManager.addGameObjectAnonymously(new FloatIndication(this.scene, this.x + Math.random() * 40 - 20, this.y + Math.random() * 40 - 80, indicator.texture, indicator.value));
            }
        }, 500);
    }
}