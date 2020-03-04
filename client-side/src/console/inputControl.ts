// Array to store prev commands.
import {getCookie, setCookie} from "../util";
import {server} from "./index";

// Maximum amount of input history system should store.
const maxInputHistory: number = 30;

export function setupInputControl() {
    // This contains the previous input histories.
    let inputHistoryList: Array<string> = Array();
    // Pointer reference of the current position of the history list.
    let inputHistoryListPtr: number = 0;

    // Fetch HTML elements.
    const msgBox: HTMLInputElement = <HTMLInputElement> document.getElementById("msg-need-send");
    const sendBtn: HTMLElement = document.getElementById("send-btn");
    const exit: HTMLElement = document.getElementById("exit");

    // Check if there is a cached command history cookie, if there is, apply cookie history.
    let cmdHisCookie = getCookie("command_history");
    if (cmdHisCookie) {
        inputHistoryList = JSON.parse(cmdHisCookie).history;
        inputHistoryListPtr = inputHistoryList.length;
    }

    // Send message to server when sendBtn is clicked.
    sendBtn.onclick = sendInputBoxMsg;
    // Request to close socket when exit button is clicked.
    exit.onclick = server.close;
    // Set callbacks when key board is pressed.
    document.onkeydown = function (event: KeyboardEvent) {
        // Calls on enter pressed, sends the message in the chat box.
        setKeyboardPressCb(event, "Enter", sendBtn.click);
        // Calls on up arrow is pressed, moves the ptr up and apply last input history to msgBox if there is any.
        setKeyboardPressCb(event, "ArrowUp", ()=>{
            if (inputHistoryListPtr > 0) {
                inputHistoryListPtr--;
                msgBox.value = inputHistoryList[inputHistoryListPtr];
            }
        });
        // Calls on down arrow is pressed, moves the ptr down and apply next input history to msgBox if there is any.
        setKeyboardPressCb(event, "ArrowDown", ()=>{
            if (inputHistoryListPtr < inputHistoryList.length - 1) {
                inputHistoryListPtr++;
                msgBox.value = inputHistoryList[inputHistoryListPtr];
                return false;
            }
            // If pointer points to the last history, make pointer the length of the history (index + 1) and set value to empty.
            inputHistoryListPtr = inputHistoryList.length;
            msgBox.value = "";
        });
        // Cancels key press event so that enter does not get logged etc.
        return false;
    };

    // Runs callback function if event.key matches the keyName variable.
    function setKeyboardPressCb(event: KeyboardEvent, keyName: string, callback: () => void) {
        if (event && event.key === keyName)
            callback();
    }

    // Send message box message.
    function sendInputBoxMsg() {
        // Detect if input box is empty, then send info to server.
        let input: string = msgBox.value.trim();
        if (input === "")
            return;
        // Saves new input to history.
        saveInputToHistory(input);
        // Sends message to server.
        server.sendMsg(input);
        // Set the input history pointer to length of the input.
        inputHistoryListPtr = inputHistoryList.length;
        // Clear msgBox.
        msgBox.value = "";
    }

    // Saves the message to history if it is not identical to the last saved message.
    function saveInputToHistory(msg: string) {
        if (msg === inputHistoryList[inputHistoryList.length - 1])
            return;
        inputHistoryList.push(msg);
        // If the length of the history is larger than the max input history.
        if (inputHistoryList.length > maxInputHistory)
            inputHistoryList.shift();
        // If the length of the history is too large, clear the history cookie to avoid bug.
        if (inputHistoryList.length > maxInputHistory + 3) {
            setCookie("command_history", "", 1000 * 60 * 60 * 24);
            return;
        }
        // Save the input history list to cookie.
        setCookie("command_history", JSON.stringify({history: inputHistoryList, ptr: inputHistoryListPtr}), 1000 * 60 * 60 * 24);
    }
}