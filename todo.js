var createBtn = document.getElementById('createBtn');
var taskPopup = document.getElementById('taskPopup');
var confirmPopup = document.getElementById('confirmPopup');
var taskForm = document.getElementById('taskForm');
var taskInput = document.getElementById('taskInput');
var taskContainer = document.getElementById('taskContainer');
var noTasksMsg = document.getElementById('noTasksMsg');

var formTitle = document.getElementById('formTitle');
var addControls = document.getElementById('addControls');
var editControls = document.getElementById('editControls');
var btnCancelEdit = document.querySelector('.btn-cancel');
var btnNo = document.getElementById('btnNo');
var btnYes = document.getElementById('btnYes');
var closeBtns = document.querySelectorAll('.btn-close');

var tasks = [];
var currentTaskId = null;

function initApp() {
    var saved = localStorage.getItem('task_data');
    if (saved) {
        tasks = JSON.parse(saved);
        renderTasks();
    }
    checkEmpty();
}

function checkEmpty() {
    noTasksMsg.style.display = tasks.length ? 'none' : 'flex';
}

function saveData() {
    localStorage.setItem('task_data', JSON.stringify(tasks));
}

function createTaskEl(task) {
    var el = document.createElement('div');
    el.className = 'task-item';
    el.setAttribute('data-id', task.id);
    
    el.innerHTML = '<div class="task-text">' + task.text + '</div><div class="task-actions"><button class="btn-edit"><i class="fas fa-edit"></i></button><button class="btn-remove"><i class="fas fa-trash"></i></button></div>';
    
    el.querySelector('.btn-edit').onclick = function() {
        openEdit(task);
    };
    
    el.querySelector('.btn-remove').onclick = function() {
        confirmDelete(task.id);
    };
    
    return el;
}

function renderTasks() {
    var oldTasks = document.querySelectorAll('.task-item');
    oldTasks.forEach(function(task) {
        task.remove();
    });

    tasks.forEach(function(task) {
        taskContainer.appendChild(createTaskEl(task));
    });
    
    checkEmpty();
}

function addTask() {
    var text = taskInput.value.trim();
    if (!text) return;
    
    var newTask = {
        id: Date.now().toString(),
        text: text
    };
    
    tasks.unshift(newTask);
    saveData();
    renderTasks();
    taskInput.value = '';
}

function updateTask() {
    var text = taskInput.value.trim();
    if (!text) return;
    
    var task = tasks.find(function(item) {
        return item.id == currentTaskId;
    });
    
    if (task) {
        task.text = text;
        saveData();
        renderTasks();
    }
}

function deleteTask() {
    tasks = tasks.filter(function(item) {
        return item.id != currentTaskId;
    });
    saveData();
    renderTasks();
}

function openAdd() {
    taskForm.reset();
    currentTaskId = null;
    formTitle.textContent = 'New Task';
    addControls.style.display = 'flex';
    editControls.style.display = 'none';
    taskPopup.style.display = 'block';
    taskInput.focus();
}

function openEdit(task) {
    taskInput.value = task.text;
    currentTaskId = task.id;
    formTitle.textContent = 'Edit Task';
    addControls.style.display = 'none';
    editControls.style.display = 'flex';
    taskPopup.style.display = 'block';
    taskInput.focus();
}

function confirmDelete(id) {
    currentTaskId = id;
    confirmPopup.style.display = 'block';
}

function closeModals() {
    taskPopup.style.display = 'none';
    confirmPopup.style.display = 'none';
}

createBtn.onclick = openAdd;
btnCancelEdit.onclick = closeModals;
btnNo.onclick = closeModals;

btnYes.onclick = function() {
    deleteTask();
    closeModals();
};

closeBtns.forEach(function(btn) {
    btn.onclick = closeModals;
});

taskForm.onsubmit = function(e) {
    e.preventDefault();
    currentTaskId ? updateTask() : addTask();
    closeModals();
};

window.onclick = function(e) {
    if (e.target == taskPopup || e.target == confirmPopup) {
        closeModals();
    }
};

document.onkeydown = function(e) {
    if (e.key == 'Escape') {
        closeModals();
    }
};

window.onload = initApp;