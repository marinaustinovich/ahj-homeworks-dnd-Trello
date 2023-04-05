const itemsList = document.querySelector('.items');
let draggedEl = null;
let sortingEl = null;

itemsList.addEventListener('mousedown', (evt) => {
  evt.preventDefault();
  if (!evt.target.classList.contains('items-item')) {
    return;
  }

  draggedEl = evt.target;
  sortingEl = evt.target.cloneNode(true);
  sortingEl.classList.add('dragged');
  document.body.appendChild(sortingEl);
  sortingEl.style.left = `${evt.pageX - sortingEl.offsetWidth / 2}px`;
  sortingEl.style.top = `${evt.pageY - sortingEl.offsetHeight / 2}px`;
});

itemsList.addEventListener('mousemove', (evt) => {
  evt.preventDefault(); // не даём выделять элементы
  if (!draggedEl) return;
  sortingEl.style.left = `${evt.pageX - sortingEl.offsetWidth / 2}px`;
  sortingEl.style.top = `${evt.pageY - sortingEl.offsetHeight / 2}px`;
});

itemsList.addEventListener('mouseleave', () => {
  // при уходе курсора за границы контейнера - отменяем перенос
  if (!draggedEl) return;
  document.body.removeChild(sortingEl);
  sortingEl = null;
  draggedEl = null;
});

itemsList.addEventListener('mouseup', (evt) => {
  if (!draggedEl) return;
  const closest = document.elementFromPoint(evt.clientX, evt.clientY);
  const { top } = closest.getBoundingClientRect();
  if (evt.pageY > window.scrollY + top + closest.offsetHeight / 2) {
    evt.currentTarget.insertBefore(draggedEl, closest.nextElementSibling);
  } else {
    evt.currentTarget.insertBefore(draggedEl, closest);
  }

  document.body.removeChild(sortingEl);
  sortingEl = null;
  draggedEl = null;
});

// DnD for file

const overlapEl = document.querySelector('[data-id=overlap]');
const previewEl = document.querySelector('[data-id=preview]');

overlapEl.addEventListener('dragover', (e) => {
  e.preventDefault();
});

overlapEl.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  const data = files[0];
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
