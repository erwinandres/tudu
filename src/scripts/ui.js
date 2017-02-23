"use strict";

// Start with empty db vars.
var dbName;
var tuduDb;

//Init toast
var toastContainer = document.getElementById('toast-container');
var toast = new Toast(toastContainer);

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

/**************************************************************
 * Lists
 **************************************************************/
//Input: save list
var saveListInput = document.getElementById('save-list-input');

saveListInput.addEventListener('focus', function() {
  this.parentElement.classList.add('newList-formGroup-active');
});

saveListInput.addEventListener('blur', function() {
  this.parentElement.classList.remove('newList-formGroup-active');
});

saveListInput.onkeyup = function() {
  if (event.keyCode == 13) {
    saveListButton.click();
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

/**************************************************************
 * Tasks/List view
 **************************************************************/
//Button: close list view
var closeListViewButton = document.getElementById('close-list-view');

closeListViewButton.addEventListener('click', function() {
  listView.classList.remove('listView-open');
  document.body.classList.remove('listOpen');
});

//Button: clear list
var clearListButton = document.getElementById('clear-list');

clearListButton.addEventListener('click', function() {
  clearList(currentListInput.value);
});

//Button: delete list
var deleteListButton = document.getElementById('delete-list');

deleteListButton.addEventListener('click', function() {
  listView.classList.remove('listView-open');
  deleteList(currentListInput.value);
});

var editListTitleButton = document.getElementById('edit-list-title-button');

editListTitleButton.addEventListener('click', function() {
  listViewHeader.classList.add('listView-header-edit');

  var listTitle = taskListTitle.innerText;
  var input = createEl('input', '', 'listView-header-titleEdit');
  input.value = listTitle;
  input.type = 'text';
  input.maxlength = '60';

  input.addEventListener('blur', function() {
      listViewHeader.classList.remove('listView-header-edit');
      listViewHeader.removeChild(input);  
  });

  input.onkeyup = function(evt) {
    if (evt.keyCode === 13) {
      var value = input.value.trim();

      if (value !== '' && value.length <= 190) {
        editListTitle(value, currentListInput.value);
      }

      input.blur();
    }
  }
  
  var moreListOptionsButton = document.getElementById('more-list-options');
  listViewHeader.insertBefore(input, moreListOptionsButton);
  input.focus();
});

//Input: new task
var tasksInput = document.getElementById('new-task-input');

tasksInput.addEventListener('focus', function() {
  this.parentElement.parentElement.classList.add('newTask-active');
});

tasksInput.addEventListener('blur', function() {
  this.parentElement.parentElement.classList.remove('newTask-active');
});

tasksInput.onkeyup = function(event) {
  if (event.keyCode == 13) {
    newTaskButton.click();
  }
}

//Button: new task
var newTaskButton = document.getElementById('new-task-button');
newTaskButton.addEventListener('click', function(evt) {
  var value = tasksInput.value.trim();

  if (value !== '' && value.length <= 200) {
    var data = { text: value };
    saveTask(data);
    tasksInput.value = '';
    tasksInput.blur();
  }
});

//Buttons: list view actions
var listTabsButtons = document.querySelectorAll('.taskTabs-button');

listTabsButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    var value = this.value;

    filter.value = value;
    setTabs();
    writeListTasks();
  });
});

/**************************************************************
 * Dialogs
 **************************************************************/
//All dialogs
var dialogs = document.querySelectorAll('[data-dialog]');
dialogs.forEach(function(dialog) {
  var dialogContent = dialog.querySelector('[data-dialog-content]');
  dialogContent.addEventListener('click', function(evt) {
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
var closeDialogButton = document.querySelectorAll('[data-dialog-close]');
for (var i = closeDialogButton.length - 1; i >= 0; i--) {
  closeDialogButton[i].addEventListener('click', function() {
    var closeTarget = this.getAttribute(['data-dialog-close']);
    var closeElement = document.querySelector('[data-dialog=' + closeTarget + ']');
    closeElement.classList.remove('dialog-visible');
  });
}

/**************************************************************
 * Main menu
 **************************************************************/
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

/**************************************************************
 * Dropdowns
 **************************************************************/
var dropdowns = document.querySelectorAll('[data-dropdown]');

var dropdownOpenButtons = document.querySelectorAll('[data-dropdown-open]');
dropdownOpenButtons.forEach(function(button) {
  button.addEventListener('click', function(evt) {
    evt.stopPropagation();

    var target = button.getAttribute(['data-dropdown-open']);
    var targetElement = document.querySelector('[data-dropdown=' + target + ']');
    targetElement.classList.add('dropdown-visible');
  });
});

/**
 * Close all menus and dialgos when clicking anywhere in the
 * body.
 */
document.body.addEventListener('click', function() {
  mainNav.classList.remove('mainNav-open');

  dropdowns.forEach(function(dropdown) {
    dropdown.classList.remove('dropdown-visible');
  });

  dialogs.forEach(function(dialog) {
    dialog.classList.remove('dialog-visible');
  });

  listViewOptions.classList.remove('listView-options-show');
});
