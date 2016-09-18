document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Gets a random integer between the min and the max, inclusive
  const getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Returns a string from the parameter, which is a mathematical expression
  const mathToString = function(value) {
    if (value.d === 1) {
      return (value.n * value.s).toString();
    }
    if (value === Infinity) {
      return 'Infinity';
    }

    return `\`${math.format(value, { fraction: 'ratio' })}\``;
  };

 // Formats coeff's of eqns to avoid the term being represented as 1 x term or
 // -1 x term
  const coeffCheck = function(coeff, term) {
    if (coeff === '1') {
      return term;
    } else if (coeff === '-1') {
      return `-${term}`;
    } else {
      return `${coeff}${term}`;
    }
  };

  const getPoint = function(xCoord, yCoord) {
    return {
      x: xCoord,
      y: yCoord
    };
  };
  
});
