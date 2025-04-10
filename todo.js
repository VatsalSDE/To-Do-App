// DOM elements
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


window.onload = function() {
    var stored = localStorage.getItem('stored_todos');
    if (stored) {
        todoItems = JSON.parse(stored);
        refreshItems();
    }
    checkEmpty();
};


function checkEmpty() {
    if (todoItems.length === 0) {
        emptyMessage.style.display = 'flex';
    } else {
        emptyMessage.style.display = 'none';
    }
}


function saveToStorage() {
    localStorage.setItem('stored_todos', JSON.stringify(todoItems));
}

function createItemElement(todo) {
    var div = document.createElement('div');
    div.className = 'todo_item';
    div.setAttribute('data-id', todo.id);
    
    var content = '';
    content += '<div class="item_text">' + todo.text + '</div>';
    content += '<div class="item_btns">';
    content += '    <button class="edit_btn"><i class="fas fa-edit"></i></button>';
    content += '    <button class="remove_btn"><i class="fas fa-trash"></i></button>';
    content += '</div>';
    
    div.innerHTML = content;
    
    
    div.querySelector('.edit_btn').onclick = function() {
        openEditForm(todo);
    };
    
    div.querySelector('.remove_btn').onclick = function() {
        openDeleteForm(todo.id);
    };
    
    return div;
}


function refreshItems() {
    
    var oldItems = document.querySelectorAll('.todo_item');
    for (var i = 0; i < oldItems.length; i++) {
        oldItems[i].remove();
    }
    

    for (var j = 0; j < todoItems.length; j++) {
        var itemElement = createItemElement(todoItems[j]);
        todoList.appendChild(itemElement);
    }
    
    checkEmpty();
}


function addNewItem() {
    var text = todoInput.value.trim();
    if (!text) return; 
    
  
    var newItem = {
        id: '' + new Date().getTime(),
        text: text
    };
    
    
    todoItems.unshift(newItem);
    saveToStorage();
    refreshItems();
}


function updateItem() {
    var text = todoInput.value.trim();
    if (!text) return;
    
    for (var i = 0; i < todoItems.length; i++) {
        if (todoItems[i].id == activeItemId) {
            todoItems[i].text = text;
            break;
        }
    }
    
    saveToStorage();
    refreshItems();
}


function deleteItem() {
    
    var newList = [];
    for (var i = 0; i < todoItems.length; i++) {
        if (todoItems[i].id != activeItemId) {
            newList.push(todoItems[i]);
        }
    }
    todoItems = newList;
    
    saveToStorage();
    refreshItems();
}


function openAddForm() {
    // Reset form
    todoForm.reset();
    activeItemId = null;
    
    
    popupHeader.textContent = 'Add New Task';
    addBtns.style.display = 'block';
    editBtns.style.display = 'none';
    
  
    addPopup.style.display = 'block';
    todoInput.focus();
}


function openEditForm(item) {
    // Load data
    todoInput.value = item.text;
    activeItemId = item.id;
    

    popupHeader.textContent = 'Edit Task';
    addBtns.style.display = 'none';
    editBtns.style.display = 'flex';
    
    // Show popup
    addPopup.style.display = 'block';
    todoInput.focus();
}

function openDeleteForm(id) {
    activeItemId = id;
    removePopup.style.display = 'block';
}


function closePopups() {
    addPopup.style.display = 'none';
    removePopup.style.display = 'none';
}


newBtn.onclick = openAddForm;
cancelEditBtn.onclick = closePopups;
cancelDelBtn.onclick = closePopups;

confirmDelBtn.onclick = function() {
    deleteItem();
    closePopups();
};


for (var i = 0; i < closeXBtns.length; i++) {
    closeXBtns[i].onclick = closePopups;
}


todoForm.onsubmit = function(e) {
    e.preventDefault();
    
    if (activeItemId) {
        
        updateItem();
    } else {
        
        addNewItem();
    }
    
    closePopups();
};


window.onclick = function(e) {
    if (e.target == addPopup || e.target == removePopup) {
        closePopups();
    }
};


document.onkeydown = function(e) {
    if (e.key == 'Escape') {
        closePopups();
    }
};