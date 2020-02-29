export class serverCom {
    ws: WebSocket;

    public async init(): Promise<void> {
        if (window.WebSocket) {
            this.ws = new WebSocket("ws:www.empiraft.com:8001");

            await new Promise<void>((resolve, reject) => {
                // Listener for when connection is made and the server is open.
                this.ws.onopen = e => {
                    console.log("Connected to server at " + this + ".");
                    this.sendToServer({ message: "Opened" });
                    resolve();
                };

                // Listener for when error occurs.
                this.ws.onerror = () => {
                    console.log("Connection failed.");
                    console.log("Failed when connecting to " + this.ws + ".");
                    reject();
                };
            });

            // Listener for when server shuts down.
            this.ws.onclose = e => {
                console.log("Server closed.");
            };

            // Listener for when server sends back a message.
            this.ws.onmessage = e => {
                var data = JSON.parse(e.data);
            };
        }
    }

    // Function for sending an object info to server.
    public sendToServer(output: {}): void {
        // Output prep section. Encoding can be added in the future.
        this.ws.send(JSON.stringify(output));
    }
}
