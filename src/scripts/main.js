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
        openList(list.id);
      });
      // Insert the list element before the save list button
      listsList.insertBefore(li, openSaveListDialogButton);
    });
  }
}

/**
 * Write the list's title
 */
function writeListTitle() {
  taskListTitle.innerHTML = '';

  var list = tuduDb.getRow(currentListInput.value, 'lists');

  listViewHeader.style.backgroundColor = list.color;
  var titleText = document.createTextNode(list.name);
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
 */
function writeListTasks() {
  // Clean the task view first
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

  currentListInput.value = listId;

  writeListTitle();
  setTabs();
  writeListTasks();
}

/**
 * Get tasks from a list.
 *
 * Use 'active' or 'completed' to filter the tasks. If no
 * filter is set, returns all the tasks from de list.
 *
 * @param {string} listId - The id of the list.
 * @param {string} [filter=all] - The name of the filter to use.
 *
 * @return {object} An object with the tasks.
 */
function getTasksFromList(listId, filter) {
  var filter = filter || 'all';
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
  writeListTasks();
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

  writeListTasks();
}

/**
 * Delete a task. Then, rewrite the task element.
 *
 * @param {string} taskId - The id of the task
 */
function deleteTask(taskId) {
  tuduDb.removeRow(taskId, 'tasks');
  tuduDb.save();

  writeListTasks();
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
  writeListTasks();

  // Creates the undo action for the toast
  function undo() {
    allListTasks.forEach(function(task) {
      tuduDb.addRow(task, 'tasks');
    });

    tuduDb.save();
    writeListTasks();
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
  loadHome();

  /**
   * Creates the 'undo' action for the toast.
   *
   * Saves the backup version of the list in the database, then
   * rewrites the home view.
   */
  function undo() {
    tuduDb.addRow(backUpList, 'lists');

    tuduDb.save();
    loadHome();
  }

  // Fires the toast
  toast.action('List deleted.', 'Undo', undo);
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
  loadHome();

  /**
   * Creates the 'undo' action for the toast.
   *
   * Saves the data from the backup in the database, then
   * rewrites the home view.
   */
  function undo() {
    tuduDb.data = backUpData;

    tuduDb.save();
    loadHome();
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
  loadHome();

  toast.simple('List "' + data.name + '" created');
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
  writeListTitle();
  loadHome();

  toast.simple('List title edited');
}

/**
 * Set the db connection and load the home view when the
 * document is ready.
 */
document.body.onload = function() {
  setDB();
  loadHome();
}
