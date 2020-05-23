import GameManager from "../game/GameManager";
import Button from "../gameobjects/impl/Button";
import MenuPanel from "../gameobjects/impl/MenuPanel";
import HelpPanel from "../gameobjects/impl/HelpPanel";
import SettingsPanel from "../gameobjects/impl/SettingsPanel";

export class MenuScene extends Phaser.Scene {
    private helpPanel: HelpPanel;

    private settingPanel: SettingsPanel;

    private gameBtn: Button;
    private helpBtn: Button;
    private settingBtn: Button;

    constructor() {
        super("menu");
    }

    public preload() {
        this.load.image("title", "assets/sprites/ui/title.png");
        this.load.image("button-long1", "assets/sprites/ui/button-long1.png");
        this.load.image("button-long2", "assets/sprites/ui/button-long2.png");
        this.load.image("button-long3", "assets/sprites/ui/button-long3.png");
        this.load.image("sound-off", "assets/sprites/ui/Sound-Off.png");
        this.load.image("sound-on", "assets/sprites/ui/Sound-On.png");
        this.load.image("sound-base", "assets/sprites/ui/SoundButton.png");
        this.load.image(
            "LargeMenuPanel",
            "assets/sprites/ui/LargeMenuPanel.png"
        );
    }

    public create() {
        this.add.sprite(600, 200, "title").setScale(5, 5);
        let gameManager = new GameManager(this);
        this.gameBtn = new Button(
            this,
            600,
            340,
            "FIND ONLINE PLAYER",
            "button-long1",
            "button-long2",
            "button-long3",
            () => this.scene.start("loader")
        );
        this.settingBtn = new Button(
            this,
            600,
            400,
            "SETTINGS",
            "button-long1",
            "button-long2",
            "button-long3",
            () => {
                this.settingPanel.enableAll();
            }
        );
        this.helpBtn = new Button(
            this,
            600,
            460,
            "HELP",
            "button-long1",
            "button-long2",
            "button-long3",
            () => {
                this.settingPanel.enableAll();
            }
        );

        this.helpPanel = new HelpPanel(this, this, 600, 300, "LargeMenuPanel");

        this.settingPanel = new SettingsPanel(
            this,
            this,
            600,
            300,
            "LargeMenuPanel"
        );

        gameManager.addGameObject("start-button", this.gameBtn);
        gameManager.addGameObject("setting-button", this.settingBtn);
        gameManager.addGameObject("help-button", this.helpBtn);
        gameManager.addGameObject("help-panel", this.helpPanel);
        gameManager.addGameObject("settings-panel", this.settingPanel);
        this.enableAll();
    }

    public disableAll(): void {
        this.helpBtn.disableInteractive();
        this.gameBtn.disableInteractive();
        this.settingBtn.disableInteractive();
    }

    public enableAll(): void {
        this.helpBtn.setInteractive();
        this.gameBtn.setInteractive();
        this.settingBtn.setInteractive();
    }
}
