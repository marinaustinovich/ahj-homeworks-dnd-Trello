// при использования интерфейса DrapAndDrob

export default function dragAndDrop(main) {
  main.addEventListener('dragleave', (e) => {
    if (e.target.classList.contains('dragged')) {
      e.target.classList.remove('dragged');
    }
  });

  main.addEventListener('dragstart', (e) => {
    // нас интересует только задача
    if (e.target.classList.contains('main-kanban-item')) {
      // сохраняем идентификатор задачи в объекте "dataTransfer" в виде обычного текста;
      // dataTransfer также позволяет сохранять HTML - text/html,
      // но в данном случае нам это ни к чему
      e.dataTransfer.setData('text/plain', e.target.dataset.id);
    }
  });

  main.addEventListener('dragenter', (e) => {
    // нас интересуют только колонки
    if (e.target.classList.contains('main-kanban-column-items')) {
      e.target.classList.add('dragged');
    }
  });

  // создаем переменную для хранения "низлежащего" элемента
  let elemBelow = '';

  main.addEventListener('dragover', (e) => {
  // отключаем стандартное поведение браузера;
  // это необходимо сделать в любом случае
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // e.dataTransfer.dropEffect = "move";
    // записываем в переменную целевой элемент;
    // валидацию сделаем позже

    elemBelow = e.target;
    // e.target.style.cursor = 'grabbing';
  });

  main.addEventListener('drop', (e) => {
  // находим перетаскиваемую задачу по идентификатору, записанному в dataTransfer
    const todo = main.querySelector(`[data-id="${e.dataTransfer.getData('text/plain')}"]`);
    // прекращаем выполнение кода, если задача и элемент - одно и тоже
    if (elemBelow === todo) {
      return;
    }

    // если элементом является параграф или кнопка, значит, нам нужен их родительский элемент
    if (elemBelow.tagName === 'span' || elemBelow.className === 'tasks-kanban-item-text' || elemBelow.className === 'tasks-kanban-item') {
      elemBelow = elemBelow.closest('.main-kanban-item');
    }

    // на всякий случай еще раз проверяем, что имеем дело с задачей
    if (elemBelow.classList.contains('main-kanban-item')) {
    // нам нужно понять, куда помещать перетаскиваемый элемент:
    // до или после низлежащего;
    // для этого необходимо определить центр низлежащего элемента
    // и положение курсора относительно этого центра (выше или ниже)
    // определяем центр
      const center = elemBelow.getBoundingClientRect().y
      + elemBelow.getBoundingClientRect().height / 2;
      // если курсор находится ниже центра
      // значит, перетаскиваемый элемент должен быть помещен под низлежащим
      // иначе, перед ним
      if (e.clientY > center) {
        if (elemBelow.nextElementSibling !== null) {
          elemBelow = elemBelow.nextElementSibling;
        } else {
          return;
        }
      }

      elemBelow.parentElement.insertBefore(todo, elemBelow);
      // рокировка элементов может происходить в разных колонках
      // необходимо убедиться, что задачи будут визуально идентичными
      todo.className = elemBelow.className;
    }

    // если целью является колонка
    if (e.target.classList.contains('main-kanban-column-body')) {
    // просто добавляем в нее перетаскиваемый элемент
    // это приведет к автоматическому удалению элемента из "родной" колонки
      const columsLocal = JSON.parse(localStorage.columns);
      const keyForTodo = todo.closest('.main-kanban-column').dataset.id;
      const index = columsLocal[keyForTodo].findIndex((item) => item.id === +todo.dataset.id);
      const todoLocal = columsLocal[keyForTodo].splice(index, 1);
      const columnItems = e.target.querySelector('.main-kanban-column-items');

      const keyForColumnItems = columnItems.closest('.main-kanban-column').dataset.id;
      // eslint-disable-next-line no-prototype-builtins
      if (!columsLocal.hasOwnProperty(keyForColumnItems)) columsLocal[keyForColumnItems] = [];

      columsLocal[keyForColumnItems].push(todoLocal[0]);
      localStorage.setItem('columns', JSON.stringify(columsLocal));

      columnItems.append(todo);

      // удаляем индикатор зоны для "бросания"
      if (e.target.classList.contains('dragged')) {
        e.target.classList.remove('dragged');
      }
    }
  });
}
