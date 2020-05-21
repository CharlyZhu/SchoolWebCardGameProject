import GameManager from "../game/GameManager";
import Button from "../gameobjects/impl/Button";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    public preload() {
        this.load.image("title", "assets/sprites/ui/title.png");
        this.load.image("button-long1", "assets/sprites/ui/button-long1.png");
        this.load.image("button-long2", "assets/sprites/ui/button-long2.png");
        this.load.image("button-long3", "assets/sprites/ui/button-long3.png");
    }

    public create() {
        this.add.sprite(600, 200, "title").setScale(5, 5);
        let gameManager = new GameManager(this);
        let gameBtn = new Button(this, 600, 340, "FIND ONLINE PLAYER",
            "button-long1",
            "button-long2",
            "button-long3",
            ()=>this.scene.start("loader")
        );
        let settingBtn = new Button(this, 600, 400, "SETTINGS",
            "button-long1",
            "button-long2",
            "button-long3",
            ()=>this.scene.start("loader")
        );
        let helpBtn = new Button(this, 600, 460, "HELP",
            "button-long1",
            "button-long2",
            "button-long3",
            ()=>this.scene.start("loader")
        );
        gameManager.addGameObject("start-button", gameBtn);
        gameManager.addGameObject("setting-button", settingBtn);
        gameManager.addGameObject("help-button", helpBtn);
    }
}
