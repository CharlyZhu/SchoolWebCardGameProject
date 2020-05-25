import GameManager from "../game/GameManager";
import {cardMgr} from "../card/CardManager";
import {server} from "../index";
import MessageBox from "../gameobjects/impl/MessageBox";
import CardHolder from "../gameobjects/impl/CardHolder";
import Character from "../gameobjects/impl/Character";
import Button from "../gameobjects/impl/Button";
import Label from "../gameobjects/impl/Label";
import Notice from "../gameobjects/impl/Notice";
import TimeMeter from "../gameobjects/impl/TimeMeter";

export let gameManager: GameManager;

export class GameScene extends Phaser.Scene {
    constructor() {
        super("mainscene");
    }

    public preload() {
        this.load.image("background", "assets/sprites/ui/background.png");
        this.load.image("queue-notice", "assets/sprites/ui/queue-notice.png");
        this.load.image("card-holder", "assets/sprites/ui/card-holder.png");
        this.load.image("icon-holder", "assets/sprites/ui/icon-holder.png");
        this.load.image("text-holder", "assets/sprites/ui/text-holder.png");
        this.load.image("button-normal", "assets/sprites/ui/button-normal1.png");
        this.load.image("button-highlighted", "assets/sprites/ui/button-normal2.png");
        this.load.image("button-disabled", "assets/sprites/ui/button-normal3.png");
        this.load.image("icon-1", "assets/sprites/ui/icon-1.png");
        this.load.image("icon-2", "assets/sprites/ui/icon-2.png");
        this.load.image("icon-3", "assets/sprites/ui/icon-3.png");
        this.load.image("icon-4", "assets/sprites/ui/icon-4.png");
        this.load.image("icon-5", "assets/sprites/ui/icon-5.png");
        this.load.image("icon-6", "assets/sprites/ui/icon-6.png");
        this.load.image("time-meter", "assets/sprites/ui/time-meter.png");
        this.load.image("time-meter-fill", "assets/sprites/ui/time-meter-fill.png");
        this.load.spritesheet("knight-idle", "assets/sprites/characters/noBKG_KnightIdle_strip.png", {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("knight-attack", "assets/sprites/characters/noBKG_KnightAttack_strip.png", {frameWidth: 144, frameHeight: 64});

        this.load.audio("bgm", "assets/audio/bgm/46_GXver.mp3");
        this.load.audio("card-draw", "assets/audio/sound/card-draw.mp3");
        this.load.audio("chain-mail", "assets/audio/sound/chain-mail.mp3");
        this.load.audio("coin", "assets/audio/sound/coin.mp3");
        this.load.audio("damage", "assets/audio/sound/damage.mp3");
        this.load.audio("forge", "assets/audio/sound/forge.mp3");
        this.load.audio("heal", "assets/audio/sound/heal.mp3");
        this.load.audio("swing", "assets/audio/sound/swing.mp3");

        // Loading card sprite images into the game.
        this.loadCardSprites().then(()=>{ console.log("Card sprites successfully loaded."); });
    }

    public create() {
        this.prepareAnimations();
        this.renderGameObjects();
        // Tells server that client is ready and can be queued in a game.
        server.notifyClientReady();
    }

    // Loads in sprite for cards from the internet using image URLs.
    public async loadCardSprites(): Promise<void> {
        await new Promise((resolve)=>{
            for (let i = 0; i < cardMgr.getCardListLength(); i++) {
                this.load.image(cardMgr.getCardName(i), cardMgr.getCardImgURL(i));
                console.log(cardMgr.getCardName(i), cardMgr.getCardImgURL(i));
            }
            resolve();
        });
    }

    public renderGameObjects() {
        const background = this.add.image(600, 300, "background");
        background.scale *= 3.5;

        new Label(this, 1000, 300, "icon-1", "= Health");
        new Label(this, 1000, 320, "icon-2", "= Mana");
        new Label(this, 1000, 340, "icon-3", "= Armour");
        new Label(this, 1000, 360, "icon-4", "= Weapon Damage");
        new Label(this, 1000, 380, "icon-5", "Strength");

        gameManager = new GameManager(this);
        gameManager.timer = new TimeMeter(this, 660, 290, "time-meter", "time-meter-fill", 60);
        gameManager.messageBox = new MessageBox(this, 30, 350, "text-holder");
        gameManager.cardHolder = new CardHolder(this, 20, 580, "card-holder");
        gameManager.player = new Character(this, 850, 190, "knight-idle");
        gameManager.player.enemy = new Character(this, 1120, 170, "knight-idle", 3, true);
        gameManager.player.enemy.enemy = gameManager.player;
        gameManager.queueNotice = new Notice(this, 500, 440, "queue-notice");
        gameManager.endTurnBtn = new Button(this, 1080, 500, "END TURN",
            "button-normal",
            "button-disabled",
            "button-highlighted",
            ()=>server.sendEndTurnRequest()
        );
        new Button(this, 1080, 550, "EXIT",
            "button-normal",
            "button-disabled",
            "button-highlighted",
            ()=>location.reload()
        );

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
        this.anims.create({
            key: "knight-attack-anim",
            frames: this.anims.generateFrameNumbers("knight-attack", {
                start: 0,
                end: 22
            }),
            frameRate: 20,
            repeat: 0
        });
    }

    public update() {
        gameManager.cardHolder.onUpdate();
    }
}
