getRandomCardFromDeck = (conn) => {
    if (getCardsLeft(conn) === 0)
        return;
    let cardID = 0;
    do { cardID = Math.floor(Math.random() * 6 + 1); }
    while (conn.arrCardDeck[cardID] === undefined || conn.arrCardDeck[cardID] <= 0);
    return cardID;
};

getCardsLeft = (conn) => {
    if (!conn)
        return 0;

    let value = 0;
    for (let i = 1; i <= 6; i++)
        value += conn.arrCardDeck[i];
    return value;
};

getCurrentTime = () => {
    return new Date().getTime();
};