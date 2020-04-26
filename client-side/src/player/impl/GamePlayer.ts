import { MainScene } from "../../scenes/MainScene";

export default class GamePlayer extends Phaser.GameObjects.Container {
    private _sprSprite: Phaser.GameObjects.Image;

    private _txtLife: Phaser.GameObjects.Text;

    private _lifeTotal: number = 30;

    public constructor(
        scene: MainScene,
        x: number,
        y: number,
        spriteString: string
    ) {
        super(scene, x, y);

        this.create(scene, spriteString);
    }

    public create(scene: MainScene, spriteString: string): void {
        this._sprSprite = new Phaser.GameObjects.Image(
            scene,
            0,
            0,
            spriteString
        );

        this.add(this._sprSprite);

        this._txtLife = new Phaser.GameObjects.Text(
            scene,
            0,
            0,
            this._lifeTotal.toString(),
            { fontFamily: '"Roboto Condensed"' }
        );

        this.add(this._txtLife);
    }
}
