const openImage = (event) => {
  const image = event.target;
  const imageUrl = image.src;
  window.open(imageUrl, '_blank');
};

const images = document.querySelectorAll('.markdown img');
images.forEach((image)=> {
  image.onclick = openImage;
});
