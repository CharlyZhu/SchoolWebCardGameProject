/* 包含动态检查登入和注册表单 */
function formCheck()
{
	// 获取注册按钮和登入按钮
	let loginBtn = document.querySelector(".login-btn");
	let signupBtn = document.querySelector(".signup-btn");
	
	// 登陆表单检测
	if (loginBtn)
	{
		let loginNameInput = document.querySelector(".login .uid input");

		let classNameArray = new Array("uid", "pwd", "captcha");

		/* 给一个 classList 标记为 pass, warn 或 error */
		function setMark(className, value, noticeContent)
		{
			let input = document.querySelector(".login ." + className + " input");
			let msg = document.querySelector(".login span." + className);
			switch(value)
			{
				case "error":
				if (!input.parentNode.classList.contains(value))
					input.parentNode.classList.add("error");
				msg.classList.remove("pass"); 
				msg.classList.remove("warn"); 
				noticeContent = "<i class=\"fas fa-exclamation-circle\"></i>" + noticeContent;
				break;
				case "warn":
				input.parentNode.classList.remove("error");
				msg.classList.remove("pass"); 
				msg.classList.remove("error"); 
				noticeContent = "<i class=\"fas fa-exclamation-circle\"></i>" + noticeContent;
				break;
				case "pass":
				input.parentNode.classList.remove("error");
				msg.classList.remove("warn"); 
				msg.classList.remove("error"); 
				noticeContent = "<i class=\"fas fa-check-circle\"></i>" + noticeContent;
				break;
				case "":
				input.parentNode.classList.remove("error");
				msg.classList.remove("pass"); 
				msg.classList.remove("warn"); 
				msg.classList.remove("error"); 
				return;
				default:
					console.log("错误: 输入了错误的标记。");
				return;
			}
			if (msg.innerHTML !== noticeContent)
				msg.innerHTML = noticeContent;
			if (!msg.classList.contains(value))
				msg.classList.add(value); 
		}

		/* 检查未填充的空位上是否有除未填充之外的标记，填充的位置上是否有未填充的标记 */
		function checkFalseBlankError(className)
		{
			let input = document.querySelector(".login ." + className + " input");
			let msg = document.querySelector(".login span." + className);
			if (input.value.trim() == "")
			{
				if (msg.classList.contains("pass") || msg.classList.contains("warn") || msg.classList.contains("error"))
				{
					if (msg.innerHTML !== "<i class=\"fas fa-exclamation-circle\"></i>此项不能为空 !")
					{                
						setMark(className, "", "");
					}
				}
			}
			else
			{
				if (msg.innerHTML === "<i class=\"fas fa-exclamation-circle\"></i>此项不能为空 !")
				{                
					setMark(className, "", "");
				}
			}
		}

		/* 检查未填充的空位上是否有除未填充之外的标记，如果没有就填上标记 */
		function blankFieldCheck(className)
		{
			var input = document.querySelector(".login ." + className + " input");
			var value = input.value;
			if (value == "")
			{
				setMark(className, "error", "此项不能为空 !");
				input.value = "";
			}
		}

		// 注册表单验证
		function loginFormValidate()
		{
			for (let i in classNameArray) { checkFalseBlankError(classNameArray[i]); }

			if(loginNameInput.value.length > 0)
			{
				// 检查名称是否格式合法。
				let namePattern = /\W/;
				if (namePattern.test(loginNameInput.value))
				{
					setMark("uid", "error", "输入了不允许的字符 !");
					return;
				}

				// 检查号码是否超过10位。
				if (loginNameInput.value.length > 20)
				{
					setMark("uid", "error", "此字段不应超过20位 !");
					return;
				}

				setMark("uid", "", "");
			}
		}

		// 实时验证，每100毫秒验证一次。
		setInterval(loginFormValidate, 100);

		loginBtn.addEventListener('click', function (event)
        {
			let canSend = true;

			loginFormValidate();
			for (let i in classNameArray)
			{
				blankFieldCheck(classNameArray[i]);
				let input = document.querySelector(".login ." + classNameArray[i] + " input");
				if (input.parentNode.classList.contains("error"))
				{
					canSend = false;
				}
			}
			if (!canSend)
				event.preventDefault();
		});
	}

	// 注册表单检测
	if (signupBtn)
	{
		let signupUidInput = document.querySelector(".signup .uid input");
		let signupPasswordInput = document.querySelector(".signup .pwd input");
		let signupPasswordConfirmInput = document.querySelector(".signup .cfm-pwd input");
		let signupCaptchaInput = document.querySelector(".signup .captcha input");

		let classNameArray = new Array("uid", "pwd", "cfm-pwd", "captcha");

		/* 给一个 classList 标记为 pass, warn 或 error */
		function setMark(className, value, noticeContent)
		{
			let input = document.querySelector(".signup ." + className + " input");
			let msg = document.querySelector(".signup span." + className);
			switch(value)
			{
				case "error":
				if (!input.parentNode.classList.contains(value))
					input.parentNode.classList.add("error");
				msg.classList.remove("pass"); 
				msg.classList.remove("warn"); 
				noticeContent = "<i class=\"fas fa-exclamation-circle\"></i>" + noticeContent;
				break;
				case "warn":
				input.parentNode.classList.remove("error");
				msg.classList.remove("pass"); 
				msg.classList.remove("error"); 
				noticeContent = "<i class=\"fas fa-exclamation-circle\"></i>" + noticeContent;
				break;
				case "pass":
				input.parentNode.classList.remove("error");
				msg.classList.remove("warn"); 
				msg.classList.remove("error"); 
				noticeContent = "<i class=\"fas fa-check-circle\"></i>" + noticeContent;
				break;
				case "":
				input.parentNode.classList.remove("error");
				msg.classList.remove("pass"); 
				msg.classList.remove("warn"); 
				msg.classList.remove("error"); 
				return;
				default:
					console.log("错误: 输入了错误的标记。");
				return;
			}
			if (msg.innerHTML !== noticeContent)
				msg.innerHTML = noticeContent;
			if (!msg.classList.contains(value))
				msg.classList.add(value); 
		}

		/* 检查未填充的空位上是否有除未填充之外的标记，填充的位置上是否有未填充的标记 */
		function checkFalseBlankError(className)
		{
			let input = document.querySelector(".signup ." + className + " input");
			let msg = document.querySelector(".signup span." + className);
			if (input.value.trim() === "")
			{
				if (msg.classList.contains("pass") || msg.classList.contains("warn") || msg.classList.contains("error"))
				{
					if (msg.innerHTML !== "<i class=\"fas fa-exclamation-circle\"></i>此项不能为空 !")
					{                
						setMark(className, "", "");
					}
				}
			}
			else
			{
				if (msg.innerHTML === "<i class=\"fas fa-exclamation-circle\"></i>此项不能为空 !")
				{                
					setMark(className, "", "");
				}
			}
		}

		/* 检查未填充的空位上是否有除未填充之外的标记，如果没有就填上标记 */
		function blankFieldCheck(className)
		{
			let input = document.querySelector(".signup ." + className + " input");
			let value = input.value;
			if (value == "")
			{
				setMark(className, "error", "此项不能为空 !");
				input.value = "";
			}
		}

		// 注册表单验证
		function signUpFormValidate()
		{
			// 动态获取所有内容。
			let nameValue = signupUidInput.value;
			let pwdValue = signupPasswordInput.value;
			let pwdCfmValue = signupPasswordConfirmInput.value;
			let captchaValue = signupCaptchaInput.value;

			// 对于每一项填空，如果未填写且提示除未填写之外的信息，则清除提示。
			for (let i in classNameArray) { checkFalseBlankError(classNameArray[i]); }
			
			// 检查游戏ID。
			if (nameValue.length > 0)
			{
				// 检查名称是否格式合法。
				let namePattern = /\W/;
				if (namePattern.test(nameValue))
				{
					setMark("uid", "error", "游戏ID只能包含字母、数字和下划线 !");
					return;
				}

				// 检查名称是否多于等于5字符，少于等于20字符。
				if (nameValue.length < 5 || nameValue.length > 20)
				{
					setMark("uid", "error", "游戏ID长度需要在 5-20 字符内 !");
					return;
				}
				// 用POST在服务器检查名称是否被占用。
				jQuery.ajax(
				{
					type: "POST",
					url: serverAddress + "account_api.php",
					dataType: 'json',
					data: {action: 'player_exists', name: nameValue},
					success: function (obj) 
					{
						if(!('error' in obj)) checkNameOccupied(obj.player_exists);
						else console.log(obj);
					},
					error: function (xhr, ajaxOptions, thrownError)
					{
						console.log(xhr);
						console.log(ajaxOptions);
						console.error(thrownError);
					}
				});
				// 回调函数
				function checkNameOccupied(nameOccupied)
				{
					// 检查名称是否被占用。
					if (nameOccupied)
					{
						setMark("uid", "error", "此名称已被其他人占用 !");
						return;
					}
					
					// 如果游戏ID可行，则清除错误。
					setMark("uid", "pass", "游戏ID可用 !");
				}
			}

			// 检查密码。
			if (pwdValue.length > 0)
			{
				// 检查密码是否包含非法字符。
				let notAllowedRegex = /[^a-zA-Z0-9!@#\$%\^&\*_-]/;
				if (notAllowedRegex.test(pwdValue))
				{
					setMark("pwd", "error", "密码包含空格或不支持的符号 !");
					return;
				}
				// 检查密码是否多于等于5字符，少于等于25字符。
				if (pwdValue.length < 5)
				{
					setMark("pwd", "error", "密码长度至少需要5个字符 !"); 
					return;
				}
				else if (pwdValue.length > 25)
				{
					setMark("pwd", "error", "密码长度不能超过25个字符 !"); 
					return;
				}
				// 检查密码是否包含游戏ID。
				if (!signupUidInput.parentNode.classList.contains("error") && pwdValue.toLowerCase().indexOf(nameValue.toLowerCase()) != -1)
				{
					setMark("pwd", "error", "密码不能包含游戏ID !"); 
					return;
				}
				// 检查密码强度。
				let mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[!@#\$%\^&\*_-]))|((?=.*[!@#\$%\^&\*_-])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[!@#\$%\^&\*_-])))/;
				let strongRegex = /^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*_-]))|((?=.*[a-z])(?=.*[!@#\$%\^&\*_-])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[!@#\$%\^&\*_-])(?=.*[0-9])))/;
				let superRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_-])(?=.{8,})/;
				// 检查密码是否符合最低要求。
				if (!mediumRegex.test(pwdValue))
				{
					setMark("pwd", "error", "密码强度: 弱， 密码需包含大小写字母、数字或符号中的至少两种 !"); 
					return;
				}
				// 检查密码是否符合中等要求。
				if (!strongRegex.test(pwdValue))
				{
					setMark("pwd", "warn", "密码强度: 中等"); 
				}
				// 检查密码是否符合最高要求。
				else if (!superRegex.test(pwdValue))
				{
					setMark("pwd", "pass", "密码强度: 强"); 
				}
				// 密码极强。
				else 
				{
					setMark("pwd", "pass", "密码强度: 极强"); 
				}
			}

			// 检查确认密码。
			if (pwdCfmValue.length > 0 && pwdValue.length > 0 && !signupPasswordInput.parentNode.classList.contains("error"))
			{
				// 检查确认密码是否和密码相等。
				if (pwdCfmValue != pwdValue)
				{
					setMark("cfm-pwd", "error", "确认密码需要与密码一致"); 
					return;
				}
				// 如果合格，清除错误标签。
				setMark("cfm-pwd", "pass", "确认密码与密码一致。"); 
			}
			
			// 检查验证码
			if (captchaValue.length > 0)
			{
				setMark("captcha", "", "."); 
			}
		}

		// 实时验证，每100毫秒验证一次。
		setInterval(signUpFormValidate, 100);
		
		// 按钮按下会最后验证，如果不通过会重置。
		signupBtn.addEventListener('click', function (event)
		{
			let canSend = true;
			signUpFormValidate();
			for (let i in classNameArray)
			{
				blankFieldCheck(classNameArray[i]);
				let input = document.querySelector(".signup ." + classNameArray[i] + " input");
				if (input.parentNode.classList.contains("error"))
				{
					canSend = false;
				}
			}
			if (!canSend)
				event.preventDefault();
		});
	}
}

let captchaImg = document.querySelector('.signup img.captcha');
if (!captchaImg) captchaImg = document.querySelector('.login img.captcha');
if (captchaImg)
{
	captchaImg.addEventListener('click', function()
	{ 
		captchaImg.src = serverAdress + "external-source/securimage/securimage_show.php"; 
	});
}

let recacheQQBtn = document.querySelector(".recache-qq");
if (recacheQQBtn)
{
	recacheQQBtn.addEventListener('click', function (event)
	{
		event.preventDefault();
		clearPageIdAndReload();
	});
}

formCheck();