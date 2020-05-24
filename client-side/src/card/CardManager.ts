import { readJSON } from "../util";

export interface ICard {
    name: string;
    uid: string;
    manaCost: number;
    effects: {};
    imageURL: string;
}

// This class holds the information of all cards and basic functions for card manipulation.
export default class CardManager {
    // Important information.
    private readonly CARD_INFO_JSON_URL =
        "//www.empiraft.com/resources/card_game/json/?file=cards";
    private readonly CARD_IMG_BASE_URL =
        "//www.empiraft.com/resources/card_game/img/?file=";

    // This array should contain all the card information there is in the whole game.
    private _arrCardList: Array;

    // Obtains the card array length.
    public getCardListLength(): number {
        return this._arrCardList.length;
    }

    // Obtains the image URL of a specific card from the array
    public getCardImgURL(index: number): string {
        if (index >= 0 && index < this.getCardListLength())
            return (
                this.CARD_IMG_BASE_URL + "000" + this._arrCardList[index].uid
            );
        else return "";
    }

    // Obtains the image URL of a specific card from the array
    public getCardName(index: number): string {
        if (index >= 0 && index < this.getCardListLength())
            return this._arrCardList[index].name;
        else return "";
    }

    // Obtains the card information array from the internet.
    public async obtainCardList(): Promise<void> {
        await new Promise((resolve, reject) => {
            readJSON(this.CARD_INFO_JSON_URL)
                .then((result) => {
                    this._arrCardList = result.cards;
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

export const cardMgr: CardManager = new CardManager();
