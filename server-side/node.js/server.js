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
	send(conn, {info: "Assigned ID " + conn.id});

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
				broadcast({broadcast: obj.message});
				break;
			default:
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

function send(conn, msg) {
	if (conn.readyState == 1)
		conn.send(JSON.stringify(msg));
}

function broadcast(msg) {
	connections.forEach((conn) => {
		send(conn, msg);
	});
}