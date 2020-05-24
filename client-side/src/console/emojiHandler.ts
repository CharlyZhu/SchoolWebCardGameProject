import {readJSON} from "../util";
import {server} from "./index";

const emojiJsonUrl = "//www.empiraft.com/resources/card_game/json/?file=emojis";
const emojiBox: HTMLElement = document.querySelector("#emoji-box");
export let emojisList;
// Creates an intractable emoji box for console.
export function setupEmojiBox(): Promise<void> {
    // Obtain the emoji json file.
    return new Promise<void>((resolve)=>{
        readJSON(emojiJsonUrl).then((result)=>{
            emojisList = result.emojis;
            createEmojiBox(emojiBox, emojisList);
            setupEmojiBoxClickCb(emojiBox);
            resolve();
        });
    });
}

// Creates the emoji box.
function createEmojiBox(emojiBox: HTMLElement, emojiList: Array<string>) {
    emojiBox.innerHTML = "";
    for (let i: number = 0; i < emojiList.length; i++) {
        emojiBox.innerHTML += "<img class='emoji' src='" + emojiList[i] + "'/>";
    }
}

// Sets click callback for emoji.
function setupEmojiBoxClickCb(emojiBox: HTMLElement) {
    let emojiItems: HTMLCollection = emojiBox.children;
    for (let i:number = 0; i < emojiItems.length; i++) {
        (<HTMLElement>emojiItems.item(i)).onclick = () => {
            server.sendToServer({type: "emoji", value: i});
        };
    }
}