"use strict";

/** Create an HMTL element */
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
