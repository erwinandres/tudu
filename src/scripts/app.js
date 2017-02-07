var taskList = document.getElementById('task-list');
var listsList = document.getElementById('lists-list');
var currentListInput = document.getElementById('current-list-input');
var taskListTitle = document.getElementById('task-list-title');
var saveListDialog = document.getElementById('save-list-dialog');
var listView = document.getElementById('list-view');
var listViewOptions = document.getElementById('list-view-options');

//Input: new task
var tasksInput = document.getElementById('new-task-input');

tasksInput.addEventListener('focus', function() {
  this.parentElement.classList.add('newTask-active');
});

tasksInput.addEventListener('blur', function() {
  this.parentElement.classList.remove('newTask-active');
});

tasksInput.onkeyup = function(event) {
  if (event.keyCode == 13) {
    var value = this.value.trim();

    if (value !== '') {
      addTask(value);
      this.value = '';
    }
  }
}

//Input: save list
var saveListInput = document.getElementById('save-list-input');

saveListInput.onkeyup = function() {
  if (event.keyCode == 13) {
    var value = this.value.trim();

    if (value !== '') {
      saveList(value, showTask, showLists);
      this.value = '';
      saveListDialog.classList.remove('dialog-visible');
    }
  }
}

//Button: open save list dialog
var openSaveListDialogButton = document.getElementById('open-savelist-dialog-button');

openSaveListDialogButton.addEventListener('click', function(evt) {
  evt.stopPropagation();

  saveListDialog.classList.add('dialog-visible');
});

//Button: cancel save list
var cancelSaveListButton = document.getElementById('cancel-save-list-button');

cancelSaveListButton.addEventListener('click', function(evt) {
  saveListInput.value = '';
  saveListDialog.classList.remove('dialog-visible');
});

//Button: create list
var saveListButton = document.getElementById('save-list-button');

saveListButton.addEventListener('click', function() {
  var newListName = saveListInput.value.trim();

  if (newListName !== '') {
    saveList(newListName, showTask, showLists);    
    saveListInput.value = '';
    saveListDialog.classList.remove('dialog-visible');
  }
});

//Save list dialog
var saveListDialogContent = document.getElementById('save-list-dialog-content');

saveListDialogContent.addEventListener('click', function(evt) {
  evt.stopPropagation();
});

//Main menu
var mainNav = document.getElementById('main-nav');
var mainNavContent = document.getElementById('main-nav-content');

mainNavContent.addEventListener('click', function(evt) {
  evt.stopPropagation();
});

//Button: open menu
var menuButton = document.getElementById('menu-button');

menuButton.addEventListener('click', function(evt) {
  evt.stopPropagation();

  this.classList.toggle('menuButton-open');
  mainNav.classList.toggle('mainNav-open');
});

//Button: close list view
var closeListViewButton = document.getElementById('close-list-view');

closeListViewButton.addEventListener('click', function() {
  listView.classList.remove('listView-show');
});

//Buttons: list view actions
var listViewButtons = document.querySelectorAll('.listSection-actionButton');

listViewButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    var data = JSON.parse(localStorage.getItem(dbName));
    var value = this.value;
    var currentList = currentListInput.value;
    var currentViewInput = document.getElementById('current-list-view');

    currentViewInput.value = value;
    showTask(data, currentList);
  });
});

//Button: more list options
var moreListOptionsButton = document.getElementById('more-list-options');

moreListOptionsButton.addEventListener('click', function(evt) {
  evt.stopPropagation();
  listViewOptions.classList.toggle('listView-options-show');
});

//Button: clear list
var clearListButton = document.getElementById('clear-list');

clearListButton.addEventListener('click', function() {
  var listId = currentListInput.value;
  clearList(listId, showTask);
});

//Button: delete list
var deleteListButton = document.getElementById('delete-list');

deleteListButton.addEventListener('click', function() {
  var listId = currentListInput.value;
  listView.classList.remove('listView-show');
  removList(listId, showLists);
});

/**
 * Close all menus and dialgos when clicking anywhere in the
 * body.
 */
document.body.addEventListener('click', function() {
  mainNav.classList.remove('mainNav-open');
  saveListDialog.classList.remove('dialog-visible');
  listViewOptions.classList.remove('listView-options-show');
});

/**************************************
 * App functions
 **************************************/
//Database name
var dbName = 'tuduDB';

/**
 * Create a fake database using localStorage and JSON.
 */
function setDB() {
  var tasks = '';
  var lists = '';
  var db = {
    tasks: [],
    lists: [
      {
        id: '1',
        name: 'Default'
      }
    ]
  };

  db = JSON.stringify(db);

  localStorage.setItem(dbName, db);
}

/**
 * Load saved lists from the database.
 */
function loadtasksList() {
  var data = JSON.parse(localStorage.getItem(dbName));
  showTask(data, "1");
  showLists(data.lists);
}

/**
 * Write tasks from a list in the HTML document.
 */
function showTask(data, listId) {
  taskList.innerHTML = '';
  taskListTitle.innerHTML = '';

  var currentViewInput = document.getElementById('current-list-view');
  var filter = currentViewInput.value;
  var listTitle;
  for (var i = data.lists.length - 1; i >= 0; i--) {
    if (data.lists[i].id === listId) {
      listTitle = data.lists[i].name;
      break;
    }
  }

  listViewButtons.forEach(function(button) {
    button.classList.remove('listSection-actionButton-active');
  });

  var tabToActive = document.querySelector('.listSection-actionButton[value="' + filter + '"]');
  tabToActive.classList.add('listSection-actionButton-active');

  var count = 0;

  data.tasks.forEach(function(task) {
    if (task.list === listId) {
      if (filter === 'active' && task.completed) {
        return;
      } else if (filter === 'completed' && !task.completed) {
        return;
      }

      count++;
      var taskLabel = document.createElement('label');
      taskLabel.className = 'list-item-label';
      taskLabel.appendChild(document.createTextNode(task.text));

      //Create the checkbox
      var circle = document.createElement('input');
      circle.className = 'list-item-check';
      circle.setAttribute('type', 'checkbox');
      circle.addEventListener('click', function() {
        completeTask(task)
      });

      //Create the delete button
      var destroy = document.createElement('button');
      destroy.className = 'list-item-destroy';
      destroy.addEventListener('click', function() {
        removeTask(task.id, showTask);
      });

      //Create the list item
      var li = document.createElement('li');
      li.id = task.id;
      li.className = 'list-item';
      if (task.completed) {
        li.classList.add('completed');
        circle.setAttribute('checked', true);
      }
      li.appendChild(circle);
      li.appendChild(taskLabel);
      li.appendChild(destroy);

      taskList.appendChild(li);
    }
  });

  if (count <= 0) {
      var message = document.createTextNode('There is nothing here.');
      var p = document.createElement('p');
      p.className = 'list-message';

      p.appendChild(message);

      taskList.appendChild(p);
  }

  listTitle = document.createTextNode(listTitle);
  taskListTitle.appendChild(listTitle);
}

/**
 * Write lists in the HTML document.
 */
function showLists(lists) {
  listsList.innerHTML = '';
  lists.forEach(function(list) {
    var listText = document.createTextNode(list.name);
    var li = document.createElement('li');

    li.className = 'listsList-item';
    li.id = list.id;
    li.appendChild(listText);

    listsList.appendChild(li);
  });

  var listItems = listsList.querySelectorAll('.listsList-item');
  listItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var listId = this.id;
      var data = JSON.parse(localStorage.getItem(dbName));

      currentListInput.value = listId;

      mainNav.classList.remove('mainNav-open');
      listView.classList.add('listView-show');
      showTask(data, listId);
    })
  });
}

/**
 * Save task to the current list.
 */
function saveTasks(updateData, callback, id) {
  var data = JSON.parse(localStorage.getItem(dbName));
  var callback = callback || function() {};

  var currentList = currentListInput.value;
  var taskToShow = [];

  if (id) {
    for (var i = data.tasks.length - 1; i >= 0; i--) {
      if (data.tasks[i].id === id) {
        for (var key in updateData) {
          data.tasks[i][key] = updateData[key];
        }
        break;
      }
    }

    localStorage.setItem(dbName, JSON.stringify(data)); 
    callback.call(this, data, currentList);

  } else {
    updateData.id = new Date().getTime().toString();
    updateData.list = currentList;

    data.tasks.push(updateData);

    localStorage.setItem(dbName, JSON.stringify(data));
    callback.call(this, data, currentList);
  }
}

/**
 * Create list and save it to the database.
 */
function saveList(listName, callback1, callback2) {
  var data = JSON.parse(localStorage.getItem(dbName));
  var callback1 = callback1 || function() {};
  var callback2 = callback2 || function() {};

  var id = new Date().getTime().toString();

  var newData = {
    id: id,
    name: listName
  }

  data.lists.push(newData);

  currentListInput.value = id;
  var currentList = currentListInput.value;

  listView.classList.add('listView-show');

  localStorage.setItem(dbName, JSON.stringify(data));
  callback1.call(this, data, currentList);
  callback2.call(this, data.lists);
}

/**
 * Add a task to the current list.
 */
function addTask(text) {
  var data = {
    text: text,
    completed: false,
    list: '1'
  }

  var currentViewInput = document.getElementById('current-list-view');

  currentViewInput.value = 'active';
  saveTasks(data, showTask);
}

/**
 * Mark a task as completed.
 */
function completeTask(task) {
  var data = JSON.parse(localStorage.getItem(dbName));

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    if (data.tasks[i].id === task.id) {
      if (task.completed) {
        task.completed = false;
      } else {
        task.completed = true;  
      }

      saveTasks(task, showTask, task.id);
      break;
    }
  }
}

/**
 * Remove an specific tag from the database.
 */
function removeTask(id, callback) {
  var data = JSON.parse(localStorage.getItem(dbName));
  var currentList = currentListInput.value;
  var callback = callback || function() {};

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    if (data.tasks[i].id === id) {
      data.tasks.splice(i, 1);
      break;
    }
  }

  localStorage.setItem(dbName, JSON.stringify(data));
  callback.call(this, data, currentList);
}

/**
 * Delete al tags from a list.
 */
function clearList(listId, callback) {
  var data = JSON.parse(localStorage.getItem(dbName));
  var currentList = currentListInput.value;
  var callback = callback || function() {};

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    if (data.tasks[i].list === listId) {
      data.tasks.splice(i, 1);
    }
  }

  localStorage.setItem(dbName, JSON.stringify(data));
  callback.call(this, data, currentList);
}

/**
 * Delete a list.
 */
function removList(id, callback) {
  clearList(id, showTask);

  var data = JSON.parse(localStorage.getItem(dbName));
  var callback = callback || function() {};

  for (var i = data.lists.length - 1; i >= 0; i--) {
    if (data.lists[i].id === id) {
      data.lists.splice(i, 1);
      break;
    }
  }

  var currentList = currentListInput.value;

  localStorage.setItem(dbName, JSON.stringify(data));
  callback.call(this, data.lists, currentList);
}

document.body.onload = function() {
  /**
   * Create the database if doesn't exits, then load the saved
   * lists.
   */
  if (!localStorage.getItem(dbName)) {
    setDB();
  }

  loadtasksList();
}

//Register service worker if available.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(function(reg) {
      console.log('Succsessfully regitered service worker', reg);
    })
    .catch(function(err) {
      console.warn('Error whilst registering service worker', err);
    });
  navigator.serviceWorker.ready.then(function(reg) {
    console.log('Service worker ready');
  });
}
