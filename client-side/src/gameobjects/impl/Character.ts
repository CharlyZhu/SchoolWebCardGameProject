import {IGameObject} from "../IGameObject";
import {gameManager, GameScene} from "../../scenes/GameScene";
import Card from "../../card/Card";
import {cardMgr} from "../../card/CardManager";
import FloatIndication from "./FloatIndication";
import Icon from "./Icon";

export default class Character extends Phaser.GameObjects.Sprite implements IGameObject {
    private _arrPendingFloatIndicator: {}[];

    private readonly _healthIcon: Icon;
    private readonly _weaponIcon: Icon;
    private readonly _strengthIcon: Icon;
    private readonly _armourIcon: Icon;
    private readonly _manaIcon: Icon;
    private readonly _cardsIcon: Icon;

    private _cardDisplay: Card;
    public readonly CARD_DEAL_POS_X;
    public readonly CARD_DEAL_POS_Y;

    private _health: number = 30;
    private _mana: number = 0;
    private _weapon: number = 6;
    private _strength: number = 1;
    private _armour: number = 1;

    public isEnemy: boolean;
    public enemy: Character;

    public constructor(scene: Phaser.Scene, x: number, y: number, characterSprite: string, scale: number = 5, reversed: boolean = false) {
        super(scene, x, y, characterSprite);
        this.setOrigin(.5, .5);
        this.scale = scale;

        if (reversed)
            this.scaleX = -this.scaleX;

        this.CARD_DEAL_POS_X = x;
        this.CARD_DEAL_POS_Y = y - scale * 20 - 30;

        // Rendering out character information.
        this.scene.add.existing(new Phaser.GameObjects.Image(scene, x, y + scale * 17, "icon-holder").setScale(scale / 2).setDepth(1));
        this._healthIcon = new Icon(scene, x - scale * 16, y + scale * 17, "icon-1", this._health.toString(), scale / 2);
        this._manaIcon = new Icon(scene, x - scale * 8, y + scale * 17, "icon-2", this._mana.toString(), scale / 2);
        this._armourIcon = new Icon(scene, x, y + scale * 17, "icon-3", this._weapon.toString(), scale / 2);
        this._weaponIcon = new Icon(scene, x + scale * 8, y + scale * 17, "icon-4", this._strength.toString(), scale / 2);
        this._strengthIcon = new Icon(scene, x + scale * 16, y + scale * 17, "icon-5", this._armour.toString(), scale / 2);
        this._cardsIcon = new Icon(scene, x + (reversed ?  scale * 16 : -scale * 16), y - scale * 10, "icon-6", "30", scale / 2);

        this._arrPendingFloatIndicator = [];

        scene.add.existing(this);
        this.onEnable();
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

    public animateTint(colour: number) {
        let times = 0;
        let id = setInterval(()=>{
            if (times % 2 === 0)
                this.setTint(colour);
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
        // If health and new health stays the same, do nothing.
        if (this._health == value)
            return;
        let difference = Math.abs(this._health - value);
        if (this._health > value) {
            // Animate attacked
            gameManager.playSound("swing");
            this.enemy.playAnimation("knight-attack-anim", ()=>{
                this.enemy.playAnimation("knight-idle-anim");
                this.animateDamage();
                this.addFloatIndication("health", "-" + difference);
                gameManager.playSound("damage");
            });
        }
        else {
            if (!this.isEnemy)
                gameManager.messageBox.addMessage("[CARD SPRITE] Back from the brink, you surge with new vitality!", "#402056", true);
            this.addFloatIndication("health",  "+" + difference);
            gameManager.playSound("heal");
            this.animateTint(0xcaffcf);
        }
        this._healthIcon.setText(value.toString());
        this._health = value;
    }

    public updateMana(value: number): void {
        // If mana mana stays the same, do nothing.
        if (this._mana == value)
            return;
        let difference = Math.abs(this._mana - value);
        if (this._mana > value) {
            this.addFloatIndication("mana", "-" + difference);
        }
        else {
            for (let i = 0; i < difference; i++)
                this.addFloatIndication("mana",  "+1");
            gameManager.playSound("coin", undefined, undefined, .3);
        }
        this._manaIcon.setText(value.toString());
        this._mana = value;
    }

    public updateCardsLeft(value: number): void {
        this._cardsIcon.setText(value.toString());
    }

    public updateStrength(value: number): void {
        this._strengthIcon.setText(value.toString());
        if (value > this._strength) {
            for (let i = 0; i < value - this._strength; i++)
                this.addFloatIndication("strength", "+1");
            this._strengthIcon.setScale(this._strengthIcon.scale * 1.1);
            gameManager.playSound("eat");
            if (!this.isEnemy)
                gameManager.messageBox.addMessage("[CARD SPRITE] You feel your muscles bulge.", "#402056", true);
        }
        this.animateTint(0xcacfcf);
        this._strength = value;
    }

    public updateWeapon(value: number): void {
        this._weaponIcon.setText(value.toString());
        if (value > this._weapon) {
            this.addFloatIndication("weapon",  "+" + (value - this._weapon));
            this._weaponIcon.setScale(this._weaponIcon.scale * 1.3);
            gameManager.playSound("forge");
            if (!this.isEnemy)
                gameManager.messageBox.addMessage("[WEAPON SMITH] Pretty price for a pretty weapon.", "#402056", true);
        }
        this.animateTint(0xff3333);
        this._weapon = value;
    }

    public updateArmour(value: number): void {
        this._armourIcon.setText(value.toString());
        if (value > this._armour) {
            for (let i = 0; i < value - this._armour; i++)
                this.addFloatIndication("armour",  "+1");
            this._armourIcon.setScale(this._armourIcon.scale *  1.3);
            gameManager.playSound("chain-mail");
            gameManager.messageBox.addMessage("[ARMOUR SMITH] Newly forged, take care of it.", "#402056", true);
        }
        this.animateTint(0xaaaaaa);
        this._armour = value;
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
                texture = "icon-5";
                break;
        }
        this._arrPendingFloatIndicator.push({texture: texture, value: value});
    }

    onEnable() {
        gameManager.addGameObjectAnonymously(this._healthIcon);
        gameManager.addGameObjectAnonymously(this._manaIcon);
        gameManager.addGameObjectAnonymously(this._weaponIcon);
        gameManager.addGameObjectAnonymously(this._armourIcon);
        gameManager.addGameObjectAnonymously(this._strengthIcon);
        gameManager.addGameObjectAnonymously(this._cardsIcon);
        setInterval(()=>{
            if (this._arrPendingFloatIndicator.length > 0) {
                let indicator = this._arrPendingFloatIndicator.shift();
                gameManager.addGameObjectAnonymously(new FloatIndication(this.scene, this.x + Math.random() * 40 - 20, this.y + Math.random() * 40 - 80, indicator.texture, indicator.value));
            }
        }, 500);
    }
}