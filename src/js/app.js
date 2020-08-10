import '../css/app.css';

const uppy = document.querySelector('[data-s3-uppy]');
if (uppy) {
  import(/* webpackChunkName: "images" */ './images.js').then(() => {
    console.log('Images module loaded.');
  });
}

const gallery = document.querySelector('[glider]');
import(/* webpackChunkName: "gallery" */ './gallery.js').then(() => {
  console.log('Gallery module loaded.');
});
