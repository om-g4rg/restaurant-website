// -----------------------------------------------
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.querySelectorAll(".food-image");
    let dots = document.querySelectorAll(".dot");

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.opacity = "0";
        dots[i].classList.remove("active");
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.opacity = "1";
    dots[slideIndex - 1].classList.add("active");

    setTimeout(showSlides, 4000); // Change slide every 4 seconds
}
