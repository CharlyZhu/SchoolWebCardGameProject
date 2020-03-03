import $ from "jquery";

// Creates a unique ID for the web page (page session)
export function generateUUID(): string {
    let d: number = new Date().getTime();
    let uuid: string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
    return uuid;
};

// Sets cookie to browser.
export function setCookie(name, value, expireTime): void {
    let exp: Date = new Date();
    exp.setTime(exp.getTime() + expireTime);
    document.cookie = name + "="+ escape(value) + ";expires=" + exp['toGMTString']();
}

// Obtain cookie from browser.
export function getCookie(name): string {
    let arr, reg: RegExp = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else return null;
}

// Using jQuery ajax to obtain information from server.
let serverAddress = "localhost/";
export function checkAgainstServer(requestObj, receiveCb)
{
    jQuery.ajax(
        {
            type: "POST",
            url: serverAddress + "rest-api/account_api.php",
            dataType: 'json',
            data: requestObj,
            success: function (replyObj) {
                // If there is error in the function.
                if (!('error' in replyObj)) {
                    receiveCb(replyObj);
                } else console.log(replyObj);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr);
                console.log(ajaxOptions);
                console.error(thrownError);
            }
        }).then((r)=>{

    });
}

export async function readString(url: string): Promise<string> {
    let request: XMLHttpRequest = new XMLHttpRequest();
    // Sets obtain method and url.
    request.open("get", url);
    // Sets send body (data) to nothing.
    request.send(null);
    return await new Promise<string>((resolve, reject)=>{
        // Sets callback on XHR object message return.
        request.onload = function () {
            // If status returned is 200, data is successfully obtained.
            if (request.status == 200) {
                let jsonStr = request.responseText;
                if (jsonStr !== "")
                    resolve(jsonStr);
            }
            reject("");
        };
    });
}

export async function readJSON(url: string): Promise<{}> {
    return await new Promise<{}>((resolve, reject)=>{
        readString(url).then((jsonStr)=>{
            resolve(JSON.parse(jsonStr));
        }).catch(()=>{
            reject({});
        });
    });
}