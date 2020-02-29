// This part of code goes into content-home.php, to help #showcase switch between all possible sections.
let showcaseWrapper = document.querySelector("#showcase");
let showcases = document.querySelectorAll("#showcase .container div");
let indices = document.querySelectorAll("#showcase .container li");
let counter = 0;
displayNextShowCase();
setInterval(displayNextShowCase, 10000);

function displayNextShowCase() {
    counter++;
    setShowCaseIndex(counter);
}

function setShowCaseIndex(targetIndex) {
    counter = targetIndex;
    let selectedShowcase = document.querySelector("#showcase .container div.s" + counter);
    let selectedIndex = document.querySelector("#showcase .container li.s" + counter);
    if (selectedShowcase === null) {
        counter = 1;
        selectedShowcase = document.querySelector("#showcase .container div.s" + counter);
        selectedIndex = document.querySelector("#showcase .container li.s" + counter);
    }
    showcases.forEach((item, index)=>{
        let current = index + 1;
        if (current != counter)
            item.style.color = "rgba(255, 255, 255, 0)";
        else
            item.style.color = "rgba(255, 255, 255, 1)";
        if (current > counter)
            item.style.transform = "translateX(100%)";
        else
            item.style.transform = "translateX(-100%)";

        indices[index].classList.remove("highlighted");
    });
    selectedShowcase.style.transform = "translateX(0)";
    selectedIndex.classList.add("highlighted");
    showcaseWrapper.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url('images/showcases/showcase-" + counter + ".png') no-repeat fixed center";
}