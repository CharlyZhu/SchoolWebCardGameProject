// Require needed files, important websocket stuff, initialization of websocket.
let ws = require("nodejs-websocket");

console.log("[INFO] Initializing web socket...");

let connections = Array();
let connId = 0;

const heartbeatCb = (conn) => {
	let timeout = 3000;
	// Creates an interval object that runs handler function once 1000 ms.
	let interval = setInterval(()=>{
		// Sends heart beat packet to client and checks if the client's last response time had been over time out time.
		send(conn, { type: "heartBeat", timestamp: new Date().getUTCMilliseconds()});
		if (new Date().getUTCMilliseconds() - conn.lastAliveTimeStamp > timeout) {
			if (conn.readyState == 1)
				conn.close("time out");
			console.log("[INFO] Connection [" + conn.id + "] terminated due to heartbeat timeout.");
			clearInterval(interval);
			return;
		}
	}, 1000);
};

// Creating server and applying default callback functions.
let server = ws.createServer((conn) => {
	// Assign an unique ID for the new connection then store it within the connection.
	connections.push(conn);
	conn.id = connId++;
	conn.status = "CONNECTED";
	conn.nickname = "ID-" + conn.id;
	conn.lastAliveTimeStamp = new Date().getUTCMilliseconds();
	console.log("[INFO] New connection established with ID number " + conn.id);
	send(conn, {type: "info", message: "Your assigned ID is " + conn.id});
	broadcast({type: "broadcast", message: "New connection joined with ID " + conn.id, from: conn.nickname});

	// Start heart beat checking.
	heartbeatCb(conn);

	// Calls on msg receive.
	conn.addListener('text', function(msg) {
		// Input prep section. Decoding can be added in the future.
		// Translate message to object.
		let obj = JSON.parse(msg);
		switch (obj.type) {
			case "heartBeat":
				conn.lastAliveTimeStamp = new Date().getUTCMilliseconds();
				conn.ping = new Date().getUTCMilliseconds() - obj.timestamp;
				break;
			case "log":
				console.log("[INFO] Message received: " + obj.message);
				break;
			case "broadcast":
				console.log("[INFO] Broadcasting: " + obj.message);
				// Broadcasts messages to clients.
				broadcast({type: "broadcast", message: obj.message,  from: conn.nickname});
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
		console.log("[INFO] Connection [" + conn.id + "] closed.");
	});

	// Calls on error occur.
	conn.addListener('error', (e) => {
		console.log("[ERROR] Connection [" + conn.id + "] produced error:");
		console.log(e);
        conn.close();
	});
});

// Global interval thing that does some general stuff. TODO: MAKE COMMENT MORE SPECIFIC.
setInterval(()=>{
	// Remove connections that has a ready state of CLOSED.
	connections = connections.filter((conn)=>{
		return conn.readyState !== undefined && conn.readyState !== 3;
	});
}, 5000);

// Asks the server to listen to port 8001.
server.listen(8001);
console.log("[INFO] Successfully created web socket, listening at 8001.");

// Sends a json obj to a connection.
function send(conn, jsonObj) {
	// Checks if connections is open, send if it is.
	if (conn.readyState === 1)
		conn.send(JSON.stringify(jsonObj));
}

// Sends a json obj to all open connections.
function broadcast(jsonObj) {
	connections.forEach((conn) => {
		send(conn, jsonObj);
	});
}

// Handles command json object from conn.
function handleCommand(conn, cmdJsonObj) {
	let cmdArgs = cmdJsonObj.args.split(' ');
	let argsCount = cmdArgs.length;
	if (cmdJsonObj.args === "")
		argsCount = 0;
	switch(cmdJsonObj.label) {
		case "connections":
			if (argsCount === 0) {
				send(conn, {type: "info", message: "Command error, not supported argument."});
				break;
			}
			switch (cmdArgs[0]) {
				case "count":
					send(conn, {type: "info", message: "There are currently " + connections.length + " connection(s) online."});
					break;
				case "list":
					let output = "Connections: ";
					connections.forEach(conn => output += conn.id + " " );
					send(conn, {type: "info", message: output.trim()});
					break;
			}
			break;
		case "ping":
			send(conn, {type: "ping", value: conn.ping});
			break;
		case "status":
			if (argsCount === 0) {
				send(conn, {type: "info", message: "Your current status is: " + conn.status + "."});
				break;
			}
			switch (cmdArgs[0]) {
				case "list":
					send(conn, {type: "info", message: "Allowed status: CONNECTED, QUEUEING, IN-GAME, BANNED."});
					break;
				case "set":
					if (argsCount <= 1) {
						send(conn, {type: "info", message: "Command error, not supported argument."});
						break;
					}
					conn.status = cmdArgs[1];
					send(conn, {type: "info", message: "Your status changed to: " + conn.status + "."});
					break;
				case "reset":
					conn.status = "CONNECTED";
					send(conn, {type: "info", message: "Your status changed to: " + conn.status + "."});
					break;
			}
			break;
		case "nick":
			if (argsCount === 0) {
				send(conn, {type: "info", message: "  - nick set [NAME]	:: Setting nick name for yourself."});
				send(conn, {type: "info", message: "  - nick check			:: Checking your current nickname."});
				send(conn, {type: "info", message: "  - nick reset			:: Setting nick name back to default."});
				break;
			}
			switch (cmdArgs[0]) {
				case "set":
					if (argsCount <= 1) {
						send(conn, {type: "info", message: "Command error, not supported argument."});
						break;
					}
					conn.nickname = cmdArgs[1];
					send(conn, {type: "info", message: "Your nickname has changed to: " + conn.nickname + "."});
					break;
				case "check":
					send(conn, {type: "info", message: "Your current nickname is: " + conn.nickname + "."});
					break;
				case "reset":
					conn.nickname = "ID-" + conn.id;
					send(conn, {type: "info", message: "Your nickname has changed to: " + conn.nickname + "."});
					break;
			}
			break;
		default:
			send(conn, {type: "info", message: "Command error, no such command."});
			break;
	}
}