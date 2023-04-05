// @param - EVENT CREATION
// @param <options> - объект с полями:
// — cancelable ;
// — bubbles .
// input type="file" требует для активации поведения по умолчанию именно MouseEvent , а не Event.

const previewEl = document.querySelector('[data-id=preview]');
const fileEl = document.querySelector('[data-id=file]');
const overlapEl = document.querySelector('[data-id=overlap]');

/* // для теоритической части
overlapEl.addEventListener('click', (evt) => {
  fileEl.dispatchEvent(evt);
});

overlapEl.addEventListener('click', (evt, options) => {
  fileEl.dispatchEvent(new MouseEvent('click', options));
});

// собственное событие

fileEl.addEventListener('mousemove', (e) => {
  if (e.layerX > 100) {
    fileEl.dispatchEvent(new CustomEvent('happy'));
  }
});
fileEl.addEventListener('happy', () => console.log('happy'));

// вне eventListener'а
fileEl.addEventListener('click', () => {
  console.log('clicked');
});

fileEl.dispatchEvent(new MouseEvent('click'));

*/

overlapEl.addEventListener('click', () => {
  fileEl.dispatchEvent(new MouseEvent('click'));
});

fileEl.addEventListener('change', (e) => {
  const data = e.target.files[0];
  /*
  // если не требуется отправка файла на сервер

  previewEl.src = URL.createObjectURL(data);
  previewEl.addEventListener('load', () => {
    URL.revokeObjectURL(previewEl.src);
  });

  */

  // для HTTP-запросов
  const reader = new FileReader();

  if (data.type.startsWith('image/')) {
    reader.onload = (event) => {
      previewEl.src = event.target.result;
    };
    reader.readAsDataURL(data);
  } else {
    reader.onload = (event) => {
      document.querySelector('.file-container').appendChild(document.createTextNode(event.target.result));
    };
    reader.readAsText(data);
  }
});
