import 'glider-js/glider.css';
import Glider from 'glider-js';

new Glider(document.querySelector('.glider'), {
  slidesToShow: 1,
  dots: '.glider-dots',
  draggable: true,
  scrollLock: true,
  arrows: {
    prev: '.glider-prev',
    next: '.glider-next'
  }
});