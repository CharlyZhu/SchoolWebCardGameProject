import {IGameObject} from "../IGameObject";

export default class Notice extends Phaser.GameObjects.Image implements IGameObject {

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scale = 5;
    }

    public onEnable() {}
}