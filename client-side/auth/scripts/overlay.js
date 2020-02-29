// Get the button
let btn = document.querySelector(".overlay .go-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = scrollFunction;

btn.onclick = topFunction;

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

let closeBtn = document.querySelector(".overlay .close");
closeBtn.onclick = () => {
    closeBtn.parentElement.style.display = 'none';
};