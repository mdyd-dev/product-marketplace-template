import apiFetch from './apiFetch';

const createStatus = (name, object_id, scope) => {
  apiFetch('/api/statuses.json', {
    body: JSON.stringify({
      status: {
        object_id: object_id,
        name: name,
        scope: scope
      }
    })
  }).then(data => {});
};

const statusChanged = (event) => {
  event.preventDefault();
  createStatus(event.target.value, event.target.dataset.itemStatusObjectId, event.target.dataset.itemStatusScope)
};

const statusSelector = Array.from(document.querySelectorAll('select[data-item-status-object-id]'));
statusSelector.forEach(button => button.addEventListener('change', statusChanged, true));
