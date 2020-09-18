const newCommentPost = document.querySelector('[data-comment-new-post]');
newCommentPost.querySelector('[data-comment-photo-upload]').addEventListener('click', function () {
  newCommentPost.querySelector('#drag-drop-area').classList.toggle('hidden');
});
