connOnCmdCb = (conn, cmdJsonObj) => {
    let cmdArgs = cmdJsonObj.args.split(' ');
    let argsCount = cmdArgs.length;
    if (cmdJsonObj.args === "")
        argsCount = 0;
    switch(cmdJsonObj.label) {
        case "connections":
            if (argsCount === 0) {
                conn.sendJson({type: "info", message: "Command error, not supported argument."});
                break;
            }
            switch (cmdArgs[0]) {
                case "count":
                    conn.sendJson({type: "info", message: "There are currently " + this.connections.length + " connection(s) online."});
                    break;
                case "list":
                    let output = "Connections: ";
                    this.connections.forEach(conn => output += conn.id + " " );
                    conn.sendJson({type: "info", message: output.trim()});
                    break;
            }
            break;
        case "ping":
            conn.sendJson({type: "ping", value: conn.ping});
            break;
        case "status":
            if (argsCount === 0) {
                conn.sendJson({type: "info", message: "Your current status is: " + conn.status + "."});
                break;
            }
            switch (cmdArgs[0]) {
                case "list":
                    conn.sendJson({type: "info", message: "Allowed status: CONNECTED, QUEUEING, IN-GAME, BANNED."});
                    break;
                case "set":
                    if (argsCount <= 1) {
                        conn.sendJson({type: "info", message: "Command error, not supported argument."});
                        break;
                    }
                    conn.status = cmdArgs[1];
                    conn.sendJson({type: "info", message: "Your status changed to: " + conn.status + "."});
                    break;
                case "reset":
                    conn.status = "CONNECTED";
                    conn.sendJson({type: "info", message: "Your status changed to: " + conn.status + "."});
                    break;
            }
            break;
        case "nick":
            if (argsCount === 0) {
                conn.sendJson({type: "info", message: "  - nick set [NAME]	:: Setting nick name for yourself."});
                conn.sendJson({type: "info", message: "  - nick check			:: Checking your current nickname."});
                conn.sendJson({type: "info", message: "  - nick reset			:: Setting nick name back to default."});
                break;
            }
            switch (cmdArgs[0]) {
                case "set":
                    if (argsCount <= 1) {
                        conn.sendJson({type: "info", message: "Command error, not supported argument."});
                        break;
                    }
                    conn.nickname = cmdArgs[1];
                    conn.sendJson({type: "info", message: "Your nickname has changed to: " + conn.nickname + "."});
                    break;
                case "check":
                    conn.sendJson({type: "info", message: "Your current nickname is: " + conn.nickname + "."});
                    break;
                case "reset":
                    conn.nickname = "ID-" + conn.id;
                    conn.sendJson({type: "info", message: "Your nickname has changed to: " + conn.nickname + "."});
                    break;
            }
            break;
        case "img":
            if (argsCount === 0) {
                conn.sendJson({type: "info", message: "  - img [imgUrl] :: Sends image to others."});
                break;
            }
            this.broadcast({type: "img", message: cmdArgs[0],  from: conn.nickname});
            break;
        case "link":
            if (argsCount === 0) {
                conn.sendJson({type: "info", message: "  - link [url] :: Sends URL to others."});
                break;
            }
            this.broadcast({type: "link", message: cmdArgs[0],  from: conn.nickname});
            break;
        default:
            conn.sendJson({type: "info", message: "Command error, no such command."});
            break;
    }
}