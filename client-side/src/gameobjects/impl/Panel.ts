import {IGameObject} from "../IGameObject";
import Button from "./Button";

export default class Panel extends Phaser.GameObjects.Image implements IGameObject {

    private btn: Button;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scale = 5;
    }

    public onEnable() {}
}