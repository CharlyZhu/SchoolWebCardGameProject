let http = require("http");

class CardManager {
    constructor() {
        // Setup basic card stuff.
        this.readJSON("www.empiraft.com", "/resources/card_game/json/?file=cards").then((result)=>{
            this.cardDeck = result.deck;
            this.cardList = result.cards;
        }).catch((error) =>{
            console.log("error: " + error.stack);
        });
    }

    async readString(host, path) {
        return await new Promise((resolve, reject)=>{
            let request = http.request({host: host, path: path}, function (response) {
                let data = '';
                response.on('data', function (chunk) {
                    data += chunk;
                });
                response.on('end', function () {
                    resolve(data);
                });
            });
            request.on('error', (error)=>{
                reject(error);
            });
            request.end();
        });
    }

    async readJSON(host, path) {
        return await new Promise((resolve, reject)=>{
            this.readString(host, path).then((jsonStr)=>{
                resolve(JSON.parse(jsonStr));
            }).catch((error)=>{
                reject(error);
            });
        });
    }
}

cardMgr = new CardManager();