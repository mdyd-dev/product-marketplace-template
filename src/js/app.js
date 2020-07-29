import '../css/app.css';

import(/* webpackChunkName: "images" */ './images.js').then(() => {
  console.log('Images module loaded.');
});