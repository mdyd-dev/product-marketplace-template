import apiFetch from './apiFetch';

const toggleGroupMembership = (action, group_id) => {
  apiFetch('/api/groups/membership/toggle.json', {
    body: JSON.stringify({
      group_id: group_id,
      action_name: action
    })
  }).then(data => {});
};

const joinButtons = Array.from(document.querySelectorAll('button[data-join-group]'))
const setButtonState = (button) => button.classList.toggle('joined')
const toggleJoin = (event) => {
  event.preventDefault();

  const action = event.target.classList.contains('joined') ? 'leave' : 'join'
  toggleGroupMembership(action, event.target.dataset.joinGroup)
  joinButtons
    .filter(e => e.dataset.joinGroup == event.target.dataset.joinGroup)
    .forEach(b => setButtonState(b))
};

joinButtons.forEach(button => button.addEventListener('click', toggleJoin, true));
