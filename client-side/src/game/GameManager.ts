import CardHolder from "./gameobjects/CardHolder";
import MessageBox from "./gameobjects/MessageBox";
import Character from "./gameobjects/Character";
import TimeMeter from "./gameobjects/TimeMeter";
import Button from "./gameobjects/Button";
import Notice from "./gameobjects/Notice";
import {gameConfig} from "../index";

// Front layer of the game, contains methods that will update the display of the game.
export default class GameManager {
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
