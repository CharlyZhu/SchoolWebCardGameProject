import {IGameObject} from "../gameobjects/IGameObject";

/*
 * Display layer of the game, contains methods that will update the display of the game.
 * TODO: The name probably needs changing in the future.
 */
export default class GameManager {
    private readonly _gameObjects: Map = new Map<string, IGameObject>();

    private readonly _scene: Phaser.Scene;

    public constructor(scene: Phaser.Scene) {
        this._scene = scene;
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
}
