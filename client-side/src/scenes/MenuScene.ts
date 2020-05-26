import Button from "../game/gameobjects/Button";
import {gameConfig} from "../index";
import Message from "../game/gameobjects/Message";
import {setCookie} from "../util";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    public preload() {
        this.load.image("title", "assets/sprites/ui/title.png");
        this.load.image("button-normal1", "assets/sprites/ui/button-normal1.png");
        this.load.image("button-normal2", "assets/sprites/ui/button-normal2.png");
        this.load.image("button-normal3", "assets/sprites/ui/button-normal3.png");
        this.load.image("button-long1", "assets/sprites/ui/button-long1.png");
        this.load.image("button-long2", "assets/sprites/ui/button-long2.png");
        this.load.image("button-long3", "assets/sprites/ui/button-long3.png");
        this.load.image("setting-panel", "assets/sprites/ui/setting-panel.png");
        this.load.image("help-panel", "assets/sprites/ui/help-panel.png");
    }

    public create() {
        this.add.sprite(600, 180, "title").setScale(5);
        new Button(this, 600, 340, "FIND GAME",
            "button-long1",
            "button-long2",
            "button-long3",
            ()=>this.scene.start("loader")
        );
        let settingBtnSetup = ()=>{
            let panel = this.add.sprite(600, 300, "setting-panel").setScale(1.1);
            let soundEffectMsg = new Message(this, 400, 300, "Sound Effect: ", 25, true, "Arial", "#3b1700").setOrigin(0, .5);
            let soundEffectBtn = new Button(this, 650, 300, (gameConfig.audio.sound ? "On" : "Off"),
                "button-normal1",
                "button-normal2",
                "button-normal3",
                ()=>{
                    gameConfig.audio.sound = !gameConfig.audio.sound;
                    setCookie("sound", gameConfig.audio.sound, 100000);
                    soundEffectBtn.setText((gameConfig.audio.sound ? "On" : "Off"));
                }
            );
            let musicMsg = new Message(this, 400, 360, "Game Music: ", 25, true, "Arial", "#3b1700").setOrigin(0, .5);
            let musicBtn = new Button(this, 650, 360, (gameConfig.audio.music ? "On" : "Off"),
                "button-normal1",
                "button-normal2",
                "button-normal3",
                ()=>{
                    gameConfig.audio.music = !gameConfig.audio.music;
                    setCookie("music", gameConfig.audio.music, 100000);
                    musicBtn.setText((gameConfig.audio.music ? "On" : "Off"));
                }
            );
            let backBtn = new Button(this, 600, 560, "BACK",
                "button-long1",
                "button-long2",
                "button-long3",
                ()=>{
                    panel.destroy(true);
                    soundEffectMsg.destroy(true);
                    soundEffectBtn.destroy(true);
                    musicMsg.destroy(true);
                    musicBtn.destroy(true);
                    backBtn.destroy(true);
                }
            );
        };
        new Button(this, 600, 400, "SETTINGS",
            "button-long1",
            "button-long2",
            "button-long3",
            ()=>settingBtnSetup()
        );
        new Button(this, 600, 460, "HELP",
            "button-long1",
            "button-long2",
            "button-long3",
            ()=>{
                let panel = this.add.sprite(600, 300, "help-panel").setScale(1.1);
                let backBtn = new Button(this, 600, 560, "BACK",
                    "button-long1",
                    "button-long2",
                    "button-long3",
                    ()=>{
                        panel.destroy(true);
                        backBtn.destroy(true);
                    }
                );
            }
        );
    }
}
