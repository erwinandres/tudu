var menuButton = document.getElementById('menu-button');
var tasksInput = document.getElementById('new-task-input');
var taskList = document.getElementById('task-list');
var listsList = document.getElementById('lists-list');
var saveListInput = document.getElementById('save-list-input');
var saveListButton = document.getElementById('save-list-button');
var currentListInput = document.getElementById('current-list-input');
var deleteListButton = document.getElementById('delete-list-button');
var taskListTitle = document.getElementById('task-list-title');
var clearListButton = document.getElementById('clear-list-button');

function saveTasks(updateData, callback, id) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
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

    localStorage.setItem('todoAppList', JSON.stringify(data)); 
    callback.call(this, data, currentList);

  } else {
    updateData.id = new Date().getTime().toString();
    updateData.list = currentList;

    data.tasks.push(updateData);

    localStorage.setItem('todoAppList', JSON.stringify(data));
    callback.call(this, data, currentList);
  }
}

function saveList(listName, callback1, callback2) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  var callback1 = callback1 || function() {};
  var callback2 = callback2 || function() {};

  var id = new Date().getTime().toString();

  var newData = {
    id: id,
    name: listName
  }

  data.lists.push(newData);

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    data.tasks[i].list = newData.id;
  }

  currentListInput.value = id;
  var currentList = currentListInput.value;

  localStorage.setItem('todoAppList', JSON.stringify(data));
  callback1.call(this, data, currentList);
  callback2.call(this, data.lists);
}

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

  localStorage.setItem('todoAppList', db);
}

function loadtasksList() {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  showTask(data, "1");
  showLists(data.lists);
}

function showTask(data, listId) {
  taskList.innerHTML = '';
  taskListTitle.innerHTML = '';

  var listTitle;
  for (var i = data.lists.length - 1; i >= 0; i--) {
    if (data.lists[i].id === listId) {
      listTitle = data.lists[i].name;
      break;
    }
  }

  listTitle = document.createTextNode(listTitle);
  taskListTitle.appendChild(listTitle);

  data.tasks.forEach(function(task) {
    if (task.list === listId) {
      var taskLabel = document.createElement('label');
      taskLabel.className = 'todoApp-list-item-label';
      taskLabel.appendChild(document.createTextNode(task.text));

      //Create the checkbox
      var circle = document.createElement('input');
      circle.className = 'todoApp-list-item-check';
      circle.setAttribute('type', 'checkbox');
      circle.addEventListener('click', function() {
        completeTask(task)
      });

      //Create the delete button
      var destroy = document.createElement('button');
      destroy.className = 'todoApp-list-item-destroy';
      destroy.addEventListener('click', function() {
        removeTask(task.id, showTask);
      });

      //Create the list item
      var li = document.createElement('li');
      li.id = task.id;
      li.className = 'todoApp-list-item';
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

  if (currentListInput.value === "1") {
    deleteListButton.setAttribute('disabled', true);
    saveListInput.removeAttribute('disabled')
    saveListButton.removeAttribute('disabled');
  } else {
    deleteListButton.removeAttribute('disabled');
    saveListInput.setAttribute('disabled', true);
    saveListButton.setAttribute('disabled', true);
  }
}

function showLists(lists) {
  listsList.innerHTML = '';
  lists.forEach(function(list) {
    var listText = document.createTextNode(list.name);
    var li = document.createElement('li');

    li.className = 'todoApp-listsList-item todoApp-mainNav-list-item';
    li.id = list.id;
    li.appendChild(listText);

    listsList.appendChild(li);
  });

  var listItems = listsList.querySelectorAll('.todoApp-listsList-item');
  listItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var listId = this.id;
      var data = JSON.parse(localStorage.getItem('todoAppList'));

      currentListInput.value = listId;

      showTask(data, listId);
    })
  });
}

function addTask(text) {
  var data = {
    text: text,
    completed: false,
    list: '1'
  }

  saveTasks(data, showTask);
}

function completeTask(task) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));

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

function removeTask(id, callback) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  var currentList = currentListInput.value;
  var callback = callback || function() {};

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    if (data.tasks[i].id === id) {
      data.tasks.splice(i, 1);
      break;
    }
  }

  localStorage.setItem('todoAppList', JSON.stringify(data));
  callback.call(this, data, currentList);
}

function clearList(listId, callback) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  var currentList = currentListInput.value;
  var callback = callback || function() {};

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    if (data.tasks[i].list === listId) {
      data.tasks.splice(i, 1);
    }
  }

  localStorage.setItem('todoAppList', JSON.stringify(data));
  callback.call(this, data, currentList);
}

function removList(id, callback1, callback2) {
  if (id !== "1") {
    clearList(id, showTask);

    var data = JSON.parse(localStorage.getItem('todoAppList'));
    var callback1 = callback1 || function() {};
    var callback2 = callback2 || function() {};

    for (var i = data.lists.length - 1; i >= 0; i--) {
      if (data.lists[i].id === id) {
        data.lists.splice(i, 1);
        break;
      }
    }

    currentListInput.value = "1";
    var currentList = currentListInput.value;

    localStorage.setItem('todoAppList', JSON.stringify(data));
    callback1.call(this, data, currentList);
    callback2.call(this, data.lists, currentList);
  }
}

tasksInput.addEventListener('focus', function() {
  this.parentElement.classList.add('todoApp-newTask-active');
});

tasksInput.addEventListener('blur', function() {
  this.parentElement.classList.remove('todoApp-newTask-active');
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

deleteListButton.addEventListener('click', function(evt) {
  evt.preventDefault();

  var id = currentListInput.value;
  removList(id, showTask, showLists);
});

saveListButton.addEventListener('click', function(evt) {
  var newListName = saveListInput.value.trim();

  if (newListName !== '') {
    saveList(newListName, showTask, showLists);    
    saveListInput.value = '';
  }
});

clearListButton.addEventListener('click', function(evt) {
  evt.preventDefault();

  var currentList = currentListInput.value;
  clearList(currentList, showTask);
});

menuButton.addEventListener('click', function(evt) {
  evt.preventDefault();

  this.classList.toggle('todoApp-menuButton-open');

  var mainNav = document.getElementById('main-nav');
  mainNav.classList.toggle('todoApp-mainNav-open');
});

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

document.body.onload = function() {
  if (!localStorage['todoAppList']) {
    setDB();
  }

  loadtasksList();
};
