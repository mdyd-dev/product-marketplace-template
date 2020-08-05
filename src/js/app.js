import '../css/app.css';

const uppy = document.querySelector('[data-s3-uppy]');
if (uppy) {
  import(/* webpackChunkName: "images" */ './images.js').then(() => {
    console.log('Images module loaded.');
  });
}
