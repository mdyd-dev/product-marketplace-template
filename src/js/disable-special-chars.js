const inputs = document.querySelectorAll('[data-disable-special-chars]');
inputs.forEach((input)=> {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/[^a-z0-9? ]/gi, '');
  });
});
