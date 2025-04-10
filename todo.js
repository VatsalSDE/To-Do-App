// DOM elements
var newBtn = document.getElementById('newTaskBtn');
var todoList = document.getElementById('itemsList');
var emptyMessage = document.getElementById('emptyMsg');
var taskCounter = document.getElementById('taskCounter');

var addPopup = document.getElementById('itemPopup');
var removePopup = document.getElementById('deletePopup');
var todoForm = document.getElementById('itemForm');
var todoInput = document.getElementById('itemText');
// Store tasks
var todoItems = [];
var activeItemId = null;

// Load saved items
window.onload = function() {
    var stored = localStorage.getItem('stored_todos');
    if (stored) {
        todoItems = JSON.parse(stored);
        refreshItems();
    }
    checkEmpty();
    updateCounter();
};
function updateCounter() {
    var count = todoItems.length;
    taskCounter.textContent = count + (count === 1 ? " task" : " tasks");
}

// Show or hide empty message
function checkEmpty() {
    if (todoItems.length === 0) {
        emptyMessage.style.display = 'flex';
    } else {
        emptyMessage.style.display = 'none';
    }
}

// Save to storage
function saveToStorage() {
    localStorage.setItem('stored_todos', JSON.stringify(todoItems));
}

// Create a new todo item element
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
    
    // Add event listeners
    div.querySelector('.edit_btn').onclick = function() {
        openEditForm(todo);
    };
    
    div.querySelector('.remove_btn').onclick = function() {
        openDeleteForm(todo.id);
    };
    
    return div;
}

// Refresh all items in the list
function refreshItems() {
    // Clear items except empty message
    var oldItems = document.querySelectorAll('.todo_item');
    for (var i = 0; i < oldItems.length; i++) {
        oldItems[i].remove();
    }
    
    // Add all items
    for (var j = 0; j < todoItems.length; j++) {
        var itemElement = createItemElement(todoItems[j]);
        todoList.appendChild(itemElement);
    }
    
    checkEmpty();
}

// Add a new todo item
function addNewItem() {
    var text = todoInput.value.trim();
    if (!text) return; // Don't add empty items
    
    // Create new item with unique ID
    var newItem = {
        id: '' + new Date().getTime(),
        text: text
    };
    
    // Add to beginning of array
    todoItems.unshift(newItem);
    saveToStorage();
    refreshItems();
}

// Update existing item
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

// Delete an item
function deleteItem() {
    // Filter out the item with activeItemId
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

// Open the create item form
function openAddForm() {
    // Reset form
    todoForm.reset();
    activeItemId = null;
    
    // Set up for create mode
    popupHeader.textContent = 'Add New Task';
    addBtns.style.display = 'block';
    editBtns.style.display = 'none';
    
    // Show popup
    addPopup.style.display = 'block';
    todoInput.focus();
}

// Open the edit item form
function openEditForm(item) {
    // Load data
    todoInput.value = item.text;
    activeItemId = item.id;
    
    // Set up for edit mode
    popupHeader.textContent = 'Edit Task';
    addBtns.style.display = 'none';
    editBtns.style.display = 'flex';
    
    // Show popup
    addPopup.style.display = 'block';
    todoInput.focus();
}

// Open delete confirmation
function openDeleteForm(id) {
    activeItemId = id;
    removePopup.style.display = 'block';
}

// Close all popups
function closePopups() {
    addPopup.style.display = 'none';
    removePopup.style.display = 'none';
}

// Event handlers
newBtn.onclick = openAddForm;
cancelEditBtn.onclick = closePopups;
cancelDelBtn.onclick = closePopups;

confirmDelBtn.onclick = function() {
    deleteItem();
    closePopups();
};

// Close X buttons
for (var i = 0; i < closeXBtns.length; i++) {
    closeXBtns[i].onclick = closePopups;
}

// Form submission
todoForm.onsubmit = function(e) {
    e.preventDefault();
    
    if (activeItemId) {
        // Update existing item
        updateItem();
    } else {
        // Add new item
        addNewItem();
    }
    
    closePopups();
};

// Close popups when clicking outside
window.onclick = function(e) {
    if (e.target == addPopup || e.target == removePopup) {
        closePopups();
    }
};

// Close popups with escape key
document.onkeydown = function(e) {
    if (e.key == 'Escape') {
        closePopups();
    }
};