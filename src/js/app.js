import '../css/app.css';

const uppyPhotos = document.querySelector('[data-s3-uppy-photo]');
if (uppyPhotos) {
  import(/* webpackChunkName: "photo-upload" */ './photo-upload.js').then(() => {});
}

const commentNewPost = document.querySelector('[data-comment-new-post]');
if (commentNewPost) {
  import(/* webpackChunkName: "comment-new-post" */ './comment-new-post.js').then(() => {});
}

const gallery = document.querySelector('.glider');
if (gallery) {
  import(/* webpackChunkName: "gallery" */ './gallery.js').then(() => {});
}

const markdownEditor = document.querySelector('[data-markdown-editor]');
if (markdownEditor) {
  import(/* webpackChunkName: "markdown-editor" */ './markdown-editor.js').then(() => {});
}

const markdownImages = document.querySelector('.markdown img');
if (markdownImages) {
  import(/* webpackChunkName: "markdown-images" */ './markdown-images.js').then(() => {});
}

const styleGuide = document.querySelector('#styleGuide');
if (styleGuide) {
  import(/* webpackChunkName: "style-guide" */ './style-guide.js').then(() => {});
}

const tagsInput = document.querySelector('[data-tags-input]');
if (tagsInput) {
  import(/* webpackChunkName: "tags-input" */ './tags-input.js').then(() => {});
}

const groupJoinButtons = document.querySelectorAll('button[data-join-group]')
if (groupJoinButtons.length > 0) {
  import(/* webpackChunkName: "groups-join" */ './groups-join.js').then(() => {});
}

const userFollowButtons = document.querySelectorAll('button[data-follow-user]')
if (userFollowButtons.length > 0) {
  import(/* webpackChunkName: "user-follow" */ './user-follow.js').then(() => {});
}

const itemStatusSelectors = document.querySelectorAll('select[data-item-status-object-id]')
if (itemStatusSelectors.length > 0) {
  import(/* webpackChunkName: "item-status-create" */ './item-status-create.js').then(() => {});
}
