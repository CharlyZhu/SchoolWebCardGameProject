import {cardMgr} from "../card/CardManager";
import {handleResponse} from "../network/responseHandler";
import {server} from "../index";

export class LoaderScene extends Phaser.Scene {
    constructor() {
        super("loader");
    }

    public preload() {

    }

    public create() {
        // Initialize the game after getting a response from server.
        server.init((response) => handleResponse(response)).then(() => {
            // Make sure that the card list is obtained from the internet.
            cardMgr.obtainCardList().then(() => {
                this.scene.start("mainscene");
            });
        });
    }
}
