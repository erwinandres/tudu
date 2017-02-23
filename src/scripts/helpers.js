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
    '#F8BBD0',
    '#E1BEE7',
    '#D1C4E9',
    '#C5CAE9',
    '#BBDEFB',
    '#B3E5FC',
    '#B2EBF2',
    '#B2DFDB',
    '#C8E6C9',
    '#DCEDC8',
    '#F0F4C3',
    '#FFF9C4',
    '#FFECB3',
    '#FFE0B2',
    '#FFCCBC',
    '#D7CCC8'

  ];

  var index = getRandomInt(0, colors.length-1);
  var color = colors[index];

  return color;
}

/**
 * Truncate text
 *
 * @param {string} text - The text to truncate.
 * @param {Number} max - The maximum number of characters in the
 *   text.
 *
 * @returns The text truncated if the length is longer than the
 *   max number plus an elypsis, or the normal text if is
 *   shorter than the max number.
 */
function truncate(text, max) {
  var textLen = text.length;

  if (textLen > max) {
    return text.substring(0, max) + '…';
  } else {
    return text;
  }
}
