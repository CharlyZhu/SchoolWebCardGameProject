export class WebSocketServer {
    ws: WebSocket;

    // Initializes websocket.
    public async init(): Promise<void> {
        if (window.WebSocket) {
            this.ws = new WebSocket("ws://54.37.66.227:8001");
            //this.ws = new WebSocket("ws://localhost:8001");

            await new Promise<void>((resolve, reject) => {
                // Listener for when connection is made and the server is open.
                this.ws.onopen = e => {
                    console.log("Connected to server at " + this.ws.url + ".");
                    resolve();
                };

                // Listener for when error occurs.
                this.ws.onerror = () => {
                    console.log("Connection failed when connecting to " + this.ws.url + ".");
                    reject();
                };
            });

            // Listener for when server sends back a message.
            this.ws.onmessage = e => {
                let data = JSON.stringify(e.data);
                console.log("MSG：" + data);
            };

            // Callback function for when server shuts down.
            this.ws.onclose = () => {
                this.ws.close();
                console.log("You have lost connection to the remote server.");
            };

            // Sets that websocket closes before page closes.
            window.onbeforeunload = () => this.ws.close();

        }
    }

    // Function for sending an object info to server.
    public sendToServer(jsonObj: {}): void {
        // Output prep section. Encoding can be added in the future.
        //console.log(JSON.stringify(jsonObj));
        if (this.ws.readyState !== this.ws.OPEN)
            return;
        this.ws.send(JSON.stringify(jsonObj));
    }

    public close() {
        this.ws.close();
    }

    private sendChat(msg: string): void {
        this.sendToServer({ type: "broadcast", message: msg });
    }

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
}
