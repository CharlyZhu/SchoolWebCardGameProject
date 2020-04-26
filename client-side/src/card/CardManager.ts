import { readJSON } from "../util";
import { MainScene } from "../scenes/MainScene";
import Card from "./Card";

// This dictionary should contain all the card information there is in the whole game.
// The key is the identifier, ie: the unique ID for the card.
// The value should contain the information of the card itself.
export let arrCardList: Array;
// Defines important variables.
const cardJsonUrl = "//www.empiraft.com/resources/card_game/json/?file=cards";
// Obtains the card list from online JSON files, storing card information in variable cardsList.
//
export async function obtainCardList(): Promise<void> {
  await new Promise((resolve, reject) => {
    readJSON(cardJsonUrl)
      .then((result) => {
        arrCardList = result.cards;
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export interface ICard {
  name: string;
  uid: string;
  manaCost: number;
  effects: {};
  imageURL: string;
}

export class CardManager {
  private readonly _gameScene: MainScene;
  public arrCard: Card[] = [];
  private _arrPlayerHand: Card[] = [];

  public constructor(scene: MainScene) {
    this._gameScene = scene;
    for (let i = 0; i < 5; i++) {
      const card = new Card(
        //"card0002",
        this._gameScene,
        i * 100 + 400,
        500,
        "dummycard"
      );
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
  }
}
