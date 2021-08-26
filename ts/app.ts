enum Status {
  ACTIVE,
  FINISHED,
}

interface Todo {
  id: number;
  text: string;
  status: Status;
}

class TodoItem {
  id: number;
  text: string;
  status: Status;

  constructor(newTodoData: Todo) {
    this.id = newTodoData.id;
    this.text = newTodoData.text;
    this.status = newTodoData.status;
    this.render();
  }

  static createElement(newTodoData: Todo) {
    const newTodoLi = document.createElement('li');
    newTodoLi.classList.toggle('todo-list__item');

    const newTodoStatus = document.createElement('span');

    const newTodoContent = document.createElement('div');
    newTodoContent.classList.toggle('todo-list__item-content');

    const newTodoSpan = document.createElement('span');
    newTodoSpan.appendChild(document.createTextNode(newTodoData.text));
    newTodoContent.appendChild(newTodoSpan);

    const newTodoActions = document.createElement('div');
    newTodoActions.classList.toggle('todo-list__item-actions');
    const newTodoButton1 = document.createElement('button');

    switch (newTodoData.status) {
      case Status.ACTIVE:
        {
          newTodoStatus.classList.toggle('todo-list__item-status');
          newTodoStatus.classList.toggle('progress');
          newTodoStatus.appendChild(document.createTextNode('In progress'));
          const newTodoStatusImage = document.createElement('img');
          newTodoStatusImage.src = './icons/icon-clock.svg';
          newTodoStatusImage.alt = 'Image of a clock.';
          newTodoStatus.appendChild(newTodoStatusImage);
          newTodoLi.prepend(newTodoStatus);

          newTodoButton1.setAttribute('aria-label', 'Press to mark to do as finished.');
          newTodoButton1.dataset.buttonRole = 'finish';
          const newTodoButton1Image = document.createElement('img');
          newTodoButton1Image.src = './icons/icon-checkmark.svg';
          newTodoButton1Image.alt = 'Image of a checkmark.';
          newTodoButton1.appendChild(newTodoButton1Image);
        }
        break;

      case Status.FINISHED:
        {
          newTodoStatus.classList.toggle('todo-list__item-status');
          newTodoStatus.classList.toggle('finished');
          newTodoStatus.appendChild(document.createTextNode('Finished'));
          const newTodoStatusImage = document.createElement('img');
          newTodoStatusImage.src = './icons/icon-checkmark.svg';
          newTodoStatusImage.alt = 'Image of a checkmark.';
          newTodoStatus.appendChild(newTodoStatusImage);
          newTodoLi.prepend(newTodoStatus);

          newTodoButton1.setAttribute('aria-label', 'Press to mark to do in progress.');
          newTodoButton1.dataset.buttonRole = 'progress';
          const newTodoButton1Image = document.createElement('img');
          newTodoButton1Image.src = './icons/icon-clock.svg';
          newTodoButton1Image.alt = 'Image of a clock.';
          newTodoButton1.appendChild(newTodoButton1Image);
        }
        break;
    }
    newTodoActions.appendChild(newTodoButton1);

    const newTodoButtonDelete = document.createElement('button');
    newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
    newTodoButtonDelete.dataset.buttonRole = 'delete';
    const newTodoImageDelete = document.createElement('img');
    newTodoImageDelete.src = './icons/icon-delete.svg';
    newTodoImageDelete.alt = 'Image of a trash bin.';
    newTodoButtonDelete.appendChild(newTodoImageDelete);

    newTodoActions.appendChild(newTodoButtonDelete);

    newTodoContent.appendChild(newTodoActions);

    newTodoLi.appendChild(newTodoContent);

    return newTodoLi;
  }

  render() {
    const todoListElement = document.getElementById('todoList') as HTMLUListElement;
    // todoListElement.appendChild(this.createElement());
  }
}

class TodoList {
  todos: TodoItem[] = [];

  constructor() {
    if (this.loadTodosFromLocalStorage()) {
      this.todos = this.loadTodosFromLocalStorage();
    }
    this.connectAddTodoButton();
    this.render();
    console.log(this.todos);
  }

  saveTodosToLocalStorage(todos: Todo[]) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  loadTodosFromLocalStorage() {
    return JSON.parse(localStorage.getItem('todos'));
  }

  addNewTodo() {
    const addTodoInput = document.getElementById('addTodoInput') as HTMLInputElement;
    const todoListElement = document.getElementById('todoList') as HTMLUListElement;

    const newTodoData = {
      id: Date.now(),
      text: addTodoInput.value,
      status: Status.ACTIVE,
    };

    const newTodoItem = new TodoItem(newTodoData);

    this.todos.push(newTodoItem);

    this.saveTodosToLocalStorage(this.todos);

    addTodoInput.value = '';

    const todoItemElement = TodoItem.createElement(newTodoData);
    todoListElement.appendChild(todoItemElement);
  }

  connectAddTodoButton() {
    const addTodoButton = document.getElementById('addTodoButton') as HTMLButtonElement;
    addTodoButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.addNewTodo();
    });
  }

  render() {
    const todoListElement = document.getElementById('todoList') as HTMLUListElement;
    this.todos.forEach((todo) => {
      const todoItemElement = TodoItem.createElement(todo);
      todoListElement.appendChild(todoItemElement);
    });
  }
}

class App {
  static init() {
    const todoList = new TodoList();
  }
}

App.init();
