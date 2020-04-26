require("./serverCb");
require("./CardManager");
require("./ConnManager");

// Require needed files, important websocket stuff, initialization of websocket.
let ws = require("ws");
console.log("[INFO] Initializing web socket...");

// Creating server and applying default callback functions.
ws = new ws.Server({
	port: serverConfig.server.port,
	perMessageDeflate: {
		zlibDeflateOptions: {
			// See zlib defaults.
			chunkSize: 1024,
			memLevel: 7,
			level: 3
		},
		zlibInflateOptions: {
			chunkSize: 10 * 1024
		},
		// Other options settable:
		clientNoContextTakeover: true, // Defaults to negotiated value.
		serverNoContextTakeover: true, // Defaults to negotiated value.
		serverMaxWindowBits: 10, // Defaults to negotiated value.
		// Below options specified as default values.
		concurrencyLimit: 10, // Limits zlib concurrency for perf.
		threshold: 1024 // Size (in bytes) below which messages
		// should not be compressed.
	}
});

console.log("[INFO] Successfully created web socket, listening at " + serverConfig.server.port + ".");
ws.on("connection", (conn)=>connMgr.connCb(conn));

connMgr.globalChecker();
