//let serverCb = require("./serverCb");

// TODO: This should be lifted to somewhere else.
let config = {
	server: {
		ip: "",
		port: 8001
	},
	timeout: {
		checkFrequency: 5000,
		heartbeat: 3000,
		inactivity: 20 * 60 * 1000
	}
};

// Require needed files, important websocket stuff, initialization of websocket.
let ws = require("nodejs-websocket");
console.log("[INFO] Initializing web socket...");

let connections = Array();
let connId = 0;

const heartbeatCb = (conn) => {
	return setInterval(() => {
		// Sends heart beat packet to client and checks if the client's last response time had been over time out time.
		send(conn, { type: "heartBeat", timestamp: getCurrentTime()});
	}, 1000);
};

// Creating server and applying default callback functions.
let server = ws.createServer((conn) => {
	// Assign an unique ID for the new connection then store it within the connection.
	connections.push(conn);
	conn.id = connId++;
	conn.status = "CONNECTED";
	conn.nickname = "ID-" + conn.id;
	conn.lastAliveTimeStamp = getCurrentTime();
	conn.lastHeartBeatTimeStamp = getCurrentTime();
	conn.iAmHacker = false;
	console.log("[INFO] New connection established with ID number [" + conn.id + "].");
	send(conn, {type: "info", message: "Your assigned ID is [" + conn.id + "], there are currently " + connections.length + " online connection(s)."});
	broadcast({type: "broadcast", message: "New connection joined with ID number [" + conn.id + "].", from: conn.nickname});

	// Start heart beat checking.
	conn.heartBeatInterval = heartbeatCb(conn);

	// Calls on msg receive.
	conn.addListener('text', function(msg) {
		// Input prep section. Decoding can be added in the future.
		// Translate message to object.
		let obj = JSON.parse(msg);
		switch (obj.type) {
			case "heartBeat":
				conn.lastHeartBeatTimeStamp = getCurrentTime();
				// Calculates ping and stores it in conn obj.
				conn.ping = getCurrentTime() - obj.timestamp;
				break;
			case "obtain":
				switch(obj.target) {
					case "info":
						send(conn, {
							type: "obtainedInfo",
							ping: conn.ping,
							name: conn.nickname,
							status: conn.status
						});
						break;
					case "player":
						send(conn,{
							type: "player",
							health: conn.player.health,
							mana: conn.player.mana
						});
						break;
				}
				break;
			case "log":
				console.log("[INFO] Message received: " + obj.message);
				break;
			case "broadcast":
				console.log("[INFO] Broadcasting: " + obj.message);
				// Fun hacker stuff.
				if (obj.message === "I AM HACKER") {
					conn.iAmHacker = true;
					obj.message = "A HACKER HAS LOGGED IN!!!"
				}
				conn.lastAliveTimeStamp = getCurrentTime();
				// Broadcasts messages to clients.
				broadcast({type: "broadcast", message: obj.message,  from: conn.nickname});
				break;
			case "command":
				console.log("[INFO] Command received: " + obj.label);
				conn.lastAliveTimeStamp = getCurrentTime();
				handleCommand(conn, obj);
				break;
			case "emoji":
				console.log("[INFO] Emoji received: " + obj.value);
				conn.lastAliveTimeStamp = getCurrentTime();
				broadcast({type: "emoji", value: obj.value,  from: conn.nickname});
				break;
			default:
				console.log("[INFO] Unknown typed text received: " + msg);
				break;
		}
	});

	// Calls on connection close.
	conn.addListener('close', function() {
		console.log("[INFO] Connection [" + conn.id + "] closed.");
		clearInterval(conn.heartBeatInterval);
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

	// Closes connections that are inactive or potentially offline.
	connections.forEach((conn)=>{
		if (getCurrentTime() - conn.lastAliveTimeStamp > config.timeout.inactivity) {
			if (conn.readyState === 1)
				conn.close("time out");
			console.log("[INFO] Connection [" + conn.id + "] terminated due to inactivity.");
			return;
		}
		if (getCurrentTime() - conn.lastHeartBeatTimeStamp > config.timeout.heartbeat) {
			if (conn.readyState === 1)
				conn.close("time out");
			console.log("[INFO] Connection [" + conn.id + "] terminated due to heartbeat timeout.");
			return;
		}
	});
}, config.timeout.checkFrequency);

// Asks the server to listen to port.
server.listen(config.server.port);
console.log("[INFO] Successfully created web socket, listening at " + config.server.port + ".");

function getCurrentTime() {
	return new Date().getTime();
}

// Sends a json obj to a connection.
function send(conn, jsonObj) {
	// Checks if connections is open, send if it is.
	if (conn.readyState !== 1)
		return;
	if (conn.iAmHacker === true)
		conn.send(JSON.stringify(jsonObj));
	else
		conn.send(JSON.stringify(jsonObj).replace(/</g, "&lt;").replace(/>/g, "&gt;"));
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
		case "img":
			if (argsCount === 0) {
				send(conn, {type: "info", message: "  - img [imgUrl] :: Sends image to others."});
				break;
			}
			broadcast({type: "img", message: cmdArgs[0],  from: conn.nickname});
			break;
		case "link":
			if (argsCount === 0) {
				send(conn, {type: "info", message: "  - link [url] :: Sends URL to others."});
				break;
			}
			broadcast({type: "link", message: cmdArgs[0],  from: conn.nickname});
			break;
		default:
			send(conn, {type: "info", message: "Command error, no such command."});
			break;
	}
}