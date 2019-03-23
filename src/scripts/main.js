"use strict";

/**
 * Initialize the database.
 *
 * Connects to the database or create one if dosn't exits using
 * the DB class.
 */
function setDB() {
  // Database name.
  dbName = 'tuduDBv0.2';

  // Start the database.
  tuduDb = new DB();

  // Database initial values.
  var dbData = {
    tasks: [],
    lists: []
  };

  tuduDb.connect(dbName, dbData);
}

/**
 * Render the home screen.
 *
 * Cleans and rewrites all saved lists in the home page.
 */
function loadHome() {
  closeList();

  document.body.classList.remove('listOpen');

  // Cean the home screen.
  var listItems = document.getElementsByClassName('myLists-list');
  for (var i = listItems.length - 1; i >= 0; i--) {
    listsList.removeChild(listItems[i]);
  }

  // Hide the loader animation.
  var loader = document.getElementById('loader');
  loader.classList.add('loader-hidden');

  var openSaveListDialogButton = document.getElementById('open-savelist-dialog-button');
  var lists = tuduDb.getTable('lists');
  if (lists) {
    // Create an HTML element for each list
    lists.forEach(function(list) {
      var list = list;
      var li = createEl('li', list.name, 'myLists-list', list.id);
      li.style.backgroundColor = list.color;
      li.addEventListener('click', function() {
        Router.navigate('/list/' + list.id + '/')
          .check();
      });
      // Insert the list element before the save list button
      listsList.insertBefore(li, openSaveListDialogButton);
    });
  }
}

function notFound() {
  // Open '404 List not found' view
}

/**
 * Write the list's title
 *
 * @param {string} name - The name of the list.
 * @param {string} color - The hex color of the list.
 */
function writeListTitle(name, color) {
  taskListTitle.innerHTML = '';

  if (color) {
    listViewHeader.style.backgroundColor = color;
  }

  var titleText = document.createTextNode(name);
  taskListTitle.appendChild(titleText);
}

/** Set the active tab */
function setTabs() {
  listTabsButtons.forEach(function(button) {
    button.classList.remove('taskTabs-button-active');
  });

  var tabToActivate = document.querySelector('.taskTabs-button[value="' + filter.value + '"]');
  tabToActivate.classList.add('taskTabs-button-active');
}

/**
 * Write the list's tasks.
 *
 * Writes the tasks for the current list and the current active
 * tab. If the list is empty, write an 'empty list' message insetad.
 *
 * @param {array} tasks - List of all tasks from current list.
 */
function writeListTasks(tasks) {
  // Clean the task view first
  taskList.innerHTML = '';

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
    // If there is no task
    var message = 'There is nothing here.';
    var p = createEl('p', message, 'tasksList-message');

    taskList.appendChild(p);
  }
}

/**
 * Open the list view
 *
 * @param {string} listId - The id of the list to open.
 */
function openList(listId) {
  listView.classList.add('listView-open');
  document.body.classList.add('listOpen');

  var list = tuduDb.getRow(listId, 'lists');

  if (list) {
    var tasks = getTasksFromList(listId);

    currentListInput.value = list.id;

    writeListTitle(list.name, list.color);
    setTabs();
    writeListTasks(tasks);
  } else {
    currentListInput.value = null;
    Router.navigate().check();
  }
}

/**
 * Close the list view
 */
function closeList() {
  listView.classList.remove('listView-open');
  document.body.classList.remove('listOpen');

  currentListInput.value = '';
}

/**
 * Get tasks from a list.
 *
 * Use 'active' or 'completed' to filter the tasks. If no
 * filter is set, returns all the tasks from de list.
 *
 * @param {string} listId - The id of the list.
 *
 * @return {object} An object with the tasks.
 */
function getTasksFromList(listId) {
  var filterValue = filter.value || 'all';
  var allTasks = tuduDb.getTable('tasks');
  var listTasks = [];

  allTasks.forEach(function(task) {
    if (task.list === listId) {
      if (filterValue === 'active' && task.completed) {
        return;
      } else if (filterValue === 'completed' && !task.completed) {
        return;
      }

      listTasks.push(task);
    }
  });

  return listTasks;
}

/**
 * Save or update (if an id is passed) a task. Then, rewrite the
 * tasks element.
 *
 * @param {object} data - The task's data to save or update.
 * @param {string} [taskId] - The id of the task to update.
 */
function saveTask(data, taskId) {
  if (taskId) {
    tuduDb.updateRow(data, 'tasks');
  } else {
    data.completed = false;
    data.list = currentListInput.value;

    tuduDb.addRow(data, 'tasks');
  }

  tuduDb.save();
  writeListTasks(getTasksFromList(currentListInput.value));

  var textToShow = truncate(data.text, 12);
  toast.simple('New task "' + textToShow +'" created.');
}

/**
 * Mark a task as completed. Then, rewrite the tasks element.
 *
 * @param {string} taskId - The id of the task.
 */
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

  writeListTasks(getTasksFromList(currentListInput.value));
}

/**
 * Delete a task. Then, rewrite the task element.
 *
 * @param {string} taskId - The id of the task
 */
function deleteTask(taskId) {
  var backUpTask = tuduDb.getRow(taskId, 'tasks');

  tuduDb.removeRow(taskId, 'tasks');
  tuduDb.save();

  var tasks = getTasksFromList(currentListInput.value);

  writeListTasks(tasks);

  function undo() {
    tuduDb.addRow(backUpTask, 'tasks');
    tuduDb.save();

    writeListTasks(tasks);
  }

  var textToShow = truncate(backUpTask.text, 12);
  toast.action('Task "' + textToShow +'" deleted.', 'Undo', undo);
}

/**
 * Delete all tasks from a list. Then, rewrites the tasks
 * element and show a toast with a 'undo' action.
 *
 * @param {string} listId - The id of the list.
 */
function clearList(listId) {
  var allListTasks = getTasksFromList(listId);
  allListTasks.forEach(function(task) {
    tuduDb.removeRow(task.id, 'tasks');
  });

  tuduDb.save();
  writeListTasks(getTasksFromList(listId));

  // Creates the undo action for the toast
  function undo() {
    allListTasks.forEach(function(task) {
      tuduDb.addRow(task, 'tasks');
    });

    tuduDb.save();
    writeListTasks(getTasksFromList(currentListInput.value));
  }

  // Fire the toast
  toast.action('List cleared.', 'Undo', undo);
}

/**
 * Delete a list. Then reload the home an show a toast with an
 * 'undo' action.
 *
 * @param {string} listId - The id of the list.
 */
function deleteList(listId) {
  // Makes a backup of the list.
  var backUpList = tuduDb.getRow(listId, 'lists');

  tuduDb.removeRow(listId, 'lists');

  tuduDb.save();
  Router.navigate();

  /**
   * Creates the 'undo' action for the toast.
   *
   * Saves the backup version of the list in the database, then
   * rewrites the home view.
   */
  function undo() {
    tuduDb.addRow(backUpList, 'lists');

    tuduDb.save();
    Router.navigate();
  }

  var textToShow = truncate(backUpList.name, 12);
  // Fires the toast
  toast.action('List "' + textToShow + '" deleted.', 'Undo', undo);
}

/**
 * Reset the data base.
 *
 * Deletes all tasks and lists in the database, then rewrites
 * the home view and fire a toast with an 'undo' action.
 */
function deleteAll() {
  // Backup the previous data.
  var backUpData = tuduDb.fetch();

  tuduDb.clear();
  tuduDb.data = {
    tasks: [],
    lists: []
  }
  tuduDb.save();
  Router.navigate();

  /**
   * Creates the 'undo' action for the toast.
   *
   * Saves the data from the backup in the database, then
   * rewrites the home view.
   */
  function undo() {
    tuduDb.data = backUpData;

    tuduDb.save();
    Router.navigate();
  }

  // Fire a toast.
  toast.action('All lists deleted', 'Undo', undo);
}

/**
 * Creates or updates (if an id is passed) a list. Then rewrite
 * the home and fire a toast.
 *
 * @param {object} data - The data to save or update.
 * @param {string} listId - The id of the list to update.
 */
function saveList(data, listId) {
  if (listId) {
    tuduDb.updateRow(data, 'lists');
  } else {
    tuduDb.addRow(data, 'lists');
  }

  tuduDb.save();
  Router.navigate();

  var textToShow = truncate(data.name, 12);
  toast.simple('List "' + textToShow + '" created');
}

/**
 * Edits a list name. Then rewrites the HTML list title element
 * and fire a toast.
 *
 * @param {string} newTitle - The new name of the list.
 * @param {string} listId - The id of the list.
 */
function editListTitle(newTitle, listId) {
  var data = {
    name: newTitle
  }

  tuduDb.updateRow(data, listId, 'lists');
  tuduDb.save();
  writeListTitle(newTitle);

  toast.simple('List title edited');
}

Router.config({ mode: 'history'});
Router
  .add(/list\/(.*)/, function() {
    console.log('list', arguments);
    openList(arguments[0]);
  })
  .add(function() {
    console.log('default');
    loadHome();
  })

/**
 * Set the db connection and load the home view when the
 * document is ready.
 */
document.body.onload = function() {
  setDB();
  Router.check();
}

window.addEventListener('popstate', function(e) {
  Router.check();
});

window.addEventListener('keydown', function(e) {
  if (e.keyCode === 27) {
    Router.navigate().check();
  }
});
