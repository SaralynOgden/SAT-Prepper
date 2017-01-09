// Gets a random integer between the min and the max, inclusive
const getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFrac = function(numerMin, numerMax, denomMin, denomMax) {
  const numer = getRandomInt(numerMin, numerMax);
  let denom = getRandomInt(denomMin, denomMax);
  while (denom === 0) {
    denom = getRandomInt(denomMin, denomMax);
  }

  return math.fraction(numer / denom);
};

// Checks if the term is of order zero and, if so, deletes it
const termExistance = function(eq, eqPortion) {
  const portion = eq[eqPortion];

  for (const term in portion) {
    if (portion[term] === 0) {
      delete portion[term];
    }
  }
};

const getPoint = function(xCoord, yCoord) {
  return {
    x: xCoord,
    y: yCoord
  };
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

// Checks if the leading coefficient of a term is one
// Returns just the term if the leading coef is one and coef*term otherwise
const coeffCheck = function(coeff, term) {
  if (coeff === '1') {
    return term;
  } else if (coeff === '-1') {
    return `-${term}`;
  } else {
    return `${coeff}${term}`;
  }
};
