(function() {
  'use strict'
  const getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getPoint = function(xCoord, yCoord) {
    return {
      x: xCoord,
      y: yCoord
    };
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

  // Returns a string from the parameter, which is a mathematical expression
  const mathToString = function(value) {
    if (value.d === 1) {
      return (value.n * value.s).toString();
    }
    if (value === Infinity) {
      return 'Infinity';
    }
  };
})();

(function() {
  'use strict'
  // Formats diagonal linear equation to follow human conventions
  // Slope must be a string and mathjsYIntercept must be in the mathjs format
  const formatDiagLinearEqn = function(slope, yIntercept) {
    const strSlope = commonMath.mathToString(slope);

    if (yIntercept.n === 0) {
      return `y = ${strSlope} x`;
    }
    if (yIntercept.s === 1) {
      const strYIntercept = commonMath.mathToString(yIntercept);

      return `y = ${commonMath.coeffCheck(strSlope, 'x')} + ${strYIntercept}`;
    } else {
      const strYIntercept = commonMath.mathToString(math.abs(yIntercept));

      return `y = ${commonMath.coeffCheck(strSlope, 'x')} - ${strYIntercept}`;
    }
  };

  // Function factory for generating linear equations on a cartesian plane
  const getLinearEqn = function() {
    const pt1 = getPoint(commonMath.getRandomInt(-20, 20),
                        commonMath.getRandomInt(-20, 20));
    const pt2 = getPoint(commonMath.getRandomInt(-20, 20),
                        commonMath.getRandomInt(-20, 20));
    const slope = pt1.x === pt2.x
                ? Infinity : math.fraction((pt2.y - pt1.y) / (pt2.x - pt1.x));
    const yIntercept = math.subtract(pt2.y, math.multiply(slope, pt2.x));
    let eqn, xIntercept;

    if (slope === Infinity) {
      xIntercept = pt1.x;
    } else if (commonMath.mathToString(slope) !== '0') {
      xIntercept = math.divide(math.unaryMinus(yIntercept), slope);
    }
    switch (commonMath.mathToString(slope)) {
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

    return { pt1, pt2, slope, yIntercept, xIntercept, eqn };
  };

  // Func. factory for generating lines in some way related to an original line
  // Options for types are: perpendicular, parallel, originalWithSignError,
  // or mistakeXIntForYInt
  const getRelatedEqn = function(originalLine, type, qualifier) {
    let yIntercept = commonMath.getRandomInt(-20, 20);

    while (yIntercept === originalLine.yIntercept) {
      yIntercept = commonMath.getRandomInt(-20, 20);
    }
    let slope;

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
        if (Math.random() > 1 / 2) {
          yIntercept = math.unaryMinus(yIntercept);
        } else {
          slope = math.unaryMinus(slope);
        }
        break;
      case 'mistakeXIntForYInt':
        slope = originalLine.slope;
        yIntercept = originalLine.xIntercept;
        break;
      default:
        return 'no such type';
    }

    return formatDiagLinearEqn(slope, yIntercept);
  };

  const linearEqnWithGivenIntercept = function(intercept) {
    return `y = ${commonMath.getRandomInt(1, 40)} x + ${intercept}`;
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
      } else if (questionType < 3 / 8) {
        incorrectAnswers.push(getRelatedEqn(originalLine, 'parallel'));
      } else if (questionType < 5 / 8 && signErrorPresent) {
        incorrectAnswers.push(
          getRelatedEqn(originalLine, 'originalWithSignError'));
        signErrorPresent = true;
      } else if (questionType < 3 / 4 && !perpWithSameYIntPresent) {
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
    console.log(linearEqn.slope);
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

    return { question, answerSet };
  };

  const test = getSingleLinearEqnQAS();
  console.log(test);
})();

(function() {
  'use strict'
  let currentQuestion;
  let currentAnswer;

  // Shuffles an array
  const shuffle = function(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const randIndex = getRandomInt(0, 3);
      const temp = arr[randIndex];

      arr[randIndex] = arr[i];
      arr[i] = temp;
    }
  };

  const heartOfAlgebra = [getSingleLinearEqnQAS];

  // const passportToAdvancedMath = [SimplificationQuestion];
  // const problemSolving = [];
  // const other = [i];
  const questionCategories = [heartOfAlgebra];

  // Sets the answers for a question
  const getNextAnswers = function(answerLabelArr, answerArr) {
    for (let i = 0; i < 4; i++) {
      if (answerArr[i].indexOf('`') !== -1) {
        answerLabelArr[i].style.margin = '25px 0px 25px 0px';
      }
      answerLabelArr[i].innerHTML = answerArr[i];
      if (answerArr[i] === currentAnswer) {
        answerLabelArr[i].id = 'correct-answer';
      }
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
        <p id="question">${currentQuestion.question}</p>\
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
          <button class="waves-effect waves-light btn right disabled card-btn" \
            id="check" type="button" disabled>Check</button>\
        </form>\
      </div>\
    </div>`);

    $('#card-processor').append($questionCard);
    getNextAnswers($('#card-processor label').toArray(),
                      currentQuestion.answerSet);

    const cardProcessor = document.getElementById('card-processor');

    MathJax.Hub.Queue(["Typeset",MathJax.Hub, cardProcessor]);
  };

  const enableCheckButton = function() {
    $('#check').removeClass('disabled');
    $('#check').prop('disabled', false);
    $(':radio').off('click');
  };

  // Sets a question to the last question generated
  const setQuestion = function() {
    const start = new Date().getTime();

    $('#card-holder').empty().append(
      $(document.getElementById('card-processor').children[0].outerHTML));
    $('#card-processor').empty();
    $('#check').click(checkAnswer(start)).click(getNextQuestion);
    $(':radio').click(enableCheckButton);
  };

  // Provides feedback to the user if they got the question right or not
  const checkAnswer = function(start) {
    return function() {
      $('#check').off('click').text('Next').attr('id', 'next');
      const $userAnswer = $('input:checked').siblings('label');

      $('#correct-answer').css('color', '#22A552');
      if ($userAnswer.attr('id') !== 'correct-answer') {
        $userAnswer.css('color', '#CE1C1C');
      }
      const end = new Date().getTime();
      const $userTime = $(`<p class="right" id="user-time">
                          ${(end - start) / 1000}s</p><br/>`);

      $('#next').before($userTime);
      $('#next').click(setQuestion);
    };
  };

  // Generate the first question and answer before the user clicks
  // into the website to avoid delays caused by slow (2-5s) ajax requests
  getNextQuestion();
  $('#next').click(setQuestion);
})();
