const newCommentPost = document.querySelector('[data-comment-new-post]');
newCommentPost.addEventListener('click', function () {
  newCommentPost.querySelector('#drag-drop-area').classList.remove('hidden');
});
