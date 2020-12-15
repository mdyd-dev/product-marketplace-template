const newCommentPost = document.querySelector('[data-comment-new-post]');
newCommentPost.querySelector('[data-comment-photo-upload]').addEventListener('click', function () {
  newCommentPost.querySelector('#drag-drop-area').classList.toggle('hidden');
});

const showNewComments = document.querySelectorAll('[data-comment-show-new-post]');
showNewComments.forEach((showComment)=> {
  showComment.onclick = (e) => {
    const button = e.currentTarget;
    button.classList.toggle('hidden');
    button.closest('[data-comment-new-post]').querySelector('[data-comment-form]').classList.toggle('hidden')
  };
});
