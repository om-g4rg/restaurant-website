const images = document.querySelectorAll('.image-container img');
const indicators = document.querySelectorAll('.indicator');
let index = 0;

setInterval(() => {
images[index].classList.remove('active');
indicators[index].classList.remove('active');

index = (index + 1) % images.length;

images[index].classList.add('active');
indicators[index].classList.add('active');
}, 3000);