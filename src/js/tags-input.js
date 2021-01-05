import '@yaireo/tagify/dist/tagify.css'
import Tagify from '@yaireo/tagify';
import apiFetch from './apiFetch'

const tagsInput = document.querySelector('[data-tags-input]')
const tagify = new Tagify(tagsInput,{
  originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(',')
});
let controller; // for aborting the call

const onInput = (e) => {
  let value = e.detail.value;
  tagify.settings.whitelist.length = 0; // reset the whitelist

  // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
  controller && controller.abort();
  controller = new AbortController();

  // show loading animation and hide the suggestions dropdown
  tagify.loading(true).dropdown.hide.call(tagify)

  apiFetch('/api/posts/tags?query=' + value, {
    method: 'GET',
    signal: controller.signal
  })
    .then(function(whitelist){
      // update inwhitelist Array in-place
      tagify.settings.whitelist.splice(0, whitelist.length, ...whitelist)
      tagify.loading(false).dropdown.show.call(tagify, value); // render the suggestions dropdown
    })
    .catch(err => {
      if (err.name === 'AbortError') return;

      throw err;
    });
};

// listen to any keystrokes which modify tagify's input
tagify.on('input', onInput)

