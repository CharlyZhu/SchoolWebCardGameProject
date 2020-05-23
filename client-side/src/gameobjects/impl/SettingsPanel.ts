import { IGameObject } from "../IGameObject";
import Button from "./Button";
import { MenuScene } from "../../scenes/MenuScene";
import MenuPanel from "./MenuPanel";

export default class SettingsPanel extends MenuPanel implements IGameObject {
    private soundIcon: Phaser.GameObjects.Image;

    private soundButton: Button;

    private soundStatus: boolean = true;

    public constructor(
        menuScene: MenuScene,
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string
    ) {
        super(menuScene, scene, x, y, texture);
    }

    public create(): void {
        this.spr_Panel = new Phaser.GameObjects.Image(
            this.menuScene,
            0,
            0,
            this.texture
        );
        this.add(this.spr_Panel);

        this.soundButton = new Button(
            this.menuScene,
            0,
            0,
            "Sound",
            "sound-base",
            "sound-base",
            "sound-base",
            () => {
                this.manageSound();
            }
        );
        this.add(this.soundButton);
        console.log(this.soundButton);
        this.soundButton.setInteractive();

        this.soundIcon = new Phaser.GameObjects.Image(
            this.menuScene,
            0,
            0,
            "sound-on"
        );
        this.add(this.soundIcon);

        this.backButton = new Button(
            this.menuScene,
            -200,
            200,
            "BACK",
            "button-long1",
            "button-long2",
            "button-long3",
            () => {
                this.disableAll();
            }
        );
        this.add(this.backButton);

        this.alpha = 0;
    }

    public disableAll(): void {
        this.alpha = 0;
        this.backButton.removeInteractive();
        this.soundButton.removeInteractive();
        this.menuScene.enableAll();
    }

    public enableAll(): void {
        console.log("enabled");
        this.alpha = 1;
        this.menuScene.disableAll();
        this.backButton.setInteractive();
        //this.soundButton.setInteractive();
    }

    private manageSound(): void {
        console.log(this.soundIcon);
        if (this.soundStatus) {
            this.soundStatus = false;
            this.soundIcon.setTexture("sound-off");
            // this.soundIcon.
        } else !this.soundStatus;
        {
            this.soundStatus = true;
            this.soundIcon.setTexture("sound-on");
        }
    }
}
