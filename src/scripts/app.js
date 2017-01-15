var tasksInput = document.getElementById('new-task-input');
var taskList = document.getElementById('task-list');

function saveList(updateData, callback, id) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));

  var callback = callback || function() {};

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
    callback.call(this, data);

  } else {
    updateData.id = new Date().getTime().toString();

    data.tasks.push(updateData);

    localStorage.setItem('todoAppList', JSON.stringify(data));
    callback.call(this, data.tasks);
  }
}

function setDB() {
  var tasks = '';
  var lists = '';
  var db = {
    tasks: [],
    lists: []
  };

  db = JSON.stringify(db);

  localStorage.setItem('todoAppList', db);
}

function loadList() {
  var data = JSON.parse(localStorage.getItem('todoAppList'));
  showTask(data.tasks);
}

function showTask(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(function(task) {
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
  });
}

function addTask(text) {
  var data = {
    text: text,
    completed: false,
  }

  saveList(data, showTask);
}

function completeTask(task) {
  var savedItems = JSON.parse(localStorage.getItem('todoAppList'));

  for (var i = savedItems.tasks.length - 1; i >= 0; i--) {
    if (savedItems.tasks[i].id === task.id) {
      if (task.completed) {
        task.completed = false;
      } else {
        task.completed = true;  
      }

      saveList(task, showTask, task.id);
      break;
    }
  }
}

function removeTask(id, callback) {
  var data = JSON.parse(localStorage.getItem('todoAppList'));

  var callback = callback || function() {};

  for (var i = data.tasks.length - 1; i >= 0; i--) {
    if (data.tasks[i].id === id) {
      data.tasks.splice(i, 1);
      break;
    }
  }

  localStorage.setItem('todoAppList', JSON.stringify(data));
  callback.call(this, data.tasks);
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

  loadList();
};
