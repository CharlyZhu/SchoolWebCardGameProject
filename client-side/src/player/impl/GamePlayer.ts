import { MainScene } from "../../scenes/MainScene";
import Card from "../../card/Card";
import {cardMgr} from "../../card/CardManager";

export default class GamePlayer extends Phaser.GameObjects.Container {
    private _arrPlayerHand: Card[] = [];

    private readonly CARDS_IN_HAND_ANCHOR_X = 300;
    private readonly CARDS_IN_HAND_ANCHOR_Y = 480;
    private readonly CARDS_IN_HAND_INTERVAL_X = 130;

    public displayCardOnBoard(index: number) {
        let card = new Card(this.scene, 100, 100, cardMgr.getCardName(index-1));
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

    public tidyCardsInHand() {
        for (let i: number in this._arrPlayerHand) {
            let card = this._arrPlayerHand[i];
            if (i != card.indexInHand) {
                card.x = i * this.CARDS_IN_HAND_INTERVAL_X + this.CARDS_IN_HAND_ANCHOR_X;
                card.indexInHand = i;
            }
        }
    }

    /*public constructor() {
            for (let i = 0; i < 5; i++) {
                const card = new Card(this._gameScene, i * 100 + 400, 500, "dummycard");
                card.scale = 0.3;
                this._arrPlayerHand.push(card);
                this._gameScene.add.existing(card);
                console.log("card added " + i.toString());
            }
    }

    public drawCard(): void {
        let cardDrawn: boolean = false;
        this._arrPlayerHand.forEach((element) => {
            if (!element.isRevealed && !cardDrawn) {
                element.cardDrawn();
                cardDrawn = true;
            }
        });
    }*/


    private _sprSprite: Phaser.GameObjects.Image;
    private _txtLife: Phaser.GameObjects.Text;
    private _lifeTotal: number = 30;

    public constructor(scene: MainScene, x: number, y: number, spriteString: string) {
        super(scene, x, y);
        this.create(scene, spriteString);
    }

    public create(scene: MainScene, spriteString: string): void {
        this._sprSprite = new Phaser.GameObjects.Image(
            scene,
            0,
            0,
            spriteString
        );
        this.add(this._sprSprite);

        this._txtLife = new Phaser.GameObjects.Text(
            scene,
            0,
            0,
            this._lifeTotal.toString(),
            { fontFamily: "Roboto Condensed" }
        );
        this.add(this._txtLife);
    }
}
