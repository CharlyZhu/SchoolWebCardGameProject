export class serverCom {
    ws: WebSocket;

    public async init(): Promise<void> {
        if (window.WebSocket) {
            //this.ws = new WebSocket("ws://54.37.66.227:8001");
            this.ws = new WebSocket("ws://localhost:8001");

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

            // Listener for when server shuts down.
            this.ws.onclose = () => {
                console.log("Server closed.");
            };
        }
    }

    // Function for sending an object info to server.
    public sendToServer(output: {}): void {
        // Output prep section. Encoding can be added in the future.
        this.ws.send(JSON.stringify(output));
    }
}
