import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import GoldenRetriever from '@uppy/golden-retriever';
import AWSS3 from '@uppy/aws-s3';
import Webcam from '@uppy/webcam';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';

const _form = document.querySelector('[data-s3-uppy="form"]');

const uppy = Uppy({
  autoProceed: true,
  restrictions: {
    maxFileSize: 2097152, // Limit size to 2 MB on the javascript side
    maxNumberOfFiles: 3,
    allowedFileTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
})
  .use(Dashboard, {
    inline: true,
    replaceTargetContent: true,
    showProgressDetails: true,
    target: '#drag-drop-area',
    note: 'Images only, up to 3 files, 2MB each',
    width: '100%',
    height: 403,
    proudlyDisplayPoweredByUppy: false,
    locale: {
      strings: {
        dropPasteImport: 'Drag & drop, paste, or %{browse} to upload file',
        browse: 'browse your computer',
      },
    },
  })
  .use(Webcam, { target: Dashboard, modes: ['picture'] })
  .use(GoldenRetriever)
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
  /*
    For every successfully uploaded image to S3, send request to the Instance
    that will create a model with the uploaded image's URL as direct_url param.
  */
  Promise.all(successful.map(({ response }) => createImage(response.body.location))).then(() => {
    console.log('File uploaded and image created!');
  });
});

const createImage = (imageUrl) => {
  // Get logged in user id
  const userId = _form.dataset.s3UppyUserId;
  const itemUuid = _form.dataset.itemUuid;

  // Create model for this user with s3 image url
  return fetch('/api/items/photos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ photo: { direct_url: imageUrl, user_id: userId, item_uuid: itemUuid } }),
  }).then((response) => response.json());
};
