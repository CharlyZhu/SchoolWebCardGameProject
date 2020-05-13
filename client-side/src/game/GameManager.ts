import { MainScene } from "../scenes/MainScene";
import Card from "../card/Card";
import {cardMgr} from "../card/CardManager";
import {IGameObject} from "../Components/IGameObject";

/*
 * Display layer of the game, contains methods that will update the display of the game.
 * TODO: The name probably needs changing in the future.
 */
export default class GameManager{
    private readonly _gameObjects: Map = new Map<string, IGameObject>();

    private readonly CARD_DEAL_POS_X = 150;
    private readonly CARD_DEAL_POS_Y = 450;

    private readonly _scene: Phaser.Scene;

    public constructor(scene: MainScene, x: number, y: number) {
        this._scene = scene;
        this.CARD_DEAL_POS_X = x + 200;
        this.CARD_DEAL_POS_Y = y - 50;
    }

    public addGameObject(name: string, gameObject: IGameObject) {
        this._gameObjects.set(name, gameObject);
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

    public displayCardOnBoard(index: number) {
        let card = new Card(this._scene, this.CARD_DEAL_POS_X, this.CARD_DEAL_POS_Y, cardMgr.getCardName(index - 1), 2);
        this._scene.add.existing(card);
    }
}
