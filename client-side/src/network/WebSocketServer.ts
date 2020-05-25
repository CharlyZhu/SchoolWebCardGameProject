import {server} from "../index";

export class WebSocketServer {
    private _ws: WebSocket;

    // Initializes websocket and applies a response handler.
    public async init(responseHandler: (response: string)=>void): Promise<void> {
        if (!window.WebSocket)
            return;

        //this._ws = new WebSocket("ws://54.37.66.227:8001");
        this._ws = new WebSocket("ws://localhost:8001");

        await new Promise<void>((resolve, reject) => {
            // Listener for when connection is made and the server is open.
            this._ws.onopen = () => {
                console.log("Connected to server at " + this._ws.url + ".");
                resolve();
            };

            // Listener for when error occurs.
            this._ws.onerror = () => {
                console.log("Connection failed when connecting to " + this._ws.url + ".");
                reject();
            };
        });

        // Listener for when server sends back a message.
        this._ws.onmessage = data => responseHandler(data.data.toString());

        // Callback function for when server shuts down.
        this._ws.onclose = () => {
            this._ws.close();
            console.log("You have lost connection to the remote server.");
            // Sends a signal to responseHandler.
            responseHandler(JSON.stringify({type: "closed"}));
        };

        // Sets that websocket closes before page closes.
        window.onbeforeunload = () => this._ws.close();
    }

    // Send an JSON object to server.
    public sendToServer(jsonObj: {}): void {
        // Output prep section. Encoding can be added in the future.
        if (this._ws.readyState !== this._ws.OPEN)
            return;
        this._ws.send(JSON.stringify(jsonObj));
    }

    // Closing connection with server.
    public close() {
        this._ws.close();
    }

    // Send a message to server for broadcasting.
    private sendChat(msg: string): void {
        this.sendToServer({type: "broadcast", message: msg});
    }

    // Send an command to server.
    private sendCommand(cmd: string): void {
        let spaceIdx: number = cmd.indexOf(' ');
        let label: string = cmd.substr(1);
        let args: string = cmd.substr(spaceIdx + 1);
        if (spaceIdx >= 1)
            label = cmd.substr(1, spaceIdx - 1);
        else
            args = "";
        this.sendToServer({ type: "command", label: label, args: args });
    }

    // Auto decide upon whether to treat message as command or message.
    public sendMsg(msg: string): void{
        if (!msg.startsWith('/'))
            this.sendChat(msg);
        else
            this.sendCommand(msg);
    }

    // Sends server some object once every certain intervals.
    public setTimerTask(jsonObj, interval: number, endCb: ()=>void) {
        let checker = setInterval(()=>{
            this.sendToServer(jsonObj);
            if (this._ws.readyState === this._ws.CLOSED) {
                clearInterval(checker);
                endCb();
            }
        }, interval);
    }

    public notifyClientReady() {
        server.sendToServer({type: "game", action: "client-ready"});
    }

    public sendDealCardRequest(index: number) {
        server.sendToServer({type: "game", action: "deal", value: index});
    }

    public sendEndTurnRequest() {
        server.sendToServer({type: "game", action: "end-turn"});
    }

    public sendDrawCardRequest() {
        server.sendToServer({type: "game", action: "draw"});
    };
}
