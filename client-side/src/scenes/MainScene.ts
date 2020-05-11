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

        this.load.image("background", "assets/sprites/ui/background.png");
        this.load.image("card-holder", "assets/sprites/ui/card-holder.png");

        this.load.spritesheet("knight-idle", "assets/sprites/characters/noBKG_KnightIdle_strip.png", {frameWidth: 64, frameHeight: 64});

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
        this.prepareAnimations();

        const background = this.add.image(600, 300, "background");
        background.scale *= 3.5;

        const cardHolder = this.add.image(500, 450, "card-holder");
        cardHolder.scale *= 4;

        gamePlayer = new GamePlayer(this, 700, 200);
        this.add.existing(gamePlayer);

        server.notifyClientReady();

        const deck = this.add.image(1100, 450, "sqrorange");
        deck.scaleX = 0.5;
        deck.scaleY = 0.8;
        deck.setInteractive();
        deck.on("pointerdown", () => {
            //server.sendDrawCardRequest();
            server.sendEndTurnRequest();
        });

        /*this.input.on('gameobjectdown', function (pointer, gameObject) {
            // To make sure that it is card that we are handling.
            if (gameObject.indexInHand != null) {
                server.sendDealCardRequest(gameObject.indexInHand);
            }
        });
        this.input.on('pointerover',function(pointer, gameObject){
            // To make sure that it is card that we are handling.
            if (gameObject.indexInHand != null) {
                gameObject.scale *= 1.5;
            }
        });
        this.input.on('pointerout',function(pointer, gameObject){
            // To make sure that it is card that we are handling.
            if (gameObject.indexInHand != null) {
                gameObject.scale /= 1.5;
            }
        });*/

        server.sendToServer({type: "status", value: "QUEUEING"});
    }

    public prepareAnimations() {
        this.anims.create({
            key: "knight-idle-anim",
            frames: this.anims.generateFrameNumbers("knight-idle", {
                start: 0,
                end: 15
            }),
            frameRate: 15,
            repeat: -1
        });
    }

    public update() {}
}
