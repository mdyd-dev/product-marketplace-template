import 'easymde/dist/easymde.min.css';
import EasyMDE from 'easymde';
import apiFetch from './apiFetch'

const _form = document.querySelector('[data-s3-photo="form"]');

const createPhoto = (imageUrl) => {
  const objectUuid = _form.dataset.s3UppyObjectUuid;
  const photoType = _form.dataset.s3UppyPhotoType;
  // Create model for this user with s3 image url
  return apiFetch('/api/photos', {
    body: JSON.stringify({ photo: { direct_url: imageUrl, photo_type: photoType, object_uuid: objectUuid } })
  });
};

const getXmlValue = (source, tagName) => {
  const start = source.indexOf(`<${tagName}>`)
  const end = source.indexOf(`</${tagName}>`, start)
  return start !== -1 && end !== -1
    ? source.slice(start + tagName.length + 2, end)
    : ''
};

const markdownEditor = document.querySelector('[data-markdown-editor]');
const easyMDE = new EasyMDE({
  element: markdownEditor,
  // TODO: fix preview, and uncomment preview icon
  // previewClass: 'markdown',
  showIcons: ['code', 'upload-image'],
  hideIcons: ['image', 'side-by-side', 'fullscreen', 'preview'],
  uploadImage: true,
  status: ["upload-image", "autosave"],
  imageUploadFunction: async function(file, success, error) {
    const data = new FormData(_form);
    data.set('file', file, file.name);
    const response = await fetch(_form.action, {method: _form.method, body: data});
    if (response.ok){
      const xmlResponse = await response.text();
      const url = getXmlValue(xmlResponse, 'Location');
      const photo = await createPhoto(url);
      const photoUrl = photo.photo.versions.uncropped.replace(/\s/g, '%20');
      success(photoUrl);
    } else {
      error("Can't upload an image");
    }
  }
});

const elementId = markdownEditor.attributes.id.value;
document.querySelector(`label[for="${elementId}"]`).onclick = function () { easyMDE.codemirror.focus(); };




