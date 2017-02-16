"use strict";

/**
 * Create HTML element.
 *
 * @param {string} type - The type of the element.
 * @param {string|node} inner - The content of the element.
 *     If is not a node of type 1, would be trated as a string.
 * @param {string} className - The class of the element.
 * @param {string} id - The id of the element.
 *
 * @return {HTMLElement} The created element.
 */
function createEl(type, inner, className, id) {
  var el = document.createElement(type);

  if (inner.nodeType !== 1) {
    inner =  document.createTextNode(inner);
  }

  el.appendChild(inner);

  if (className) {
    el.className = className;
  }

  if (id) {
    el.id = id;
  }

  return el;
}

/**
 * Get a random integer.
 *
 * @param {number} min - Minium number to return.
 * @param {number} max - Maximum number to return.
 *
 * @return {number} Generated random integer.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random color from a presetted list.
 *
 * Is used to assign a color to a list when is created and
 * depends of the getRandomInt function.
 *
 * @return {string} The hex code of the picked color.
 */
function getRandomColor() {
  var colors = [
    '#FFCDD2',
    '#E1BEE7',
    '#D1C4E9',
    '#C5CAE9',
    '#BBDEFB',
    '#B2DFDB',
    '#F0F4C3',
    '#FFECB3'
  ];

  var index = getRandomInt(0, colors.length-1);
  var color = colors[index];

  return color;
}
