import { serverCom } from "./serverCom";

const msgBox: HTMLElement = document.getElementById("msg-need-send");
const sendBtn: HTMLElement = document.getElementById("send-btn");
const exit: HTMLElement = document.getElementById("exit");
const receiveBox: HTMLElement = document.getElementById("receive-box");

// Web server stuff:
const server = new serverCom();

server.init();

const ws = server.ws;
ws.onmessage = data => {
    // Process data.
    let json = JSON.parse(data.data);
    let newLine: string = "";
    if (json.type === "info")
        newLine = "[INFO] " + json.message;
    else if (json.type === "broadcast")
        newLine = "[MSG] [ID-" + json.from + "] " + json.message;
    // When server feeds back data, this logs data inside HTML.
    receiveBox.innerHTML += `<p>${newLine}</p>`;
    receiveBox.scrollTo({
        top: receiveBox.scrollHeight,
        behavior: "smooth"
    });
};

// Send message on enter pressed.
document.onkeydown = function (event: KeyboardEvent) {
    // Calls on enter pressed, enter has a key code of 13.
    if (event && event.keyCode == 13) {
        sendBtn.click();
        // Cancels key press event so that enter does not get logged.
        return false;
    }
};

sendBtn.onclick = () => {
    // Detect if input box is empty, then send info to server.
    let input: string = (<HTMLInputElement> msgBox).value.trim();
    if (input !== "") {
        if (!input.startsWith('/'))
            server.sendToServer({ type: "broadcast", message: input });
        else
            server.sendToServer({ type: "command", label: input.substr(1, input.indexOf(' ') - 1), args: input.substr(input.indexOf(' ') + 1) });
    }
    
    (<HTMLInputElement> msgBox).value = "";
};

exit.onclick = () => {
    // Request to close socket.
    ws.close();
};