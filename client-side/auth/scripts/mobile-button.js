// 用于手机版小视窗导航栏图标
let navSlide = () =>
{
	let btn = document.querySelector(".menu-button");
	let nav = document.querySelector("header nav ul");
	let navLinks = document.querySelectorAll("header nav li");
	
	// 单击聆听器
	btn.addEventListener('click', () => 
	{
		// Toggle bar.
		nav.classList.toggle('active');
		// Animate links.
		navLinks.forEach((li, index) => 
		{
			if (li.style.animation)
			{
				li.style.animation = '';
			}
			else
			{
				li.style.animation = `navLinkFade 0.5s ease forwards ${index / 5 + 0.2}s`
			}
		});
		// Button animation.
		btn.classList.toggle('toggle');
	});
}
navSlide();