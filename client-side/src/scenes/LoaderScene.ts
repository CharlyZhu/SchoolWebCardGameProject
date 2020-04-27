import {cardMgr, ICard, obtainCardList} from "../card/CardManager";

export class LoaderScene extends Phaser.Scene {
    constructor() {
        super("loader");
    }

    public preload() {

    }

    public create() {
        const card: ICard = this.cache.json.get("card0002");
        console.log(card);
        console.log("main loading");

        cardMgr.obtainCardList().then(() => {
            this.scene.start("mainscene");
        });
    }
}
