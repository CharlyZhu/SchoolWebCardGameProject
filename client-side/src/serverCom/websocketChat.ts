import { serverCom } from "./serverCom";
import { setCookie, getCookie } from "../util";

const msgBox: HTMLElement = document.getElementById("msg-need-send");
const sendBtn: HTMLElement = document.getElementById("send-btn");
const exit: HTMLElement = document.getElementById("exit");
const receiveBox: HTMLElement = document.getElementById("receive-box");

// Array to store prev commands.
let cmdHis: Array<string> = Array();
let cmdIdxPtr: number = 0;

// Check if there is a cached command history cookie, if there is, apply that too.
let cmdHisCookie = getCookie("command_history");
if (cmdHisCookie) {
    cmdHis = JSON.parse(cmdHisCookie).history;
    cmdIdxPtr = cmdHis.length - 1;
}

// Web server stuff:
const server = new serverCom();
let ws: WebSocket = null;

server.init().then(() => {
    ws = server.ws;

    // Calls when message received from server.
    ws.onmessage = data => {
        let newLine: string = "";

        // Process data.
        let json = JSON.parse(data.data);
        switch(json.type) {
            case "heartBeat":
                // Sending the server timestamp back to server to complete ping test server side.
                server.sendToServer({type: "heartBeat", timestamp: json.timestamp});
                break;
            case "ping":
                newLine = "[PING] Pong: " + json.value + "ms";
                break;
            case "info":
                newLine = "[INFO] " + json.message;
                break;
            case "broadcast":
                newLine = "[MSG] [" + json.from + "] " + json.message;
                break;
        }

        // When server feeds back data, this logs data inside HTML.
        receiveBox.innerHTML += `<p>${newLine}</p>`;
        receiveBox.scrollTo({
            top: receiveBox.scrollHeight,
            behavior: "smooth"
        });
    };

    // Send message on enter pressed.
    document.onkeydown = function (event: KeyboardEvent) {
        // Calls on enter pressed, sends the message in the chat box.
        if (event && event.key === "Enter") {
            sendBtn.click();
            // Cancels key press event so that enter does not get logged.
            return false;
        }
        if (event && event.key === "ArrowUp") {
            (<HTMLInputElement> msgBox).value = cmdHis[cmdIdxPtr];
            if (cmdIdxPtr > 0) {
                cmdIdxPtr--;
            }
            return false;
        }
        if (event && event.key === "ArrowDown") {
            if (cmdIdxPtr < cmdHis.length - 1) {
                cmdIdxPtr++;
                (<HTMLInputElement> msgBox).value = cmdHis[cmdIdxPtr];
                return false;
            }
            (<HTMLInputElement> msgBox).value = "";
            return false;
        }
    };

    sendBtn.onclick = () => {
        // Detect if input box is empty, then send info to server.
        let input: string = (<HTMLInputElement> msgBox).value.trim();
        if (input !== "") {
            cmdHis.push(input);
            cmdIdxPtr = cmdHis.length - 1;
            setCookie("command_history", JSON.stringify({history: cmdHis, ptr: cmdIdxPtr}), 1000 * 60 * 60 * 24);
            if (!input.startsWith('/'))
                server.sendChat(input);
            else
                server.sendCommand(input);
        }

        (<HTMLInputElement> msgBox).value = "";
    };

    exit.onclick = () => {
        // Request to close socket.
        ws.close();
    };
});