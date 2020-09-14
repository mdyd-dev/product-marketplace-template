import '../css/app.css';

const uppyItemPhotos = document.querySelector('[data-s3-uppy-item]');
if (uppyItemPhotos) {
  import(/* webpackChunkName: "image-upload" */ './image-upload.js').then(() => {
    console.log('Image upload module loaded.');
  });
}

const uppyPhotos = document.querySelector('[data-s3-uppy-photo]');
if (uppyPhotos) {
  import(/* webpackChunkName: "photo-image-upload" */ './photo-image-upload.js').then(() => {
    console.log('Image upload module loaded.');
  });
}

const uppyProfile = document.querySelector('[data-s3-uppy-profile]');
if (uppyProfile) {
  import(/* webpackChunkName: "profile-image-upload" */ './profile-image-upload.js').then(() => {
    console.log('Image upload module loaded.');
  });
}

const gallery = document.querySelector('.glider');
if (gallery) {
  import(/* webpackChunkName: "gallery" */ './gallery.js').then(() => {
    console.log('Gallery module loaded.');
  });
}
