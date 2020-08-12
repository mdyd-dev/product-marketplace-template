import '../css/app.css';

const uppy = document.querySelector('[data-s3-uppy]');
if (uppy) {
  import(/* webpackChunkName: "image-upload" */ './image-upload.js').then(() => {
    console.log('Image upload module loaded.');
  });
}

const gallery = document.querySelector('.glider');
if (gallery) {
  import(/* webpackChunkName: "gallery" */ './gallery.js').then(() => {
    console.log('Gallery module loaded.');
  });
}
