"use strict";

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
