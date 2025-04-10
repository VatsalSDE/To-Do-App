var newBtn = document.getElementById('newTaskBtn');
var addPopup = document.getElementById('itemPopup');
var removePopup = document.getElementById('deletePopup');
var todoForm = document.getElementById('itemForm');
var todoInput = document.getElementById('itemText');
var todoList = document.getElementById('itemsList');
var emptyMessage = document.getElementById('emptyMsg');

var popupHeader = document.getElementById('popupTitle');
var addBtns = document.getElementById('addButtons');
var editBtns = document.getElementById('editButtons');
var cancelEditBtn = document.getElementById('cancelEdit');
var cancelDelBtn = document.getElementById('cancelDelete');
var confirmDelBtn = document.getElementById('confirmDelete');
var closeXBtns = document.querySelectorAll('.close_x');

var todoItems = [];
var activeItemId = null;

function initializeApp() {
    var stored = localStorage.getItem('stored_todos');
    if (stored) {
        todoItems = JSON.parse(stored);
        updateTaskList();
    }
    toggleEmptyMessage();
}

function toggleEmptyMessage() {
    emptyMessage.style.display = todoItems.length === 0 ? 'flex' : 'none';
}

function saveTasks() {
    localStorage.setItem('stored_todos', JSON.stringify(todoItems));
}

function createTaskElement(task) {
    var div = document.createElement('div');
    div.className = 'todo_item';
    div.setAttribute('data-id', task.id);
    
    div.innerHTML = `
        <div class="item_text">${task.text}</div>
        <div class="item_btns">
            <button class="edit_btn"><i class="fas fa-edit"></i></button>
            <button class="remove_btn"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    div.querySelector('.edit_btn').onclick = () => showEditForm(task);
    div.querySelector('.remove_btn').onclick = () => showDeleteForm(task.id);
    
    return div;
}

function updateTaskList() {
    var existingItems = todoList.querySelectorAll('.todo_item');
    existingItems.forEach(item => item.remove());

    todoItems.forEach(task => {
        todoList.appendChild(createTaskElement(task));
    });
    
    toggleEmptyMessage();
}

function addTask() {
    var text = todoInput.value.trim();
    if (!text) return;
    
    var newTask = {
        id: Date.now().toString(),
        text: text
    };
    
    todoItems.unshift(newTask);
    saveTasks();
    updateTaskList();
    todoInput.value = '';
}

function editTask() {
    var text = todoInput.value.trim();
    if (!text) return;
    
    var task = todoItems.find(item => item.id == activeItemId);
    if (task) {
        task.text = text;
        saveTasks();
        updateTaskList();
    }
}

function removeTask() {
    todoItems = todoItems.filter(item => item.id != activeItemId);
    saveTasks();
    updateTaskList();
}

function showAddForm() {
    todoForm.reset();
    activeItemId = null;
    popupHeader.textContent = 'Add New Task';
    addBtns.style.display = 'block';
    editBtns.style.display = 'none';
    addPopup.style.display = 'block';
    todoInput.focus();
}

function showEditForm(task) {
    todoInput.value = task.text;
    activeItemId = task.id;
    popupHeader.textContent = 'Edit Task';
    addBtns.style.display = 'none';
    editBtns.style.display = 'flex';
    addPopup.style.display = 'block';
    todoInput.focus();
}

function showDeleteForm(id) {
    activeItemId = id;
    removePopup.style.display = 'block';
}

function hidePopups() {
    addPopup.style.display = 'none';
    removePopup.style.display = 'none';
}

newBtn.onclick = showAddForm;
cancelEditBtn.onclick = hidePopups;
cancelDelBtn.onclick = hidePopups;

confirmDelBtn.onclick = function() {
    removeTask();
    hidePopups();
};

closeXBtns.forEach(btn => {
    btn.onclick = hidePopups;
});

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (activeItemId) {
        editTask();
    } else {
        addTask();
    }
    hidePopups();
});

window.onclick = function(e) {
    if (e.target == addPopup || e.target == removePopup) {
        hidePopups();
    }
};

document.onkeydown = function(e) {
    if (e.key == 'Escape') {
        hidePopups();
    }
};

window.onload = initializeApp;