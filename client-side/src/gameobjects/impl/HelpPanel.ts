import { IGameObject } from "../IGameObject";
import Button from "./Button";
import { MenuScene } from "../../scenes/MenuScene";
import MenuPanel from "./MenuPanel";

export default class HelpPanel extends MenuPanel implements IGameObject {
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
        this.add(this.backButton);

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
