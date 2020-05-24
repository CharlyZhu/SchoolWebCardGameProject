import { MainScene } from "../../scenes/MainScene";
import Message from "../../game/Message";
import { IGameObject } from "../IGameObject";

export default class MessageBox extends Phaser.GameObjects.Image {
    public static readonly MAX_MESSAGE_LENGTH = 8;
    private _arrMessages: Message[] = [];

    public constructor(
        scene: MainScene,
        x: number,
        y: number,
        backgroundTexture: string
    ) {
        super(scene, x, y, backgroundTexture);
        this.setOrigin(0, 1);
        this.scale = 4;
    }

    public addMessage(
        message: string,
        color: string = "black",
        bold: boolean = false
    ): void {
        let newMsgRect = new Message(
            this.scene,
            this.x + 50,
            this.y - 90,
            "[INFO] " + message,
            18,
            bold
        );
        newMsgRect.setOrigin(0, 1);
        if (color !== "black") newMsgRect.setColor(color);

        // Removes the top message.
        if (this._arrMessages.length == MessageBox.MAX_MESSAGE_LENGTH)
            this._arrMessages.shift().destroy();

        // Handles the old messages.
        for (let i: number in this._arrMessages) {
            let msgRect = this._arrMessages[i];
            msgRect.y -= newMsgRect.height;
            msgRect.alpha =
                1 -
                (1 / MessageBox.MAX_MESSAGE_LENGTH) *
                    (this._arrMessages.length - i);
        }
        this._arrMessages.push(newMsgRect);
    }

    onEnable() {}
}
