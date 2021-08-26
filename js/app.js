var Status;
(function (Status) {
    Status[Status["ACTIVE"] = 0] = "ACTIVE";
    Status[Status["FINISHED"] = 1] = "FINISHED";
})(Status || (Status = {}));
var TodoItem = /** @class */ (function () {
    function TodoItem(newTodoData) {
        this.id = newTodoData.id;
        this.text = newTodoData.text;
        this.status = newTodoData.status;
        this.render();
    }
    TodoItem.createElement = function (newTodoData) {
        var newTodoLi = document.createElement('li');
        newTodoLi.classList.toggle('todo-list__item');
        var newTodoStatus = document.createElement('span');
        var newTodoContent = document.createElement('div');
        newTodoContent.classList.toggle('todo-list__item-content');
        var newTodoSpan = document.createElement('span');
        newTodoSpan.appendChild(document.createTextNode(newTodoData.text));
        newTodoContent.appendChild(newTodoSpan);
        var newTodoActions = document.createElement('div');
        newTodoActions.classList.toggle('todo-list__item-actions');
        var newTodoButton1 = document.createElement('button');
        switch (newTodoData.status) {
            case Status.ACTIVE:
                {
                    newTodoStatus.classList.toggle('todo-list__item-status');
                    newTodoStatus.classList.toggle('progress');
                    newTodoStatus.appendChild(document.createTextNode('In progress'));
                    var newTodoStatusImage = document.createElement('img');
                    newTodoStatusImage.src = './icons/icon-clock.svg';
                    newTodoStatusImage.alt = 'Image of a clock.';
                    newTodoStatus.appendChild(newTodoStatusImage);
                    newTodoLi.prepend(newTodoStatus);
                    newTodoButton1.setAttribute('aria-label', 'Press to mark to do as finished.');
                    newTodoButton1.dataset.buttonRole = 'finish';
                    var newTodoButton1Image = document.createElement('img');
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
                    var newTodoStatusImage = document.createElement('img');
                    newTodoStatusImage.src = './icons/icon-checkmark.svg';
                    newTodoStatusImage.alt = 'Image of a checkmark.';
                    newTodoStatus.appendChild(newTodoStatusImage);
                    newTodoLi.prepend(newTodoStatus);
                    newTodoButton1.setAttribute('aria-label', 'Press to mark to do in progress.');
                    newTodoButton1.dataset.buttonRole = 'progress';
                    var newTodoButton1Image = document.createElement('img');
                    newTodoButton1Image.src = './icons/icon-clock.svg';
                    newTodoButton1Image.alt = 'Image of a clock.';
                    newTodoButton1.appendChild(newTodoButton1Image);
                }
                break;
        }
        newTodoActions.appendChild(newTodoButton1);
        var newTodoButtonDelete = document.createElement('button');
        newTodoButtonDelete.setAttribute('aria-label', 'Press to delete to do.');
        newTodoButtonDelete.dataset.buttonRole = 'delete';
        var newTodoImageDelete = document.createElement('img');
        newTodoImageDelete.src = './icons/icon-delete.svg';
        newTodoImageDelete.alt = 'Image of a trash bin.';
        newTodoButtonDelete.appendChild(newTodoImageDelete);
        newTodoActions.appendChild(newTodoButtonDelete);
        newTodoContent.appendChild(newTodoActions);
        newTodoLi.appendChild(newTodoContent);
        return newTodoLi;
    };
    TodoItem.prototype.render = function () {
        var todoListElement = document.getElementById('todoList');
        // todoListElement.appendChild(this.createElement());
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
        var todoItemElement = TodoItem.createElement(newTodoData);
        todoListElement.appendChild(todoItemElement);
    };
    TodoList.prototype.connectAddTodoButton = function () {
        var _this = this;
        var addTodoButton = document.getElementById('addTodoButton');
        addTodoButton.addEventListener('click', function (event) {
            event.preventDefault();
            _this.addNewTodo();
        });
    };
    TodoList.prototype.render = function () {
        var todoListElement = document.getElementById('todoList');
        this.todos.forEach(function (todo) {
            var todoItemElement = TodoItem.createElement(todo);
            todoListElement.appendChild(todoItemElement);
        });
    };
    return TodoList;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App.init = function () {
        var todoList = new TodoList();
    };
    return App;
}());
App.init();
