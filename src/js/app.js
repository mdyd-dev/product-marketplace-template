import '../css/app.css';

const uppyPhotos = document.querySelector('[data-s3-uppy-photo]');
if (uppyPhotos) {
  import(/* webpackChunkName: "photo-upload" */ './photo-upload.js').then(() => {
    console.log('Image upload module loaded.');
  });
}

const commentNewPost = document.querySelector('[data-comment-new-post]');
if (commentNewPost) {
  import(/* webpackChunkName: "comment-new-post" */ './comment-new-post.js').then(() => {
  });
}

const gallery = document.querySelector('.glider');
if (gallery) {
  import(/* webpackChunkName: "gallery" */ './gallery.js').then(() => {
    console.log('Gallery module loaded.');
  });
}

const markdownEditor = document.querySelector('[data-markdown-editor]');
if (markdownEditor) {
  import(/* webpackChunkName: "markdown-editor" */ './markdown-editor.js').then(() => {
    console.log('Markdown editor module loaded.');
  });
}
