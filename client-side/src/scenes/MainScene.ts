import GameManager from "../game/GameManager";
import {cardMgr} from "../card/CardManager";
import {server} from "../index";
import MessageBox from "../Components/impl/MessageBox";
import CardHolder from "../Components/impl/CardHolder";
import Character from "../Components/impl/Character";
import Button from "../Components/impl/Button";
import PlayerStats from "../Components/impl/PlayerStats";

export let gameManager: GameManager;

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
        this.load.image("text-holder", "assets/sprites/ui/text-holder.png");
        this.load.image("button-normal", "assets/sprites/ui/button-normal.png");
        this.load.image("button-highlighted", "assets/sprites/ui/button-highlighted.png");
        this.load.image("button-disabled", "assets/sprites/ui/button-disabled.png");

        this.load.image("icon-1", "assets/sprites/ui/icon-1.png");
        this.load.image("icon-2", "assets/sprites/ui/icon-2.png");
        this.load.image("icon-3", "assets/sprites/ui/icon-3.png");
        this.load.image("icon-4", "assets/sprites/ui/icon-4.png");

        this.load.spritesheet("knight-idle", "assets/sprites/characters/noBKG_KnightIdle_strip.png", {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet("knight-attack", "assets/sprites/characters/noBKG_KnightAttack_strip.png", {frameWidth: 144, frameHeight: 64});

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

        let messageBoxComponent = new MessageBox(this, 50, 350, "text-holder");
        let cardHolderComponent = new CardHolder(this, 20, 580, "card-holder");
        let characterComponent = new Character(this, 770, 210, "knight-idle");
        let enemyCharacterComponent = new Character(this, 1120, 180, "knight-idle", 3, true);
        let endTurnButton = new Button(this, 1080, 550, "END TURN",
            "button-normal",
            "button-disabled",
            "button-highlighted",
            ()=>server.sendEndTurnRequest()
        );

        let healthStats = new PlayerStats(this, 1000, 300, "icon-1", "Health-Placeholder");
        let manaStatus = new PlayerStats(this, 1000, 320, "icon-2", "Mana-Placeholder");
        let armourStats = new PlayerStats(this, 1000, 340, "icon-3", "Armour-Placeholder");
        let weaponStatus = new PlayerStats(this, 1000, 360, "icon-4", "Weapon-Placeholder");
        let enemyHealthStats = new PlayerStats(this, 1000, 400, "icon-1", "Health-Placeholder");
        let enemyManaStatus = new PlayerStats(this, 1000, 420, "icon-2", "Mana-Placeholder");
        let enemyArmourStats = new PlayerStats(this, 1000, 440, "icon-3", "Armour-Placeholder");
        let enemyWeaponStatus = new PlayerStats(this, 1000, 460, "icon-4", "Weapon-Placeholder");

        gameManager = new GameManager(this, 700, 200);
        gameManager.addGameObject("MessageBox", messageBoxComponent);
        gameManager.addGameObject("CardHolder", cardHolderComponent);
        gameManager.addGameObject("Character", characterComponent);
        gameManager.addGameObject("EnemyCharacter", enemyCharacterComponent);
        gameManager.addGameObject("EndTurnButton", endTurnButton);

        gameManager.addGameObject("healthStats", healthStats);
        gameManager.addGameObject("manaStatus", manaStatus);
        gameManager.addGameObject("armourStats", armourStats);
        gameManager.addGameObject("weaponStatus", weaponStatus);

        gameManager.addGameObject("enemyHealthStats", enemyHealthStats);
        gameManager.addGameObject("enemyManaStatus", enemyManaStatus);
        gameManager.addGameObject("enemyArmourStats", enemyArmourStats);
        gameManager.addGameObject("enemyWeaponStatus", enemyWeaponStatus);

        // TODO: Make this one request.
        server.notifyClientReady();
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

    public update() {}
}
