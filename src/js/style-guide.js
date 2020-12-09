/*
  handling various aspects of the style guide
  that can be found under /style-guide/
*/


// purpose:   the main style guide namespace
// ************************************************************************
const styleGuide = function(){

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		initializes the module
  // ------------------------------------------------------------------------
  module.init = () => {
    styleGuide.colors();
    styleGuide.typography();
    styleGuide.clipboard();
  };

  module.init();

};



// purpose:		handles the color section
// ************************************************************************
styleGuide.colors = () => {

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // the container with the colors (dom node)
  module.settings.container = document.querySelector('#styleGuide-colors');
  // the list with the properties color (dom nodes)
  module.settings.propertiesList = module.settings.container.querySelectorAll('dl');


  // purpose:   initializes module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.showBackgroundClass();
    module.showBackgroundColor();
  };


  // purpose:		convert the color from rgb[a] to hex
  // arguments: color in rgb[a]
  // returns:   color in hex
  // ------------------------------------------------------------------------
  function rgbaToHex(color){
    if( color.indexOf('#') != -1 ) return color;

    color = color
                .replace('rgba', '')
                .replace('rgb', '')
                .replace('(', '')
                .replace(')', '');
    color = color.split(',');

    return  '#'
            + ( '0' + parseInt(color[0], 10).toString(16) ).slice(-2)
            + ( '0' + parseInt(color[1], 10).toString(16) ).slice(-2)
            + ( '0' + parseInt(color[2], 10).toString(16) ).slice(-2);
  };


  // purpose:		finds the background color class name and shows it in corresponding place
  // ------------------------------------------------------------------------
  module.showBackgroundClass = () => {
    module.settings.propertiesList.forEach(element => {
      let classNames = '';

      Array.from(element.parentElement.querySelector('.styleGuide-colorBox').children).forEach(element => {
        classNames += '<li>' + Array.from(element.classList).filter((name) => name.startsWith('bg-')) + '</li>';
      });

      element.querySelector('.styleGuide-className ul').insertAdjacentHTML('beforeend', classNames.replaceAll('bg', ''));
    });
  };

  // purpose:		finds the background color and shows it in corresponding place
  // ------------------------------------------------------------------------
  module.showBackgroundColor = () => {
    module.settings.propertiesList.forEach(element => {
      let colorNames = '';

      Array.from(element.parentElement.querySelector('.styleGuide-colorBox').children).forEach(element => {
        colorNames += '<li>' + rgbaToHex(window.getComputedStyle(element).getPropertyValue('background-color')) + '</li>';
      });

      // let colorBox = element.parentElement.querySelector('.styleGuide-colorBox');
      // let color = window.getComputedStyle(colorBox).getPropertyValue('background-color');

      element.querySelector('.styleGuide-color ul').insertAdjacentHTML('beforeend', colorNames);
    });
  };


  module.init();

};



// purpose:		handles the typography section
// ************************************************************************
styleGuide.typography = () => {

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // the container for basic typography info (dom node)
  module.settings.container = document.querySelector('#styleGuide-typography');
  // class name for the examples box (string)
  module.settings.typographyExample = 'styleGuide-example';


  // purpose:   initializes module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.showTextInfo();
  };


  // purpose:		sets the basic font information
  // ------------------------------------------------------------------------
  module.showTextInfo = () => {

    let rows = Array.from(module.settings.container.children).filter(elements => {
      return elements.matches('div');
    });

    rows.forEach((row) => {
      let textStyle = window.getComputedStyle(row.querySelector('.' + module.settings.typographyExample).firstElementChild);

      row.querySelector('.styleGuide-color').textContent = textStyle.getPropertyValue('color');
      row.querySelector('.styleGuide-font').textContent = textStyle.getPropertyValue('font-family');
      row.querySelector('.styleGuide-size').textContent = textStyle.getPropertyValue('font-size');
      row.querySelector('.styleGuide-lineHeight').textContent = textStyle.getPropertyValue('line-height');
    });
  };

  module.init();

};



// purpose:		handles copying the text to clipboard
// ************************************************************************
styleGuide.clipboard = () => {

  // cache 'this' value not to be overwritten later
  const module = this;

  // purpose:		settings that are being used across the module
  // ------------------------------------------------------------------------
  module.settings = {};
  // the button that activates the copying (dom node)
  module.settings.button = document.querySelectorAll('.styleGuide-copy');


  // purpose:   initializes module
  // ------------------------------------------------------------------------
  module.init = () => {
    module.clipboard();
  };


  // purpose:		saves the code content to clipboard on button click
  // ------------------------------------------------------------------------
  module.clipboard = () => {
    module.settings.button.forEach((element) => {
      element.addEventListener('click', (event) => {
        let text = event.target.parentElement.parentElement.childNodes[0].textContent.trim();

        navigator.clipboard.writeText(text).then(() => {
          event.target.classList.add('text-green-700');

          setTimeout(() => {
            event.target.classList.remove('text-green-700');
          }, 800);
        }, () => {
          new Error('Could not copy the code to clipboard');
        });
      });
    });
  };


  module.init();

};



new styleGuide();