import {IGameObject} from "../IGameObject";
import {MainScene} from "../../scenes/MainScene";
import Card from "../../card/Card";
import {cardMgr} from "../../card/CardManager";

export default class CardHolder extends Phaser.GameObjects.Image implements IGameObject {
    private _arrPlayerHand: Card[] = [];

    private readonly CARDS_IN_HAND_ANCHOR_X = 150;
    private readonly CARDS_IN_HAND_ANCHOR_Y = 450;
    private readonly CARDS_IN_HAND_INTERVAL_X = 180;

    public constructor(scene: MainScene, x: number, y: number, backgroundTexture: string) {
        super(scene, x, y, backgroundTexture);
        this.setOrigin(0, 1);
        this.scale = 4;
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

    public enableAllCards() {
        this.setTint(0xffffff);
        this._arrPlayerHand.forEach((card: Card)=>{
            card.setDisabled(false);
        });
    }

    public disableAllCards() {
        this.setTint(0xaaaaaa);
        this._arrPlayerHand.forEach((card: Card)=>{
            card.setDisabled(true);
        });
    }

    onEnable() {
    }
}