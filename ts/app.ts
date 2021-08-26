enum Status {
  ACTIVE,
  FINISHED,
}

interface Todo {
  id: number;
  text: string;
  status: Status;
}

class TodoItemStatus {
  static render(status: Status) {
    const newTodoStatus = document.createElement('span');

    switch (status) {
      case Status.ACTIVE:
        {
          newTodoStatus.classList.toggle('todo-list__item-status');
          newTodoStatus.classList.toggle('progress');
          newTodoStatus.appendChild(document.createTextNode('In progress'));
          const newTodoStatusImage = document.createElement('img');
          newTodoStatusImage.src = './icons/icon-clock.svg';
          newTodoStatusImage.alt = 'Image of a clock.';
          newTodoStatus.appendChild(newTodoStatusImage);
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
        }
        break;
    }

    return newTodoStatus;
  }
}

class TodoItemMainButton {
  static render(status: Status) {
    const newTodoMainButton = document.createElement('button');

    switch (status) {
      case Status.ACTIVE:
        {
          newTodoMainButton.setAttribute('aria-label', 'Press to mark to do as finished.');
          newTodoMainButton.dataset.buttonRole = 'finish';
          const newTodoMainButtonImage = document.createElement('img');
          newTodoMainButtonImage.src = './icons/icon-checkmark.svg';
          newTodoMainButtonImage.alt = 'Image of a checkmark.';
          newTodoMainButton.appendChild(newTodoMainButtonImage);
        }
        break;

      case Status.FINISHED:
        {
          newTodoMainButton.setAttribute('aria-label', 'Press to mark to do in progress.');
          newTodoMainButton.dataset.buttonRole = 'progress';
          const newTodoMainButtonImage = document.createElement('img');
          newTodoMainButtonImage.src = './icons/icon-clock.svg';
          newTodoMainButtonImage.alt = 'Image of a clock.';
          newTodoMainButton.appendChild(newTodoMainButtonImage);
        }
        break;
    }

    return newTodoMainButton;
  }
}

class TodoItemDeleteButton {
  static render() {
    const newTodoButtonDelete = document.createElement('button');
    newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
    newTodoButtonDelete.dataset.buttonRole = 'delete';
    const newTodoImageDelete = document.createElement('img');
    newTodoImageDelete.src = './icons/icon-delete.svg';
    newTodoImageDelete.alt = 'Image of a trash bin.';
    newTodoButtonDelete.appendChild(newTodoImageDelete);

    return newTodoButtonDelete;
  }
}

class TodoItem {
  id: number;
  text: string;
  status: Status;

  constructor(newTodoData: Todo) {
    this.id = newTodoData.id;
    this.text = newTodoData.text;
    this.status = newTodoData.status;
  }

  static render(newTodoData: Todo) {
    const newTodoLi = document.createElement('li');
    newTodoLi.classList.toggle('todo-list__item');
    newTodoLi.dataset.id = newTodoData.id.toString();

    const newTodoStatus = TodoItemStatus.render(newTodoData.status);

    const newTodoContent = document.createElement('div');
    newTodoContent.classList.toggle('todo-list__item-content');

    const newTodoSpan = document.createElement('span');
    newTodoSpan.appendChild(document.createTextNode(newTodoData.text));
    newTodoContent.appendChild(newTodoSpan);
    const newTodoActions = document.createElement('div');
    newTodoActions.classList.toggle('todo-list__item-actions');
    const newTodoMainButton = TodoItemMainButton.render(newTodoData.status);

    newTodoActions.appendChild(newTodoMainButton);
    const newTodoButtonDelete = TodoItemDeleteButton.render();
    newTodoActions.appendChild(newTodoButtonDelete);

    newTodoContent.appendChild(newTodoActions);

    newTodoLi.appendChild(newTodoContent);
    newTodoLi.prepend(newTodoStatus);

    return newTodoLi;
  }
}

class TodoList {
  todos: TodoItem[] = [];

  constructor() {
    if (this.loadTodosFromLocalStorage()) {
      this.todos = this.loadTodosFromLocalStorage();
    }
    this.connectAddTodoButton();
    this.connectDeleteTodoButton();
    this.render();
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

    if (this.todos.length === 0) {
      todoListElement.removeChild(todoListElement.firstElementChild);
    }

    const newTodoData = {
      id: Date.now(),
      text: addTodoInput.value,
      status: Status.ACTIVE,
    };

    const newTodoItem = new TodoItem(newTodoData);

    this.todos.push(newTodoItem);

    this.saveTodosToLocalStorage(this.todos);

    addTodoInput.value = '';

    this.renderTodoItems(newTodoData, todoListElement);
  }

  connectAddTodoButton() {
    const addTodoForm = document.getElementById('addTodoForm') as HTMLFormElement;
    addTodoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addNewTodo();
    });
  }

  deleteTodo(event, todoListElement: HTMLUListElement) {
    const target = event.target;

    if (target.tagName === 'BUTTON') {
      if (target.dataset.buttonRole === 'delete') {
        const targetLi = target.closest('li');
        this.todos = this.todos.filter((todo) => todo.id !== +targetLi.dataset.id);
        this.saveTodosToLocalStorage(this.todos);
        targetLi.parentElement.removeChild(targetLi);

        this.setEmptyListContent(todoListElement);
      }
    }
  }

  connectDeleteTodoButton() {
    const todoListElement = document.getElementById('todoList') as HTMLUListElement;
    todoListElement.addEventListener('click', (event) => this.deleteTodo(event, todoListElement));
  }

  switchTodoStatus(todoId: number) {
    const targetTodo = this.todos.find((todo) => todo.id === todoId);
    if (targetTodo.status === Status.ACTIVE) {
      targetTodo.status = Status.FINISHED;
    } else if (targetTodo.status === Status.FINISHED) {
      targetTodo.status = Status.ACTIVE;
    }
    this.saveTodosToLocalStorage(this.todos);

    const targetTodoElement = document.querySelector(`[data-id="${todoId}"]`);
    targetTodoElement.removeChild(targetTodoElement.firstElementChild);
    targetTodoElement.prepend(TodoItemStatus.render(targetTodo.status));
    const targetTodoElementActions = targetTodoElement.lastElementChild.lastElementChild;
    targetTodoElementActions.removeChild(targetTodoElementActions.firstElementChild);
    targetTodoElementActions.prepend(TodoItemMainButton.render(targetTodo.status));
    targetTodoElementActions.firstElementChild.addEventListener('click', () => this.switchTodoStatus(todoId));
  }

  setEmptyListContent(todoListElement: HTMLUListElement) {
    if (this.todos.length === 0) {
      const todoElementContent = document.createElement('li');
      todoElementContent.classList.toggle('todo-list__item');
      todoElementContent.appendChild(document.createTextNode('There are no tasks to do. Consider adding some!'));
      todoElementContent.dataset.role = 'emptyList';
      todoListElement.appendChild(todoElementContent);
    }
  }

  renderTodoItems(todo: Todo, todoListElement) {
    const todoItemElement = TodoItem.render(todo);
    const todoItemElementMainButton = todoItemElement.lastElementChild.lastElementChild.firstElementChild;
    todoItemElementMainButton.addEventListener('click', () => this.switchTodoStatus(todo.id));
    todoListElement.appendChild(todoItemElement);
  }

  render() {
    const todoListElement = document.getElementById('todoList') as HTMLUListElement;

    this.setEmptyListContent(todoListElement);

    this.todos.forEach((todo) => {
      this.renderTodoItems(todo, todoListElement);
    });
  }
}

class App {
  static init() {
    new TodoList();
  }
}

App.init();
