var Status;
(function (Status) {
    Status[Status["ACTIVE"] = 0] = "ACTIVE";
    Status[Status["FINISHED"] = 1] = "FINISHED";
})(Status || (Status = {}));
var TodoItemStatus = /** @class */ (function () {
    function TodoItemStatus() {
    }
    TodoItemStatus.render = function (status) {
        var newTodoStatus = document.createElement('span');
        switch (status) {
            case Status.ACTIVE:
                {
                    newTodoStatus.classList.toggle('todo-list__item-status');
                    newTodoStatus.classList.toggle('progress');
                    newTodoStatus.appendChild(document.createTextNode('In progress'));
                    var newTodoStatusImage = document.createElement('img');
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
                    var newTodoStatusImage = document.createElement('img');
                    newTodoStatusImage.src = './icons/icon-checkmark.svg';
                    newTodoStatusImage.alt = 'Image of a checkmark.';
                    newTodoStatus.appendChild(newTodoStatusImage);
                }
                break;
        }
        return newTodoStatus;
    };
    return TodoItemStatus;
}());
var TodoItemMainButton = /** @class */ (function () {
    function TodoItemMainButton() {
    }
    TodoItemMainButton.render = function (status) {
        var newTodoMainButton = document.createElement('button');
        switch (status) {
            case Status.ACTIVE:
                {
                    newTodoMainButton.setAttribute('aria-label', 'Press to mark to do as finished.');
                    newTodoMainButton.dataset.buttonRole = 'finish';
                    var newTodoMainButtonImage = document.createElement('img');
                    newTodoMainButtonImage.src = './icons/icon-checkmark.svg';
                    newTodoMainButtonImage.alt = 'Image of a checkmark.';
                    newTodoMainButton.appendChild(newTodoMainButtonImage);
                }
                break;
            case Status.FINISHED:
                {
                    newTodoMainButton.setAttribute('aria-label', 'Press to mark to do in progress.');
                    newTodoMainButton.dataset.buttonRole = 'progress';
                    var newTodoMainButtonImage = document.createElement('img');
                    newTodoMainButtonImage.src = './icons/icon-clock.svg';
                    newTodoMainButtonImage.alt = 'Image of a clock.';
                    newTodoMainButton.appendChild(newTodoMainButtonImage);
                }
                break;
        }
        return newTodoMainButton;
    };
    return TodoItemMainButton;
}());
var TodoItemDeleteButton = /** @class */ (function () {
    function TodoItemDeleteButton() {
    }
    TodoItemDeleteButton.render = function () {
        var newTodoButtonDelete = document.createElement('button');
        newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
        newTodoButtonDelete.dataset.buttonRole = 'delete';
        var newTodoImageDelete = document.createElement('img');
        newTodoImageDelete.src = './icons/icon-delete.svg';
        newTodoImageDelete.alt = 'Image of a trash bin.';
        newTodoButtonDelete.appendChild(newTodoImageDelete);
        return newTodoButtonDelete;
    };
    return TodoItemDeleteButton;
}());
var TodoItem = /** @class */ (function () {
    function TodoItem(newTodoData) {
        this.id = newTodoData.id;
        this.text = newTodoData.text;
        this.status = newTodoData.status;
    }
    TodoItem.render = function (newTodoData) {
        var newTodoLi = document.createElement('li');
        newTodoLi.classList.toggle('todo-list__item');
        newTodoLi.dataset.id = newTodoData.id.toString();
        var newTodoStatus = TodoItemStatus.render(newTodoData.status);
        var newTodoContent = document.createElement('div');
        newTodoContent.classList.toggle('todo-list__item-content');
        var newTodoSpan = document.createElement('span');
        newTodoSpan.appendChild(document.createTextNode(newTodoData.text));
        newTodoContent.appendChild(newTodoSpan);
        var newTodoActions = document.createElement('div');
        newTodoActions.classList.toggle('todo-list__item-actions');
        var newTodoMainButton = TodoItemMainButton.render(newTodoData.status);
        newTodoActions.appendChild(newTodoMainButton);
        var newTodoButtonDelete = TodoItemDeleteButton.render();
        newTodoActions.appendChild(newTodoButtonDelete);
        newTodoContent.appendChild(newTodoActions);
        newTodoLi.appendChild(newTodoContent);
        newTodoLi.prepend(newTodoStatus);
        return newTodoLi;
    };
    return TodoItem;
}());
var TodoList = /** @class */ (function () {
    function TodoList() {
        this.todos = [];
        if (this.loadTodosFromLocalStorage()) {
            this.todos = this.loadTodosFromLocalStorage();
        }
        this.connectAddTodoButton();
        this.connectDeleteTodoButton();
        this.render();
        console.log(this.todos);
    }
    TodoList.prototype.saveTodosToLocalStorage = function (todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    };
    TodoList.prototype.loadTodosFromLocalStorage = function () {
        return JSON.parse(localStorage.getItem('todos'));
    };
    TodoList.prototype.addNewTodo = function () {
        var _this = this;
        var addTodoInput = document.getElementById('addTodoInput');
        var todoListElement = document.getElementById('todoList');
        var newTodoData = {
            id: Date.now(),
            text: addTodoInput.value,
            status: Status.ACTIVE
        };
        var newTodoItem = new TodoItem(newTodoData);
        this.todos.push(newTodoItem);
        this.saveTodosToLocalStorage(this.todos);
        addTodoInput.value = '';
        var todoItemElement = TodoItem.render(newTodoData);
        var todoItemElementMainButton = todoItemElement.lastElementChild.lastElementChild.firstElementChild;
        todoItemElementMainButton.addEventListener('click', function () { return _this.switchTodoStatus(newTodoData.id); });
        todoListElement.appendChild(todoItemElement);
    };
    TodoList.prototype.connectAddTodoButton = function () {
        var _this = this;
        var addTodoForm = document.getElementById('addTodoForm');
        addTodoForm.addEventListener('submit', function (event) {
            event.preventDefault();
            _this.addNewTodo();
        });
    };
    TodoList.prototype.deleteTodo = function (event) {
        var target = event.target;
        if (target.tagName === 'BUTTON' && target.dataset.buttonRole === 'delete') {
            var targetLi_1 = target.closest('li');
            this.todos = this.todos.filter(function (todo) { return todo.id !== +targetLi_1.dataset.id; });
            this.saveTodosToLocalStorage(this.todos);
            targetLi_1.parentElement.removeChild(targetLi_1);
        }
    };
    TodoList.prototype.connectDeleteTodoButton = function () {
        var todoListElement = document.getElementById('todoList');
        todoListElement.addEventListener('click', this.deleteTodo.bind(this));
    };
    TodoList.prototype.switchTodoStatus = function (todoId) {
        var _this = this;
        var targetTodo = this.todos.find(function (todo) { return todo.id === todoId; });
        if (targetTodo.status === Status.ACTIVE) {
            targetTodo.status = Status.FINISHED;
        }
        else if (targetTodo.status === Status.FINISHED) {
            targetTodo.status = Status.ACTIVE;
        }
        this.saveTodosToLocalStorage(this.todos);
        var targetTodoElement = document.querySelector("[data-id=\"" + todoId + "\"]");
        targetTodoElement.removeChild(targetTodoElement.firstElementChild);
        targetTodoElement.prepend(TodoItemStatus.render(targetTodo.status));
        var targetTodoElementActions = targetTodoElement.lastElementChild.lastElementChild;
        targetTodoElementActions.removeChild(targetTodoElementActions.firstElementChild);
        targetTodoElementActions.prepend(TodoItemMainButton.render(targetTodo.status));
        targetTodoElementActions.firstElementChild.addEventListener('click', function () { return _this.switchTodoStatus(todoId); });
    };
    TodoList.prototype.render = function () {
        var _this = this;
        var todoListElement = document.getElementById('todoList');
        this.todos.forEach(function (todo) {
            var todoItemElement = TodoItem.render(todo);
            var todoItemElementMainButton = todoItemElement.lastElementChild.lastElementChild.firstElementChild;
            todoItemElementMainButton.addEventListener('click', function () { return _this.switchTodoStatus(todo.id); });
            todoListElement.appendChild(todoItemElement);
        });
    };
    return TodoList;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App.init = function () {
        new TodoList();
    };
    return App;
}());
App.init();
