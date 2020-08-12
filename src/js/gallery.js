import 'glider-js/glider.css';
import Glider from 'glider-js';

const el = document.querySelector('.glider');

if (el) {
  new Glider(el, {
    slidesToShow: 1,
    dots: '.glider-dots',
    draggable: true,
    scrollLock: true,
    arrows: {
      prev: '.glider-prev',
      next: '.glider-next'
    }
  });
}