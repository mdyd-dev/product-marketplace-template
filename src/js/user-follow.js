import apiFetch from './apiFetch';

const toggleFollowingUser = (action, user_id) => {
  apiFetch('/api/users/followers/toggle.json', {
    body: JSON.stringify({
      user_id: user_id,
      action_name: action
    })
  }).then(data => {});
}

const followButtons = Array.from(document.querySelectorAll('button[data-follow-user]'))
const setButtonState = (button) => button.classList.toggle('following')

const toggleFollowing = (event) => {
  event.preventDefault();

  const action = event.target.classList.contains('following') ? 'unfollow' : 'follow'

  toggleFollowingUser(action, event.target.dataset.followUser)

  followButtons
    .filter(e => e.dataset.followUser == event.target.dataset.followUser)
    .forEach(b => setButtonState(b))
}

followButtons.forEach(button => button.addEventListener('click', toggleFollowing, true))
