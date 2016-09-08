$(document).ready(function() {
  'use strict';
  let currentQuestion;
  let currentAnswer;
  let currentAnswerButton;

  // Gets a random integer between the min and the max, inclusive
  const getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

  // Constructor for points
  const Pt = function(xcoord, ycoord) {
    this.x = xcoord;
    this.y = ycoord;
  };

  // Constructor for simpification equations
  const Simplification = function() {
    this.numer = {
      x: getRandomInt(-10, 10),
      y: getRandomInt(-10, 10),
      z: getRandomInt(-10, 10)
    };
    this.denom = {
      x: getRandomInt(-10, 10),
      y: getRandomInt(-10, 10),
      z: getRandomInt(-10, 10)
    };
    this.eqn = function() {
      termExistance(this, 'numer');
      termExistance(this, 'denom');
      let eqn = '(';

      for (const term in this.numer) {
        const power = this.numer[term];

        if (power === 1) {
          eqn += `${term}* `;
        } else {
          eqn += `${term}^${power}* `;
        }
      }
      eqn = `${eqn.slice(0, -2)})/(`;
      for (const term in this.denom) {
        const power = this.denom[term];

        if (power === 1) {
          eqn += ` ${term}* `;
        } else {
          eqn += `${term}^${power}* `;
        }
      }
      eqn = `${eqn.slice(0, -2)})`;

      return eqn;
    };
  }

  // Constructor for term simplification questions
  const SimplificationQuestion = function() {
    const simplification = new Simplification();
    this.question = function() {
      return `Simplify \`${simplification.eqn()}\``;
    };
    this.wolframQuestion = function() {
      return `Simplify ${simplification.eqn()}`;
    }
    this.answerSet = function() {
      const wrong1 = new Simplification();
      const wrong2 = new Simplification();
      const wrong3 = new Simplification();
      const answers = [`\`${wrong1.eqn()}\``, `\`${wrong2.eqn()}\``, `\`${wrong3.eqn()}\``, currentAnswer];
      shuffle(answers);
      return answers;
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
    if (coeff === "1") {
      return term;
    } else if (coeff === "-1") {
      return `-${term}`;
    } else {
      return `${coeff}${term}`;
    }
  };

  // Formats diagonal linear equation to follow human conventions
  // Slope must be a string and mathjsYIntercept must be in the mathjs format
  const formatDiagLinearEqn = function(slope, mathjsYIntercept) {
    if (mathjsYIntercept.n === 0) {
      return `y = ${slope} x`;
    }
    if (mathjsYIntercept.s === 1) {
      const yIntercept = mathToString(mathjsYIntercept);

      return `y = ${coeffCheck(slope, 'x')} + ${yIntercept}`;
    } else {
      const yIntercept = mathToString(math.abs(mathjsYIntercept));

      return `y = ${coeffCheck(slope, 'x')} - ${yIntercept}`;
    }
  };

  // Constructor for linear equations
  const LinearEqn = function() {
    this.pt1 = new Pt(getRandomInt(-10, 10), getRandomInt(-10, 10));
    this.pt2 = new Pt(getRandomInt(-10, 10), getRandomInt(-10, 10));
    this.slope = function() {
      if (this.pt2.x === this.pt1.x) {
        return Infinity;
      }

      return math.fraction((this.pt2.y - this.pt1.y) /
                           (this.pt2.x - this.pt1.x));
    };
    this.yIntercept = function() {
      return math.subtract(this.pt2.y, math.multiply(this.slope(), this.pt2.x));
    };
    this.xIntercept = function() {
      if (this.slope() === Infinity) {
        return this.pt2.x;
      }

      return math.divide(math.unaryMinus(this.yIntercept()), this.slope());
    };
    this.eqn = function() {
      const slope = mathToString(this.slope());

      switch (slope) {
        case 'Infinity':
          return `x = ${this.pt1.x}`;
        case '0':
          return `y = ${this.pt1.y}`;
        default:
          return formatDiagLinearEqn(slope, this.yIntercept());
      }
    };
  };

  // Constructor for lines perpendicular to a line passed in as a parameter
  const PerpendicularLine = function(originalLine) {
    this.slope = function() {
      return math.divide(1, originalLine.slope());
    };
    this.yIntercept = function() {
      return math.fraction(getRandomInt(-20, 20));
    };
    this.eqn = function() {
      return formatDiagLinearEqn(mathToString(this.slope()), this.yIntercept());
    };
    this.eqnWithSameYInt = function() {
      return formatDiagLinearEqn(mathToString(this.slope()),
                                  originalLine.yIntercept());
    };
  };

  // Constructor for lines parallel to a line passed in as a parameter
  const ParallelLine = function(originalLine) {
    this.slope = function() {
      return originalLine.slope();
    };
    this.eqn = function() {
      let yIntercept = math.fraction(getRandomInt(-20, 20));

      if (yIntercept === originalLine.yIntercept()) {
        yIntercept = getRandomInt(-20, 20);
      }

      return formatDiagLinearEqn(mathToString(this.slope()), yIntercept);
    };
  };

  // Constructor for lines where the x-intercept has been misunderstood as
  // the y-intercept
  const XIntMistakeLine = function(originalLine) {
    this.slope = function() {
      return originalLine.slope();
    };
    this.eqn = function() {
      let yIntercept = originalLine.xIntercept();

      return formatDiagLinearEqn(mathToString(this.slope()), yIntercept);
    };
  };

  const linearEqnWithParticularIntercept = function(intercept) {
    return `y = ${getRandomInt(1, 40)} x + ${intercept}`;
  }

  // Generates three incorrect answer for horizontal linear equations
  const getIncorrectHorzLEqns = function(originalLine) {
    let incorrectAnswers = [];
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
        incorrectAnswers.push(linearEqnWithParticularIntercept(originalLine.pt1.y));
      }
    }
    return incorrectAnswers;
  };

  // Generates three incorrect answer for vertical linear equations
  const getIncorrectVertLEqns = function(originalLine) {
    let incorrectAnswers = [];
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
        incorrectAnswers.push(linearEqnWithParticularIntercept(originalLine.pt1.x));
      }
    }
    return incorrectAnswers;
  };

  // Generates three incorrect answers for diagonal linear equations
  const getIncorrectDiagLEqns = function(originalLine) {
    let incorrectAnswers = [];
    let perpWithSameYIntPresent = false;
    let xIntMistakeLinePresent = false;

    for (let i = 0; i < 3; i++) {
      const questionType = Math.random();

      if (questionType < 1 / 8 && !xIntMistakeLinePresent) {
        let xIntMistake = new XIntMistakeLine(originalLine);

        incorrectAnswers.push(xIntMistake.eqn());
        xIntMistakeLinePresent = true;
      } else if (questionType < 5 / 8) {
        let parallel = new ParallelLine(originalLine);

        incorrectAnswers.push(parallel.eqn());
      } else if (questionType < 3 / 4 && !perpWithSameYIntPresent) {
        let perpendicular = new PerpendicularLine(originalLine);

        incorrectAnswers.push(perpendicular.eqnWithSameYInt());
        perpWithSameYIntPresent = true;
      } else {
        let perpendicular = new PerpendicularLine(originalLine);

        incorrectAnswers.push(perpendicular.eqn());
      }
    }

    return incorrectAnswers;
  };

  // Shuffles an array
  const shuffle = function(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let randIndex = getRandomInt(0, 3);
      let temp = arr[randIndex];
      arr[randIndex] = arr[i];
      arr[i] = temp;
    }
  };

  // Generates a shuffled set of answers (one correct, three incorrect)
  const getAnswerSet = function(answer, incorrectAnswers) {
    incorrectAnswers.push(answer);
    shuffle(incorrectAnswers);
    return incorrectAnswers;
  }

  // Constructor for questions asking to find the equation of a line from
  // two points
  const LineFromPts = function() {
    this.line = new LinearEqn();
    this.question = function() {
      return `What is the equation of a line with the points
      (${this.line.pt1.x}, ${this.line.pt1.y}) and
      (${this.line.pt2.x}, ${this.line.pt2.y})?`;
    };
    this.answer = function() {
      return this.line.eqn();
    };
    this.answerSet = function() {
      const slope = mathToString(this.line.slope());

      switch (slope) {
        case 'Infinity':
          return getAnswerSet(this.answer(), getIncorrectVertLEqns(this.line));
        case '0':
          return getAnswerSet(this.answer(), getIncorrectHorzLEqns(this.line));
        default:
          return getAnswerSet(this.answer(), getIncorrectDiagLEqns(this.line));
      }
    };
  };

  // Constructor for questions asking to find the equation of a line from
  // a point and the slope
  const LineFromPtAndSlope = function() {
    this.line = new LinearEqn();
    this.question = function() {
      return `What is the equation of a line with the point
      (${this.line.pt1.x}, ${this.line.pt1.y})
      and a slope of ${mathToString(this.line.slope())}?`;
    };
    this.answer = function() {
      return this.line.eqn();
    };
    this.answerSet = function() {
      const slope = mathToString(this.line.slope());

      switch (slope) {
        case 'Infinity':
          return getAnswerSet(this.answer(), getIncorrectVertLEqns(this.line));
        case '0':
          return getAnswerSet(this.answer(), getIncorrectHorzLEqns(this.line));
        default:
          return getAnswerSet(this.answer(), getIncorrectDiagLEqns(this.line));
      }
    };
  };

  // Constructor for questions asking to find the equation of a line from
  // the x-intercept and the slope
  const LineFromXIntAndSlope = function() {
    this.line = new LinearEqn();
    this.question = function() {

      // redefine the line if it doesn't have an x-intercept (ie: y = 3)
      if (this.line.slope().n === 0) {
        this.line = new LinearEqn();
      }

      return `What is the equation of a line with an x-intercept of
      ${mathToString(this.line.xIntercept())}
       and a slope of ${mathToString(this.line.slope())}?`;
    };
    this.answer = function() {
      return this.line.eqn();
    };
    this.answerSet = function() {
      const slope = mathToString(this.line.slope());

      switch (slope) {
        case 'Infinity':
          return getAnswerSet(this.answer(), getIncorrectVertLEqns(this.line));
        case '0':
          return getAnswerSet(this.answer(), getIncorrectHorzLEqns(this.line));
        default:
          return getAnswerSet(this.answer(), getIncorrectDiagLEqns(this.line));
      }
    };
  };

  const heartOfAlgebra = [LineFromPts, LineFromPtAndSlope,
                          LineFromXIntAndSlope];
  // const passportToAdvancedMath = [SimplificationQuestion];
  // const problemSolving = [];
  // const other = [i];
  const questionCategories = [heartOfAlgebra];

  // Sets the answers for a question
  const setAnswers = function(answerLabelArr, answerArr) {
    console.log(answerLabelArr);
    console.log(answerArr);
    let anythingHasFrac = false;
    for (let i = 0; i < 4; i++) {
      if (answerArr[i].indexOf('\`') !== -1) {
        answerLabelArr[i].style.margin = '20px 0px 20px 0px';
      }
      answerLabelArr[i].innerHTML = answerArr[i];
    }
  };

  // Generates the question that will be shown the next time the user presses
  // the button
  const getNextQuestion = function() {
    const questionCategory =
            questionCategories[getRandomInt(0, questionCategories.length - 1)];
    const QuestionSubCategory =
            questionCategory[getRandomInt(0, questionCategory.length - 1)];
    currentQuestion = new QuestionSubCategory();

    const $questionCard = $(`<div class="card">\
      <div class="card-content">\
        <p id="question">${currentQuestion.question()}</p>\
        <form>\
          <p class="answer">\
            <input class="with-gap" name="group1" type="radio" id="a" />\
            <label for="a"></label>\
          </p>\
          <p class="answer">\
            <input class="with-gap" name="group1" type="radio" id="b" />\
            <label for="b"></label>\
          </p>\
          <p class="answer">\
            <input class="with-gap red" name="group1" type="radio" id="c"  />\
            <label for="c"></label>\
          </p>\
          <p class="answer">\
            <input class="with-gap" name="group1" type="radio" id="d"/>\
            <label for="d"></label>\
          </p>\
        </form>\
      </div>\
    </div>`);

    $('#card-processor').append($questionCard);
    setAnswers($('#card-processor label').toArray(), currentQuestion.answerSet());

    var cardProcessor = document.getElementById('card-processor');

    MathJax.Hub.Queue(["Typeset",MathJax.Hub, cardProcessor]);
  };

  const enableCheckButton = function() {
    $('#check').removeClass('disabled');
    $(':radio').off('click');
  };

  // Provides feedback to the user if they got the question right or not
  const checkAnswer = function() {
    $('#check').off('click').text('Next').attr('id', 'next');
    const $userAnswer = $('input:checked');

    if ($userAnswer.attr('id') !== currentAnswerButton) {
      $userAnswer.siblings('label').css('color', 'red');
    }
    $('#next').click(setQuestion);
  };

  // Sets a question to the last question generated
  const setQuestion = function() {
    $('#card-holder').empty().append($(document.getElementById('card-processor').children[0].outerHTML));
    $('#card-holder form').append($('<a class="waves-effect waves-light btn right disabled card-btn" \
              id="check">Check</a>'));
    $('#card-processor').empty();
    $('#check').click(checkAnswer).click(getNextQuestion);
    $(':radio').click(enableCheckButton);
  };

  // Generate the first question and answer before the user clicks
  // into the website to avoid delays caused by slow (2-5s) ajax requests
  getNextQuestion();
  $('#next').click(setQuestion);
});
