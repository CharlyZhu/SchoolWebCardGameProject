import {cardMgr} from "../card/CardManager";
import {handleResponse} from "../network/responseHandler";
import {server} from "../index";
import Message from "../game/Message";

export class LoaderScene extends Phaser.Scene {
    constructor() {
        super("loader");
    }

    public preload() {
        this.load.image("notice", "assets/sprites/ui/connection-notice.png");
    }

    public create() {
        this.add.existing(new Phaser.GameObjects.Image(this, 600, 370, "notice").setScale(5));
        let message = new Message(this, 600, 530, "Connecting to remote server, if this takes too long, it may indicate that the server id broken or offline.",
            20, true, "Arial", "#97563c").setOrigin(.5);
        // Initialize the game after getting a response from server.
        server.init((response) => handleResponse(response)).then(() => {
            message.text = "Connection to server established, fetching small assets...";
            // Make sure that the card list is obtained from the internet.
            cardMgr.obtainCardList().then(() => {
                message.text = "Complete!";
                this.scene.start("mainscene");
            });
        });
    }
}
