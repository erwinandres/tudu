"use strict";

/**
 * ToastJs.
 * A simple Tudú implementation of a toast engine.
 *
 * @param {HTMLElement} container - The container element for
 *     all the toasts.
 */
function Toast(container) {
  var container = container;
  var className = 'toast';

  /**
   * Creates a simple basic toast.
   *
   * @param {string} text - The text of the toast.
   */
  this.simple = function(text) {
    var toast = createToast(text);
    container.appendChild(toast);

    // Deletes toast after 3000ms.
    deleteToast(toast, 3000);
  }

  /**
   * Creates an action toast.
   *
   * An acion toast contains text and an action button which
   * calls a function.
   *
   * @param {string} text - The text of the toast.
   * @param {string} buttonText - The text of the action button.
   * @param {function} buttonAction - The function to fire when
   *     the action button is clicked.
   */
  this.action = function(text, buttonText, buttonAction) {
    var toast = createToast(text);

    // Creates the action button
    var button = createEl('button', buttonText, 'toast-action');
    button.addEventListener('click', function() {
      buttonAction();
      container.removeChild(toast);
    });

    toast.appendChild(button);

    container.appendChild(toast);

    // Deletes toast after 3000ms.
    deleteToast(toast, 3000);
  }

  /**
   * Creates the HTML toast element.
   *
   * @param {string} text - The inner text of the element.
   * @returns {HTMLElement} The toast as an HTML element.
   */
  function createToast(text) {
    var toast = createEl('div', '', className);
    var toastText = createEl('span', text, 'toast-text');

    toast.appendChild(toastText);

    return toast;
  }

  /**
   * Detele a toast after a time.
   *
   * @param {HTMLElement} toast - The toast element to delete.
   * @param {number} delay - The delay time to delete the toast
   *     in milliseconds.
   */
  function deleteToast (toast, delay) {
    setTimeout(function() {
      if (container.contains(toast)) {
        container.removeChild(toast);        
      }
    }, delay);
  }
}
