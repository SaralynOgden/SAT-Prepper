// Formats diagonal linear equation to follow human conventions
// Slope must be a string and mathjsYIntercept must be in the mathjs format
const formatDiagLinearEqn = function(slope, yIntercept) {
  const strSlope = mathToString(slope);

  if (yIntercept.n === 0) {
    return `y = ${strSlope} x`;
  }
  if (yIntercept.s === 1) {
    const strYIntercept = mathToString(yIntercept);

    return `y = ${coeffCheck(strSlope, 'x')} + ${strYIntercept}`;
  } else {
    const strYIntercept = mathToString(math.abs(yIntercept));

    return `y = ${coeffCheck(strSlope, 'x')} - ${strYIntercept}`;
  }
};

// Function factory for generating linear equations on a cartesian plane
const getLinearEqn = function(pt) {
  const pt1 = pt ? pt : getPoint(getRandomInt(-20, 20), getRandomInt(-20, 20));
  const pt2 = getPoint(getRandomInt(-20, 20), getRandomInt(-20, 20));
  const slope = pt1.x === pt2.x ?
              Infinity : math.fraction((pt2.y - pt1.y) / (pt2.x - pt1.x));
  const yIntercept = math.subtract(pt2.y, math.multiply(slope, pt2.x));
  let xIntercept, eqn;

  if (slope === Infinity) {
    xIntercept = pt1.x;
  } else if (mathToString(slope) !== '0') {
    xIntercept = math.divide(math.unaryMinus(yIntercept), slope);
  }
  switch (mathToString(slope)) {
    case 'Infinity':
      eqn = `x = ${pt1.x}`;
      break;
    case '0':
      eqn = `y = ${pt1.y}`;
      break;
    default:
      eqn = formatDiagLinearEqn(slope, yIntercept);
      break;
  }

  return {pt1, pt2, slope, yIntercept, xIntercept, eqn};
};

// Func. factory for generating lines in some way related to an original line
// Options for types are: perpendicular, parallel, originalWithSignError,
// or mistakeXIntForYInt
const getRelatedEqn = function(originalLine, type, qualifier) {
  let yIntercept = getRandomFrac(-200, 200, 210, 210);

  while (yIntercept === originalLine.yIntercept) {
    yIntercept = getRandomFrac(-200, 200, 210, 210);
  }
  let slope = originalLine.slope;

  switch (type) {
    case 'perpendicular':
      slope = math.divide(1, originalLine.slope);
      if (qualifier === 'same y-intercept') {
        yIntercept = originalLine.yIntercept;
      }
      break;
    case 'parallel':
      slope = originalLine.slope;
      break;
    case 'originalWithSignError':
      yIntercept = originalLine.yIntercept;
      slope = originalLine.slope;
      if (Math.random() >  1 / 2) {
        yIntercept = math.unaryMinus(yIntercept);
      } else {
        slope = math.unaryMinus(slope);
      }
      console.log('slope: ' + slope + ' y-intercept: ' + yIntercept);
      break;
    case 'mistakeXIntForYInt':
      slope = originalLine.slope;
      yIntercept = originalLine.xIntercept;
      break;
    default:
      return 'no such type';
  }
  return formatDiagLinearEqn(slope, yIntercept);
}

const linearEqnWithGivenIntercept = function(intercept) {
  return `y = ${getRandomInt(1, 40)} x + ${intercept}`;
};

// Generates three incorrect answer for horizontal linear equations
const getIncorrectHorzLEqns = function(originalLine) {
  const incorrectAnswers = [];
  let vertLEqnNotPresent = true;
  let xForYNotPresent = true;

  for (let i = 0; i < 3; i++) {
    const questionType = Math.random();

    if (questionType < 1 / 3 && vertLEqnNotPresent) {
      vertLEqnNotPresent = false;
      incorrectAnswers.push(`x = ${originalLine.pt1.y}`);
    } else if (questionType < 2 / 3 && xForYNotPresent) {
      xForYNotPresent = false;
      incorrectAnswers.push(`y = ${originalLine.pt1.x}`);
    } else {
      incorrectAnswers.push(linearEqnWithGivenIntercept(originalLine.pt1.y));
    }
  }

  return incorrectAnswers;
};

// Generates three incorrect answer for vertical linear equations
const getIncorrectVertLEqns = function(originalLine) {
  const incorrectAnswers = [];
  let horzLEqnNotPresent = true;
  let yForXNotPresent = true;

  for (let i = 0; i < 3; i++) {
    const questionType = Math.random();

    if (questionType < 1 / 3 && horzLEqnNotPresent) {
      horzLEqnNotPresent = false;
      incorrectAnswers.push(`y = ${originalLine.pt1.x}`);
    } else if (questionType < 2 / 3 && yForXNotPresent) {
      yForXNotPresent = false;
      incorrectAnswers.push(`x = ${originalLine.pt1.y}`);
    } else {
      incorrectAnswers.push(linearEqnWithGivenIntercept(originalLine.pt1.x));
    }
  }

  return incorrectAnswers;
};

// Generates three incorrect answers for diagonal linear equations
const getIncorrectDiagLEqns = function(originalLine) {
  const incorrectAnswers = [];
  let perpWithSameYIntPresent = false;
  let xIntMistakeLinePresent = false;
  let signErrorPresent = false;

  for (let i = 0; i < 3; i++) {
    const questionType = Math.random();

    if (questionType < 1 / 8 && !xIntMistakeLinePresent) {
      incorrectAnswers.push(
        getRelatedEqn(originalLine, 'mistakeXIntForYInt'));
      xIntMistakeLinePresent = true;
    } else if (questionType < 3/ 8) {
      incorrectAnswers.push(getRelatedEqn(originalLine, 'parallel'));
    } else if (questionType < 5 / 8 && signErrorPresent) {
      incorrectAnswers.push(
        getRelatedEqn(originalLine, 'originalWithSignError'))
    } else if (questionType < 11 / 16 && !perpWithSameYIntPresent) {
      incorrectAnswers.push(
        getRelatedEqn(originalLine, 'perpendicular', 'same y-intercept'));
      perpWithSameYIntPresent = true;
    } else {
      incorrectAnswers.push(getRelatedEqn(originalLine, 'perpendicular'));
    }
  }

  return incorrectAnswers;
};

// Generates a shuffled set of answers (one correct, three incorrect)
const getAnswerSet = function(answer, incorrectAnswers) {
  currentAnswer = answer;
  incorrectAnswers.push(answer);
  shuffle(incorrectAnswers);

  return incorrectAnswers;
};

// Func. factory for getting a question about a single linear equation and
// its cooresponding answer set
const getSingleLinearEqnQAS = function() {
  let linearEqn = getLinearEqn();
  const linearEqnQuestions = [
    `What is the equation of a line with the points
    (${linearEqn.pt1.x}, ${linearEqn.pt1.y}) and
    (${linearEqn.pt2.x}, ${linearEqn.pt2.y})?`,
    `What is the equation of a line with the point
    (${linearEqn.pt1.x}, ${linearEqn.pt1.y})
    and a slope of ${mathToString(linearEqn.slope)}?`,
    `What is the equation of a line with an x-intercept of
    ${mathToString(linearEqn.xIntercept)}
     and a slope of ${mathToString(linearEqn.slope)}?`
  ];
  const questionType = Math.random();
  let question;
  let answerSet;

  if (questionType < 1 / 2) {
    question = linearEqnQuestions[0];
  } else if (questionType < 2 / 3) {
    question = linearEqnQuestions[1];
  } else {
    while (!linearEqn.xIntercept) {
      linearEqn = getLinearEqn();
    }
    question = linearEqnQuestions[2];
  }
  switch (mathToString(linearEqn.slope)) {
    case 'Infinity':
      answerSet =
        getAnswerSet(linearEqn.eqn, getIncorrectVertLEqns(linearEqn));
      break;
    case '0':
      answerSet =
        getAnswerSet(linearEqn.eqn, getIncorrectHorzLEqns(linearEqn));
      break;
    default:
      answerSet =
        getAnswerSet(linearEqn.eqn, getIncorrectDiagLEqns(linearEqn));
      break;
  }

  return {question, answerSet};
};

// Function factory for intersecting lines that can have two different forms:
// standard or slope-inercept
const getSystemOfLinearEqns = function() {
  const intersectionPoint =
      getPoint(getRandomInt(-20, 20), getRandomInt(-20, 20));
  let eqn1 = getLinearEqn(intersectionPoint);
  let eqn2 = getLinearEqn(intersectionPoint);

  while (eqn1.slope === eqn2.slope && eqn1.yIntercept === eqn2.yIntercept) {
    eqn1 = getLinearEqn(pt);
    eqn2 = getLinearEqn(pt);
  }
  const formDecider = Math.random();
  const isInStdForm = formDecider < 0.5;

  if (isInStdForm) {
    eqn1.eqn = putLinearEqnInStdForm(eqn1);
    eqn2.eqn = putLinearEqnInStdForm(eqn2);
  }

  return { eqn1, eqn2, intersectionPoint, isInStdForm };
};

const putLinearEqnInStdForm = function(eqn) {
  const multiplier = eqn.slope.d;
  const xCoeff = mathToString(eqn.slope.n);
  const yCoeff = mathToString(math.unaryMinus(multiplier));
  const loneConstant = mathToString(math.unaryMinus(
                        math.multiply(multiplier, eqn.yIntercept)));

  return `${loneConstant} = ${coeffCheck(xCoeff, 'x')} + ${coeffCheck(yCoeff, 'y')}`;
};

const getIntersectLinearEqnsQAS = function() {
  const systemOfEqns = getSystemOfLinearEqns();
  const question = `Solve the following system of linear equations:\n
                    \t${systemOfEqns.eqn1.eqn}\n
                    \t${systemOfEqns.eqn2.eqn}`;
  console.log(systemOfEqns.intersectionPoint);
  return question;
}

const test = getIntersectLinearEqnsQAS();
console.log(test);
