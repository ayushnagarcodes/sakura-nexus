const header = document.querySelector("header");
const navMenu = document.querySelector("nav");
const hamburgerMenu = document.querySelector(".menu-hamburger");
const navLinks = document.querySelectorAll(".menu-items ul li");
const translateBtn = document.getElementById("btn-translate");
const elementToObserve = document.querySelector(".observe");

// Hamburger Menu
function modifyNav() {
    if (navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
}

hamburgerMenu.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        modifyNav();
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }
});

// Sticky Nav
const observer = new window.IntersectionObserver(
    ([entry]) => {
        if (entry.isIntersecting) {
            header.classList.remove("sticky");
            return;
        }
        header.classList.add("sticky");
    },
    {
        root: null,
        threshold: 0,
        rootMargin: "-80px",
    }
);
observer.observe(elementToObserve);

// Translate Page
translateBtn.onclick = () => {
    console.log("Translating...");
};
