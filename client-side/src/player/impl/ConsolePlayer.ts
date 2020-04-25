import { server } from "../../console";
import { IPlayer } from "../IPlayer";
import { arrCardList } from "../../card/CardManager";

// This class contains methods and descriptions of the player, which is deeply related to the game.
// This class should be considered invalid when connection is not in a game.
export class ConsolePlayer implements IPlayer {
  cardsInHand: Array;

  // Adds a card into player's hand with the given card ID.
  public addCard(cardId: number): void {
    let cardBox: HTMLElement = document.getElementById("game");
    cardBox.innerHTML +=
      "<div class='card'><img src='//www.empiraft.com/resources/card_game/json/" +
      arrCardList[cardId].imgUrl +
      "' /></div>";
    this.reassignCardClickCb();
  }

  // Removes a card from player's hand from the given slot index.
  // Slot index represents the index of the card in player's hand, starting from 0 counting left to right.
  public removeCard(slotId: number): void {
    let cardBox: HTMLElement = document.getElementById("game");
    cardBox.children[slotId].remove();
    this.reassignCardClickCb();
  }

  // Reassigns click callback for all cards in hand.
  public reassignCardClickCb(): void {
    let handCards: HTMLCollection = document.getElementById("game").children;
    if (handCards.length <= 1) return;
    for (let i: number = 1; i < handCards.length; i++)
      (<HTMLElement>handCards.item(i)).onclick = () => {
        server.sendToServer({
          type: "game",
          action: "play-card",
          value: i - 1,
        });
      };
  }
}
