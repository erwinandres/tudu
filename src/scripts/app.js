"use strict";

/** Create an HMTL element */
function createEl(type, inner, className, id) {
  var el = document.createElement(type);

  if (inner.nodeType !== 1) {
    inner =  document.createTextNode(inner);
  }

  el.appendChild(inner);

  if (className) {
    el.className = className;
  }

  if (id) {
    el.id = id;
  }

  return el;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var colors = [
    '#FFCDD2',
    '#E1BEE7',
    '#D1C4E9',
    '#C5CAE9',
    '#BBDEFB',
    '#B2DFDB',
    '#F0F4C3',
    '#FFECB3'
  ];

  var index = getRandomInt(0, colors.length-1);
  var color = colors[index];

  return color;
}

// Start with empty db vars.
var dbName;
var tuduDb;

// Page elements
var listsList = document.getElementById('lists-list');
var saveListDialog = document.getElementById('save-list-dialog');
var listView = document.getElementById('list-view');
var listViewHeader = document.getElementById('list-view-header');
var listViewOptions = document.getElementById('list-view-options');
var taskListTitle = document.getElementById('task-list-title');
var taskList = document.getElementById('task-list');
var currentListInput = document.getElementById('current-list-input');
var filter = document.getElementById('current-list-filter');

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
      var data = { text: value };
      saveTask(data);
      this.value = '';
    }
  }
}

//Button: create list
var saveListButton = document.getElementById('save-list-button');

saveListButton.addEventListener('click', function() {
  var newListName = saveListInput.value.trim();

  if (newListName !== '' && newListName.length <= 60) {
    var color = getRandomColor();
    var data = {
      name: newListName,
      color: color
    }

    saveList(data);
    saveListInput.value = '';
    saveListDialog.classList.remove('dialog-visible');
  }
});

//Input: save list
var saveListInput = document.getElementById('save-list-input');

saveListInput.addEventListener('focus', function() {
  this.parentElement.classList.add('newList-fromGroup-active');
});

saveListInput.addEventListener('blur', function() {
  this.parentElement.classList.remove('newList-fromGroup-active');
});

saveListInput.onkeyup = function() {
  if (event.keyCode == 13) {
    saveListButton.click();
  }
}

//All dialogs
var dialogs = document.querySelectorAll('[data-dialog]');
dialogs.forEach(function(dialog) {
  dialog.addEventListener('click', function(evt) {
    evt.stopPropagation();
  });
});

//Buttons: open dialog
var openDialogButtons = document.querySelectorAll('[data-dialog-open]');
openDialogButtons.forEach(function(button) {
  button.addEventListener('click', function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    mainNav.classList.remove('mainNav-open');

    var target = this.getAttribute(['data-dialog-open']);
    var element = document.querySelector('[data-dialog=' + target + ']');

    element.classList.add('dialog-visible');
  });
});


//Button: close about dialog
var closeDialogButton = document.getElementsByClassName('dialog-closeButton');
for (var i = closeDialogButton.length - 1; i >= 0; i--) {
  closeDialogButton[i].addEventListener('click', function() {
    var closeTarget = this.getAttribute(['data-dialog-close']);
    var closeElement = document.querySelector('[data-dialog=' + closeTarget + ']');
    closeElement.classList.remove('dialog-visible');
  });
}
//Button: close list view
var closeListViewButton = document.getElementById('close-list-view');

closeListViewButton.addEventListener('click', function() {
  listView.classList.remove('listView-show');
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
  clearList(currentListInput.value);
});

//Button: delete list
var deleteListButton = document.getElementById('delete-list');

deleteListButton.addEventListener('click', function() {
  listView.classList.remove('listView-show');
  deleteList(currentListInput.value);
});

//Buttons: list view actions
var listTabsButtons = document.querySelectorAll('.listSection-actionButton');

listTabsButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    var value = this.value;

    filter.value = value;
    setTabs();
    writeListTasks();
  });
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

var deleteAllListsButton = document.getElementById('delete-all-lists-button');
deleteAllListsButton.addEventListener('click', function(evt) {
  evt.preventDefault();
  
  var confirmDialog = document.querySelector('[data-dialog="confirm"]');
  confirmDialog.classList.remove('dialog-visible');
  deleteAll();
});

/**
 * Close all menus and dialgos when clicking anywhere in the
 * body.
 */
document.body.addEventListener('click', function() {
  mainNav.classList.remove('mainNav-open');
  dialogs.forEach(function(dialog) {
    dialog.classList.remove('dialog-visible');
  });
  listViewOptions.classList.remove('listView-options-show');
});


/**
 * Initialize the database.
 */
function setDB() {
  // Database name.
  dbName = 'tuduDBv0.2';
  // Start the database.
  tuduDb = new DB();

  var dbData = {
    tasks: [],
    lists: []
  };

  tuduDb.connect(dbName, dbData);
}

function loadHome() {
  var listItems = document.getElementsByClassName('listsList-item');
  for (var i = listItems.length - 1; i >= 0; i--) {
    listsList.removeChild(listItems[i]);
  }

  var loader = document.getElementById('loader');
  loader.classList.add('loader-hidden');

  var openSaveListDialogButton = document.getElementById('open-savelist-dialog-button');
  var lists = tuduDb.getTable('lists');
  if (lists) {
    lists.forEach(function(list) {
      var list = list;
      var li = createEl('li', list.name, 'listsList-item', list.id);
      li.style.backgroundColor = list.color;
      li.addEventListener('click', function() {
        openList(list.id);
      });
      listsList.insertBefore(li, openSaveListDialogButton);
    });
  }
}

function writeListTitle(listName) {
  taskListTitle.innerHTML = '';

  var list = tuduDb.getRow(currentListInput.value, 'lists');

  listViewHeader.style.backgroundColor = list.color;
  var titleText = document.createTextNode(list.name);
  taskListTitle.appendChild(titleText);
}

function setTabs() {
  listTabsButtons.forEach(function(button) {
    button.classList.remove('listSection-actionButton-active');
  });

  var tabToActivate = document.querySelector('.listSection-actionButton[value="' + filter.value + '"]');
  tabToActivate.classList.add('listSection-actionButton-active');
}

function writeListTasks() {
  taskList.innerHTML = '';
  var listId = currentListInput.value;
  var tasks = getTasksFromList(listId, filter.value);

  if (tasks.length > 0) {
    tasks.forEach(function(task) {
      // The label
      var textLabel = createEl('label', task.text, 'list-item-label');

      // The checkbox input
      var checkbox = createEl('input', '', 'list-item-check');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.addEventListener('click', function() {
        completeTask(task.id);
      });

      // The delete button
      var destroyButton = createEl('button', '', 'list-item-destroy');
      destroyButton.addEventListener('click', function() {
        deleteTask(task.id);
      });

      // The list item element
      var li = createEl('li', '', 'list-item', task.id);
      if (task.completed) {
        li.classList.add('completed');
        checkbox.setAttribute('checked', true);
      }
      li.appendChild(checkbox);
      li.appendChild(textLabel);
      li.appendChild(destroyButton);

      taskList.appendChild(li);
    });
  } else {
    var message = 'There is nothing here.';
    var p = createEl('p', message, 'list-message');

    taskList.appendChild(p);
  }
}

function openList(listId) {
  listView.classList.add('listView-show');
  currentListInput.value = listId;

  writeListTitle();
  setTabs();
  writeListTasks();
}

function getTasksFromList(listId, filter) {
  var filter = filter || 'all';
  var count = 0;
  var allTasks = tuduDb.getTable('tasks');
  var listTasks = [];

  allTasks.forEach(function(task) {
    if (task.list === listId) {
      if (filter === 'active' && task.completed) {
        return;
      } else if (filter === 'completed' && !task.completed) {
        return;
      }

      listTasks.push(task);

      count++;
    }
  });

  return listTasks;
}

function saveTask(data, taskId) {
  if (taskId) {
    tuduDb.updateRow(data, 'tasks');
  } else {
    data.completed = false;
    data.list = currentListInput.value;

    tuduDb.addRow(data, 'tasks');
  }

  tuduDb.save();
  writeListTasks();
}

function completeTask(taskId) {
  var task = tuduDb.getRow(taskId, 'tasks');
  var data;

  if (task.completed) {
    data = { completed: false };
  } else {
    data = { completed: true };
  }
  
  tuduDb.updateRow(data, taskId, 'tasks');
  tuduDb.save();

  writeListTasks();
}

function deleteTask(taskId) {
  tuduDb.removeRow(taskId, 'tasks');
  tuduDb.save();

  writeListTasks();
}

function clearList(listId) {
  var allListTasks = getTasksFromList(listId);
  allListTasks.forEach(function(task) {
    tuduDb.removeRow(task.id, 'tasks');
  });

  tuduDb.save();
  writeListTasks();

  function undo() {
    allListTasks.forEach(function(task) {
      tuduDb.addRow(task, 'tasks');
    });

    tuduDb.save();
    writeListTasks();
  }

  toast.action('List cleared.', 'Undo', undo);
}

function deleteList(listId) {
  var cachedList = tuduDb.getRow(listId, 'lists');

  tuduDb.removeRow(listId, 'lists');

  tuduDb.save();
  loadHome();

  function undo() {
    tuduDb.addRow(cachedList, 'lists');

    tuduDb.save();
    loadHome();
  }

  toast.action('List deleted.', 'Undo', undo);
}

function deleteAll() {
  var cacheData = tuduDb.fetch();

  tuduDb.clear();
  tuduDb.data = {
    tasks: [],
    lists: []
  }
  tuduDb.save();
  loadHome();

  function undo() {
    tuduDb.data = cacheData;

    tuduDb.save();
    loadHome();
  }

  toast.action('All lists deleted.', 'Undo', undo);
}

function saveList(data, listId) {
  if (listId) {
    tuduDb.updateRow(data, 'lists');
  } else {
    tuduDb.addRow(data, 'lists');
  }

  tuduDb.save();
  loadHome();

  toast.simple('List ' + data.name + ' created');
}

function Toast(container) {
  var container = container;
  var className = 'toast';

  this.simple = function(text) {
    var toast = createToast(text);
    container.appendChild(toast);

    deleteToast(toast, 3000);
  }

  this.action = function(text, buttonText, buttonAction) {
    var toast = createToast(text);

    var button = createEl('button', buttonText, 'toast-action');
    button.addEventListener('click', function() {
      buttonAction();
      container.removeChild(toast);
    });

    toast.appendChild(button);

    container.appendChild(toast);

    deleteToast(toast, 3000);
  }

  function createToast(text) {
    var toast = createEl('div', '', className);
    var toastText = createEl('span', text, 'toast-text');

    toast.appendChild(toastText);

    return toast;
  }

  function deleteToast (toast, delay) {
    setTimeout(function() {
      if (container.contains(toast)) {
        container.removeChild(toast);        
      }
    }, delay);
  }
}

//Init toast
var toastContainer = document.getElementById('toast-container');
var toast = new Toast(toastContainer);

document.body.onload = function() {
  setDB();
  loadHome();
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
 
