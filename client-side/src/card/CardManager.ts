import { Card } from "./Card";
import { readJSON } from "../util";

// This dictionary should contain all the card information there is in the whole game.
// The key is the identifier, ie: the unique ID for the card.
// The value should contain the information of the card itself.
export let cardsList: Array;
// Defines important variables.
const cardJsonUrl = "//www.empiraft.com/resources/card_game/json/?file=cards";
// Obtains the card list from online JSON files, storing card information in variable cardsList.
//
export function obtainCardList(): void {
  readJSON(cardJsonUrl).then((result) => {
    cardsList = result.cards;
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
  public arrCard: Card[] = [];
  public constructor() {
    for (let i = 1; i < 6; i++) {}
  }
}
