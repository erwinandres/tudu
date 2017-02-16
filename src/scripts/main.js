"use strict";

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
  document.body.classList.remove('listOpen');

  var listItems = document.getElementsByClassName('myLists-list');
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
      var li = createEl('li', list.name, 'myLists-list', list.id);
      li.style.backgroundColor = list.color;
      li.addEventListener('click', function() {
        openList(list.id);
      });
      listsList.insertBefore(li, openSaveListDialogButton);
    });
  }
}

function writeListTitle() {
  taskListTitle.innerHTML = '';

  var list = tuduDb.getRow(currentListInput.value, 'lists');

  listViewHeader.style.backgroundColor = list.color;
  var titleText = document.createTextNode(list.name);
  taskListTitle.appendChild(titleText);
}

function setTabs() {
  listTabsButtons.forEach(function(button) {
    button.classList.remove('taskTabs-button-active');
  });

  var tabToActivate = document.querySelector('.taskTabs-button[value="' + filter.value + '"]');
  tabToActivate.classList.add('taskTabs-button-active');
}

function writeListTasks() {
  taskList.innerHTML = '';
  var listId = currentListInput.value;
  var tasks = getTasksFromList(listId, filter.value);

  if (tasks.length > 0) {
    tasks.forEach(function(task) {
      // The label
      var textLabel = createEl('label', task.text, 'task-label');

      // The checkbox input
      var checkbox = createEl('input', '', 'task-check');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.addEventListener('click', function() {
        completeTask(task.id);
      });

      // The delete button
      var destroyButton = createEl('button', '', 'task-destroy');
      destroyButton.addEventListener('click', function() {
        deleteTask(task.id);
      });

      // The list item element
      var li = createEl('li', '', 'task', task.id);
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
    var p = createEl('p', message, 'tasksList-message');

    taskList.appendChild(p);
  }
}

function openList(listId) {
  listView.classList.add('listView-open');
  document.body.classList.add('listOpen');

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

  toast.action('All lists deleted', 'Undo', undo);
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

function editListTitle(newTitle, listId) {
  var data = {
    name: newTitle
  }

  tuduDb.updateRow(data, listId, 'lists');
  tuduDb.save();
  writeListTitle();

  toast.simple('List title edited');
}

document.body.onload = function() {
  setDB();
  loadHome();
}
