import {IGameObject} from "../gameobjects/IGameObject";
import CardHolder from "../gameobjects/impl/CardHolder";
import MessageBox from "../gameobjects/impl/MessageBox";
import Character from "../gameobjects/impl/Character";
import TimeMeter from "../gameobjects/impl/TimeMeter";
import Button from "../gameobjects/impl/Button";
import Notice from "../gameobjects/impl/Notice";
import {gameConfig} from "../index";

// Front layer of the game, contains methods that will update the display of the game.
export default class GameManager {
    private readonly _gameObjects: Map = new Map<string, IGameObject>();
    private readonly _scene: Phaser.Scene;

    public bgm: Phaser.Sound.BaseSound;
    public cardHolder: CardHolder;
    public messageBox: MessageBox;
    public player: Character;
    public timer: TimeMeter;
    public endTurnBtn: Button;
    public queueNotice: Notice;

    public constructor(scene: Phaser.Scene) {
        this._scene = scene;
    }

    public addGameObject(name: string, gameObject: IGameObject) {
        this._gameObjects.set(name, gameObject);
        this._scene.add.existing(gameObject);
        gameObject.onEnable();
    }

    public addGameObjectAnonymously(gameObject: IGameObject) {
        this._scene.add.existing(gameObject);
        gameObject.onEnable();
    }

    public removeGameObject(name: string) {
        if (this._gameObjects.has(name))
            this._gameObjects.delete(name);
    }

    public getGameObject(componentName: string): IGameObject {
        if (this._gameObjects.has(componentName))
            return <IGameObject>this._gameObjects.get(componentName);
    }

    public playSound(value: string, mute: boolean=!gameConfig.audio.sound, loop: boolean=false, volume: number=1): Phaser.Sound.BaseSound {
        let sound = this._scene.sound.add(value, {
            mute: mute,
            volume: volume,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: loop,
            delay: 0
        });
        sound.play();
        return sound;
    }

    public stopBgm() {
        if (this.bgm)
            this.bgm.stop();
    }
}
