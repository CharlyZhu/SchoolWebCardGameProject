/* Creates a unique ID for the page (page session) */
function generateUUID()
{
	let d = new Date().getTime();
	let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
	function(c) 
	{
		let r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	console.log(uuid);
	return uuid;
};

// Set cookies
function setCookie(name, value, expireTime)
{
	let exp = new Date();
	exp.setTime(exp.getTime() + expireTime);
	document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
}

// read cookies
function getCookie(name)
{
	let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else return null;
}

function clearPageIdAndReload()
{
	setCookie("page_id", "", -1);
	window.location.href = window.location.href.substr(0, window.location.href.indexOf("?")) + window.location.hash;
	window.location.reload();
}

function clearAllAndReload()
{
	setCookie("page_id", "", -1);
	uuid = generateUUID();
	setCookie("user_id", "", -1);
	window.location.href = window.location.href.substr(0, window.location.href.indexOf("?")) + window.location.hash;
	window.location.reload();
}

/* Using jQuery ajax to obtain information from server */
function checkAgainstServer(requestObj, customFunction)
{
	jQuery.ajax(
		{
			type: "POST",
			url: serverAddress + "account_api.php",
			dataType: 'json',
			data: requestObj,
			success: function (replyObj)
			{
				// If there is error in the function.
				if(!('error' in replyObj))
				{
					customFunction(replyObj);
				}
				else console.log(replyObj);
			},
			error: function (xhr, ajaxOptions, thrownError)
			{
				console.log(xhr);
				console.log(ajaxOptions);
				console.error(thrownError);
			}
		});
}

/* Updates QQ cache from server. */
function updatePageStatus()
{
	checkAgainstServer({action: 'qq_cache', state: uuid}, (obj) => {
		if (obj.cache.state)
		{
			// If UUID on server matches the current UUID
			if (obj.cache.state == uuid && obj.cache.state != getCookie("page_id"))
			{
				// Store the current page id for 1 hour and reload the page.
				setCookie("page_id", uuid, 24 * 60 * 60 * 1000);
				window.location.reload();
			}
			// If the UUID on server matches the stored UUID.
			else if (obj.cache.state == getCookie("page_id"))
			{
				// If this UUID does points to a qq cache but does not point to an existing account.
				if (obj.cache.account == null)
				{
					let qqDisplay = document.querySelector('.qq-display');
					qqDisplay.innerHTML = "<img src=" + obj.cache.profile_pic + " alt=\"profile-pic\" /> <span><strong>尊敬的 " + obj.cache.nickname + " 您好， 您已成功验证QQ， 请补全信息完成注册或重置QQ验证并用其他QQ账号验证。</strong></span>";
				}
				// If this UUID points to an existing account
				else
				{
					// If client does not know the user id this account has.
					if (!getCookie("user_id"))
					{
						// Write down the user id to store for an hour and reload page.
						setCookie("user_id", obj.cache.account.uid, 60 * 60 * 1000);
						window.location.reload();
					}
					// If client prefers to login using password.
					if (getCookie("login"))
					{
						let qqDisplay = document.querySelector('.qq-display');
						qqDisplay.innerHTML = "<img src=" + obj.cache.profile_pic + " alt=\"profile-pic\" /> <span><strong>尊敬的 " + obj.cache.nickname + " 您好， 您已成功验证QQ， 请补全信息完成注册或重置QQ验证并用其他QQ账号验证。</strong></span>";
						$(".login .recache-qq").css("display", "none");
					}
				}
			}
			else { clearPageIdAndReload(); }
		}
	});
}

// Bans actions from client.
function banAction()
{
	document.oncontextmenu = function(){ return false; };
	document.onselectstart = function(){ return false; };
	document.oncopy = function(){ return false; };
	document.onkeydown = function()
	{
		//if (event.ctrlKey) return false;
		if (event.altKey) return false;
		if (event.shiftKey) return false;
	}
}
banAction();