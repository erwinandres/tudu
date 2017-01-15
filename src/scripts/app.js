var tasksInput = document.getElementById('new-task-input');
var taskList = document.getElementById('task-list');
var listsList = document.getElementById('lists-list');
var saveListInput = document.getElementById('save-list-input');
var saveListButton = document.getElementById('save-list-button');
var currentListInput = document.getElementById('current-list-input');
var deleteListButton = document.getElementById('delete-list-button');

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
    callback.call(this, data.tasks, currentList);

  } else {
    updateData.id = new Date().getTime().toString();
    updateData.list = currentList;

    data.tasks.push(updateData);

    localStorage.setItem('todoAppList', JSON.stringify(data));
    callback.call(this, data.tasks, currentList);
  }
}

function saveList(listName, callback1, callback2) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  var callback1 = callback1 || function() {};
  var callback2 = callback2 || function() {};
  var currentList = currentListInput.value;

  var id = new Date().getTime().toString();

  var newData = {
    id: id,
    name: listName
  }

  data.lists.push(newData);

  console.log(newData)

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    data.tasks[i].list = newData.id;
  }

  localStorage.setItem('todoAppList', JSON.stringify(data));
  callback1.call(this, data.tasks, currentList);
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
        name: 'default'
      }
    ]
  };

  db = JSON.stringify(db);

  localStorage.setItem('todoAppList', db);
}

function loadtasksList() {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  showTask(data.tasks, "1");
  showLists(data.lists);
}

function showTask(tasks, listId) {
  taskList.innerHTML = '';

  tasks.forEach(function(task) {
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
}

function showLists(lists) {
  listsList.innerHTML = '';
  lists.forEach(function(list) {
    var listText = document.createTextNode(list.name);
    var li = document.createElement('li');

    li.className = 'todoApp-listsList-item';
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

      showTask(data.tasks, listId);
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
  callback.call(this, data.tasks, currentList);
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

saveListButton.addEventListener('click', function(evt) {
  var newListName = saveListInput.value.trim();

  console.log(newListName);

  if (newListName !== '') {
    saveList(newListName, showTask, showLists);    
    saveListInput.value = '';
  }
})

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
