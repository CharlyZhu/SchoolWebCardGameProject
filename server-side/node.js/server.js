// Require needed files, important websocket stuff, initializaton of websocket.
let ws = require("nodejs-websocket");
console.log("[INFO] Initializing web socket...");

let connections = Array();
let connId = 0;

// Creating server and applying default callback functions.
let server = ws.createServer((conn) => {
	// Assign an unique ID for the new connection then store it within the connection.
	connections.push(conn);
	conn.id = connId++;
	console.log("[INFO] New connection established with ID number " + conn.id);
	send(conn, {type: "info", message: "Your assigned ID is " + conn.id});
	broadcast({type: "broadcast", message: "New connection joined with ID " + conn.id, from: conn.id});

	// Calls on msg receive.
	conn.addListener('text', function(msg) {
		// Input prep section. Decoding can be added in the future.
		// Translate message to object.
		let obj = JSON.parse(msg);
		switch (obj.type) {
			case "log":
				console.log("[INFO] Message received: " + obj.message);
				break;
			case "broadcast":
				console.log("[INFO] Broadcasting: " + obj.message);
				// Broadcasts messages to clients.
				broadcast({type: "broadcast", message: obj.message, from: conn.id});
				break;
			case "command":
				console.log("[INFO] Command received: " + obj.label);
				handleCommand(conn, obj);
				break;
			default:
				console.log("[INFO] Unknown typed text received: " + msg);
				break;
		}
	});

	// Calls on connection close.
	conn.addListener('close', function() {
		console.log("[INFO] Connection " + conn.id + " closed.");
		connections.splice(conn.id, 1);
	});

	// Calls on error occur.
	conn.addListener('error', (e) => {
		console.log("[ERROR] Connection " + conn.id + " produced error:");
		console.log(e);
		connections.splice(conn.id, 1);
	});
});

// Asks the server to listen to port 8001.
server.listen(8001);
console.log("[INFO] Successfully created web socket, listening at 8001.");

function send(conn, jsonObj) {
	if (conn.readyState == 1)
		conn.send(JSON.stringify(jsonObj));
}

function broadcast(jsonObj) {
	connections.forEach((conn) => {
		send(conn, jsonObj);
	});
}

function handleCommand(conn, cmdJsonObj) {
	switch(cmdJsonObj.label) {
		case "connections":
			let cmdArgs = cmdJsonObj.args.split(' ');
			if (cmdArgs.length == 0) {
				send(conn, {type: "info", message: "Command error, not supported argument."});
				break;
			}
			switch (cmdArgs[0]) {
				case "count":
					send(conn, {type: "info", message: "There are currently " + connections.length + " connection(s) online."});
					break;
				case "list":
					let output = "Connections: ";
					connections.forEach((conn) => {output += conn.id + " "})
					send(conn, {type: "info", message: output.trim()});
					break;
			}
			break;
		case "ping":
			send(conn, {type: "info", message: "pong"});
			break;
		default:
			send(conn, {type: "info", message: "Command error, no such command."});
			break;
	}
}