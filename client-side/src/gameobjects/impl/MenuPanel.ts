import { IGameObject } from "../IGameObject";
import Button from "./Button";
import { MenuScene } from "../../scenes/MenuScene";
import { gameManager } from "../../scenes/MainScene";

export default class MenuPanel extends Phaser.GameObjects.Container
    implements IGameObject {
    protected backButton: Button;

    protected spr_Panel: Phaser.GameObjects.Image;

    protected menuScene: MenuScene;

    protected texture: string;

    public constructor(
        menuScene: MenuScene,
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string
    ) {
        super(scene, x, y);

        this.menuScene = menuScene;

        this.texture = texture;

        // this.create();
    }

    public onEnable(): void {}

    public create(): void {
        this.spr_Panel = new Phaser.GameObjects.Image(
            this.menuScene,
            0,
            0,
            this.texture
        );
        this.add(this.spr_Panel);

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
        // gameManager.addGameObject("back-button", this.backButton);
        // this.add(this.backButton);

        this.alpha = 0;
    }

    public disableAll(): void {
        this.alpha = 0;
        this.backButton.removeInteractive();
        this.menuScene.enableAll();
    }

    public enableAll(): void {
        console.log("enabled");
        this.alpha = 1;
        this.menuScene.disableAll();
        this.backButton.setInteractive();
    }
}
