getRandomCardFromDeck = (conn) => {
    if (getCardsLeft(conn) === 0)
        return;
    let cardID = 0;
    do {
        cardID = Math.floor(Math.random() * 6 + 1);
    } while (conn.deck[cardID] === undefined || conn.deck[cardID] <= 0);
    return cardID;
};

getCardsLeft = (conn) => {
    let value = 0;
    for (let i = 1; i <= 6; i++) {
        value += conn.deck[i];
    }
    return value;
};

getCurrentTime = () => {
    return new Date().getTime();
}