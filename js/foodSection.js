function scrollToAbout() {
    document.getElementById("about").scrollIntoView({ behavior: "smooth" });
}

    function rotateCircle(element) {
const angle = element.getAttribute('data-rotation');
const circle = document.getElementById('circle-image');
circle.style.transform = `rotate(${angle}deg)`;
}

function resetRotation() {
const circle = document.getElementById('circle-image');
circle.style.transform = 'rotate(0deg)';
}
