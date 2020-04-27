import GamePlayer from "../player/impl/GamePlayer";
import {cardMgr} from "../card/CardManager";
import {server} from "../index";

export let gamePlayer: GamePlayer;

export class MainScene extends Phaser.Scene {
    constructor() {
        super("mainscene");
    }

    public preload() {
        this.load.image("sqrgreen", "assets/sprites/ui/square-green.png");
        this.load.image("sqrorange", "assets/sprites/ui/square-orange.png");
        this.load.image("sqrblue", "assets/sprites/ui/square-blue.png");
        this.load.image("sqrgrey", "assets/sprites/ui/square-grey.png");
        this.load.image("dummycard", "assets/sprites/ui/dummy-card.png");

        // Loading card sprite images into the game.
        this.loadCardSprites().then(()=>{
            console.log("Card sprites successfully loaded.");
        });
    }

    // Loads in sprite for cards from the internet using image URLs.
    public async loadCardSprites(): Promise<void> {
        await new Promise((resolve)=>{
            for (let i = 0; i < cardMgr.getCardListLength(); i++)
                this.load.image(cardMgr.getCardName(i), cardMgr.getCardImgURL(i));
            resolve();
        });
    }

    public create() {
        gamePlayer = new GamePlayer(this, 100, 500, "sqrgrey");
        this.add.existing(gamePlayer);

        const playerHand = this.add.image(600, 500, "sqrgreen");
        playerHand.scaleX = 2;

        const deck = this.add.image(1000, 500, "sqrorange");
        deck.scaleX = 0.5;
        deck.scaleY = 0.8;
        deck.setInteractive();
        deck.on("pointerdown", () => {
            server.sendDrawCardRequest();
        });

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject.indexInHand != null) {
                server.sendDealCardRequest(gameObject.indexInHand);
            }
        });

        server.sendToServer({type: "status", value: "QUEUEING"});
    }

    public update() {}
}
