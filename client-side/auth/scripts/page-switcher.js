var navButtons = document.querySelectorAll(".nav-header-main li");
var contents = [document.querySelector(".middle-square"), document.querySelector(".account"), document.querySelector(".contact"), document.querySelector(".downloads")];

var accButton = document.querySelector(".account-button");
var accContent = document.querySelector(".account-suggestion");
var regContent = document.querySelector(".regular-suggestion");

/* 页面内容更换器 */
function pageSwitchListenerAdder()
{
	switchPage(navButtons[0], 0, true);
	switchPage(navButtons[1], 1, false);
	switchPage(accButton, 1, false);
	switchPage(navButtons[2], 2, true);
	switchPage(navButtons[3], 3, true);
	
	navButtons[0].classList.add("highlight");
	contents[0].classList.remove("transparent");
}

pageSwitchListenerAdder();

function switchPage(btn, index, displaySuggestion)
{
	btn.addEventListener("click", function()
	{
		for (a = 0; a < navButtons.length; a++)
		{
			navButtons[a].classList.remove("highlight");
			contents[a].classList.add("transparent");
		}
		navButtons[index].classList.add("highlight");
		contents[index].classList.remove("transparent");
		
		if (displaySuggestion)
		{
			accContent.classList.remove("none");
			regContent.classList.add("none");
		}
		else
		{
			accContent.classList.add("none");
			regContent.classList.remove("none");
		}
	});
}