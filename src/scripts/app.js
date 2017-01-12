var tasksInput = document.getElementById('new-task-input');
var taskList = document.getElementById('task-list');

function saveList(updateData, callback, id) {
  var data = [];

  var callback = callback || function() {};

  if (localStorage['todoAppList'] !== '') {
    data = JSON.parse(localStorage['todoAppList']);
  }

  if (id) {
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].id === id) {
        for (var key in updateData) {
          data[i][key] = updateData[key];
        }
        break;
      }
    }

    localStorage['todoAppList'] = JSON.stringify(data);
    callback.call(this, data);

  } else {
    updateData.id = new Date().getTime().toString();

    data.push(updateData);

    localStorage['todoAppList'] = JSON.stringify(data);
    callback.call(this, data);
  }
}

function loadList() {
  if (localStorage['todoAppList'] !== '') {
    var data = JSON.parse(localStorage['todoAppList']);
    showTask(data);
  }
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
  var savedItems = JSON.parse(localStorage['todoAppList']);

  for (var i = savedItems.length - 1; i >= 0; i--) {
    if (savedItems[i].id === task.id) {
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
  var data = JSON.parse(localStorage['todoAppList']);

  var callback = callback || function() {};

  for (var i = data.length - 1; i >= 0; i--) {
    if (data[i].id === id) {
      data.splice(i, 1);
      break;
    }
  }

  localStorage['todoAppList'] = JSON.stringify(data);
  callback.call(this, data);
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

document.body.onload = loadList;
