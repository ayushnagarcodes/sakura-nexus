const header = document.querySelector("header");
const navMenu = document.querySelector("nav");
const hamburgerMenu = document.querySelector(".menu-hamburger");
const navLinks = document.querySelectorAll(".menu-items ul li");
const translateBtn = document.getElementById("btn-translate");

function modifyNav() {
    if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
}

hamburgerMenu.onclick = () => {
    navMenu.classList.toggle("active");
};

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        modifyNav();
    });
});

translateBtn.onclick = () => {
    console.log("Translating...");
};

window.onresize = () => {
    if (window.innerWidth > 900 && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
};
