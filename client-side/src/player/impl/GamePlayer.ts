import { MainScene } from "../../scenes/MainScene";
import Card from "../../card/Card";
import {cardMgr} from "../../card/CardManager";
import Message from "../../game/Message";

/*
 * Display layer of the game, contains methods that will update the display of the game.
 * TODO: The name probably needs changing in the future.
 */
export default class GamePlayer extends Phaser.GameObjects.Container {
    private readonly _characterSprite: Phaser.GameObjects.Sprite;
    private readonly _enemySprite: Phaser.GameObjects.Sprite;

    private readonly _txtHealth: Message;
    private readonly _txtCardsLeft: Message;
    private readonly _txtMana: Message;
    private readonly _txtEnemyHealth: Message;
    private readonly _txtEnemyCardsLeft: Message;
    private readonly _txtEnemyMana: Message;

    private _arrPlayerHand: Card[] = [];
    private _arrMessages: Message[] = [];

    private readonly CARDS_IN_HAND_ANCHOR_X = 150;
    private readonly CARDS_IN_HAND_ANCHOR_Y = 450;
    private readonly CARDS_IN_HAND_INTERVAL_X = 170;

    private readonly CARD_DEAL_POS_X = 150;
    private readonly CARD_DEAL_POS_Y = 450;

    public constructor(scene: MainScene, x: number, y: number) {
        super(scene, x, y);

        // Rendering out character.
        this._characterSprite = scene.add.sprite(x, y, "knight-idle").play("knight-idle-anim", true);
        this._characterSprite.scale = 5;

        // Rendering out enemy, make it reversed and smaller, to show that he is in a distance.
        this._enemySprite = scene.add.sprite(x + 400, y - 30, "knight-idle").play("knight-idle-anim", true, 7);
        this._enemySprite.scale = 3;
        this._enemySprite.scaleX = -this._enemySprite.scaleX;

        this.CARD_DEAL_POS_X = x + 200;
        this.CARD_DEAL_POS_Y = y - 50;

        // Rendering out character information.
        this._txtHealth = new Message(this.scene, -50, -130, "HEALTH", 90, true);
        this.add(this._txtHealth);
        this._txtCardsLeft = new Message(this.scene, -50, -120, "CARDS_LEFT", 90, true);
        this.add(this._txtCardsLeft);
        this._txtMana = new Message(this.scene, -50, -110, "MANA", 90, true);
        this.add(this._txtMana);

        // Rendering out enemy information.
        this._txtEnemyHealth = new Message(this.scene, 350, -130, "ENEMY_HEALTH", 90, true);
        this.add(this._txtEnemyHealth);
        this._txtEnemyCardsLeft = new Message(this.scene, 350, -120, "ENEMY_CARDS_LEFT", 90, true);
        this.add(this._txtEnemyCardsLeft);
        this._txtEnemyMana = new Message(this.scene, 350, -110, "ENEMY_MANA", 90, true);
        this.add(this._txtEnemyMana);
    }

    public updateHealthTxt(health: number) {
        this._txtHealth.text = "Health: " + health;
    }

    public updateCardsLeft(cardsLeft: number) {
        this._txtCardsLeft.text = "Cards Left: " + cardsLeft;
    }

    public updateEnemyHealth(health: number) {
        this._txtEnemyHealth.text = "Enemy Health: " + health;
    }

    public displayCardOnBoard(index: number) {
        let card = new Card(this.scene, this.CARD_DEAL_POS_X, this.CARD_DEAL_POS_Y, cardMgr.getCardName(index - 1), 2);
        this.scene.add.existing(card);
    }

    public addCardToHand(index: number): void {
        let card = new Card(this.scene, this._arrPlayerHand.length * this.CARDS_IN_HAND_INTERVAL_X + this.CARDS_IN_HAND_ANCHOR_X, this.CARDS_IN_HAND_ANCHOR_Y, cardMgr.getCardName(index));
        card.indexInHand = this._arrPlayerHand.length;
        this.scene.add.existing(card);

        this._arrPlayerHand.push(card);
    }

    // Remove a card from player's hand based on its hand index position.
    public removeCardFromHand(index: number): void {
        if (index < 0 || index > this._arrPlayerHand.length)
            return;

        let card = this._arrPlayerHand[index];
        card.destroy();
        this._arrPlayerHand.splice(index, 1);

        this.tidyCardsInHand();
    }

    // Tidies cards in hand and re-calculates the order.
    public tidyCardsInHand() {
        for (let i: number in this._arrPlayerHand) {
            let card = this._arrPlayerHand[i];
            if (i != card.indexInHand) {
                card.x = i * this.CARDS_IN_HAND_INTERVAL_X + this.CARDS_IN_HAND_ANCHOR_X;
                card.indexInHand = i;
            }
        }
    }

    public addMessage(message: string) {
        let newMsgRect = new Message(this.scene, 10, 10, "[INFO] " + message);

        // Removes the top message.
        if (this._arrMessages.length == 10)
            this._arrMessages.shift().destroy();

        for (let i: number in this._arrMessages) {
            let msgRect = this._arrMessages[i];
            msgRect.y += newMsgRect.height;
        }
        this.scene.add.existing(newMsgRect);
        this._arrMessages.push(newMsgRect);
        console.log(message);
    }
}
