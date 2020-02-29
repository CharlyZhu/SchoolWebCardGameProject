// Define default game options.

// What default food should be like.

// Total food.

// This function generates data for a food.

// Require needed files, important websocket stuff, initializaton of websocket.
let ws = require("nodejs-websocket");
console.log("[INFO] Initializing web socket...");
// Creates the server.
let server = ws.createServer();
// Adds a listener on making connection.
server.addListener("connection", function(connection)
{
	// Calls on msg receive.
	connection.addListener('text', function(msg) {
		// Input prep section. Decoding can be added in the future.
		// Translate message to object.
		let obj = JSON.parse(msg);
		switch (obj.type) {
			case "log":
				console.log("[INFO] Message received: " + obj.message);
				break;
			case "broadcast":
				console.log("[INFO] Broadcasting: " + obj.message);
				// TODO: Add a function that broadcasts messages to clients.
				break;
			default:
				break;
		}
	});

	// Calls on connection close.
	connection.addListener('close', function() {

	});

	// Calls on error occur.
	connection.addListener('error', function() {

	});
});

// Asks the server to listen to port 8001.
server.listen(8001);
console.log("[INFO] Successfully created web socket.");
function get_distance(loc1, loc2) { return Math.sqrt(Math.pow(Math.abs(loc1.x - loc2.x), 2) + Math.pow(Math.abs(loc1.y - loc2.y), 2)); }