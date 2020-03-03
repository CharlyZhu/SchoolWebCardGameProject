export interface IPlayer {
    // An array that stores the array of cards in hand.
    cardsInHand: Array;

    // Adds a card into player's hand with the given card ID.
    addCard(cardId: number): void;

    // Removes a card from player's hand from the given slot index.
    // Slot index represents the index of the card in player's hand, starting from 0 counting left to right.
    removeCard(slotId: number): void;

    // Reassigns click callback for all cards in hand.
    reassignCardClickCb(): void;
}