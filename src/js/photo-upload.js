import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import GoldenRetriever from '@uppy/golden-retriever';
import AWSS3 from '@uppy/aws-s3';
import Webcam from '@uppy/webcam';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';
import apiFetch from './apiFetch'

const _form = document.querySelector('[data-s3-uppy-photo="form"]');
const maxNumberOfFiles = _form.dataset.s3UppyMaxNumberOfFiles;
const note = _form.dataset.s3UppyNote;
const photos = JSON.parse(_form.dataset.s3UppyPhotos || '[]') || [];

const uppy = Uppy({
  autoProceed: photos.length == 0,
  restrictions: {
    maxFileSize: 2097152, // Limit size to 2 MB on the javascript side
    maxNumberOfFiles: maxNumberOfFiles,
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
});

const createPhoto = (imageUrl) => {
  const objectUuid = _form.dataset.s3UppyObjectUuid;
  const photoType = _form.dataset.s3UppyPhotoType;
  // Create model for this user with s3 image url
  return apiFetch('/api/photos', {
    data: { photo: { direct_url: imageUrl, photo_type: photoType, object_uuid: objectUuid } }
  });
};

const deletePhoto = (photoId) => {
  return apiFetch('/api/photos', {
    method: 'DELETE',
    data: { photo: { id: photoId } }
  });
};

const loadExistingPhotos = async (photos) => {
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const response = await fetch(photo.photo.url);
    const blob = await response.blob();
    uppy.addFile({
      name: photo.photo.file_name,
      type: blob.type,
      data: blob,
      meta: { photoId: photo.id },
      remote: true
    });
  }
  uppy.getFiles().forEach(file => {
    console.log(file.id);
    uppy.setFileState(file.id, {
      progress: { uploadComplete: true, percentage: 100, uploadStarted: Date.now() }
    })
  });
};

uppy.use(Dashboard,
  {
    inline: true,
    replaceTargetContent: true,
    showProgressDetails: true,
    target: '#drag-drop-area',
    note: note,
    width: '100%',
    height: 300,
    proudlyDisplayPoweredByUppy: false,
    showRemoveButtonAfterComplete: true,
    locale: {
      strings: {
        dropPasteImport: 'Drag & drop, paste, or %{browse} to upload file',
        browse: 'browse your computer',
      },
    },
  })
  .use(Webcam, { target: Dashboard, modes: ['picture'] })
  // .use(GoldenRetriever)
  .use(AWSS3, {
    getUploadParameters() {
      // 1. Get URL to post to from action attribute
      const _url = _form.getAttribute('action');
      // 2. Create Array from FormData object to make it easy to operate on
      const _formDataArray = Array.from(new FormData(_form));
      // 3. Create a JSON object from array
      const _fields = _formDataArray.reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});

      // 4. Return resolved promise with Uppy. Uppy it will add file in file param as the last param
      return Promise.resolve({
        method: 'POST',
        url: _url,
        fields: _fields,
      });
    },
  });

uppy.on('complete', ({ failed, successful }) => {
  Promise.all(successful.map(({ response }) => createPhoto(response.body.location))).then(() => {
    console.log('File uploaded and image created!');
  });
});

uppy.on('file-removed', (file, reason) => {
  console.log('Remove file', file);
  if (file.meta.photoId) deletePhoto(file.meta.photoId);
})

loadExistingPhotos(photos);
