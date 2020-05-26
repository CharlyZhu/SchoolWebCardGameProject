export default class Notice extends Phaser.GameObjects.Image {
    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this.scale = 5;

        scene.add.existing(this);
    }
}